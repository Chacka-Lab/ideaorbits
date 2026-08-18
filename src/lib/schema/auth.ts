import { sql } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';

import { CONSTR_NAMES, mainSchema } from './global';

export const oauthProvider = p.pgEnum('oauth_provider', ['github']);
export const webauthnTransports = p.pgEnum('webauthn_transports', [
  'ble',
  'cable',
  'hybrid',
  'internal',
  'nfc',
  'smart-card',
  'usb',
]);

export const userPasswords = mainSchema.table('user_passwords', {
  userId: p.uuid('user_id').primaryKey(),
  passwordHash: p.bytea('password_hash').notNull(),
  createdAt: p.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: p.timestamp('last_used_at', { withTimezone: true }),
});

export const userOAuth = mainSchema.table(
  'user_oauth',
  {
    userId: p.uuid('user_id'),
    provider: oauthProvider('provider'),
    providerUid: p.text('provider_uid').notNull(),
    createdAt: p.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastUsedAt: p.timestamp('last_used_at', { withTimezone: true }),
  },
  (t) => [
    p.primaryKey({ name: CONSTR_NAMES.userOAuthPk, columns: [t.userId, t.provider] }),
    p.unique('uq_provider_provider_uid').on(t.provider, t.providerUid),
  ],
);

/**
 * 2FA!
 * Before executing DML, the corresponding user's RecoveryKeys must be locked.
 */
export const userTotps = mainSchema.table('user_totps', {
  userId: p.uuid('user_id').primaryKey(),
  encryptedSecret: p.bytea('encrypted_secret').notNull(),
  createdAt: p.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: p.timestamp('last_used_at', { withTimezone: true }),
});

/**
 * 2FA!
 * Before executing DML, the corresponding user's RecoveryKeys must be locked.
 */
export const userPasskeys = mainSchema.table('user_passkeys', {
  id: p.text('id').primaryKey(),
  userId: p.uuid('user_id').notNull(),
  publicKey: p.bytea('public_key').notNull(),
  counter: p.bigint('counter', { mode: 'number' }).notNull().default(0),
  transports: webauthnTransports('transports').array(),
  aaguid: p.text('aaguid'),
  nickname: p.text('nickname').notNull(),
  createdAt: p.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  lastUsedAt: p.timestamp('last_used_at', { withTimezone: true }),
});

/**
 * 2FA!
 * Before executing DML, the corresponding user's RecoveryKeys must be locked.
 */
export const userRecoveryKeys = mainSchema.table('user_recovery_keys', {
  userId: p.uuid('user_id').primaryKey(),
  keyHash: p.bytea('key_hash').notNull(),
  createdAt: p.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userSessions = mainSchema.table(
  'user_sessions',
  {
    id: p
      .uuid('id')
      .default(sql`uuidv7()`)
      .primaryKey(),

    userId: p.uuid('user_id').notNull(),
    secretHash: p.bytea('secret_hash').notNull(),
    createdAt: p.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: p.timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => [
    p.index('idx_user-sessions_user').on(t.userId),
    p.index('idx_user-sessions_created').on(t.createdAt),
    p.check('ck_user-sessions_expires_created', sql`${t.expiresAt} >= ${t.createdAt}`),
  ],
);
