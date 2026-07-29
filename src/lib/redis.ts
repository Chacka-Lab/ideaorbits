import { createClient } from 'redis';

import env from '~/lib/env';

import { exchangeCode } from './lua/exchange-code';
import { hSetKeyNX } from './lua/hset-key-nx';
import { slidingRateLimiter } from './lua/sliding-rate-limiter';

const globalForRedis = globalThis as typeof globalThis & {
  redis?: ReturnType<typeof createRedis>;
};

const scripts = {
  slidingRateLimiter,
  exchangeCode,
  hSetKeyNX,
};

function createRedis() {
  return createClient({
    url: env.REDIS_URL,
    scripts,
  });
}

const redis = globalForRedis.redis ?? createRedis();

if (import.meta.env.DEV) {
  globalForRedis.redis = redis;
}

if (!redis.isOpen) {
  await redis.connect();
}

export default redis;
