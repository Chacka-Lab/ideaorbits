import 'server-only';

import { eq } from 'drizzle-orm';
import * as otp from 'otplib';

import { APP_NAME } from '~/lib/consts';
import db from '~/lib/db';
import logger from '~/lib/logger';
import { userTotps } from '~/lib/schema/auth';
import { simpleDecrypt, simpleEncrypt } from '~/modules/crypto/encryption';
import { consume } from '~/modules/redis/totp-Invalided-token';

// ===== Request Register =====

type RequestSuccess = {
  secret: string;
  uri: string;
};

export async function requestRegister(email: string): Promise<RequestSuccess> {
  const secret = otp.generateSecret();
  const uri = otp.generateURI({
    strategy: 'totp',
    issuer: APP_NAME,
    label: email,
    secret,
  });

  return { secret, uri };
}

// ===== Register =====

type EncryptedSecret = Buffer;

export async function register(
  secret: string,
  token: string,
): Promise<EncryptedSecret | null> {
  const verification = await otp.verify({ token, secret });
  if (verification.valid) {
    return simpleEncrypt(Buffer.from(secret, 'utf-8'), 'totpSecret');
  }
  return null;
}

// ===== Auth =====

type AuthResult =
  | {
      success: true;
    }
  | {
      success: false;
      message:
        | 'userUnavailable'
        | 'totpUnavailable'
        | 'internalError'
        | 'invalidToken'
        | 'tooFrequently';
    };

export async function auth(userId: string, token: string): Promise<AuthResult> {
  const user = await db.query.users.findFirst({
    where: { id: userId, status: 'active' },
    columns: { createdAt: true },
    with: {
      totp: {
        columns: { encryptedSecret: true },
      },
      recoveryKey: {
        columns: { createdAt: true },
      },
    },
  });
  if (!user) {
    return {
      success: false,
      message: 'userUnavailable',
    };
  }
  if (!user.recoveryKey || !user.totp) {
    return {
      success: false,
      message: 'totpUnavailable',
    };
  }

  const secret = simpleDecrypt(user.totp.encryptedSecret, 'totpSecret');
  if (!secret) {
    return {
      success: false,
      message: 'internalError',
    };
  }

  if (secret.reEncrypt) {
    const newEncryptedSecret = simpleEncrypt(secret.payload, 'totpSecret');
    db.transaction(async (tx) => {
      const [totp] = await tx
        .select()
        .from(userTotps)
        .where(eq(userTotps.userId, userId))
        .for('update');

      if (!totp || !totp.encryptedSecret.equals(user.totp!.encryptedSecret)) {
        throw new Error('totp changed');
      }

      await tx
        .update(userTotps)
        .set({ encryptedSecret: newEncryptedSecret })
        .where(eq(userTotps.userId, userId));
    }).catch((e) => {
      logger.warn('auth/totp error:', e);
    });
  }

  const res = await otp.verify({ token, secret: secret.payload.toString('utf-8') });
  if (!res.valid) {
    return {
      success: false,
      message: 'invalidToken',
    };
  }
  if (!(await consume(userId, token))) {
    return {
      success: false,
      message: 'tooFrequently',
    };
  }

  return { success: true };
}
