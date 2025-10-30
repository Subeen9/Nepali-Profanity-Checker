#!/usr/bin/env node
const readline = require('readline');
const { containsProfanity, findProfanities, censorProfanity } = require('../dist/index.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

console.log('Nepali Profanity Checker — interactive console');
console.log("Type a sentence and press Enter. Submit an empty line to exit.");
rl.setPrompt('> ');
rl.prompt();

rl.on('line', (line) => {
  const text = String(line || '');
  if (!text.trim()) {
    rl.close();
    return;
  }

  try {
    console.log('containsProfanity:', containsProfanity(text));
    const found = findProfanities(text);
    if (found.length) {
      console.log('findProfanities:');
      for (const f of found) {
        console.log('  -', `match="${f.match}", base=${f.base || 'N/A'}, category=${JSON.stringify(f.category || [])}, index=${f.index}`);
      }
    } else {
      console.log('findProfanities: []');
    }
    console.log('censorProfanity:', censorProfanity(text));
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('\nGoodbye.');
  process.exit(0);
});
