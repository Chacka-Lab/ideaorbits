export default function firstOf<T extends string, U>(
  arr: readonly string[] | undefined,
  known: readonly T[],
  unknown: U,
): T | U | undefined {
  if (!arr?.length) return undefined;
  const found = arr.find((e): e is T => (known as readonly string[]).includes(e));
  return found !== undefined ? found : unknown;
}
