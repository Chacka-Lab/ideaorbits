import 'server-only';

import { randomBytes } from 'node:crypto';

import redis from '~/lib/redis';

import * as redisKeyNames from './key-names';

// ===== Top =====

const CHALLENGE_TTL = 60 * 5; // 5min

type Challenge = string;

// ===== Exports =====

export async function create(): Promise<Challenge> {
  const challenge = randomBytes(16).toString('base64url');
  await redis.set(redisKeyNames.webauthnChallenge(challenge), 'OK', {
    expiration: {
      type: 'EX',
      value: CHALLENGE_TTL,
    },
  });

  return challenge;
}

export async function consume(challenge: string): Promise<boolean> {
  return (await redis.get(redisKeyNames.webauthnChallenge(challenge))) === 'OK';
}
