import 'server-only';

import { sql } from 'drizzle-orm';

import db from '~/lib/db';
import logger from '~/lib/logger';
import redis from '~/lib/redis';

export async function GET() {
  try {
    // Test
    await db.execute(sql`SELECT 1`);
    await redis.ping();
    // Response
    return Response.json({ text: 'Ready' }, { status: 200 });
  } catch (e) {
    logger.error('healthz error:', e);
    return Response.json({ text: 'Error' }, { status: 500 });
  }
}
