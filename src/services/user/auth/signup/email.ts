import 'server-only';

import { z } from 'zod';

import db from '~/lib/db';
import logger from '~/lib/logger';
import { userPasswords } from '~/lib/schema/auth';
import { CONSTR_NAMES } from '~/lib/schema/global';
import { users } from '~/lib/schema/users';
import { hashPassword } from '~/modules/crypto/hash';
import { sendSignupVerifyEmail } from '~/modules/emails/signup-verify';
import { intlConfig } from '~/modules/intl/config';
import * as emailVerification from '~/modules/redis/email-verification';
import { findUserByEmail } from '~/modules/user/query/email';
import * as basic from '~/modules/user/schemas/basic';
import drizzleErrParse, { PG_ERR_CODES } from '~/utils/drizzle-err-parse';
import firstOf from '~/utils/first-of';

// ===== Top =====

const CODE_TTL = 60 * 3; // 3min
const TOKEN_TTL = 60 * 60 * 3; // 3h

// ===== Request =====

const requestSchema = z.object({
  ...basic.displayNameSchema.shape,
  ...basic.emailSchema.shape,
  locale: z.enum(intlConfig.locales),
});
type RequestInput = z.infer<typeof requestSchema>;

type RequestResult =
  | { success: true }
  | {
      success: false;
      message?: 'internalError' | 'sendEmailError' | 'tooFrequently';
      fieldErrors?: {
        displayName?: basic.DisplayNameErr | 'unknownError';
        email?: basic.EmailErr | 'emailTaken' | 'unknownError';
      };
    };

export async function request(input: RequestInput): Promise<RequestResult> {
  // Validate input
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    const errs = parsed.error.flatten((i) => i.message).fieldErrors;
    return {
      success: false,
      fieldErrors: {
        displayName: firstOf(errs.displayName, basic.displayNameErrArr, 'unknownError'),
        email: firstOf(errs.email, basic.emailErrArr, 'unknownError'),
      },
    };
  }

  try {
    // Check if the email exists
    if ((await findUserByEmail(parsed.data.email)) !== null) {
      return {
        success: false,
        fieldErrors: {
          email: 'emailTaken',
        },
      };
    }

    const payload: basic.DisplayName = {
      displayName: parsed.data.displayName,
    };

    const res = await emailVerification.createCode(
      { payload: JSON.stringify(payload), email: parsed.data.email },
      'signup',
      CODE_TTL,
      async (link, email) => {
        return await sendSignupVerifyEmail({
          displayName: parsed.data.displayName,
          email: email,
          link: link,
          locale: parsed.data.locale,
        });
      },
    );
    if (res === 'tooFrequently') return { success: false, message: 'tooFrequently' };
    if (res.error !== null) return { success: false, message: 'sendEmailError' };

    return { success: true };
  } catch (e) {
    logger.error('email:request error:', e);
    return { success: false, message: 'internalError' };
  }
}

// ===== Exchange code =====

type ExchangeCodeResult =
  | {
      success: true;
      token: Buffer;
    }
  | {
      success: false;
      message: 'internalError' | 'invalidCode';
    };

export async function exchangeCode(code: string): Promise<ExchangeCodeResult> {
  try {
    const token = await emailVerification.exchangeCode(code, 'signup', TOKEN_TTL);
    if (!token) return { success: false, message: 'invalidCode' };
    return { success: true, token };
  } catch (e) {
    logger.error('email:exchangeCode error:', e);
    return { success: false, message: 'internalError' };
  }
}

// ===== Get payload =====

type GetPayloadResult =
  | {
      success: true;
      data: emailVerification.Payload;
    }
  | {
      success: false;
      message: 'internalError' | 'invalidToken';
    };

export async function getPayload(token: Buffer): Promise<GetPayloadResult> {
  try {
    const res = await emailVerification.verifyToken(token, 'signup');
    if (!res) return { success: false, message: 'invalidToken' };
    return { success: true, data: res };
  } catch (e) {
    logger.error('email:getPayload error:', e);
    return { success: false, message: 'internalError' };
  }
}

// ===== Complete =====

const completeInputSchema = z.object({
  ...basic.usernameSchema.shape,
  ...basic.displayNameSchema.partial().shape,
  ...basic.passwordSchema.shape,
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
        password?: basic.PasswordErr | 'unknownError';
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
        password: firstOf(errs.password, basic.passwordErrArr, 'unknownError'),
      },
    };
  }

  // Consume token
  let payload;
  let tokenRes;
  try {
    tokenRes = await emailVerification.consumeToken(token, 'signup');
    if (!tokenRes) return { success: false, message: 'invalidToken' };
    payload = basic.displayNameSchema.parse(JSON.parse(tokenRes.payload));
  } catch (e) {
    logger.error('email:complete error:', e);
    return { success: false, message: 'internalError' };
  }

  // DB handle
  try {
    const passwordHash = await hashPassword(parsed.data.password);
    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          displayName: parsed.data.displayName ?? payload.displayName,
          username: parsed.data.username,
          email: tokenRes.email,
          status: 'active',
        })
        .returning({ id: users.id });

      if (!user) throw new Error('insert user no returning');

      await tx.insert(userPasswords).values({ userId: user.id, passwordHash });
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
    logger.error('email:complete error:', e);
    return { success: false, message: 'internalError' };
  }
}
