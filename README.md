# Nepali Profanity Checker

Lightweight Nepali profanity detection and censoring library (Devanagari + romanized variants).

## Quick start

Build the library and run tests:

```powershell
npm ci
npm run build
npm test
```

Run interactive console to try phrases manually:

```powershell
npm run console
```

## API

Import the library and use the helpers:

```js
const { containsProfanity, findProfanities, censorProfanity } = require('./dist/index.js');

console.log(containsProfanity('तँ हरामी हो')); // true
console.log(findProfanities('तँ हरामी हो')); // details about matches
console.log(censorProfanity('तँ हरामी हो')); // 'तँ ***** हो'

// Fuzzy (approximate) matching example
console.log(containsProfanity('you are h4rami', { fuzzy: true }));
```

## Features

- Loads a curated JSON wordlist (`src/data/badword.json`) with variants and categories.
- Unicode normalization (NFKC) and diacritic removal for robust matching.
- Optional fuzzy matching (Levenshtein) to catch obfuscated/typo variants.
- Simple censoring that preserves Unicode codepoint lengths.

## Publishing

Before publishing run:

```powershell
npm run build
npm pack  # creates a tarball to inspect what will be published
# then when ready:
npm publish
```

## Contributing

Add/modify words in `src/data/badword.json`. Add unit tests under `test/` and submit a PR.

## License

MIT

