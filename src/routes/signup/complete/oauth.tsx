import { Title } from '@solidjs/meta';
import { action, createAsync, query, redirect, useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';

import routes, { completeUrl } from '~/lib/routes';
import * as oauthSignupTokenCookie from '~/modules/cookies/oauth-signup-token';
import * as oauthSignup from '~/services/user/auth/signup/oauth';

// ===== Types =====

type CompleteResult = Awaited<ReturnType<typeof oauthSignup.complete>>;

// ===== Server loader =====

const getSignupState = query(async () => {
  'use server';
  const token = oauthSignupTokenCookie.get();
  // Same reasoning as email complete: don't redirect here, let the page handle it
  if (!token) return null;

  const res = await oauthSignup.getPayload(token);
  if (!res.success) return null;

  return {
    displayName: res.data.displayName,
    email: res.data.email,
    provider: res.data.provider,
  };
}, 'oauthSignupState');

export const route = {
  preload: () => getSignupState(),
};

// ===== Action =====

const completeOAuthSignup = action(
  async (formData: FormData): Promise<CompleteResult> => {
    'use server';
    const token = oauthSignupTokenCookie.get();
    if (!token) return { success: false, message: 'invalidToken' };

    const result = await oauthSignup.complete(token, {
      displayName: String(formData.get('displayName') ?? ''),
      username: String(formData.get('username') ?? ''),
    });

    if (result.success) {
      oauthSignupTokenCookie.del();
      throw redirect(completeUrl(routes.pages.home));
    }

    return result;
  },
  'completeOAuthSignup',
);

// ===== Page =====

export default function SignupOAuthCompletePage() {
  const state = createAsync(() => getSignupState());
  const sub = useSubmission(completeOAuthSignup);

  const failResult = () => {
    const r = sub.result;
    return r?.success === false ? r : null;
  };

  return (
    <main class="mx-auto max-w-md px-4 py-12">
      <Title>完成注册 - IdeaOrbits</Title>
      <h1 class="mb-2 text-2xl font-bold">完成注册</h1>

      <Show when={state()}>
        <p class="mb-6 text-sm text-gray-500">
          通过{' '}
          <span class="font-medium text-gray-700 capitalize">{state()!.provider}</span>{' '}
          授权：
          <span class="font-medium text-gray-700">{state()!.email}</span>
        </p>
      </Show>

      {/* Top-level error (message without fieldErrors) */}
      <Show when={failResult()}>
        {(result) => (
          <Show when={result().message && !result().fieldErrors}>
            <div class="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-800">
              ❌{' '}
              {result().message === 'invalidToken'
                ? '授权已过期，请重新发起注册'
                : '服务器错误，请稍后重试'}
            </div>
          </Show>
        )}
      </Show>

      <form action={completeOAuthSignup} method="post" class="space-y-4">
        {/* displayName — pre-filled from OAuth, optional override */}
        <div class="flex flex-col gap-1">
          <label for="displayName" class="text-sm font-medium">
            昵称
            <span class="ml-1 text-xs font-normal text-gray-400">（可修改）</span>
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            maxlength="50"
            value={state()?.displayName ?? ''}
            class="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Show when={failResult()?.fieldErrors?.displayName}>
            {(err) => <span class="text-xs text-red-600">{formatFieldErr(err())}</span>}
          </Show>
        </div>

        {/* username */}
        <div class="flex flex-col gap-1">
          <label for="username" class="text-sm font-medium">
            用户名
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            minlength="3"
            maxlength="50"
            placeholder="字母、数字，可含连字符，如 my-name"
            class="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Show when={failResult()?.fieldErrors?.username}>
            {(err) => <span class="text-xs text-red-600">{formatFieldErr(err())}</span>}
          </Show>
        </div>

        {/* email taken (edge case) */}
        <Show when={failResult()?.fieldErrors?.email}>
          <p class="text-xs text-red-600">该邮箱已被注册，请使用其他账号重新授权。</p>
        </Show>

        <button
          type="submit"
          disabled={sub.pending}
          class="w-full rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {sub.pending ? '注册中…' : '完成注册'}
        </button>
      </form>
    </main>
  );
}

// ===== Helpers =====

function formatFieldErr(err: string): string {
  const map: Record<string, string> = {
    displayNameBad: '昵称格式错误',
    displayNameTooShort: '昵称不能为空',
    displayNameTooLong: '昵称最多 50 字符',
    displayNameInvalid: '昵称包含非法字符',
    usernameBad: '用户名格式错误',
    usernameTooShort: '用户名至少 3 个字符',
    usernameTooLong: '用户名最多 50 个字符',
    usernameInvalid: '用户名只能包含字母、数字和连字符，且不能以连字符开头或结尾',
    usernameTaken: '该用户名已被占用',
    unknownError: '未知错误',
  };
  return map[err] ?? err;
}
