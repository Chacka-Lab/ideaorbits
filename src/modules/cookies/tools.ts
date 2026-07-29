import { deleteCookie, getCookie } from '@solidjs/start/http';

export function consumeCookie(name: string): string | undefined {
  const res = getCookie(name);
  if (res === undefined) return undefined;
  deleteCookie(name);
  return res;
}
