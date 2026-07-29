export type SearchParams = Record<string, string>;

/**
 * Append the search params to the URL.
 * If the specified key already exists, it will be overwritten.
 *
 * @param url Valid URL (URL validity is no longer verified within the function).
 * @param params The key-value pairs of the search params.
 * @return A URL object.
 */
export function buildUrl(url: URL | string, params?: SearchParams): URL {
  if (typeof url === 'string') url = new URL(url);
  if (!params) return url;
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url;
}
