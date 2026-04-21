#!/usr/bin/env node
/**
 * bump-cachebusters.js — Bump (or add) ?v= query strings on the assets that
 * changed in this batch, across every .html file in the repo.
 *
 * Files bumped:
 *   vcx-a11y-fixes.css         v=2 -> v=3
 *   vcx-redesign.css           v=11 -> v=12
 *   vcx-premium-2.css          v=19 -> v=20
 *   vcx-footer.css             v=5 -> v=6
 *   vcx-sample.css             v=3 -> v=4
 *   vcx-back-link.js           v=11 -> v=12
 *   vcx-app-premium.css        (no query) -> ?v=2
 *   vcx-lookup-premium.css     (no query) -> ?v=2
 *   vitacorex-public.css       (no query) -> ?v=2
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// (fileName, nextVersion) — regex-replace any existing ?v=N with ?v=nextVersion
// or insert ?v=nextVersion when it's missing.
const targets = [
  { name: 'vcx-a11y-fixes.css', nextVersion: 3 },
  { name: 'vcx-redesign.css', nextVersion: 12 },
  { name: 'vcx-premium-2.css', nextVersion: 20 },
  { name: 'vcx-footer.css', nextVersion: 6 },
  { name: 'vcx-sample.css', nextVersion: 4 },
  { name: 'vcx-back-link.js', nextVersion: 12 },
  { name: 'vcx-app-premium.css', nextVersion: 2 },
  { name: 'vcx-lookup-premium.css', nextVersion: 2 },
  { name: 'vitacorex-public.css', nextVersion: 2 },
];

function walk(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.') continue;
    if (e.name === 'node_modules' || e.name === '.git' || e.name === '.claude-audit') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.isFile() && (p.endsWith('.html'))) out.push(p);
  }
  return out;
}

function escapeForRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function bumpIn(content, fileName, nextVersion) {
  const esc = escapeForRe(fileName);
  let changed = 0;

  // 1. Replace existing ?v=N (any N) with ?v=nextVersion
  const reWithV = new RegExp(`(${esc})\\?v=\\d+`, 'g');
  content = content.replace(reWithV, (_, p1) => {
    changed++;
    return `${p1}?v=${nextVersion}`;
  });

  // 2. Insert ?v=nextVersion where the filename appears WITHOUT a query.
  // Match fileName followed by " or ' (end of URL) with nothing after it (no ?).
  const reNoV = new RegExp(`(${esc})(?=["'])`, 'g');
  content = content.replace(reNoV, (_, p1) => {
    changed++;
    return `${p1}?v=${nextVersion}`;
  });

  return { content, changed };
}

let totalFiles = 0;
let totalReplacements = 0;
const htmlFiles = walk(root, []);
for (const f of htmlFiles) {
  let src;
  try { src = fs.readFileSync(f, 'utf8'); } catch (e) { continue; }
  let anyChange = false;
  let fileReplacements = 0;
  for (const t of targets) {
    const { content, changed } = bumpIn(src, t.name, t.nextVersion);
    if (changed > 0) {
      src = content;
      fileReplacements += changed;
      anyChange = true;
    }
  }
  if (anyChange) {
    fs.writeFileSync(f, src);
    totalFiles++;
    totalReplacements += fileReplacements;
    console.log(`${path.relative(root, f).padEnd(60)}  ${fileReplacements} replacement(s)`);
  }
}
console.log(`\nDone. ${totalFiles} file(s) updated, ${totalReplacements} total replacement(s).`);
