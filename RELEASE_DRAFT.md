# Release draft — nepali-profanity-checker v1.0.1

Release date: 10/29/2025

## Summary
- Add Unicode normalization and diacritic removal for robust matching.
- Add optional fuzzy matching (Levenshtein) to detect obfuscated/typo variants.
- Implement fuzzy censoring option to mask approximate matches.
- Improve tokenization to better detect leet-style obfuscation (letters + digits).
- Add unit and edge tests covering fuzziness, punctuation boundaries, overlapping matches, and performance sanity.
- Prepare package metadata and packaging (`dist/`, types, README updates).

## Notes
- Fuzzy matching is optional and can be enabled with opts.fuzzy in `containsProfanity` and `findProfanities`.
- Fuzzy censoring must be explicitly enabled with `censorProfanity(text, maskChar, { fuzzy: true, fuzzyCensor: true })` to avoid accidental replacements.

## Next steps before publishing
- Confirm package name and repository settings.
- Choose a release date and create GitHub Release using these notes.
- Optionally increment version to 1.1.0 if you plan more breaking changes.
