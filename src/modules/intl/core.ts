import { type Formats, IntlMessageFormat } from 'intl-messageformat';
import { LRUCache } from 'lru-cache';
import type { JSX } from 'solid-js';

import logger from '~/lib/logger';

import { mergeFormats } from './formats';
import formatters, { stableStringify } from './formatters';

export type Messages = { readonly [key: string]: string | Messages };

type BasicType = string | number | boolean | Date | null;
type TextValues = Record<string, BasicType>;
type RichValues = Record<string, BasicType | JSX.Element>;

interface TranslatorFn {
  text: (key: string, values?: TextValues) => string;
  rich: (key: string, values?: RichValues) => JSX.Element;
}

// Cache: Change as needed
const messageFormatterCache = new LRUCache<string, IntlMessageFormat>({
  max: 500,
});

// ========== Tools ==========

function getPath(messages: Messages, key: string): string | Messages | undefined {
  let current: string | Messages | undefined = messages;
  for (const part of key.split('.')) {
    if (typeof current !== 'object' || current === null) {
      return undefined;
    }

    current = current[part];
    if (current === undefined) {
      return undefined;
    }
  }

  return current;
}

function getMessage(messages: Messages, key: string): string | undefined {
  const message = getPath(messages, key);
  return typeof message === 'string' ? message : undefined;
}

function getFormatter(
  message: string,
  locale: string,
  override?: Partial<Formats>,
): IntlMessageFormat {
  const cacheKey = stableStringify([message, locale, override]);
  const cached = messageFormatterCache.get(cacheKey);
  if (cached) return cached;

  const formatter = new IntlMessageFormat(message, locale, mergeFormats(override), {
    formatters,
  });
  messageFormatterCache.set(cacheKey, formatter);
  return formatter;
}

// ========== Formatter ==========

function formatText(
  locale: string,
  message: string,
  override?: Partial<Formats>,
  values?: TextValues,
): string {
  // skip parsing if no values and no ICU escape sequences (e.g., '{' or '}')
  if (!values && !/'[{}]/.test(message)) return message;

  const formatted = getFormatter(message, locale, override).format<string>(values);
  if (typeof formatted === 'string') return formatted;
  throw new Error('Unknown format');
}

function formatRich(
  locale: string,
  message: string,
  override?: Partial<Formats>,
  values?: RichValues,
): JSX.Element {
  return getFormatter(message, locale, override).format<JSX.Element>(values);
}

// ========== Creator ==========

export function createTranslator(
  locale: string,
  messages?: Messages,
  namespace?: string,
  overrideFormats?: Partial<Formats>,
): Readonly<TranslatorFn> {
  const scopedMessages = (() => {
    if (!messages) return undefined;
    if (!namespace) return messages;
    const scoped = getPath(messages, namespace);
    return scoped && typeof scoped === 'object' ? scoped : undefined;
  })();

  return {
    // fallback to key on missing message or format message to avoid blank UI
    text: (key, values) => {
      try {
        if (scopedMessages === undefined) return key;
        const message = getMessage(scopedMessages, key);
        if (message === undefined) return key;
        return formatText(locale, message, overrideFormats, values);
      } catch (e) {
        logger.debug('format text message:', e);
        return key;
      }
    },
    rich: (key, values) => {
      try {
        if (scopedMessages === undefined) return key;
        const message = getMessage(scopedMessages, key);
        if (message === undefined) return key;
        return formatRich(locale, message, overrideFormats, values);
      } catch (e) {
        logger.debug('format rich message:', e);
        return key;
      }
    },
  };
}
