import 'server-only';

import { z } from 'zod';

import db from '~/lib/db';
import logger from '~/lib/logger';
import { userOAuth } from '~/lib/schema/auth';
import { CONSTR_NAMES } from '~/lib/schema/global';
import { users } from '~/lib/schema/users';
import type { Payload as OAuthPayload } from '~/modules/redis/oauth-signup-pending';
import * as oauthSignupPending from '~/modules/redis/oauth-signup-pending';
import { getUser } from '~/modules/user/auth/oauth';
import * as basic from '~/modules/user/schemas/basic';
import { displayNameSchema, emailSchema } from '~/modules/user/schemas/basic';
import type { OAuthProvider } from '~/modules/user/schemas/oauth-providers';
import drizzleErrParse, { PG_ERR_CODES } from '~/utils/drizzle-err-parse';
import firstOf from '~/utils/first-of';

// ===== Handle Callback =====

type HandleCallbackResult =
  | {
      success: true;
      token: Buffer;
    }
  | {
      success: false;
      message: 'invalidToken' | 'invalidEmail' | 'internalError';
    };

export async function handleCallback(
  provider: OAuthProvider,
  params: URLSearchParams,
): Promise<HandleCallbackResult> {
  try {
    const user = await getUser(provider, params);
    if (!user.success) return { success: false, message: user.message };

    const parsedEmail = emailSchema.safeParse({ email: user.data.email });
    if (!parsedEmail.success) return { success: false, message: 'invalidEmail' };

    const parsedDisplayName = (() => {
      const parsed = displayNameSchema.safeParse({ displayName: user.data.name });
      if (!parsed.success) return 'User'; // fallback
      return parsed.data.displayName;
    })();

    const token = await oauthSignupPending.createToken({
      provider: provider,
      email: parsedEmail.data.email,
      displayName: parsedDisplayName,
      uid: user.data.uid,
    });

    return { success: true, token };
  } catch (e) {
    logger.error('oauth/handleCallback error:', e);
    return { success: false, message: 'internalError' };
  }
}

// ===== Get Payload =====

type GetPayloadResult =
  | {
      success: true;
      data: OAuthPayload;
    }
  | {
      success: false;
      message: 'internalError' | 'invalidToken';
    };

export async function getPayload(token: Buffer): Promise<GetPayloadResult> {
  try {
    const res = await oauthSignupPending.getPayload(token);
    if (!res) return { success: false, message: 'invalidToken' };
    return { success: true, data: res };
  } catch (e) {
    logger.error('oauth/getPayload error:', e);
    return { success: false, message: 'internalError' };
  }
}

// ===== Complete =====

const completeInputSchema = z.object({
  ...basic.displayNameSchema.shape,
  ...basic.usernameSchema.shape,
});
type CompleteInput = z.infer<typeof completeInputSchema>;

type CompleteResult =
  | { success: true }
  | {
      success: false;
      message?: 'invalidToken' | 'internalError';
      fieldErrors?: {
        displayName?: basic.DisplayNameErr | 'unknownError';
        username?: basic.UsernameErr | 'usernameTaken' | 'unknownError';
        email?: 'emailTaken';
      };
    };

export async function complete(
  token: Buffer,
  input: CompleteInput,
): Promise<CompleteResult> {
  // Validate input
  const parsed = completeInputSchema.safeParse(input);
  if (!parsed.success) {
    const errs = parsed.error.flatten((i) => i.message).fieldErrors;
    return {
      success: false,
      fieldErrors: {
        displayName: firstOf(errs.displayName, basic.displayNameErrArr, 'unknownError'),
        username: firstOf(errs.username, basic.usernameErrArr, 'unknownError'),
      },
    };
  }

  // Consume token
  let payload;
  try {
    payload = await oauthSignupPending.getPayload(token);
    if (!payload) return { success: false, message: 'invalidToken' };
  } catch (e) {
    logger.error('oauth/complete error:', e);
    return { success: false, message: 'internalError' };
  }

  // DB handle
  try {
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          displayName: parsed.data.displayName,
          username: parsed.data.username,
          email: payload.email,
          status: 'active',
        })
        .returning({ id: users.id });

      if (!user) throw new Error('insert user no returning');

      await Promise.all([
        await oauthSignupPending.consumeToken(token),
        await tx.insert(userOAuth).values({
          userId: user.id,
          provider: payload.provider,
          providerUid: payload.uid,
        }),
      ]);
    });
    return { success: true };
  } catch (e) {
    // Error handle
    const dbError = drizzleErrParse(e);
    if (dbError?.code === PG_ERR_CODES.UniqueErr) {
      if (dbError.constraint_name === CONSTR_NAMES.usersUsername) {
        return { success: false, fieldErrors: { username: 'usernameTaken' } };
      } else if (dbError.constraint_name === CONSTR_NAMES.usersEmail) {
        return { success: false, fieldErrors: { email: 'emailTaken' } };
      }
    }
    logger.error('oauth/complete error:', e);
    return { success: false, message: 'internalError' };
  }
}
