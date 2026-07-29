import redis from '~/lib/redis';

import * as keyNames from './key-names';

const RETENTION_TTL = 30 * 4; // step = 30s; T ± 1; window(3 steps) + margin(1 step)

export async function consume(userId: string, token: string): Promise<boolean> {
  const key = keyNames.totpInvalidedToken(userId, token);
  const res = await redis.set(key, '', {
    expiration: {
      type: 'EX',
      value: RETENTION_TTL,
    },
    condition: 'NX',
  });
  return res === 'OK';
}
