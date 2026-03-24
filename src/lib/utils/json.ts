export function toJsonSafe(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
  );
}