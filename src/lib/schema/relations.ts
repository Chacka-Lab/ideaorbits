import { defineRelations } from 'drizzle-orm';

import * as auth from '~/lib/schema/auth';
import * as users from '~/lib/schema/users';

export const relations = defineRelations(
  {
    users: users.users,
    userPasswords: auth.userPasswords,
    userTotps: auth.userTotps,
    userRecoveryKeys: auth.userRecoveryKeys,
    userSessions: auth.userSessions,
    userOAuth: auth.userOAuth,
    userPasskeys: auth.userPasskeys,
  },
  (r) => ({
    users: {
      password: r.one.userPasswords({
        from: r.users.id,
        to: r.userPasswords.userId,
      }),

      totp: r.one.userTotps({
        from: r.users.id,
        to: r.userTotps.userId,
      }),

      recoveryKey: r.one.userRecoveryKeys({
        from: r.users.id,
        to: r.userRecoveryKeys.userId,
      }),

      oauth: r.many.userOAuth({
        from: r.users.id,
        to: r.userOAuth.userId,
      }),

      passkeys: r.many.userPasskeys({
        from: r.users.id,
        to: r.userPasskeys.userId,
      }),
    },

    userOAuth: {
      user: r.one.users({
        from: r.userOAuth.userId,
        to: r.users.id,
      }),
    },

    userPasskeys: {
      user: r.one.users({
        from: r.userPasskeys.userId,
        to: r.users.id,
      }),
    },

    userSessions: {
      user: r.one.users({
        from: r.userSessions.userId,
        to: r.users.id,
      }),
    },
  }),
);
