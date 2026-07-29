import { createMemo } from 'solid-js';

import { useIntl } from './context';
import { createTranslator } from './core';

export function useTranslator({ namespace }: { namespace?: string }) {
  const intl = useIntl();
  // recomputes whenever locale or messages change
  const translator = createMemo(() =>
    createTranslator(intl.locale, intl.messages, namespace),
  );
  // stable object — callers use t.text() / t.rich() without calling t()
  return {
    text: (...args: Parameters<ReturnType<typeof createTranslator>['text']>) =>
      translator().text(...args),
    rich: (...args: Parameters<ReturnType<typeof createTranslator>['rich']>) =>
      translator().rich(...args),
  } as ReturnType<typeof createTranslator>;
}
