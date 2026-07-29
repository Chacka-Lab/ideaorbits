import 'server-only';

import { createHash, hkdfSync } from 'node:crypto';

import env from '~/lib/env';

// ===== Top =====

export const keyInfos = ['sessionToken', 'emailVerification', 'totpSecret'] as const;
export type KeyInfo = (typeof keyInfos)[number];

type KeyStore = Readonly<Record<string, Buffer>>;

const hkdfSalt = 'github.com/Chacka-Lab/ideaorbits';
const hkdfLength = 32;

// ===== Tools =====

function toSecretIdBuffer(ikm: string): Buffer {
  return createHash('sha256').update(ikm).digest().subarray(0, 4);
}

export function toSecretId(secretIdBuffer: Buffer): string {
  if (secretIdBuffer.length !== 4) {
    throw new Error('the "secretIdBuffer" length must be 4');
  }
  return secretIdBuffer.toString('base64url');
}

// ===== Exports =====

// Strong random string (>= 32 bytes security)
const ikms = env.SERVER_SECRETS.split(';')
  .map((s) => s.trim())
  .filter(Boolean);
if (!ikms[0]) throw new Error('no effective ikm was found');

export const primaryKeyIdBuffer = toSecretIdBuffer(ikms[0]);
export const primaryKeyId = toSecretId(primaryKeyIdBuffer);

/**
 * keyId -> { info -> key }
 */
export const keyStores: Readonly<Record<string, KeyStore>> = (() => {
  const stores: Record<string, KeyStore> = {};
  for (const ikm of ikms) {
    const id = toSecretId(toSecretIdBuffer(ikm));
    const store: Record<string, Buffer> = {};
    stores[id] = store;
    for (const info of keyInfos) {
      store[info] = Buffer.from(
        hkdfSync(
          'sha256',
          Buffer.from(ikm, 'utf-8'),
          Buffer.from(hkdfSalt, 'utf-8'),
          Buffer.from(info, 'utf-8'),
          hkdfLength,
        ),
      );
    }
  }
  return stores;
})();
