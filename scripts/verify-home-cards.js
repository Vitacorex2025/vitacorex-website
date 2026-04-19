/* P02 Step 2.5 — Regression check: home dual-entry cards untouched.
 *
 * Asserts that the "Who are you coming for?" section on index.html still
 * contains the full expected markup and that no recently-introduced CSS
 * targets the .vcx-route* / .vcx-routes* namespace.
 *
 * Exits 0 if untouched, 1 if regression detected.
 * Run: node scripts/verify-home-cards.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const REQUIRED_MARKUP = [
  '<section class="vcx-routes" id="who-you-are"',
  'data-page="routes_eyebrow"',
  'data-page="routes_title"',
  'data-page="routes_lede"',
  'class="vcx-routes__grid"',
  'data-page="route_b2b_tag"',
  'data-page="route_b2b_headline"',
  'data-page="route_b2b_cta"',
  'data-page="route_priv_tag"',
  'data-page="route_priv_headline"',
  'data-page="route_priv_cta"'
];

const PROHIBITED_SELECTORS_IN_NEW_CSS = [
  '.vcx-route',
  '.vcx-routes',
  '#who-you-are'
];

const NEW_CSS_FILES = [
  'assets/css/vcx-nav.css',
  'assets/css/vcx-footer.css'
];

let fail = 0;

// (1) markup presence
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
console.log('--- Home cards markup check ---');
REQUIRED_MARKUP.forEach(needle => {
  if (html.includes(needle)) console.log('  \u2713', needle);
  else { console.log('  \u2717 MISSING:', needle); fail++; }
});

// (2) no P02-introduced CSS targeting the cards
console.log('\n--- P02 CSS namespace-isolation check ---');
NEW_CSS_FILES.forEach(f => {
  const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
  PROHIBITED_SELECTORS_IN_NEW_CSS.forEach(sel => {
    if (src.includes(sel)) { console.log('  \u2717', f, 'contains prohibited selector:', sel); fail++; }
    else console.log('  \u2713', f, 'does not touch', sel);
  });
});

// (3) Outer card anchors preserved (the clickable card itself is an <a>)
console.log('\n--- Card anchor wrappers check ---');
const B2B_A  = /<a class="vcx-route vcx-route--primary" href="[^"]+" data-route="b2b"/;
const PRIV_A = /<a class="vcx-route vcx-route--private" href="[^"]+" data-route="private"/;
if (B2B_A.test(html))  console.log('  \u2713 B2B card <a data-route="b2b"> intact');
else { console.log('  \u2717 B2B card anchor missing or altered'); fail++; }
if (PRIV_A.test(html)) console.log('  \u2713 Private card <a data-route="private"> intact');
else { console.log('  \u2717 Private card anchor missing or altered'); fail++; }

if (fail) {
  console.log('\nFAIL:', fail, 'regression(s) detected.');
  process.exit(1);
}
console.log('\nPASS: home dual-entry cards are untouched by the P02 cascade.');
