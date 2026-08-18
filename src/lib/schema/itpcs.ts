import { sql } from 'drizzle-orm';
import * as p from 'drizzle-orm/pg-core';

import { mainSchema } from '~/lib/schema/global';

export const objectStatus = p.pgEnum('object_status', ['open', 'pinned', 'closed']);

export const ideas = mainSchema.table('ideas', {
  id: p
    .uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),

  status: objectStatus('idea_status').notNull(),
});

export const topics = mainSchema.table('topics', {
  id: p
    .uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),

  status: objectStatus('idea_status').notNull(),
});

export const points = mainSchema.table('points', {
  id: p
    .uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),

  status: objectStatus('idea_status').notNull(),
});

export const contents = mainSchema.table('contents', {
  status: objectStatus('idea_status').notNull(),
});

export const sections = mainSchema.table('sections', {
  id: p
    .uuid('id')
    .default(sql`uuidv7()`)
    .primaryKey(),

  status: objectStatus('idea_status').notNull(),
});
