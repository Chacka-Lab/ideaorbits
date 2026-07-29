import 'server-only';

import { deleteCookie, getCookie, setCookie } from '@solidjs/start/http';

import { keyNames } from '~/modules/cookies/key-names';
import { TOKEN_TTL } from '~/modules/redis/two-factor-pending';

export function set(token: Buffer) {
  setCookie(keyNames.twoFactorToken, token.toString('base64url'), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: TOKEN_TTL,
  });
}

export function get(): Buffer | null {
  const token = getCookie(keyNames.twoFactorToken);
  if (!token) return null;
  return Buffer.from(token, 'base64url');
}

export function del() {
  deleteCookie(keyNames.twoFactorToken);
}
