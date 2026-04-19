/* Cache-bump vcx-translations.js?v=FROM → v=TO
 * Run: node scripts/bump-translations-cache.js
 * Edit FROM/TO below per release.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'docs', 'scripts']);
const FROM = 'vcx-translations.js?v=19';
const TO   = 'vcx-translations.js?v=20';

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) { if (SKIP_DIRS.has(ent.name)) continue; walk(path.join(dir, ent.name), out); }
    else if (ent.name.endsWith('.html')) out.push(path.join(dir, ent.name));
  }
  return out;
}

let bumped = 0, skipped = 0;
for (const f of walk(ROOT)) {
  const before = fs.readFileSync(f, 'utf8');
  if (!before.includes(FROM)) { skipped++; continue; }
  const after = before.split(FROM).join(TO);
  fs.writeFileSync(f, after);
  bumped++;
  console.log('  bumped: ' + path.relative(ROOT, f).replace(/\\/g, '/'));
}
console.log('\nBumped: ' + bumped + ' · Skipped: ' + skipped);
