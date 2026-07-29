const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function encodeB32(data: Buffer): string {
  let bits = 0,
    value = 0,
    output = '';
  for (const byte of data) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += B32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += B32[(value << (5 - bits)) & 31];
  return output;
}

export function decodeB32(str: string): Buffer {
  let bits = 0,
    value = 0;
  const bytes: number[] = [];
  for (const char of str.toUpperCase()) {
    const idx = B32.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}
