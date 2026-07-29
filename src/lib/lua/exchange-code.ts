import { defineScript } from 'redis';

const SCRIPT = `
local old_key = KEYS[1]
local new_key = KEYS[2]
local secret_hash = ARGV[1]
local ttl = tonumber(ARGV[2])

local stored_hash = redis.call('HMGET', old_key, "secretHash")
if secret_hash ~= stored_hash[1] then
  return 0
end

redis.call("RENAME", old_key, new_key)
redis.call("HDEL",   new_key, "secretHash")
redis.call("EXPIRE", new_key, ttl)

return 1
`;

export const exchangeCode = defineScript({
  SCRIPT,
  NUMBER_OF_KEYS: 2,
  parseCommand(
    parser,
    oldKey: string,
    newKey: string,
    codeSecretHash: string,
    ttl: number,
  ) {
    if (ttl < 0) throw new RangeError('"ttl" must >= 0');
    parser.push(oldKey, newKey, codeSecretHash, String(Math.floor(ttl)));
  },
  transformReply(reply: unknown): boolean {
    return reply === 1;
  },
});
