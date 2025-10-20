const assert = require("assert");
const { containsProfanity, censorProfanity } = require("../src/index.js");

// ---- Tests ----

// Detects profanity
assert.strictEqual(containsProfanity("तँ हरामी हो"), true, "Profanity should be detected");

// Censors profanity
assert.strictEqual(
  censorProfanity("तँ हरामी हो"),
  "तँ ***** हो",
  "Profanity should be censored"
);

console.log("✅ All CommonJS tests passed successfully!");
