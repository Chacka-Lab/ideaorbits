export function isPast(date: Date, now?: Date): boolean {
  if (now === undefined) {
    now = new Date();
  }
  return date.getTime() <= now.getTime();
}
