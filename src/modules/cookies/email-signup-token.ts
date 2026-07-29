import 'server-only';

import { deleteCookie, getCookie, setCookie } from '@solidjs/start/http';

import { keyNames } from '~/modules/cookies/key-names';

const TOKEN_TTL = 60 * 60 * 3; // 3h

export function set(token: Buffer) {
  setCookie(keyNames.emailSignupToken, token.toString('base64url'), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: TOKEN_TTL,
  });
}

export function get(): Buffer | undefined {
  const cookie = getCookie(keyNames.emailSignupToken);
  if (!cookie) return undefined;
  return Buffer.from(cookie, 'base64url');
}

export function del() {
  deleteCookie(keyNames.emailSignupToken);
}
