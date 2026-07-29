import { Resend } from 'resend';

import env from '~/lib/env';

const globalForEmail = globalThis as typeof globalThis & {
  email?: Resend;
};

const email = globalForEmail.email ?? new Resend(env.RESEND_API_KEY);

if (import.meta.env.PROD) {
  globalForEmail.email = email;
}

export default email;
