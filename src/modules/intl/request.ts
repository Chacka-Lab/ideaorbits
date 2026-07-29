import { query } from '@solidjs/router';

import type { Messages } from '~/modules/intl/core';
import { loadMessages } from '~/modules/intl/load-messages';

import { intlConfig, type Locale, type Timezone } from './config';

type Result = { locale: Locale; timezone: Timezone; messages: Messages };

export const getRequestIntl = query(async (): Promise<Result> => {
  // TODO: Get locale from db
  return {
    locale: intlConfig.defaultLocale,
    timezone: intlConfig.defaultTimezone,
    messages: await loadMessages(intlConfig.defaultLocale),
  };
}, 'getRequestIntl');
