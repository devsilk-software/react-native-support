import { generateId } from '../ids';
import { tryRequire } from '../tryRequire';

describe('generateId', () => {
  it('prefixes and is unique across a burst', () => {
    const ids = new Set(Array.from({ length: 5000 }, () => generateId('idem_')));
    expect(ids.size).toBe(5000);
    for (const id of ids) expect(id.startsWith('idem_')).toBe(true);
  });
});

describe('tryRequire', () => {
  it('returns the module when the loader succeeds', () => {
    expect(tryRequire(() => ({ ok: true }))).toEqual({ ok: true });
  });

  it('returns null when the loader throws (module absent)', () => {
    expect(
      tryRequire(() => {
        throw new Error('Cannot find module');
      }),
    ).toBeNull();
  });
});
