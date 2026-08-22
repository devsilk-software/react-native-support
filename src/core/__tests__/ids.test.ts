import { generateId } from '../ids';

describe('generateId', () => {
  it('prefixes and is unique across a burst', () => {
    const ids = new Set(Array.from({ length: 5000 }, () => generateId('idem_')));
    expect(ids.size).toBe(5000);
    for (const id of ids) expect(id.startsWith('idem_')).toBe(true);
  });
});

