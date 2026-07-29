import { defineScript } from 'redis';

const SCRIPT = `
local now = tonumber(redis.call("TIME")[1])
local window = tonumber(ARGV[1])
local limit = tonumber(ARGV[2])
local key = KEYS[1]

if ((tonumber(redis.call("LLEN", key)) < limit) or
  (now - tonumber(redis.call("LRANGE", key, -1, -1)[1])) >= window) then
    
  redis.call("LPUSH", key, now)
  redis.call("LTRIM", key, 0, limit - 1)
  redis.call("EXPIRE", key, window * 2)
  
  return 1
else
  return 0
end
`;

export const slidingRateLimiter = defineScript({
  SCRIPT,
  NUMBER_OF_KEYS: 1,
  parseCommand(parser, key: string, windowSecs: number, limit: number) {
    if (windowSecs <= 0 || limit <= 0) {
      throw new RangeError('windowSecs and limit must be > 0');
    }
    parser.push(key, String(Math.floor(windowSecs)), String(Math.floor(limit)));
  },
  transformReply(reply: unknown): boolean {
    return reply === 1;
  },
});
