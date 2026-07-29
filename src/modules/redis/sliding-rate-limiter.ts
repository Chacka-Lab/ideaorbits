import 'server-only';

import redis from '~/lib/redis';
import * as redisKeyNames from '~/modules/redis/key-names';

export type RateLimiterType = 'totp';

export function request(
  type: RateLimiterType,
  id: string,
  windowSecs: number,
  limit: number,
): Promise<boolean> {
  return redis.slidingRateLimiter(
    redisKeyNames.slidingRateLimiter(type, id),
    windowSecs,
    limit,
  );
}
