/* Detect HTML pages that are meta-refresh redirect stubs. */
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

const stubs = [];
for (const f of walk(ROOT)) {
  const c = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f).replace(/\\/g, '/');
  // Small file + meta refresh OR body contains "Redirecting"
  const hasMetaRefresh = /<meta[^>]+http-equiv=["']refresh["']/i.test(c);
  const hasRedirectingBody = /Redirecting\s+to/i.test(c);
  const sizeKB = c.length / 1024;
  if (hasMetaRefresh || (hasRedirectingBody && sizeKB < 20)) {
    const tgt = (c.match(/<a\s+href="([^"]+)">[^<]*<\/a>/i) || [])[1] || '?';
    stubs.push({ rel, sizeKB: sizeKB.toFixed(1), tgt });
  }
}

console.log('Redirect stubs detected (' + stubs.length + '):');
stubs.forEach(s => console.log('  ' + s.rel.padEnd(40) + ' → ' + s.tgt + '   (' + s.sizeKB + ' KB)'));
