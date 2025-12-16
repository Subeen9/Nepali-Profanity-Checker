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
If you would like to add some profane words, please make sure it is unique than the Current List down below
to avoid duplication.

## Current Profane Words List
```bash
[
  'harami',        'murkha',     'badmas',       'saley',
  'sali',          'kukur',      'randi',        'rande',
  'bhate',         'bhalu',      'machikni',     'chhakka',
  'lado',          'lauro',      'muji',         'puti',
  'chhuchi',       'chhura',     'turi',         'geda',
  'gu',            'gukhane',    'pakhe',        'boka',
  'bokni',         'jantha',     'condo',        'chaak',
  'chaak ko pwal', 'bhosdika',   'madarchod',    'bhenchod',
  'lund',          'lodo',       'chod',         'chodna',
  'rakhnu',        'pesa',       'gand',         'gandako',
  'gandu',         'pesa garne', 'sungur',       'budi',
  'budo',          'chikney',    'lundra',       'lundri',
  'gadha',         'kutta',      'kichkich',     'thukk',
  'nalayak',       'beijjat',    'ghrina',       'ninda',
  'kachara',       'nikamma',    'sasto manche', 'gali',
  'fohor',         'ghinlagdo',  'nindaniya',    'gand',
  'gandako',       'gandu',      'chutiya',      'bekar',
  'jhola',         'chor',       'hijada',       'pagal',
  'kutne',         'latti',      'beshya',       'bokshi',
  'chaak',         'Chickne',    'Gula',         'moot',
  'murda',         'bajiya', 'khate', 'torpe',
  'daka',  'paji',
  'dhoti', 'radi',
  'paad',  'mukhulla',
  'gobre', 'bhusya',
  'dhurt', 'bhaisi, 'kamina', 'kutti', 'haramzada'
]

```

## License

MIT License

Copyright (c) 2025 Subin Bista

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

