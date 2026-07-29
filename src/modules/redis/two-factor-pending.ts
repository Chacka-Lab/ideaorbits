import { randomBytes } from 'node:crypto';

import { pack, unpack } from 'msgpackr';
import { z } from 'zod';

import redis from '~/lib/redis';
import { hashToken } from '~/modules/crypto/hash';
import * as redisKeyNames from '~/modules/redis/key-names';

// ===== Top =====

const packageSchema = z.object({
  userId: z.string(),
  secret: z.instanceof(Buffer),
});
type Package = z.infer<typeof packageSchema>;

type Token = Buffer;
type UserId = string;

export const TOKEN_TTL = 60 * 10; // 10min

// ===== Exports =====

export async function createToken(userId: string): Promise<Token> {
  const secret = randomBytes(32);
  const key = redisKeyNames.twoFactorToken(
    userId,
    hashToken(secret).toString('base64url'),
  );

  await redis.set(key, 'OK', {
    expiration: {
      type: 'EX',
      value: TOKEN_TTL,
    },
  });

  const tokenPayload: Package = { userId, secret };

  return pack(tokenPayload);
}

export async function verifyToken(token: Token): Promise<UserId | null> {
  const tokenPayload = packageSchema.safeParse(unpack(token));
  if (!tokenPayload.success) return null;

  const key = redisKeyNames.twoFactorToken(
    tokenPayload.data.userId,
    hashToken(tokenPayload.data.secret).toString('base64url'),
  );

  const res = await redis.get(key);

  if (res === 'OK') return tokenPayload.data.userId;
  return null;
}

export async function consumeToken(token: Token): Promise<UserId | null> {
  const tokenPayload = packageSchema.safeParse(unpack(token));
  if (!tokenPayload.success) return null;

  const key = redisKeyNames.twoFactorToken(
    tokenPayload.data.userId,
    hashToken(tokenPayload.data.secret).toString('base64url'),
  );

  const res = await redis.getDel(key);

  if (res === 'OK') return tokenPayload.data.userId;
  return null;
}
