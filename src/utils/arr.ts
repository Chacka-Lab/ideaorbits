export function includes<T extends U, U>(arr: ReadonlyArray<T>, value: U): value is T {
  return (arr as ReadonlyArray<U>).includes(value);
}
