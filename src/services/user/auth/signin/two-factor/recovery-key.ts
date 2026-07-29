import 'server-only';

import { eq } from 'drizzle-orm';

import db from '~/lib/db';
import { userPasskeys, userRecoveryKeys, userTotps } from '~/lib/schema/auth';
import * as twoFactorPending from '~/modules/redis/two-factor-pending';
import { auth } from '~/modules/user/auth/recovery-key';

type DisableTwoFactorResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: 'internalError' | 'invalidToken' | 'invalidKey';
    };

export async function disableTwoFactor(
  token: Buffer,
  key: string,
): Promise<DisableTwoFactorResult> {
  const userId = await twoFactorPending.verifyToken(token);
  if (!userId) return { success: false, message: 'invalidToken' };

  return await db.transaction(async (tx): Promise<DisableTwoFactorResult> => {
    const [rk] = await tx
      .select()
      .from(userRecoveryKeys)
      .where(eq(userRecoveryKeys.userId, userId))
      .for('update');

    if (!rk) return { success: false, message: 'invalidKey' };

    const user = await tx.query.users.findFirst({
      where: { id: userId, status: 'active' },
      columns: { createdAt: true },
      with: {
        recoveryKey: {
          columns: { keyHash: true },
        },
      },
    });

    if (!user?.recoveryKey || auth(key, user.recoveryKey.keyHash)) {
      return { success: false, message: 'invalidKey' };
    }

    await Promise.all([
      await twoFactorPending.consumeToken(token),
      await tx.delete(userRecoveryKeys).where(eq(userRecoveryKeys.userId, userId)),
      await tx.delete(userTotps).where(eq(userTotps.userId, userId)),
      await tx.delete(userPasskeys).where(eq(userPasskeys.userId, userId)),
    ]);

    return { success: true };
  });
}
