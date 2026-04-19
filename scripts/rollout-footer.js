/* P02 Step 2.3 — Bulk rollout of vcx-footer.css + vcx-footer.js on every
 * page that carries <footer class="footer"> markup.
 *
 * Idempotent: skips a page if the vcx-footer.js?v=1 tag is already present.
 * Injection strategy (same as Step 2.2 for vcx-nav):
 *   1. If the page loads vcx-nav.js, inject right after that <script> tag.
 *   2. Else if the page loads vcx-translations.js, inject after that tag.
 *   3. Else fall back to injecting before </body>.
 *
 * Run: node scripts/rollout-footer.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSS_TAG = '<link rel="stylesheet" href="/assets/css/vcx-footer.css?v=1">';
const JS_TAG  = '<script src="/assets/js/vcx-footer.js?v=1" defer></script>';
const SKIP_DIRS = new Set(['node_modules', '.git', 'docs', 'scripts']);

const REPORT = { total: 0, touched: 0, already: 0, skipped: 0, byStrategy: { afterNav: 0, afterTranslations: 0, beforeBody: 0 } };

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
    } else if (ent.name.endsWith('.html')) {
      out.push(path.join(dir, ent.name));
    }
  }
  return out;
}

function hasFooter(src) {
  return /<footer\s+class="footer(\s|")/.test(src) || src.includes('class="footer"');
}

function injectAfter(src, anchorRe, inject) {
  const m = src.match(anchorRe);
  if (!m) return null;
  const idx = m.index + m[0].length;
  return src.slice(0, idx) + '\n' + inject + src.slice(idx);
}

function injectBeforeBody(src, inject) {
  const i = src.lastIndexOf('</body>');
  if (i === -1) return null;
  return src.slice(0, i) + inject + '\n' + src.slice(i);
}

function process(file) {
  REPORT.total++;
  let src = fs.readFileSync(file, 'utf8');

  if (!hasFooter(src)) { REPORT.skipped++; return; }
  if (src.includes('vcx-footer.js?v=1')) { REPORT.already++; return; }

  const inject = CSS_TAG + '\n' + JS_TAG;
  let out = null;
  let strategy = null;

  // Prefer after vcx-nav.js script (so footer loads right after nav)
  out = injectAfter(src, /<script\s+src="\/assets\/js\/vcx-nav\.js\?v=1"[^>]*><\/script>/, inject);
  if (out) strategy = 'afterNav';

  if (!out) {
    out = injectAfter(src, /<script\s+src="[^"]*vcx-translations\.js\?v=\d+"[^>]*><\/script>/, inject);
    if (out) strategy = 'afterTranslations';
  }

  if (!out) {
    out = injectBeforeBody(src, inject);
    if (out) strategy = 'beforeBody';
  }

  if (!out) { REPORT.skipped++; console.warn('  no anchor:', path.relative(ROOT, file)); return; }

  fs.writeFileSync(file, out, 'utf8');
  REPORT.touched++;
  REPORT.byStrategy[strategy]++;
}

const files = walk(ROOT);
files.forEach(process);

console.log('--- Rollout report ---');
console.log('Total HTML scanned:   ', REPORT.total);
console.log('Touched (injected):   ', REPORT.touched);
console.log('  after vcx-nav.js:   ', REPORT.byStrategy.afterNav);
console.log('  after translations: ', REPORT.byStrategy.afterTranslations);
console.log('  before </body>:     ', REPORT.byStrategy.beforeBody);
console.log('Already had footer:   ', REPORT.already);
console.log('Skipped (no footer):  ', REPORT.skipped);
