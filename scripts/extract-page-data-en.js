#!/usr/bin/env node
/**
 * Extract PAGE_DATA.en from index.html — the RU and ES sections are
 * mojibake and break JSON.parse, but EN is valid; walk braces carefully
 * to isolate just the EN object.
 * One-shot recovery utility — used once to rebuild broken inline script.
 */
const fs = require('fs');
const path = require('path');

const idxPath = path.resolve(__dirname, '..', 'index.html');
const src = fs.readFileSync(idxPath, 'utf8');

const pdMatch = src.match(/window\.PAGE_DATA\s*=\s*(\{[\s\S]*?\});<\/script>/);
if (!pdMatch) { console.error('NO PAGE_DATA'); process.exit(1); }
const pdRaw = pdMatch[1];

// Find '"en": {' and its matching closing '}'
const enKeyIdx = pdRaw.indexOf('"en":');
if (enKeyIdx < 0) { console.error('NO en key'); process.exit(1); }

// Skip to opening '{'
let i = enKeyIdx + 5;
while (pdRaw[i] !== '{') i++;
const openBrace = i;
let depth = 1;
i++;

// Walk forward, respecting string literals
while (i < pdRaw.length && depth > 0) {
  const c = pdRaw[i];
  if (c === '"') {
    // Scan until unescaped '"'
    i++;
    while (i < pdRaw.length) {
      if (pdRaw[i] === '\\') { i += 2; continue; }
      if (pdRaw[i] === '"') break;
      i++;
    }
    i++;
    continue;
  }
  if (c === '{') depth++;
  else if (c === '}') depth--;
  i++;
}

const enObjText = pdRaw.slice(openBrace, i);
const obj = (new Function('return ' + enObjText))();

const outPath = path.resolve(__dirname, '..', '.tmp', 'page-data-en.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(obj, null, 2));

console.log(`Extracted PAGE_DATA.en: ${Object.keys(obj).length} keys → ${outPath}`);
console.log('First 10 keys:', Object.keys(obj).slice(0, 10).join(', '));
