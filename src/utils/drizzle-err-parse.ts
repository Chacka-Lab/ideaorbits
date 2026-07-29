import { z } from 'zod';

/* Example
{
  "constructorName": "DrizzleQueryError",
  "instanceofError": true,
  "name": "Error",
  "message": "Failed query: insert into \"drizzle_capture_1775782459718\" (\"secret\", \"emails\") values (default, $1)\nparams: duplicate@example.com",
  "ownPropertyNames": [
    "stack",
    "message",
    "query",
    "params",
    "cause"
  ],
  "query": "insert into \"drizzle_capture_1775782459718\" (\"secret\", \"emails\") values (default, $1)",
  "params": [
    "duplicate@example.com"
  ],
  "cause": {
    "constructorName": "PostgresError",
    "name": "PostgresError",
    "message": "duplicate key value violates unique constraint \"drizzle_capture_1775782459718_email_unique\"",
    "severity_local": "ERROR",
    "severity": "ERROR",
    "code": "23505",
    "detail": "Key (emails)=(duplicate@example.com) already exists.",
    "schema_name": "public",
    "table_name": "drizzle_capture_1775782459718",
    "constraint_name": "drizzle_capture_1775782459718_email_unique",
    "file": "nbtinsert.c",
    "line": "666",
    "routine": "_bt_check_unique",
    "query": "insert into \"drizzle_capture_1775782459718\" (\"secret\", \"emails\") values (default, $1)",
    "parameters": [
      "duplicate@example.com"
    ],
    "args": [
      "duplicate@example.com"
    ],
    "types": [
      25
    ]
  }
}
*/

// Define as needed
export const PG_ERR_CODES = {
  UniqueErr: '23505',
} as const;

type ErrWithCause = { cause?: unknown };

const pgLikeErrSchema = z.object({
  code: z.string(),
  message: z.string().optional(),
  constraint_name: z.string().optional(),
});
type PgLikeErr = z.infer<typeof pgLikeErrSchema>;

export default function drizzleErrParse(error: unknown): PgLikeErr | undefined {
  // "cause" MUST be accessed using ?.
  const parsed = pgLikeErrSchema.safeParse((error as ErrWithCause)?.cause);
  if (!parsed.success) return undefined;
  return parsed.data;
}
