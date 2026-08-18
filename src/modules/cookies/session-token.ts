import 'server-only';

import { deleteCookie, getCookie, setCookie } from '@solidjs/start/http';

import { keyNames } from '~/modules/cookies/key-names';

const MAX_TTL = 60 * 60 * 24 * 400; // 400d (Server-side ctrl of actual expiration)

export function set(token: Buffer) {
  setCookie(keyNames.sessionToken, token.toString('base64url'), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: MAX_TTL,
  });
}

export function get(): Buffer | null {
  const token = getCookie(keyNames.sessionToken);
  if (!token) return null;
  return Buffer.from(token, 'base64url');
}

export function del() {
  deleteCookie(keyNames.sessionToken);
}
