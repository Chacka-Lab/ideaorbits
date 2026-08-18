import { Title } from '@solidjs/meta';
import { A, action, redirect, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';

import routes from '~/lib/routes';
import * as oauthStateCookie from '~/modules/cookies/oauth-state';
import * as sessionTokenCookie from '~/modules/cookies/session-token';
import * as twoFactorTokenCookie from '~/modules/cookies/two-factor-token';
import { request as oauthRequest } from '~/modules/user/auth/oauth';
import * as signinPassword from '~/services/user/auth/signin/password';

// ===== Actions =====

const requestGitHubSignin = action(async () => {
  'use server';
  const { link, state } = oauthRequest('github', 'signin');
  oauthStateCookie.set(state);
  throw redirect(link);
}, 'requestGitHubSignin');

const requestPasswordSignin = action(async (formData: FormData) => {
  'use server';
  const identifier = String(formData.get('identifier') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!identifier || !password) {
    return { success: false as const, message: 'fieldRequired' as const };
  }

  const input = identifier.includes('@')
    ? { email: identifier, password }
    : { username: identifier, password };

  const result = await signinPassword.request(input);

  if (!result.success) return result;

  if (result.twoFactor) {
    twoFactorTokenCookie.set(result.token);
    throw redirect(routes.pages.auth.twoFactorLogin);
  }

  sessionTokenCookie.set(result.token);
  throw redirect(routes.pages.home);
}, 'requestPasswordSignin');

// ===== Page =====

export default function SignInPage() {
  const sub = useSubmission(requestPasswordSignin);
  const ghSub = useSubmission(requestGitHubSignin);

  return (
    <main class="mx-auto max-w-md px-4 py-12">
      <Title>登录 - IdeaOrbits</Title>
      <h1 class="mb-6 text-2xl font-bold">登录</h1>

      {/* GitHub OAuth */}
      <form action={requestGitHubSignin} method="post" class="mb-4">
        <button
          type="submit"
          disabled={ghSub.pending}
          class="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {ghSub.pending ? '跳转中…' : '使用 GitHub 登录'}
        </button>
      </form>

      {/* Divider */}
      <div class="mb-4 flex items-center gap-3 text-sm text-gray-400">
        <span class="flex-1 border-t" />
        <span>或使用账号密码登录</span>
        <span class="flex-1 border-t" />
      </div>

      {/* Error banner */}
      <Show when={sub.result?.success === false ? sub.result : null}>
        {(result) => (
          <div class="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-800">
            ❌ {signinErrMsg(result().message)}
          </div>
        )}
      </Show>

      <form action={requestPasswordSignin} method="post" class="space-y-4">
        {/* identifier */}
        <div class="flex flex-col gap-1">
          <label for="identifier" class="text-sm font-medium">
            用户名或邮箱
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            autocomplete="username"
            placeholder="username 或 you@example.com"
            class="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* password */}
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label for="password" class="text-sm font-medium">
              密码
            </label>
            <A
              href={routes.pages.auth.passwordReset}
              class="text-xs text-blue-600 hover:underline"
            >
              忘记密码？
            </A>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autocomplete="current-password"
            class="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={sub.pending}
          class="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {sub.pending ? '登录中…' : '登录'}
        </button>
      </form>

      {/* Footer link */}
      <p class="mt-6 text-center text-sm text-gray-500">
        还没有账号？{' '}
        <A href="/signup" class="text-blue-600 hover:underline">
          立即注册
        </A>
      </p>
    </main>
  );
}

// ===== Helpers =====

function signinErrMsg(message: string): string {
  const map: Record<string, string> = {
    emailOrPasswordIncorrect: '账号或密码错误',
    usernameOrPasswordIncorrect: '账号或密码错误',
    fieldRequired: '请填写账号和密码',
    userSuspended: '账户已被封禁，如有疑问请联系支持',
    internalError: '服务器错误，请稍后重试',
  };
  return map[message] ?? '未知错误';
}
