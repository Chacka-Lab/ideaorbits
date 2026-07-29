import type { Formats } from 'intl-messageformat';

import TIMEZONES from './timezones';

function defineConfig<
  const L extends readonly string[],
  const T extends readonly Timezone[],
>(config: { locales: L; defaultLocale: L[number]; defaultTimezone: T[number] }) {
  return config;
}

// timezone
export type Timezone = (typeof TIMEZONES)[number];
export function hasTimezone(tz: string): tz is Timezone {
  return (TIMEZONES as readonly string[]).includes(tz);
}

// locale
export type Locale = (typeof intlConfig.locales)[number];
export function hasLocale(lc: string): lc is Locale {
  return (intlConfig.locales as readonly string[]).includes(lc);
}

export function normalizeLocale(lc: unknown): Locale {
  if (typeof lc !== 'string' || !hasLocale(lc)) return intlConfig.defaultLocale;
  return lc;
}

// config
export const intlConfig = defineConfig({
  locales: ['en', 'zh-Hans'],
  defaultLocale: 'en',
  defaultTimezone: 'UTC',
});

// messages
export const localeMessages = {
  en: {
    common: () => import('./messages/en/common.json'),
  },
  'zh-Hans': {
    common: () => import('./messages/zh-Hans/common.json'),
  },
} as const;

// formats
export const globalFormats: Readonly<Formats> = {
  number: {},
  date: {},
  time: {},
};
