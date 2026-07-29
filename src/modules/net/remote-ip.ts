import 'server-only';

import { isIP } from 'node:net';

import { getRequestHeader } from '@solidjs/start/http';

/**
 * (!) Must be called within a request call chain.
 *
 * @return Remote IP or `undefined`.
 */
export default function remoteIp(): string | undefined {
  const ip = getRequestHeader('x-real-ip');
  if (ip === undefined || isIP(ip) === 0) return undefined;
  return ip;
}
