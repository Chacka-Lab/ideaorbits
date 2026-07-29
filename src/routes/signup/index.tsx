import { Title } from '@solidjs/meta';
import { action, redirect, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';

import * as oauthStateCookie from '~/modules/cookies/oauth-state';
import { request as oauthRequest } from '~/modules/user/auth/oauth';
import * as emailSignup from '~/services/user/auth/signup/email';

// ===== Actions =====

const requestGitHubSignup = action(async () => {
  'use server';
  const { link, state } = oauthRequest('github', 'signup');
  oauthStateCookie.set(state);
  throw redirect(link);
}, 'requestGitHubSignup');

const requestEmailSignup = action(async (formData: FormData) => {
  'use server';
  const locale = formData.get('locale');
  return await emailSignup.request({
    displayName: String(formData.get('displayName') ?? ''),
    email: String(formData.get('email') ?? ''),
    locale: locale === 'zh-Hans' ? 'zh-Hans' : 'en',
  });
}, 'requestEmailSignup');

// ===== Page =====

export default function SignUpPage() {
  const sub = useSubmission(requestEmailSignup);
  const ghSub = useSubmission(requestGitHubSignup);

  return (
    <main class="mx-auto max-w-md px-4 py-12">
      <Title>注册 - IdeaOrbits</Title>
      <h1 class="mb-6 text-2xl font-bold">注册</h1>

      {/* GitHub OAuth */}
      <form action={requestGitHubSignup} method="post" class="mb-4">
        <button
          type="submit"
          disabled={ghSub.pending}
          class="flex w-full items-center justify-center gap-2 rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.48 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {ghSub.pending ? '跳转中…' : '使用 GitHub 注册'}
        </button>
      </form>

      {/* Divider */}
      <div class="mb-4 flex items-center gap-3 text-sm text-gray-400">
        <span class="flex-1 border-t" />
        <span>或使用邮箱注册</span>
        <span class="flex-1 border-t" />
      </div>

      {/* Success */}
      <Show when={sub.result?.success === true}>
        <div class="mb-4 rounded border border-green-300 bg-green-50 p-3 text-green-800">
          ✅ 验证邮件已发送，请查收邮箱并点击链接完成注册。
        </div>
      </Show>

      {/* Top-level error — capture once so TS can narrow the union */}
      <Show when={sub.result?.success === false ? sub.result : null}>
        {(result) => (
          <Show when={result().message}>
            <div class="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-800">
              ❌{' '}
              {result().message === 'tooFrequently'
                ? '发送太频繁，请稍后再试'
                : result().message === 'sendEmailError'
                  ? '邮件发送失败，请稍后重试'
                  : '服务器错误，请稍后重试'}
            </div>
          </Show>
        )}
      </Show>

      <form action={requestEmailSignup} method="post" class="space-y-4">
        {/* displayName */}
        <div class="flex flex-col gap-1">
          <label for="displayName" class="text-sm font-medium">
            昵称
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            maxlength="50"
            placeholder="最多 50 字符"
            class="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Show
            when={sub.result?.success === false && sub.result.fieldErrors?.displayName}
          >
            <span class="text-xs text-red-600">
              {sub.result?.success === false &&
                formatFieldErr(sub.result.fieldErrors?.displayName)}
            </span>
          </Show>
        </div>

        {/* email */}
        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-medium">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            class="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Show when={sub.result?.success === false && sub.result.fieldErrors?.email}>
            <span class="text-xs text-red-600">
              {sub.result?.success === false &&
                formatFieldErr(sub.result.fieldErrors?.email)}
            </span>
          </Show>
        </div>

        {/* locale */}
        <div class="flex flex-col gap-1">
          <label for="locale" class="text-sm font-medium">
            语言
          </label>
          <select
            id="locale"
            name="locale"
            class="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="zh-Hans">简体中文</option>
            <option value="en">English</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={sub.pending}
          class="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {sub.pending ? '发送中…' : '发送验证邮件'}
        </button>
      </form>
    </main>
  );
}

// ===== Helpers =====

function formatFieldErr(err: string | undefined): string {
  if (!err) return '';
  const map: Record<string, string> = {
    displayNameBad: '昵称格式错误',
    displayNameTooShort: '昵称不能为空',
    displayNameTooLong: '昵称最多 50 字符',
    displayNameInvalid: '昵称包含非法字符',
    emailBad: '邮箱格式错误',
    emailTooLong: '邮箱最多 255 字符',
    emailInvalid: '邮箱格式无效',
    emailTaken: '该邮箱已被注册',
    unknownError: '未知错误',
  };
  return map[err] ?? err;
}
