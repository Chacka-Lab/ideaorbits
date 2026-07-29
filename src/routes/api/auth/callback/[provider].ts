import 'server-only';

import { type CustomResponse, redirect } from '@solidjs/router';
import type { APIEvent } from '@solidjs/start/server';

import routes, { completeUrl } from '~/lib/routes';
import * as oauthSignupTokenCookie from '~/modules/cookies/oauth-signup-token';
import * as oauthStateCookie from '~/modules/cookies/oauth-state';
import * as sessionToken from '~/modules/cookies/session-token';
import * as twoFactorTokenCookie from '~/modules/cookies/two-factor-token';
import { getFlow } from '~/modules/user/auth/oauth';
import { oauthProviders } from '~/modules/user/schemas/oauth-providers';
import * as oauthSignin from '~/services/user/auth/signin/oauth';
import * as oauthSignup from '~/services/user/auth/signup/oauth';
import { includes } from '~/utils/arr';
import { buildUrl } from '~/utils/url';

export async function GET(event: APIEvent): Promise<CustomResponse<never>> {
  const provider = event.params.provider;
  if (!provider || !includes(oauthProviders, provider)) {
    return redirect(completeUrl(routes.pages.notFound));
  }

  const { searchParams } = new URL(event.request.url);
  const state = searchParams.get('state');
  const storedState = oauthStateCookie.consume();
  if (!state || state !== storedState) {
    return redirect(
      buildUrl(completeUrl(routes.pages.showError), {
        message: 'invalidToken',
      }).href,
    );
  }

  const flow = getFlow(storedState);
  if (!flow) {
    return redirect(
      buildUrl(completeUrl(routes.pages.showError), {
        message: 'invalidToken',
      }).href,
    );
  }

  switch (flow) {
    case 'signup':
      const signupRes = await oauthSignup.handleCallback(provider, searchParams);
      if (!signupRes.success) {
        return redirect(
          buildUrl(completeUrl(routes.pages.showError), {
            message: signupRes.message,
          }).href,
        );
      }
      oauthSignupTokenCookie.set(signupRes.token);
      return redirect(completeUrl(routes.pages.auth.signupOAuthComplete));

    case 'signin':
      const signinRes = await oauthSignin.handleCallback(provider, searchParams);
      if (!signinRes.success) {
        return redirect(
          buildUrl(completeUrl(routes.pages.showError), {
            message: signinRes.message,
          }).href,
        );
      }

      if (signinRes.twoFactor) {
        twoFactorTokenCookie.set(signinRes.token);
        return redirect(completeUrl(routes.pages.auth.twoFactorLogin));
      } else {
        sessionToken.set(signinRes.token);
        return redirect(completeUrl(routes.pages.home));
      }
  }
}
