export type ValueOf<T> = T[keyof T];

export type StringValues<T> = T extends string
  ? T
  : T extends object
    ? { [K in keyof T]: StringValues<T[K]> }[keyof T]
    : never;
