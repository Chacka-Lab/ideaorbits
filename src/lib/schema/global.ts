import * as p from 'drizzle-orm/pg-core';

export const mainSchema = p.pgSchema('site');

export const citext = p.customType<{ data: string }>({ dataType: () => 'citext' });

export const CONSTR_NAMES = {
  usersUsername: 'uq_users_username',
  usersEmail: 'uq_users_email',
  userOAuthPk: 'pk_user_oauth',
  userWebAuthnPk: 'pk_user_webauthn',
} as const;
