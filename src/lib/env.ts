import 'server-only';

import { z } from 'zod';

const envSchema = z.object({
  // Site
  PUBLIC_SITE_BASE_URL: z.url().transform((val) => new URL(val)),
  SERVER_SECRETS: z.string(),
  // DB
  DATABASE_URL: z.string(),
  // Redis
  REDIS_URL: z.string(),
  // S3
  S3_REGION: z.string(),
  S3_ENDPOINT: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  S3_PUBLIC_BUCKET_NAME: z.string(),
  S3_PUBLIC_BUCKET_BASE_URL: z.url().transform((val) => new URL(val)),
  // Resend
  RESEND_API_KEY: z.string(),
  // Turnstile
  PUBLIC_TURNSTILE_SITE_KEY: z.string(),
  TURNSTILE_SECRET_KEY: z.string(),
  // GitHub App
  PUBLIC_GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
});

const env: Readonly<z.infer<typeof envSchema>> = envSchema.parse(process.env);

export default env;
