"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsProfanity = containsProfanity;
exports.findProfanities = findProfanities;
exports.censorProfanity = censorProfanity;
const badword_json_1 = __importDefault(require("./data/badword.json"));
function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}
function codePointLength(s) {
    // Count Unicode code points (so multi-byte glyphs are handled)
    return Array.from(s).length;
}
function normalizeText(s) {
    if (!s)
        return "";
    // Unicode normalize to NFKC, lowercase, and remove diacritic marks
    // 
    // We remove combining marks using the Unicode property \p{M}.
    try {
        const n = s.normalize('NFKC').toLowerCase();
        // remove diacritics / marks
        return n.replace(/\p{M}/gu, '').trim();
    }
    catch (e) {
        // Fallback if normalize throws for any reason
        return s.toLowerCase();
    }
}
// Simple Levenshtein distance implementation (iterative, memory-optimized)
function levenshtein(a, b) {
    if (a === b)
        return 0;
    const aLen = Array.from(a).length;
    const bLen = Array.from(b).length;
    if (aLen === 0)
        return bLen;
    if (bLen === 0)
        return aLen;
    // Convert to arrays of codepoints to handle Unicode properly
    const aArr = Array.from(a);
    const bArr = Array.from(b);
    let prev = new Array(bLen + 1);
    let cur = new Array(bLen + 1);
    for (let j = 0; j <= bLen; j++)
        prev[j] = j;
    for (let i = 1; i <= aLen; i++) {
        cur[0] = i;
        for (let j = 1; j <= bLen; j++) {
            const cost = aArr[i - 1] === bArr[j - 1] ? 0 : 1;
            cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        }
        const tmp = prev;
        prev = cur;
        cur = tmp;
    }
    return prev[bLen];
}
// Flatten the badword data into searchable variants
const flattened = (() => {
    const entries = [];
    for (const item of badword_json_1.default) {
        if (typeof item === "string") {
            entries.push({ text: item, raw: item });
            continue;
        }
        const add = (v) => {
            if (typeof v !== "string")
                return;
            const t = v.trim();
            if (!t)
                return;
            entries.push({ text: t, base: item.base || item.value, category: item.category || [], raw: item });
        };
        if (item.base)
            add(item.base);
        if (item.value)
            add(item.value);
        if (item.romanized)
            add(item.romanized);
        if (Array.isArray(item.variants)) {
            for (const v of item.variants)
                add(v);
        }
        if (Array.isArray(item.nepali)) {
            for (const v of item.nepali)
                add(v);
        }
        // Some entries use other keys like 'nepali' being a string
        if (typeof item.nepali === "string")
            add(item.nepali);
    }
    // Deduplicate by normalized text (keep first occurrence metadata)
    const seen = new Map();
    for (const e of entries) {
        const key = e.text.toLowerCase();
        if (!seen.has(key))
            seen.set(key, e);
    }
    return Array.from(seen.values()).map(e => {
        const escaped = escapeRegExp(e.text);
        // For detection we use case-insensitive and unicode-safe regex.
        // For testing presence we don't need global flag; for replacement we will use global.
        const testRegex = new RegExp(escaped, "iu");
        const replaceRegex = new RegExp(escaped, "igu");
        const normalized = normalizeText(e.text);
        const normalizedEscaped = escapeRegExp(normalized);
        const normalizedTestRegex = new RegExp(normalizedEscaped, "iu");
        return {
            text: e.text,
            base: e.base,
            category: e.category || [],
            raw: e.raw,
            testRegex,
            replaceRegex,
            normalized,
            normalizedTestRegex,
        };
    });
})();
const DEFAULT_OPTS = { fuzzy: false, maxDistance: 1, maxRatio: 0.25 };
function containsProfanity(input, opts) {
    const options = { ...DEFAULT_OPTS, ...(opts || {}) };
    const text = String(input || "");
    if (!text)
        return false;
    const normalizedText = normalizeText(text);
    for (const entry of flattened) {
        try {
            if (entry.testRegex.test(text))
                return true;
            // also check normalized form as substring
            if (entry.normalized && normalizedText.includes(entry.normalized))
                return true;
        }
        finally {
            entry.testRegex.lastIndex = 0;
        }
    }
    if (options.fuzzy) {
        // Tokenize original text with indices so fuzzy matches can be mapped back to the original string
        const tokenRegex = /\p{L}[\p{L}\p{N}]*/gu;
        let m;
        while ((m = tokenRegex.exec(text)) !== null) {
            const rawTok = m[0];
            const tok = normalizeText(rawTok);
            for (const entry of flattened) {
                const target = entry.normalized || normalizeText(entry.text || '');
                const len = Array.from(target).length;
                if (Math.abs(len - Array.from(tok).length) > Math.max(2, Math.floor(len * options.maxRatio)))
                    continue;
                const dist = levenshtein(tok, target);
                if (dist <= options.maxDistance || dist / Math.max(1, len) <= options.maxRatio)
                    return true;
            }
        }
    }
    return false;
}
function findProfanities(input, opts) {
    const options = { ...DEFAULT_OPTS, ...(opts || {}) };
    const text = String(input || "");
    const results = [];
    if (!text)
        return results;
    const normalizedText = normalizeText(text);
    for (const entry of flattened) {
        const rx = entry.replaceRegex;
        let m;
        // reset lastIndex
        rx.lastIndex = 0;
        while ((m = rx.exec(text)) !== null) {
            results.push({ match: m[0], base: entry.base, category: entry.category, index: m.index, fuzzy: false });
            // avoid infinite loops for zero-length matches
            if (m.index === rx.lastIndex)
                rx.lastIndex++;
        }
        // check normalized substring matches (exact on normalized form)
        if (entry.normalized && normalizedText.includes(entry.normalized)) {
            // try to find the index of the normalized substring within the original text
            const rawIndex = text.toLowerCase().indexOf(entry.text.toLowerCase());
            results.push({ match: entry.text, base: entry.base, category: entry.category, index: rawIndex >= 0 ? rawIndex : -1, fuzzy: false });
        }
    }
    if (options.fuzzy) {
        // Tokenize original text and find approximate matches; record original index for fuzzy matches
        const tokenRegex = /\p{L}[\p{L}\p{N}]*/gu;
        let m;
        const seen = new Set();
        while ((m = tokenRegex.exec(text)) !== null) {
            const rawTok = m[0];
            const tok = normalizeText(rawTok);
            for (const entry of flattened) {
                const target = entry.normalized || normalizeText(entry.text || '');
                const len = Array.from(target).length;
                if (Math.abs(len - Array.from(tok).length) > Math.max(2, Math.floor(len * options.maxRatio)))
                    continue;
                const dist = levenshtein(tok, target);
                if (dist <= options.maxDistance || dist / Math.max(1, len) <= options.maxRatio) {
                    const key = `${m.index}:${entry.base}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        results.push({ match: rawTok, base: entry.base, category: entry.category, index: m.index, fuzzy: true });
                    }
                }
            }
        }
    }
    // sort by index (fuzzy matches with -1 come last)
    results.sort((a, b) => (a.index === b.index) ? 0 : (a.index === -1 ? 1 : (b.index === -1 ? -1 : a.index - b.index)));
    return results;
}
function censorProfanity(input, maskChar = "*", opts) {
    let text = String(input || "");
    if (!text)
        return text;
    // First perform exact replacements (safe)
    for (const entry of flattened) {
        const rx = entry.replaceRegex;
        text = text.replace(rx, (match) => {
            return maskChar.repeat(codePointLength(match));
        });
    }
    // Optionally perform fuzzy censoring: find fuzzy matches with indices and mask those spans
    const options = { ...DEFAULT_OPTS, ...(opts || {}) };
    if (options.fuzzy && options.fuzzyCensor) {
        // Ensure fuzzy mode is enabled for findProfanities
        const matches = findProfanities(text, options).filter(m => m.fuzzy && m.index >= 0);
        if (matches.length > 0) {
            // Build replacement spans [start, end, mask]
            const spans = [];
            for (const m of matches) {
                const start = m.index;
                const matchStr = String(m.match || '');
                const end = start + matchStr.length; // code unit length for slicing
                const mask = maskChar.repeat(codePointLength(matchStr));
                spans.push({ start, end, mask });
            }
            // Sort spans by start descending and apply, skipping overlaps
            spans.sort((a, b) => b.start - a.start);
            let maskedText = text;
            const appliedRanges = [];
            for (const s of spans) {
                // skip if overlaps any applied range
                if (appliedRanges.some(r => !(s.end <= r.start || s.start >= r.end)))
                    continue;
                // apply replacement using slicing
                maskedText = maskedText.slice(0, s.start) + s.mask + maskedText.slice(s.end);
                appliedRanges.push({ start: s.start, end: s.start + s.mask.length });
            }
            text = maskedText;
        }
    }
    return text;
}
exports.default = {
    containsProfanity,
    findProfanities,
    censorProfanity,
};
//# sourceMappingURL=index.js.map