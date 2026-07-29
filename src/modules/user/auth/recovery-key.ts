import 'server-only';

import { randomBytes } from 'node:crypto';

import { decodeB32, encodeB32 } from '~/modules/crypto/base32';
import { hashToken, verifyToken } from '~/modules/crypto/hash';

type GenerateSuccess = {
  key: string;
  hash: Buffer;
};

export function generate(): GenerateSuccess {
  const key = randomBytes(30);
  return {
    key: encodeB32(key),
    hash: hashToken(key),
  };
}

export function auth(key: string, hash: Buffer): boolean {
  return verifyToken(decodeB32(key), hash);
}
