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
const EXPECTED_B2B = [
  'solutions.html','revenue-recovery-workflow.html','revenue-recovery-florida.html',
  'revenue-recovery-miami.html','revenue-recovery-orlando.html','revenue-recovery-tampa.html',
  'corporate-legal-file-control.html','pre-collection-pilot.html',
  'small-claims-documentation.html','structured-case-intake.html',
  'industries.html','industry-contract-services.html','industry-fleet-logistics.html',
  'industry-healthcare-dental.html','industry-subscription-recurring.html',
  'case-study-fleet-logistics.html','case-study-healthcare-network.html','case-study-subscription-saas.html',
  'vitacorex-vs-traditional-agency.html','pricing-and-engagement-tiers.html',
  'sample-deliverable.html','partners.html','security-and-compliance.html'
];
const EXPECTED_B2C = [
  'additional-services.html','contract-review-service.html','auto-deal-review.html',
  'florida-small-claims-help.html','llc-formation-florida.html','diagnostic-review.html',
  'immigration-packet-review.html','immigration-services-tampa.html',
  'i-130-petition.html','i-485-adjustment.html','n-400-naturalization.html'
];
const EXPECTED_SHARED = [
  'about.html','contact.html','careers.html','resources.html','faq.html',
  'privacy-policy.html','terms-of-use.html','cookie-policy.html',
  'secure-coordination.html','sub-processors-and-dpa.html','thank-you.html'
];
// Must NOT appear in sitemap.
const FORBIDDEN = [
  '404.html','app.html','index.html','auto-purchase.html','business-plans.html',
  'contracts.html','corporate-paralegal.html','immigration-documents.html','net-recovery.html',
  'google4ac6122041612c23.html','yandex_7c27f4f2ed32ff4d.html'
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
check('Forbidden (' + FORBIDDEN.length + ' must be absent)', FORBIDDEN, false);

// Home root
console.log('--- Root ---');
if (urlSet.has(BASE + '/')) console.log('  \u2713 /'); else { console.log('  \u2717 MISSING: /'); fail++; }

console.log('\nTotal URLs in sitemap: ' + urls.length);
console.log(fail ? ('\nFAIL: ' + fail + ' coverage issue(s).') : '\nPASS: sitemap coverage complete.');
process.exit(fail ? 1 : 0);
