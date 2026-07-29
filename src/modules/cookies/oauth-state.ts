import 'server-only';

import { setCookie } from '@solidjs/start/http';

import routes from '~/lib/routes';

import { keyNames } from './key-names';
import { consumeCookie } from './tools';

type State = string;

const STATE_TTL = 60 * 15; // 15min

export function set(state: State) {
  setCookie(keyNames.oauthState, state, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: routes.path.api.callback,
    maxAge: STATE_TTL,
  });
}

export function consume(): State | null {
  return consumeCookie(keyNames.oauthState) ?? null;
}
