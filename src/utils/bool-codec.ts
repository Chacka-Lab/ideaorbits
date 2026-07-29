export function encodeBool(b: boolean): string {
  return b ? '1' : '0';
}

export function decodeBool(v: string | null): boolean {
  return v === '1';
}

export function safeDecodeBool(v: string | null): boolean | null {
  if (v === null) return null;

  if (v === '0') {
    return false;
  } else if (v === '1') {
    return true;
  } else {
    return null;
  }
}
