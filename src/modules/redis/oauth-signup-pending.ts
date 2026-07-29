import 'server-only';

import { randomBytes } from 'node:crypto';

import { z } from 'zod';

import redis from '~/lib/redis';
import { hashToken } from '~/modules/crypto/hash';
import * as keyNames from '~/modules/redis/key-names';
import { displayNameSchema, emailSchema } from '~/modules/user/schemas/basic';
import { oauthProviders } from '~/modules/user/schemas/oauth-providers';

// ===== Top =====

const payloadSchema = z.object({
  uid: z.string(),
  ...displayNameSchema.shape,
  ...emailSchema.shape,
  provider: z.enum(oauthProviders),
});
export type Payload = z.infer<typeof payloadSchema>;

type Token = Buffer;

const TOKEN_TTL = 60 * 60 * 3; // 3h

// ===== Tools =====

function hashSecret(secret: Buffer): string {
  return hashToken(secret).toString('base64url');
}

// ===== Exports =====

export async function createToken(payload: Payload): Promise<Token> {
  const secret = randomBytes(32);
  await redis.set(
    keyNames.oauthSignupToken(hashSecret(secret)),
    JSON.stringify(payload),
    {
      expiration: {
        type: 'EX',
        value: TOKEN_TTL,
      },
    },
  );
  return secret;
}

export async function getPayload(token: Token): Promise<Payload | null> {
  const res = await redis.get(keyNames.oauthSignupToken(hashSecret(token)));
  if (!res) return null;
  return payloadSchema.parse(JSON.parse(res));
}

export async function consumeToken(token: Token): Promise<Payload | null> {
  const res = await redis.getDel(keyNames.oauthSignupToken(hashSecret(token)));
  if (!res) return null;
  return payloadSchema.parse(JSON.parse(res));
}
