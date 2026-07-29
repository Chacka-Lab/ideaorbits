import { type CustomResponse, redirect } from '@solidjs/router';
import type { APIEvent } from '@solidjs/start/server';

import routes, { completeUrl } from '~/lib/routes';
import * as emailSignupTokenCookie from '~/modules/cookies/email-signup-token';
import { flows } from '~/modules/redis/email-verification';
import * as emailSignup from '~/services/user/auth/signup/email';
import { includes } from '~/utils/arr';
import { buildUrl } from '~/utils/url';

export async function GET(event: APIEvent): Promise<CustomResponse<never>> {
  const { searchParams } = new URL(event.request.url);
  const code = searchParams.get('code');
  const flow = searchParams.get('flow');

  if (!code || !includes(flows, flow)) {
    return redirect(
      buildUrl(completeUrl(routes.pages.showError), {
        errCode: 'invalidCode',
      }).href,
    );
  }

  switch (flow) {
    case 'signup':
      const res = await emailSignup.exchangeCode(code);
      if (!res.success) {
        return redirect(
          buildUrl(completeUrl(routes.pages.showError), {
            errCode: res.message,
          }).href,
        );
      }
      emailSignupTokenCookie.set(res.token);
      return redirect(completeUrl(routes.pages.auth.signupEmailComplete));
  }
}
