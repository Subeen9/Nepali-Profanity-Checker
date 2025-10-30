import { containsProfanity, censorProfanity, findProfanities } from '../dist/index.js';

describe('Nepali Profanity Checker - unit tests', () => {
  test('empty input returns false', () => {
    expect(containsProfanity('')).toBe(false);
    expect(containsProfanity(null as unknown as string)).toBe(false);
    expect(containsProfanity(undefined as unknown as string)).toBe(false);
  });

  test('detects romanized variant', () => {
    expect(containsProfanity('you are harami')).toBe(true);
  });

  test('detects Devanagari variant and censors correctly', () => {
    const text = 'तँ हरामी हो';
    expect(containsProfanity(text)).toBe(true);
    expect(censorProfanity(text)).toBe('तँ ***** हो');
  });

  test('censor preserves Unicode codepoint length', () => {
    const word = 'कुकुर';
    const censored = censorProfanity(word);
    // same number of codepoints as original
    expect(censored.length).toBe(Array.from(word).length);
  });

  test('findProfanities returns metadata', () => {
    const res = findProfanities('तँ हरामी हो');
    expect(res.length).toBeGreaterThan(0);
    expect(res.some(r => r.base === 'harami')).toBe(true);
  });

  test('no false positives for clean text', () => {
    expect(containsProfanity('hello world this is clean')).toBe(false);
  });
});
