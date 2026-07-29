import envPublic from '~/lib/env-public';
import type { StringValues } from '~/utils/types';

const routes = {
  pages: {
    home: '/',
    notFound: '/not-found',
    showError: '/show-error',
    auth: {
      signIn: '/sign-in',
      // complete
      signupEmailComplete: '/signup/complete/email',
      signupOAuthComplete: '/signup/complete/oauth',
      // reset
      passwordReset: '/reset-password',
      // twoFactorToken
      twoFactorLogin: '/login/two-factor',
    },
  },
  api: {
    auth: {
      callbackEmail: '/api/auth/callback/email',
      callbackGitHub: '/api/auth/callback/github',
    },
  },
  path: {
    api: {
      callback: '/api/auth/callback',
    },
  },
  system: {
    healthz: '/api/healthz',
  },
} as const;

export default routes;

const base = envPublic.SITE_BASE_URL.href.replace(/\/$/, '');

export function completeUrl<T extends StringValues<typeof routes>>(path: T): string {
  return `${base}${path}`;
}
