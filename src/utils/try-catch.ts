export function tryCatch<T extends () => unknown>(
  fn: T,
):
  | {
      ok: true;
      re: ReturnType<T>;
      err: undefined;
    }
  | {
      ok: false;
      re: undefined;
      err: unknown;
    } {
  try {
    return {
      ok: true,
      re: fn() as ReturnType<T>,
      err: undefined,
    };
  } catch (e) {
    return {
      ok: false,
      re: undefined,
      err: e,
    };
  }
}

export async function tryCatchAsync<T extends () => Promise<unknown>>(
  fn: T,
): Promise<
  | {
      ok: true;
      re: Awaited<ReturnType<T>>;
      err: undefined;
    }
  | {
      ok: false;
      re: undefined;
      err: unknown;
    }
> {
  try {
    return {
      ok: true,
      re: (await fn()) as Awaited<ReturnType<T>>,
      err: undefined,
    };
  } catch (e) {
    return {
      ok: false,
      re: undefined,
      err: e,
    };
  }
}
