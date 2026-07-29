import 'server-only';

import { deleteCookie, getCookie, setCookie } from '@solidjs/start/http';

import { keyNames } from '~/modules/cookies/key-names';

export function set(token: Buffer) {
  setCookie(keyNames.oauthSignupToken, token.toString('base64url'), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 3, // 3h
  });
}

export function get(): Buffer | null {
  const token = getCookie(keyNames.oauthSignupToken);
  if (!token) return null;
  return Buffer.from(token, 'base64url');
}

export function del() {
  deleteCookie(keyNames.oauthSignupToken);
}
