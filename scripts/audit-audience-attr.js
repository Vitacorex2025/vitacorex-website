/* P02 Step 2.4 — Audit body[data-audience] classification across the site.
 * Run: node scripts/audit-audience-attr.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'docs', 'scripts']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) { if (SKIP_DIRS.has(ent.name)) continue; walk(path.join(dir, ent.name), out); }
    else if (ent.name.endsWith('.html')) out.push(path.join(dir, ent.name));
  }
  return out;
}

const byAud = { b2b: [], b2c: [], shared: [], none: [] };
for (const f of walk(ROOT)) {
  const c = fs.readFileSync(f, 'utf8');
  const m = c.match(/<body[^>]*data-audience="([^"]+)"/);
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (m) byAud[m[1]].push(rel); else byAud.none.push(rel);
}

function print(title, arr) {
  console.log(title + ' (' + arr.length + '):');
  arr.forEach(p => console.log('  ' + p));
}
print('b2b   ', byAud.b2b);
print('b2c   ', byAud.b2c);
print('shared', byAud.shared);
print('NONE  ', byAud.none);
console.log('Total tagged:', byAud.b2b.length + byAud.b2c.length + byAud.shared.length);
