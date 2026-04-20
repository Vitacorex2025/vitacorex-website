#!/usr/bin/env node
/**
 * Strip the broken inline `<script>window.SITE_I18N = ...; window.PAGE_DATA = ...;</script>`
 * from index.html. This is a re-application of commit 965d7582 "Fix P0: remove broken
 * inline SITE_I18N + PAGE_DATA with mojibake" which was silently reverted by commit
 * 9f9c0fa ("1") on 2026-04-04.
 *
 * External translation sources (assets/js/shell-i18n.js + assets/js/vcx-translations.js)
 * are self-sufficient and mojibake-free — the inline blob is redundant as well as broken.
 *
 * Idempotent: safe to re-run. Exits with mojibake-count summary.
 */
const fs = require('fs');
const path = require('path');

const IDX = path.resolve(__dirname, '..', 'index.html');
const before = fs.readFileSync(IDX, 'utf8');

const mojiBefore = (before.match(/Ð/g) || []).length + (before.match(/Ã/g) || []).length;

// Regex matches the entire broken script tag defining SITE_I18N and PAGE_DATA.
// Conservative: require both globals + opening <script> + closing </script>.
const scriptRE = /<script>window\.SITE_I18N\s*=\s*\{[\s\S]*?\};\s*window\.PAGE_DATA\s*=\s*\{[\s\S]*?\};<\/script>/;

if (!scriptRE.test(before)) {
  // Already removed (fix previously applied) or structure changed
  console.log('No broken inline SITE_I18N/PAGE_DATA block found.');
  console.log(`Mojibake chars still present: ${mojiBefore}`);
  process.exit(mojiBefore > 0 ? 2 : 0);
}

const after = before.replace(scriptRE, '');
const mojiAfter = (after.match(/Ð/g) || []).length + (after.match(/Ã/g) || []).length;

const sizeBefore = Buffer.byteLength(before, 'utf8');
const sizeAfter = Buffer.byteLength(after, 'utf8');
const saved = sizeBefore - sizeAfter;

fs.writeFileSync(IDX, after, 'utf8');

console.log('=== Strip broken inline i18n from index.html ===');
console.log(`  Size before: ${sizeBefore} bytes`);
console.log(`  Size after:  ${sizeAfter} bytes`);
console.log(`  Saved:       ${saved} bytes (~${(saved/1024).toFixed(1)} KB)`);
console.log(`  Mojibake before: ${mojiBefore}`);
console.log(`  Mojibake after:  ${mojiAfter}`);
if (mojiAfter > 0) {
  console.error('WARNING: residual mojibake detected — additional sweep needed.');
  process.exit(2);
}
console.log('  OK — inline blob removed; external i18n sources (shell-i18n.js + vcx-translations.js) remain.');
