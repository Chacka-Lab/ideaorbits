import { z } from 'zod';

const envPublicSchema = z.object({
  SITE_BASE_URL: z.url().transform((val) => new URL(val)),
  TURNSTILE_SITE_KEY: z.string(),
  GITHUB_CLIENT_ID: z.string(),
});

const envPublic: Readonly<z.infer<typeof envPublicSchema>> = envPublicSchema.parse({
  SITE_BASE_URL: import.meta.env.PUBLIC_SITE_BASE_URL,
  TURNSTILE_SITE_KEY: import.meta.env.PUBLIC_TURNSTILE_SITE_KEY,
  GITHUB_CLIENT_ID: import.meta.env.PUBLIC_GITHUB_CLIENT_ID,
});

export default envPublic;
