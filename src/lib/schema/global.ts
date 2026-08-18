import * as p from 'drizzle-orm/pg-core';

export const mainSchema = p.pgSchema('site');

export const citext = p.customType<{ data: string }>({ dataType: () => 'citext' });

export const CONSTR_NAMES = {
  usersUsername: 'uq_users_username',
  usersEmail: 'uq_users_email',
  userOAuthPk: 'pk_user_oauth',
  userWebAuthnPk: 'pk_user_webauthn',
} as const;

export const globalSettingsIndex = p.pgEnum('global_ettings_index', ['00']);

export const globalSettings = mainSchema.table('global_settings', {
  id: globalSettingsIndex('id').primaryKey(),
  // Idea
  ignitionThreshold: p.bigint({ mode: 'bigint' }).notNull(),
});
