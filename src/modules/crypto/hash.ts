import 'server-only';

import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

import { pack, unpack } from 'msgpackr';
import { z } from 'zod';

import { type KeyInfo, keyStores, primaryKeyId } from './keys';

// ===== Token =====

export function hashToken(token: Buffer): Buffer {
  return crypto.createHash('sha256').update(token).digest();
}

export function verifyToken(token: Buffer, storedHash: Buffer): boolean {
  const hash = hashToken(token);
  return hash.length === storedHash.length && crypto.timingSafeEqual(hash, storedHash);
}

// ===== Password =====

const argon2Async = promisify(crypto.argon2);
const PARAMS = { parallelism: 1, tagLength: 32, memory: 19456, passes: 2 } as const;
const ALGORITHMS = ['argon2d', 'argon2i', 'argon2id'] as const;

const storedSchema = z.object({
  key: z.instanceof(Buffer),
  algorithm: z.enum(ALGORITHMS),
  nonce: z.instanceof(Buffer),
  parallelism: z.number(),
  tagLength: z.number(),
  memory: z.number(),
  passes: z.number(),
});

export async function hashPassword(pwd: string): Promise<Buffer> {
  const nonce = crypto.randomBytes(16);
  const key = await argon2Async('argon2id', {
    message: pwd,
    nonce: nonce,
    ...PARAMS,
  });

  const storedHash: z.infer<typeof storedSchema> = {
    algorithm: 'argon2id',
    nonce: nonce,
    key: key,
    ...PARAMS,
  };
  return pack(storedHash);
}

type VerifyPasswordResult =
  | {
      success: true;
      reHash: boolean;
    }
  | { success: false };

export async function verifyPassword(
  pwd: string,
  storedHash: Buffer,
): Promise<VerifyPasswordResult> {
  const stored = storedSchema.parse(unpack(storedHash));
  const key = await argon2Async(stored.algorithm, {
    message: pwd,
    nonce: stored.nonce,
    parallelism: stored.parallelism,
    tagLength: stored.tagLength,
    memory: stored.memory,
    passes: stored.passes,
  });

  if (key.length === stored.key.length && crypto.timingSafeEqual(key, stored.key)) {
    return {
      success: true,
      reHash:
        stored.parallelism !== PARAMS.parallelism ||
        stored.tagLength !== PARAMS.tagLength ||
        stored.memory !== PARAMS.memory ||
        stored.passes !== PARAMS.passes,
    };
  }

  return { success: false };
}

// ===== HMAC =====

type HmacSuccess = {
  hash: Buffer;
  keyId: string;
};

export function hmacHash(
  payload: string | Buffer,
  info: KeyInfo,
  keyId?: string,
): HmacSuccess | null {
  const useKeyId = keyId ?? primaryKeyId;
  const key = keyStores[useKeyId]?.[info];
  if (!key) return null;

  return {
    hash: crypto.createHmac('sha256', key).update(payload).digest(),
    keyId: useKeyId,
  };
}
