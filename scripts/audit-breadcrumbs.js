/* P02 Step 2.6 — Audit BreadcrumbList JSON-LD coverage.
 * Run: node scripts/audit-breadcrumbs.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'docs', 'scripts']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
    } else if (ent.name.endsWith('.html')) out.push(path.join(dir, ent.name));
  }
  return out;
}

const have = [], missing = [];
for (const f of walk(ROOT)) {
  const c = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  if (c.includes('BreadcrumbList')) have.push(rel);
  else missing.push(rel);
}
console.log('== Pages WITHOUT BreadcrumbList (' + missing.length + ') ==');
missing.forEach(p => console.log('  ' + p));
console.log('== Pages WITH BreadcrumbList (' + have.length + ') ==');
have.forEach(p => console.log('  ' + p));
