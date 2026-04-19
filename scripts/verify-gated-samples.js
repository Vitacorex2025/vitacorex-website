/* P03 Step 3.5 — Verifier: no page should link directly to a gated sample
 * without routing through the gate (samples/request-gated-sample.html?s=<slug>).
 *
 * Gated slugs:
 *   - ar-leakage-map
 *   - counsel-ready-packet
 *
 * A gate-bypass link is any anchor in the <body> of a non-gated page whose
 * href ends at /samples/<slug>.html directly (no ?s=<slug> query). Exceptions:
 *   - The gated sample page itself (self-link / canonical etc.)
 *   - The gate page (request-gated-sample.html) and its success panel
 *
 * Additionally:
 *   - Confirms every gated sample page wires vcx-sample-gate.css + vcx-sample-gate.js
 *   - Confirms the gate page is NOT present in sitemap.xml (noindex)
 *
 * Exits 0 on PASS, 1 on any failure.
 *
 * Run: node scripts/verify-gated-samples.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const GATED = ['ar-leakage-map', 'counsel-ready-packet'];
const GATE_PAGE = 'samples/request-gated-sample.html';
const GATE_CSS = 'vcx-sample-gate.css';
const GATE_JS = 'vcx-sample-gate.js';

function listHtml(dir) {
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.join(dir, f));
}

function read(p) { return fs.readFileSync(p, 'utf8'); }

let fail = 0;

// ---- (1) No gate bypass links ----
console.log('--- (1) No gate bypass links ---');
const rootPages = listHtml(ROOT);
const samplePages = listHtml(path.join(ROOT, 'samples'));
const allPages = rootPages.concat(samplePages);

allPages.forEach((p) => {
  const base = path.basename(p);
  // Skip the gated sample pages themselves (self-links are allowed)
  if (GATED.indexOf(base.replace(/\.html$/, '')) !== -1) return;
  // Skip the gate page itself
  if (base === 'request-gated-sample.html') return;

  const h = read(p);
  // Scan main content (between </header> and <footer)
  const hs = h.indexOf('</header>');
  const he = h.indexOf('<footer');
  if (hs < 0 || he < 0) return;
  const body = h.slice(hs, he);

  GATED.forEach((slug) => {
    const re = new RegExp('href=\"([^\"]*' + slug + '\\.html)[^\"]*\"', 'g');
    [...body.matchAll(re)].forEach((m) => {
      if (m[0].indexOf('request-gated') === -1) {
        console.log('  \u2717 ' + path.relative(ROOT, p) + ' -> ' + m[1]);
        fail++;
      }
    });
  });
});
if (fail === 0) console.log('  \u2713 No bypass leaks.');

// ---- (2) Gate CSS+JS wired on both gated samples ----
console.log('\n--- (2) Gate wiring on gated sample pages ---');
GATED.forEach((slug) => {
  const p = path.join(ROOT, 'samples', slug + '.html');
  if (!fs.existsSync(p)) {
    console.log('  \u2717 MISSING: samples/' + slug + '.html');
    fail++;
    return;
  }
  const h = read(p);
  const css = h.indexOf(GATE_CSS) !== -1;
  const js = h.indexOf(GATE_JS) !== -1;
  console.log('  ' + (css && js ? '\u2713' : '\u2717') + ' samples/' + slug + '.html css=' + css + ' js=' + js);
  if (!css || !js) fail++;
});

// ---- (3) Gate page exists and is noindex ----
console.log('\n--- (3) Gate page noindex + present ---');
const gateP = path.join(ROOT, GATE_PAGE);
if (!fs.existsSync(gateP)) {
  console.log('  \u2717 ' + GATE_PAGE + ' missing');
  fail++;
} else {
  const h = read(gateP);
  const robots = (h.match(/<meta\s+name=\"robots\"\s+content=\"([^\"]+)\"/) || [])[1] || '';
  const noindex = /noindex/i.test(robots);
  console.log('  ' + (noindex ? '\u2713' : '\u2717') + ' ' + GATE_PAGE + ' robots=\"' + robots + '\"');
  if (!noindex) fail++;
}

// ---- (4) Gate page NOT in sitemap ----
console.log('\n--- (4) Gate page excluded from sitemap ---');
const smp = path.join(ROOT, 'sitemap.xml');
if (fs.existsSync(smp)) {
  const s = read(smp);
  const inMap = s.indexOf('request-gated-sample') !== -1;
  console.log('  ' + (inMap ? '\u2717' : '\u2713') + ' sitemap ' + (inMap ? 'leaks' : 'correctly excludes') + ' gate page');
  if (inMap) fail++;
} else {
  console.log('  - sitemap.xml not present; skipping');
}

console.log('\n' + (fail ? 'FAIL: ' + fail + ' issue(s).' : 'PASS.'));
process.exit(fail ? 1 : 0);
