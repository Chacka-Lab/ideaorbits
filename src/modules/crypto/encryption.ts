import 'server-only';

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

import {
  type KeyInfo,
  keyStores,
  primaryKeyId,
  primaryKeyIdBuffer,
  toSecretId,
} from './keys';

const VERSION_TAG: Buffer = Buffer.from([0x01]);

export function simpleEncrypt(payload: Buffer, info: KeyInfo): Buffer {
  const iv = randomBytes(12);
  const key = keyStores[primaryKeyId]![info]!;
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(payload), cipher.final()]);

  return Buffer.concat([
    VERSION_TAG,
    primaryKeyIdBuffer,
    iv,
    cipher.getAuthTag(),
    ciphertext,
  ]); // 1 + 4 + 12 + 16 + N (N >= 0)
}

type DecryptSuccess = { payload: Buffer; reEncrypt: boolean };

export function simpleDecrypt(data: Buffer, info: KeyInfo): DecryptSuccess | null {
  if (data.length < 1 + 4 + 12 + 16) return null;

  const version = data.subarray(0, 1);
  if (!version.equals(VERSION_TAG)) return null;

  const keyId = toSecretId(data.subarray(1, 5));
  const key = keyStores[keyId]?.[info];
  if (key === undefined) return null;

  const iv = data.subarray(5, 17);
  const authTag = data.subarray(17, 33);
  const ciphertext = data.subarray(33);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  try {
    return {
      payload: Buffer.concat([decipher.update(ciphertext), decipher.final()]),
      reEncrypt: keyId !== primaryKeyId,
    };
  } catch {}

  return null;
}
