import { defineScript } from 'redis';

const SCRIPT = `
local key = KEYS[1]
local ttl = tonumber(ARGV[1])

if redis.call('EXISTS', key) == 1 then
  return 0
end

redis.call('HSET', key, unpack(ARGV, 2))
redis.call("EXPIRE", key, ttl)

return 1
`;

export const hSetKeyNX = defineScript({
  SCRIPT,
  NUMBER_OF_KEYS: 1,
  parseCommand(parser, key: string, fields: Record<string, string>, ttl: number) {
    if (ttl < 0) throw new RangeError('"ttl" must >= 0');
    parser.push(key, String(Math.floor(ttl)), ...Object.entries(fields).flat());
  },
  transformReply(reply: unknown): boolean {
    return reply === 1;
  },
});
