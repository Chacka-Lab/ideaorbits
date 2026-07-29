import type { Formats } from 'intl-messageformat';

import { globalFormats } from './config';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// no circular reference guard — safe as long as Formats values stay plain objects
function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result: Record<string, unknown> = { ...base };

  for (const key of Object.keys(override)) {
    const overrideValue = override[key];
    const baseValue = result[key];

    if (overrideValue === undefined) continue;

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue);
    } else {
      result[key] = overrideValue;
    }
  }

  return result as T;
}

export function mergeFormats(override?: Partial<Formats>): Partial<Formats> {
  const merged: Partial<Formats> = {};

  if (globalFormats.number || override?.number) {
    merged.number = deepMerge(globalFormats.number, override?.number ?? {});
  }

  if (globalFormats.date || override?.date) {
    merged.date = deepMerge(globalFormats.date, override?.date ?? {});
  }

  if (globalFormats.time || override?.time) {
    merged.time = deepMerge(globalFormats.time, override?.time ?? {});
  }

  return merged;
}
