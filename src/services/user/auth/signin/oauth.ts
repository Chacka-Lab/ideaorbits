import db from '~/lib/db';
import * as twoFactorPending from '~/modules/redis/two-factor-pending';
import { getUser } from '~/modules/user/auth/oauth';
import * as session from '~/modules/user/auth/session';
import type { OAuthProvider } from '~/modules/user/schemas/oauth-providers';

type HandleCallbackResult =
  | {
      success: true;
      twoFactor: boolean;
      token: Buffer;
    }
  | {
      success: false;
      message: 'invalidToken' | 'unknowUser' | 'internalError' | 'userSuspended';
    };

export async function handleCallback(
  provider: OAuthProvider,
  params: URLSearchParams,
): Promise<HandleCallbackResult> {
  const oauthUser = await getUser(provider, params);
  if (!oauthUser.success) return { success: false, message: oauthUser.message };

  const res = await db.query.userOAuth.findFirst({
    where: { provider, providerUid: oauthUser.data.uid },
    columns: {},
    with: {
      user: {
        columns: { id: true, status: true },
        with: {
          recoveryKey: {
            columns: { createdAt: true },
          },
        },
      },
    },
  });

  if (res?.user?.status === 'suspended') {
    return { success: false, message: 'userSuspended' };
  }

  if (!res?.user || res.user.status !== 'active') {
    return { success: false, message: 'unknowUser' };
  }

  const is2fa = !!res.user.recoveryKey;
  return {
    success: true,
    twoFactor: is2fa,
    token: is2fa
      ? await twoFactorPending.createToken(res.user.id)
      : await session.create(res.user.id),
  };
}
