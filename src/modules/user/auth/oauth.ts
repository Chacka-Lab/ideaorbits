import { randomBytes } from 'node:crypto';

import { pack, unpack } from 'msgpackr';
import { OAuthApp, Octokit, RequestError } from 'octokit';
import { z } from 'zod';

import env from '~/lib/env';
import logger from '~/lib/logger';
import routes, { completeUrl } from '~/lib/routes';
import type { OAuthProvider } from '~/modules/user/schemas/oauth-providers';
import { buildUrl } from '~/utils/url';

// ===== Top =====

export interface UserPayload {
  uid: string;
  name: string;
  avatarUrl: string;
  email: string;
}

const flows = ['signin', 'signup'] as const;
type Flow = (typeof flows)[number];

type State = string;

const statePayloadSchema = z.object({
  flow: z.enum(flows),
  nonce: z.instanceof(Buffer),
});
type StatePayload = z.infer<typeof statePayloadSchema>;

// ===== Request =====

type RequestSuccess = {
  link: string;
  state: State;
};

export function request(provider: OAuthProvider, flow: Flow): RequestSuccess {
  const statePack: StatePayload = { flow, nonce: randomBytes(16) };
  const state = pack(statePack).toString('base64url');

  switch (provider) {
    case 'github':
      return {
        link: buildUrl('https://github.com/login/oauth/authorize', {
          client_id: env.PUBLIC_GITHUB_CLIENT_ID,
          redirect_uri: completeUrl(routes.api.auth.callbackGitHub),
          state,
        }).href,
        state,
      };
  }
}

// ===== Get State Flow =====

export function getFlow(state: string): Flow | null {
  const parsed = statePayloadSchema.safeParse(unpack(Buffer.from(state, 'base64url')));
  return parsed.success ? parsed.data.flow : null;
}

// ===== GitHub =====

type GetGitHubUserResult =
  | {
      success: true;
      data: UserPayload;
    }
  | {
      success: false;
      message: 'invalidToken' | 'internalError';
    };

async function getGitHubUser(code: string): Promise<GetGitHubUserResult> {
  const app = new OAuthApp({
    clientId: env.PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
  });

  let authentication;
  try {
    authentication = (await app.createToken({ code })).authentication;
  } catch (e) {
    if (e instanceof RequestError) {
      // TODO: Identify the cause of the error (Draft)
      return { success: false, message: 'invalidToken' };
    }
    return { success: false, message: 'internalError' };
  }

  const octokit = new Octokit({
    auth: authentication.token,
    log: logger,
  });

  const [userRes, emailsRes] = await Promise.all([
    await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2026-03-10',
      },
    }),
    await octokit.request('GET /user/emails', {
      headers: {
        'X-GitHub-Api-Version': '2026-03-10',
      },
    }),
  ]);

  const primaryEmail = emailsRes.data.find((e) => e.primary && e.verified)?.email;
  if (!primaryEmail) return { success: false, message: 'internalError' };

  return {
    success: true,
    data: {
      uid: String(userRes.data.id),
      name: userRes.data.name ?? userRes.data.login,
      avatarUrl: userRes.data.avatar_url,
      email: primaryEmail,
    },
  };
}

// ===== Get User =====

type GetUserResult =
  | {
      success: true;
      data: UserPayload;
    }
  | {
      success: false;
      message: 'invalidToken' | 'internalError';
    };

export async function getUser(
  provider: OAuthProvider,
  params: URLSearchParams,
): Promise<GetUserResult> {
  switch (provider) {
    case 'github':
      const code = params.get('code');
      if (!code) return { success: false, message: 'invalidToken' };
      const ghRes = await getGitHubUser(code);
      if (!ghRes.success) return { success: false, message: ghRes.message };
      return { success: true, data: ghRes.data };
  }
}
