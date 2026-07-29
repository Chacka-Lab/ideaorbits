import { sql } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';

import { citext, CONSTR_NAMES, mainSchema } from './global';

export const userStatus = p.pgEnum('user_status', ['active', 'suspended', 'deleted']);

export const users = mainSchema.table(
  'users',
  {
    id: p
      .uuid('id')
      .default(sql`uuidv7()`)
      .primaryKey(),

    displayName: p.text('display_name').notNull(),
    username: citext('username').notNull(),
    email: p.text('email').notNull(),
    status: userStatus('status').notNull(),
    createdAt: p.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    p.unique(CONSTR_NAMES.usersUsername).on(t.username),
    p.unique(CONSTR_NAMES.usersEmail).on(t.email),
  ],
);
