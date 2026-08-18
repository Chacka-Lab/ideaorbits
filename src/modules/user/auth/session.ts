import 'server-only';

import { randomBytes } from 'node:crypto';

import { desc, eq, inArray, lt, sql } from 'drizzle-orm';
import { pack, unpack } from 'msgpackr';
import { z } from 'zod';

import db from '~/lib/db';
import logger from '~/lib/logger';
import { userSessions } from '~/lib/schema/auth';
import { hashToken, verifyToken } from '~/modules/crypto/hash';
import { isPast } from '~/utils/time';

// ===== Top =====

const MAX_SESSIONS = 30;
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30d

type SessionToken = Buffer;

const tokenPayloadSchema = z.object({
  id: z.string(),
  secret: z.instanceof(Buffer),
});
type TokenPayloadSchema = z.infer<typeof tokenPayloadSchema>;

// ===== Create =====

/**
 * Danger! It is only called after successful identity verification.
 *
 * @param userId The verified user's userId.
 * @return Session token.
 */
export async function create(userId: string): Promise<SessionToken> {
  const secret = randomBytes(32);
  const secretHash = hashToken(secret);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const [session] = await db
    .insert(userSessions)
    .values({ userId, secretHash, expiresAt })
    .returning({ id: userSessions.id });

  if (!session) {
    throw new Error('sessions/createToken: insert session no return val');
  }

  // It cannot be encapsulated within a single transaction;
  // otherwise, the insertions made by other concurrent transactions cannot be read.
  //
  // In most cases, the final consistency is not a strict consistency.
  const overflow = db
    .select({ id: userSessions.id })
    .from(userSessions)
    .where(eq(userSessions.userId, userId))
    .orderBy(desc(userSessions.createdAt))
    .offset(MAX_SESSIONS);

  await db.delete(userSessions).where(inArray(userSessions.id, overflow));

  const payload: TokenPayloadSchema = {
    id: session.id,
    secret: secret,
  };

  return pack(payload);
}

// ===== Verify =====

export interface Session {
  user: {
    id: string;
    displayName: string;
    username: string;
    email: string;
    createdAt: Date;
  };
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
}

export async function verify(token: Buffer): Promise<Session | null> {
  const parsed = tokenPayloadSchema.safeParse(unpack(token));
  if (!parsed.success) return null;

  const session = await db.query.userSessions.findFirst({
    where: { id: parsed.data.id },
    with: {
      user: { where: { status: 'active' } },
    },
  });

  if (!session?.user || isPast(session.expiresAt)) {
    if (!session) return null;
    // Concurrently, clean up
    db.delete(userSessions)
      .where(eq(userSessions.id, session.id))
      .catch((e) => logger.warn('session:verify failed to clean session:', e));
    return null;
  }

  if (!verifyToken(parsed.data.secret, session.secretHash)) {
    return null;
  }

  return {
    user: session.user,
    sessionId: session.id,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
  };
}

// ===== Revoke =====

export async function revoke(sessionId: string) {
  await db.delete(userSessions).where(eq(userSessions.id, sessionId));
}

export async function revokeAll(userId: string) {
  await db.delete(userSessions).where(eq(userSessions.userId, userId));
}

// ===== Maintenance =====

export async function cleanup(limit = 500) {
  const expired = db
    .select({ id: userSessions.id })
    .from(userSessions)
    .where(lt(userSessions.expiresAt, sql`NOW()`))
    .limit(limit);

  await db.delete(userSessions).where(inArray(userSessions.id, expired));
}
