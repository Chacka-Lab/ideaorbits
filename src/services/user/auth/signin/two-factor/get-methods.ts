import 'server-only';

import db from '~/lib/db';
import logger from '~/lib/logger';
import * as oneFactorPending from '~/modules/redis/two-factor-pending';

type twoFactorMethod = 'TOTP' | 'WebAuthn';

type GetMethodsResult =
  | {
      success: true;
      data: twoFactorMethod[];
    }
  | {
      success: false;
      message: 'invalidToken' | 'twoFactorUnavailable' | 'internalError';
    };

export async function getMethods(twoFactorToken: Buffer): Promise<GetMethodsResult> {
  try {
    const userId = await oneFactorPending.verifyToken(twoFactorToken);
    if (!userId) return { success: false, message: 'invalidToken' };

    const user = await db.query.users.findFirst({
      where: { id: userId, status: 'active' },
      columns: {},
      with: {
        totp: {
          columns: { createdAt: true },
        },
        passkeys: {
          columns: { createdAt: true },
        },
        recoveryKey: {
          columns: { createdAt: true },
        },
      },
    });

    if (!user || !user.recoveryKey) {
      return { success: false, message: 'twoFactorUnavailable' };
    }

    const arr: twoFactorMethod[] = [];
    if (user.totp) arr.push('TOTP');
    if (user.passkeys) arr.push('WebAuthn');

    return { success: true, data: arr };
  } catch (e) {
    logger.error('two-factor/get-methods error:', e);
    return { success: false, message: 'internalError' };
  }
}
