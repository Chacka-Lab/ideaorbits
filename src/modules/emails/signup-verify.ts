import 'server-only';

import email from '~/lib/email';
import type { Locale } from '~/modules/intl/config';

interface Input {
  displayName: string;
  email: string;
  link: string;
  locale: Locale;
}

export async function sendSignupVerifyEmail(input: Input) {
  return await email.emails.send({
    to: input.email,
    template: {
      id: `signup-verify-${input.locale.toLowerCase()}`,
      variables: {
        DISPLAY_NAME: input.displayName,
        LINK: input.link,
      },
    },
  });
}
