/**
 * Optional-dependency detection — plan §3.1.
 *
 * Metro resolves imports statically, so callers must pass a closure whose
 * `require` uses a LITERAL specifier:
 *
 *   const kc = tryRequire(() => require('react-native-keyboard-controller'));
 *
 * Never a computed specifier and never dynamic `import()` — both either fail
 * to bundle or throw at runtime. This helper is the only place the pattern
 * lives; every optional integration goes through it.
 */
export function tryRequire<T>(load: () => T): T | null {
  try {
    return load();
  } catch {
    return null;
  }
}
