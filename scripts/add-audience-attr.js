/* P02 Step 2.4 — Hardcode body[data-audience] on every HTML page.
 *
 * Why SSR-hardcoded (not JS-only):
 *  - No FOUC: CSS that reads body[data-audience="b2b"] applies immediately
 *  - Crawler-visible: SEO/AI signals the audience without JS
 *  - Grep-auditable: `grep data-audience` reliably reports classification
 *  - vcx-nav.js still sets the attribute at runtime as a fallback/guarantee
 *
 * Classification is the single source of truth — mirrors
 * assets/js/vcx-nav.js AUD_B2B / AUD_B2C / getAudience().
 *
 * Idempotent: skips pages where <body> already has data-audience="…".
 * Run: node scripts/add-audience-attr.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'docs', 'scripts']);

const AUD_B2B = new Set([
  'solutions.html', 'corporate-legal-file-control.html', 'revenue-recovery-workflow.html',
  'revenue-recovery-florida.html', 'revenue-recovery-miami.html', 'revenue-recovery-orlando.html',
  'revenue-recovery-tampa.html',
  'pre-collection-pilot.html', 'small-claims-documentation.html',
  'industries.html', 'security-and-compliance.html', 'sample-deliverable.html',
  'structured-case-intake.html', 'partners.html',
  'case-study-fleet-logistics.html', 'case-study-healthcare-network.html', 'case-study-subscription-saas.html',
  'vitacorex-vs-traditional-agency.html',
  'industry-contract-services.html', 'industry-fleet-logistics.html',
  'industry-healthcare-dental.html', 'industry-subscription-recurring.html',
  'pricing-and-engagement-tiers.html'
]);

const AUD_B2C = new Set([
  'contract-review-service.html', 'immigration-packet-review.html', 'auto-deal-review.html',
  'florida-small-claims-help.html', 'llc-formation-florida.html', 'business-plans.html',
  'additional-services.html', 'diagnostic-review.html',
  'i-130-petition.html', 'i-485-adjustment.html', 'n-400-naturalization.html',
  'immigration-services-tampa.html'
]);

function classify(file) {
  const base = path.basename(file);
  if (base === 'index.html') return 'shared'; // both root index and app/* indices
  if (AUD_B2B.has(base)) return 'b2b';
  if (AUD_B2C.has(base)) return 'b2c';
  return 'shared';
}

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

const REPORT = { total: 0, b2b: 0, b2c: 0, shared: 0, already: 0, skipped: 0, noBodyTag: 0 };

function process(file) {
  REPORT.total++;
  let src = fs.readFileSync(file, 'utf8');

  // Find the first <body ...> tag (ignore markup/comments before it).
  const m = src.match(/<body\b([^>]*)>/i);
  if (!m) { REPORT.noBodyTag++; return; }

  const existingAttrs = m[1] || '';
  if (/\bdata-audience\s*=/.test(existingAttrs)) { REPORT.already++; return; }

  const aud = classify(file);
  const newOpen = '<body' + existingAttrs + ' data-audience="' + aud + '">';
  const out = src.slice(0, m.index) + newOpen + src.slice(m.index + m[0].length);
  fs.writeFileSync(file, out, 'utf8');

  REPORT[aud]++;
}

const files = walk(ROOT);
files.forEach(process);

console.log('--- Audience-attr rollout report ---');
console.log('Total HTML scanned:  ', REPORT.total);
console.log('  b2b attribute:     ', REPORT.b2b);
console.log('  b2c attribute:     ', REPORT.b2c);
console.log('  shared attribute:  ', REPORT.shared);
console.log('Already had attr:    ', REPORT.already);
console.log('No <body> tag found: ', REPORT.noBodyTag);
