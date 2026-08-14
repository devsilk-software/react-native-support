/**
 * Id generation without a uuid dependency or a crypto polyfill.
 *
 * Used for install ids and Idempotency-Key values (plan §6). These need
 * uniqueness, not unguessability — the server treats them as opaque strings
 * scoped to an already-authenticated key, so Math.random entropy plus a
 * timestamp is sufficient and works on every RN runtime including Expo Go.
 */
export function generateId(prefix = ''): string {
  const time = Date.now().toString(36);
  const rand = () => Math.random().toString(36).slice(2, 10);
  return `${prefix}${time}-${rand()}${rand()}`;
}
