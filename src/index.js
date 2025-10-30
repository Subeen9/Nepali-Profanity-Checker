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
        return {
            text: e.text,
            base: e.base,
            category: e.category || [],
            raw: e.raw,
            testRegex,
            replaceRegex,
        };
    });
})();
function containsProfanity(input) {
    const text = String(input || "");
    if (!text)
        return false;
    for (const entry of flattened) {
        // reset lastIndex just in case (not needed for testRegex, but safe)
        try {
            if (entry.testRegex.test(text))
                return true;
        }
        finally {
            entry.testRegex.lastIndex = 0;
        }
    }
    return false;
}
function findProfanities(input) {
    const text = String(input || "");
    const results = [];
    if (!text)
        return results;
    for (const entry of flattened) {
        const rx = entry.replaceRegex;
        let m;
        // reset lastIndex
        rx.lastIndex = 0;
        while ((m = rx.exec(text)) !== null) {
            results.push({ match: m[0], base: entry.base, category: entry.category, index: m.index });
            // avoid infinite loops for zero-length matches
            if (m.index === rx.lastIndex)
                rx.lastIndex++;
        }
    }
    // sort by index ascending
    results.sort((a, b) => a.index - b.index);
    return results;
}
function censorProfanity(input, maskChar = "*") {
    let text = String(input || "");
    if (!text)
        return text;
    // For each entry, replace all occurrences with mask of same codepoint length
    for (const entry of flattened) {
        const rx = entry.replaceRegex;
        text = text.replace(rx, (match) => {
            return maskChar.repeat(codePointLength(match));
        });
    }
    return text;
}
exports.default = {
    containsProfanity,
    findProfanities,
    censorProfanity,
};
