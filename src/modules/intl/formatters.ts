import { LRUCache } from 'lru-cache';

// sorts object keys so {a,b} and {b,a} produce the same cache key
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${JSON.stringify(key)}:${stableStringify(val)}`);

  return `{${entries.join(',')}}`;
}

function makeCacheKey(args: readonly unknown[]): string {
  return stableStringify(args);
}

const dateTimeCache = new LRUCache<string, Intl.DateTimeFormat>({ max: 500 });
const numberCache = new LRUCache<string, Intl.NumberFormat>({ max: 500 });
const pluralRulesCache = new LRUCache<string, Intl.PluralRules>({ max: 100 });
const relativeTimeCache = new LRUCache<string, Intl.RelativeTimeFormat>({ max: 200 });
const listCache = new LRUCache<string, Intl.ListFormat>({ max: 100 });
const displayNamesCache = new LRUCache<string, Intl.DisplayNames>({ max: 100 });

function getDateTimeFormat(
  ...args: ConstructorParameters<typeof Intl.DateTimeFormat>
): Intl.DateTimeFormat {
  const key = makeCacheKey(args);
  const cached = dateTimeCache.get(key);
  if (cached) return cached;

  const value = new Intl.DateTimeFormat(...args);
  dateTimeCache.set(key, value);
  return value;
}

function getNumberFormat(
  ...args: ConstructorParameters<typeof Intl.NumberFormat>
): Intl.NumberFormat {
  const key = makeCacheKey(args);
  const cached = numberCache.get(key);
  if (cached) return cached;

  const value = new Intl.NumberFormat(...args);
  numberCache.set(key, value);
  return value;
}

function getPluralRules(
  ...args: ConstructorParameters<typeof Intl.PluralRules>
): Intl.PluralRules {
  const key = makeCacheKey(args);
  const cached = pluralRulesCache.get(key);
  if (cached) return cached;

  const value = new Intl.PluralRules(...args);
  pluralRulesCache.set(key, value);
  return value;
}

function getRelativeTimeFormat(
  ...args: ConstructorParameters<typeof Intl.RelativeTimeFormat>
): Intl.RelativeTimeFormat {
  const key = makeCacheKey(args);
  const cached = relativeTimeCache.get(key);
  if (cached) return cached;

  const value = new Intl.RelativeTimeFormat(...args);
  relativeTimeCache.set(key, value);
  return value;
}

function getListFormat(
  ...args: ConstructorParameters<typeof Intl.ListFormat>
): Intl.ListFormat {
  const key = makeCacheKey(args);
  const cached = listCache.get(key);
  if (cached) return cached;

  const value = new Intl.ListFormat(...args);
  listCache.set(key, value);
  return value;
}

function getDisplayNames(
  ...args: ConstructorParameters<typeof Intl.DisplayNames>
): Intl.DisplayNames {
  const key = makeCacheKey(args);
  const cached = displayNamesCache.get(key);
  if (cached) return cached;

  const value = new Intl.DisplayNames(...args);
  displayNamesCache.set(key, value);
  return value;
}

const formatters = {
  getDateTimeFormat,
  getNumberFormat,
  getPluralRules,
  getRelativeTimeFormat,
  getListFormat,
  getDisplayNames,
};

export default formatters;
