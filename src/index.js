"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.containsProfanity = containsProfanity;
exports.censorProfanity = censorProfanity;
const badword_json_1 = __importDefault(require("./data/badword.json"));
function containsProfanity(text) {
    return badword_json_1.default.some(word => text.includes(word));
}
function censorProfanity(text, maskChar = "*") {
    let censored = text;
    for (const word of badword_json_1.default) {
        const regex = new RegExp(word, "gi");
        censored = censored.replace(regex, maskChar.repeat(word.length));
    }
    return censored;
}
//# sourceMappingURL=index.js.map