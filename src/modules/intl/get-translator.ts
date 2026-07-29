import type { Formats } from 'intl-messageformat';

import { createTranslator } from './core';
import { loadMessages } from './load-messages';
import { getRequestIntl } from './request';

export async function getTranslator(
  namespace?: string,
  overrideFormats?: Partial<Formats>,
) {
  const { locale, timezone } = await getRequestIntl();
  const messages = await loadMessages(locale);
  const formats = {
    date: { custom: { timeZone: timezone } },
    time: { custom: { timeZone: timezone } },
    ...overrideFormats,
  };
  return createTranslator(locale, messages, namespace, formats);
}
