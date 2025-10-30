import { containsProfanity, findProfanities } from '../dist/index.js';

describe('Edge cases', () => {
  test('punctuation boundary detection', () => {
    expect(containsProfanity('तँ हरामी!')).toBe(true);
    expect(containsProfanity('साला, के गर्‍यो?')).toBe(true);
  });

  test('overlapping / repeated matches', () => {
    const res = findProfanities('हरामी हरामी');
    expect(res.length).toBeGreaterThanOrEqual(2);
  });

  test('fuzzy detection for obfuscated (leet) romanized token', () => {
    // Enable fuzzy matching (small maxDistance)
    expect(containsProfanity('you are h4rami', { fuzzy: true, maxDistance: 1 })).toBe(true);
  });

  test('large clean text performance sanity', () => {
    const long = 'a'.repeat(20000) + ' ' + 'hello world ' + 'b'.repeat(20000);
    expect(containsProfanity(long)).toBe(false);
  });

  test('fuzzy censoring masks obfuscated tokens when enabled', () => {
    const text = 'you are h4rami today';
    const censored = require('../dist/index.js').censorProfanity(text, '*', { fuzzy: true, maxDistance: 1, fuzzyCensor: true });
    // 'h4rami' should be masked to same length
    expect(censored.includes('******')).toBe(true);
  });
});
