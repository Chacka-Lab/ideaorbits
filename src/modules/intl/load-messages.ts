import { type Locale, localeMessages } from './config';
import type { Messages } from './core';

export async function loadMessages(locale: Locale): Promise<Messages> {
  const messages = localeMessages[locale];

  const entries = await Promise.all(
    Object.entries(messages).map(async ([key, loader]) => {
      const mod = await loader();
      return [key, mod.default];
    }),
  );

  return Object.fromEntries(entries) as {
    [K in keyof typeof messages]: Awaited<ReturnType<(typeof messages)[K]>>['default'];
  };
}
