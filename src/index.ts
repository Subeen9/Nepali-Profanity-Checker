import badwords from "./data/badword.json";

export function containsProfanity(text: string): boolean {
  return badwords.some(word => text.includes(word));
}

export function censorProfanity(text: string, maskChar = "*"): string {
  let censored = text;
  for (const word of badwords) {
    const regex = new RegExp(word, "gi");
    censored = censored.replace(regex, maskChar.repeat(word.length));
  }
  return censored;
}
