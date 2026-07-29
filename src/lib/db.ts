import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';

import env from '~/lib/env';

import { relations } from './schema/relations';

const globalForDb = globalThis as typeof globalThis & {
  db?: ReturnType<typeof createDb>;
};

function createDb() {
  return drizzle({
    relations,
    connection: {
      url: env.DATABASE_URL,
    },
  });
}

const db = globalForDb.db ?? createDb();

if (import.meta.env.DEV) {
  globalForDb.db = db;
}

export default db;
