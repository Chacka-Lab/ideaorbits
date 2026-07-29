import 'server-only';

import { createHash, randomBytes } from 'node:crypto';

import { pack, unpack } from 'msgpackr';
import { z } from 'zod';

import redis from '~/lib/redis';
import routes, { completeUrl } from '~/lib/routes';
import { simpleDecrypt, simpleEncrypt } from '~/modules/crypto/encryption';
import { hashToken } from '~/modules/crypto/hash';
import { emailSchema } from '~/modules/user/schemas/basic';
import { buildUrl } from '~/utils/url';

import * as redisKeyNames from './key-names';

// ===== Top =====

const payloadSchema = z.object({
  ...emailSchema.shape,
  payload: z.string(),
});
type Payload = z.infer<typeof payloadSchema>;

const packageSchema = z.object({
  // There is an email field, encryption is necessary
  ...emailSchema.shape,
  secret: z.instanceof(Buffer),
});
type Package = z.infer<typeof packageSchema>;

export const flows = ['signup'] as const;
export type Flow = (typeof flows)[number];

type Code = string;
type Token = Buffer;

// ===== Tools =====

function encodePackage(p: Package): Buffer {
  // raw => pack => encrypt => stringify (Code)
  return simpleEncrypt(pack(p), 'emailVerification');
}

function decodePackage(data: Buffer): Package | null {
  const res = simpleDecrypt(data, 'emailVerification');
  if (res) {
    const parsed = packageSchema.safeParse(unpack(res.payload));
    if (parsed.success) return parsed.data;
  }
  return null;
}

function hashEmail(parsedEmail: string, flow: Flow): Buffer {
  return createHash('sha256').update(`${flow}:${parsedEmail}`).digest();
}

function hashSecret(secret: Buffer): string {
  return hashToken(secret).toString('base64url');
}

// ===== Exports =====

export async function createCode<T>(
  input: Payload,
  flow: Flow,
  ttl: number,
  sendEmailFn: (link: string, email: string) => T,
): Promise<T | 'tooFrequently'> {
  const parsed = payloadSchema.parse(input);
  const hash = hashEmail(parsed.email, flow);
  const key = redisKeyNames.emailVerificationCode(hash.toString('base64url'));
  const codePayload: Package = { email: parsed.email, secret: randomBytes(32) };

  const ok = await redis.hSetKeyNX(
    key,
    {
      secretHash: hashSecret(codePayload.secret),
      payload: parsed.payload,
    },
    ttl,
  );
  if (!ok) return 'tooFrequently';

  const code = encodePackage(codePayload).toString('base64url');
  const link = buildUrl(completeUrl(routes.api.auth.callbackEmail), { code, flow }).href;

  return sendEmailFn(link, parsed.email);
}

export async function exchangeCode(
  code: Code,
  flow: Flow,
  ttl: number,
): Promise<Token | null> {
  // code
  const codePayload = decodePackage(Buffer.from(code, 'base64url'));
  if (!codePayload) return null;

  // token
  const tokenPayload: Package = { email: codePayload.email, secret: randomBytes(32) };

  // exchange
  const hashStr = hashEmail(codePayload.email, flow).toString('base64url');
  const ok = await redis.exchangeCode(
    redisKeyNames.emailVerificationCode(hashStr),
    redisKeyNames.emailVerificationToken(hashStr, hashSecret(tokenPayload.secret)),
    hashSecret(codePayload.secret),
    ttl,
  );
  if (ok) return encodePackage(tokenPayload);

  return null;
}

export async function getPayload(token: Token, flow: Flow): Promise<Payload | null> {
  // token
  const tokenPayload = decodePackage(token);
  if (!tokenPayload) return null;

  // get payload
  const [payload] = await redis.hmGet(
    redisKeyNames.emailVerificationToken(
      hashEmail(tokenPayload.email, flow).toString('base64url'),
      hashSecret(tokenPayload.secret),
    ),
    ['payload'],
  );
  if (typeof payload !== 'string') return null;

  return { email: tokenPayload.email, payload };
}

export async function consumeToken(token: Token, flow: Flow): Promise<Payload | null> {
  // token
  const tokenPayload = decodePackage(token);
  if (!tokenPayload) return null;

  // get & delete
  const [payload] = await redis.hGetDel(
    redisKeyNames.emailVerificationToken(
      hashEmail(tokenPayload.email, flow).toString('base64url'),
      hashSecret(tokenPayload.secret),
    ),
    ['payload'],
  );
  if (typeof payload !== 'string') return null;

  return { email: tokenPayload.email, payload };
}
