/* P02 Step 2.6 — Verify sitemap.xml contains every classified audience page
 * and no redirect stubs / auth / verification tokens.
 *
 * Exits 0 if coverage is complete, 1 on drift.
 * Run: node scripts/verify-sitemap.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// Mirror of scripts/generate-sitemap.js classification.
// 2026-10 rebuild: recovery/corporate legacy pages are noindex (existing clients only) and
// several legacy directories became meta-refresh stubs (see worklogs/ROUTE_MAP.csv).
const EXPECTED_B2B = [
  'small-claims-documentation.html'
];
const EXPECTED_B2C = [
  'contract-review-service.html','llc-formation-florida.html',
  'immigration-packet-review.html','n-400-naturalization.html'
];
const EXPECTED_SHARED = [
  'about.html','contact.html','careers.html',
  'privacy-policy.html','terms-of-use.html','cookie-policy.html'
];
// P03 Step 3.2 — Samples cluster under /samples/<slug>.html (ADR-008).
const EXPECTED_SAMPLES = [];   // samples are noindex since 2026-10-15
// Must NOT appear in sitemap.
// business-plans.html was a redirect stub — promoted to a full standalone page on 2026-04-20,
// so it was removed from this list at that time (now has its own sitemap entry).
const FORBIDDEN = [
  '404.html','app.html','index.html','auto-purchase.html',
  'contracts.html','corporate-paralegal.html','immigration-documents.html','net-recovery.html',
  'google4ac6122041612c23.html','yandex_7c27f4f2ed32ff4d.html',
  // retired automotive service (noindex retirement pages)
  'auto-deal-review.html','private-intake-auto.html','samples/auto-deal-cost-breakdown.html',
  // meta-refresh redirect stubs (2026-10 rebuild)
  'private-services.html','additional-services.html','structured-case-intake.html',
  'pricing-and-engagement-tiers.html','engagement.html','private-intake-business.html',
  'private-intake-immigration.html','i-130-petition.html','i-485-adjustment.html'
];
// noindex legacy pages: reported as warnings when still listed (not a coverage failure).
const NOINDEX_WARN = [
  'turnkey-business-opening.html','location-analysis.html','florida-small-claims-help.html',
  'solutions.html','diagnostic-review.html','corporate-legal-file-control.html','pre-collection-pilot.html',
  'revenue-recovery-workflow.html','revenue-recovery-florida.html','revenue-recovery-miami.html',
  'revenue-recovery-orlando.html','revenue-recovery-tampa.html',
  'industries.html','industry-contract-services.html','industry-fleet-logistics.html',
  'industry-healthcare-dental.html','industry-subscription-recurring.html',
  'case-study-fleet-logistics.html','case-study-healthcare-network.html','case-study-subscription-saas.html',
  'vitacorex-vs-traditional-agency.html'
];

const BASE = 'https://vitacorexllc.com';
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const urlSet = new Set(urls);

let fail = 0;

function check(label, expected, requirePresent) {
  console.log('--- ' + label + ' ---');
  expected.forEach(p => {
    const url = BASE + '/' + p;
    const present = urlSet.has(url);
    if (requirePresent && !present) { console.log('  \u2717 MISSING: ' + p); fail++; }
    else if (!requirePresent && present) { console.log('  \u2717 FORBIDDEN present: ' + p); fail++; }
    else console.log('  \u2713 ' + p);
  });
}

check('B2B cluster (' + EXPECTED_B2B.length + ' expected)', EXPECTED_B2B, true);
check('B2C cluster (' + EXPECTED_B2C.length + ' expected)', EXPECTED_B2C, true);
check('Shared pages (' + EXPECTED_SHARED.length + ' expected)', EXPECTED_SHARED, true);
check('P03 samples cluster (' + EXPECTED_SAMPLES.length + ' expected)', EXPECTED_SAMPLES, true);
check('Forbidden (' + FORBIDDEN.length + ' must be absent)', FORBIDDEN, false);

console.log('--- noindex legacy pages (warning only) ---');
NOINDEX_WARN.forEach(p => { if (urlSet.has(BASE + '/' + p)) console.log('  ! WARN noindex page still listed: ' + p); });

// Home root
console.log('--- Root ---');
if (urlSet.has(BASE + '/')) console.log('  \u2713 /'); else { console.log('  \u2717 MISSING: /'); fail++; }

console.log('\nTotal URLs in sitemap: ' + urls.length);
console.log(fail ? ('\nFAIL: ' + fail + ' coverage issue(s).') : '\nPASS: sitemap coverage complete.');
process.exit(fail ? 1 : 0);
