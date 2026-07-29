import 'server-only';

import db from '~/lib/db';
import logger from '~/lib/logger';
import { verifyPassword } from '~/modules/crypto/hash';
import * as twoFactorPending from '~/modules/redis/two-factor-pending';
import * as session from '~/modules/user/auth/session';

type RequestInput =
  | {
      username: string;
      password: string;
    }
  | {
      email: string;
      password: string;
    };

type RequestResult =
  | {
      success: true;
      twoFactor: boolean;
      token: Buffer;
    }
  | {
      success: false;
      message:
        | 'emailOrPasswordIncorrect'
        | 'usernameOrPasswordIncorrect'
        | 'userSuspended'
        | 'internalError';
    };

export async function request(input: RequestInput): Promise<RequestResult> {
  const isEmail = 'email' in input;

  try {
    const user = await db.query.users.findFirst({
      where: {
        username: isEmail ? undefined : input.username,
        email: isEmail ? input.email : undefined,
      },
      columns: { id: true, status: true },
      with: {
        password: { columns: { passwordHash: true } },
        recoveryKey: { columns: { createdAt: true } },
      },
    });

    if (user?.status === 'suspended') {
      return { success: false, message: 'userSuspended' };
    }

    if (
      !user?.password ||
      user.status !== 'active' ||
      !(await verifyPassword(input.password, user.password.passwordHash))
    ) {
      return {
        success: false,
        message: isEmail ? 'emailOrPasswordIncorrect' : 'usernameOrPasswordIncorrect',
      };
    }

    const is2fa = !!user.recoveryKey;
    return {
      success: true,
      twoFactor: is2fa,
      token: is2fa
        ? await twoFactorPending.createToken(user.id)
        : await session.create(user.id),
    };
  } catch (e) {
    logger.error('login/password error:', e);
    return { success: false, message: 'internalError' };
  }
}
