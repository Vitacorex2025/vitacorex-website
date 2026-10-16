/* Generate sitemap.xml clustered by audience (ADR-006, updated 2026-10-14).
 *
 * 2026-10-14 rebuild (private clients first):
 *   - New private-client pages: services, pricing, request, apostille,
 *     tax-preparation (+ existing translations / online-notary pages).
 *   - Retired automotive service pages are no longer emitted.
 *   - /app/ tools are no longer emitted (robots.txt disallows /app/).
 *   - Each entry carries its own lastmod; unchanged pages keep the date of
 *     their last published sitemap entry.
 *
 * Dropped: redirect stubs, 404, verification tokens, auth pages, widgets,
 *          app tools, retired services.
 * Preserved: well-known JSON-LD, PDFs, feeds, llms.txt, humans.txt, Bing auth.
 *
 * Run: node scripts/generate-sitemap.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://vitacorexllc.com';

// lastmod values
const PREV = '2026-04-28';   // date of the previous published sitemap
const TODAY = '2026-10-15';  // pages / files created or changed in this rebuild (every page was rebuilt 2026-10-14/15)
const MAY26 = '2026-05-26';  // translations / online-notary last commit

// ---------- Classification ----------
// Each entry: [path, changefreq, priority, lastmod]
const SHARED_CORE = [
  ['about.html',    'weekly', '0.8', TODAY],
  ['contact.html',  'weekly', '0.8', TODAY],
  ['careers.html',  'weekly', '0.8', TODAY],
  ['insights.html', 'weekly', '0.8', TODAY],
  ['faq.html',      'weekly', '0.8', TODAY]
];

// Private clients (primary lane)
const PRIVATE_HUB = [
  ['services.html', 'weekly', '0.9', TODAY],
  ['pricing.html',  'weekly', '0.9', TODAY],
  ['request.html',  'weekly', '0.8', TODAY]
];
const PRIVATE_DOCUMENTS = [
  ['translations.html',  'weekly', '0.8', TODAY],
  ['online-notary.html', 'weekly', '0.8', TODAY],
  ['apostille.html',     'weekly', '0.8', TODAY]
];
const PRIVATE_PERSONAL = [
  ['tax-preparation.html',          'weekly', '0.8', TODAY],
  ['name-change.html',              'monthly', '0.7', TODAY],
  ['fee-waiver.html',               'monthly', '0.7', TODAY],
  ['civil-case-referral.html',      'monthly', '0.6', TODAY],
  ['contract-review-service.html',  'weekly', '0.8', TODAY],
  ['immigration-packet-review.html','weekly', '0.8', TODAY],
  ['immigration-services-tampa.html','weekly','0.8', TODAY],
  ['i-130-petition.html',           'weekly', '0.8', TODAY],
  ['i-485-adjustment.html',         'weekly', '0.8', TODAY],
  ['n-400-naturalization.html',     'weekly', '0.8', TODAY],
  ['florida-small-claims-help.html','weekly', '0.8', TODAY]
];
const PRIVATE_FOUNDERS = [
  ['financial-recovery.html',       'monthly', '0.7', TODAY],
  ['business-filings.html',         'monthly', '0.7', TODAY],
  ['llc-formation-florida.html',    'weekly', '0.8', TODAY],
  ['founder-services.html',         'monthly', '0.7', TODAY],
  ['business-plans.html',           'weekly', '0.8', TODAY],
  ['location-analysis.html',        'weekly', '0.8', TODAY],
  ['turnkey-business-opening.html', 'weekly', '0.8', TODAY]
];
const PRIVATE_OTHER = [
  ['additional-services.html', 'weekly', '0.9', TODAY],
  ['diagnostic-review.html',   'weekly', '0.7', TODAY]
];

// Companies (B2B lane)
const B2B_HUB = [
  ['solutions.html', 'weekly', '0.9', TODAY]
];
const B2B_RECOVERY = [
  ['revenue-recovery-workflow.html', 'weekly', '0.8', TODAY],
  ['revenue-recovery-florida.html',  'weekly', '0.8', TODAY],
  ['revenue-recovery-miami.html',    'weekly', '0.8', TODAY],
  ['revenue-recovery-orlando.html',  'weekly', '0.8', TODAY],
  ['revenue-recovery-tampa.html',    'weekly', '0.8', TODAY]
];
const B2B_CORE = [
  ['corporate-legal-file-control.html', 'weekly', '0.8', TODAY],
  ['pre-collection-pilot.html',         'weekly', '0.8', TODAY],
  ['small-claims-documentation.html',   'weekly', '0.8', TODAY],
  ['structured-case-intake.html',       'weekly', '0.8', TODAY]
];
const B2B_INDUSTRIES = [
  ['industries.html',                    'weekly', '0.7', TODAY],
  ['industry-contract-services.html',    'weekly', '0.7', TODAY],
  ['industry-fleet-logistics.html',      'weekly', '0.7', TODAY],
  ['industry-healthcare-dental.html',    'weekly', '0.7', TODAY],
  ['industry-subscription-recurring.html','weekly','0.7', TODAY]
];
const B2B_PROOF = [
  ['case-study-fleet-logistics.html',     'weekly', '0.7', TODAY],
  ['case-study-healthcare-network.html',  'weekly', '0.7', TODAY],
  ['case-study-subscription-saas.html',   'weekly', '0.7', TODAY],
  ['vitacorex-vs-traditional-agency.html','weekly', '0.7', TODAY],
  ['sample-deliverable.html',             'weekly', '0.7', TODAY]
];
const B2B_PRICING = [
  ['pricing-and-engagement-tiers.html', 'weekly', '0.9', TODAY],
  ['security-and-compliance.html',      'weekly', '0.7', TODAY],
  ['partners.html',                     'weekly', '0.6', TODAY]
];

// Sample deliverables (ADR-008), under /samples/<slug>.html
const SAMPLES_B2B = [];  // old B2B samples: noindex since 2026-10-15
const SAMPLES_B2C = [];
const SAMPLES_SHARED = [];

const SHARED_LEGAL = [
  ['privacy-policy.html',         'monthly', '0.5', TODAY],
  ['terms-of-use.html',           'monthly', '0.5', TODAY],
  ['cookie-policy.html',          'monthly', '0.5', TODAY],
  ['secure-coordination.html',    'monthly', '0.5', TODAY],
  ['sub-processors-and-dpa.html', 'monthly', '0.5', TODAY]
];
const SHARED_UTILITY = [
  ['thank-you.html', 'monthly', '0.3', TODAY]
];

// Pages intentionally DROPPED (redirect stubs, verification, 404, auth,
// widgets, app tools, retired services). Listed for the coverage report.
const DROPPED = new Set([
  '404.html', 'app.html', 'index.html',
  'contracts.html', 'corporate-paralegal.html',
  'immigration-documents.html', 'net-recovery.html',
  'google4ac6122041612c23.html', 'yandex_7c27f4f2ed32ff4d.html',
  'app/'  // all /app/ tools — disallowed in robots.txt
  // Retired automotive service pages (2026-10-14) are not listed anywhere
  // in this file; their retirement pages carry noindex.
]);

// Non-HTML URLs (assets, feeds, well-known)
const NON_HTML = {
  wellKnown: [
    ['.well-known/ai-plugin.json',         'weekly',  '0.4', TODAY],
    ['.well-known/knowledge-graph.jsonld', 'weekly',  '0.5', TODAY],
    ['.well-known/author-entity.jsonld',   'weekly',  '0.5', TODAY],
    ['.well-known/wikidata-claims.json',   'monthly', '0.4', TODAY],
    ['.well-known/voice-actions.jsonld',   'weekly',  '0.5', TODAY]
  ],
  feeds: [
    ['feed.xml',      'weekly', '0.6', TODAY],
    ['llms.txt',      'weekly', '0.5', TODAY],
    ['llms-full.txt', 'weekly', '0.5', TODAY],
    ['llms-ru.txt',   'weekly', '0.5', TODAY],
    ['llms-es.txt',   'weekly', '0.5', TODAY]
  ],
  pdfs: [
    ['assets/pdf/lead-magnet-healthcare.pdf',                'monthly', '0.6', PREV],
    ['assets/pdf/healthcare-cfo-brief.pdf',                  'monthly', '0.6', PREV],
    ['assets/pdf/dental-institutional-deck.pdf',             'monthly', '0.6', PREV],
    ['assets/pdf/precollection-executive-review.pdf',        'monthly', '0.6', PREV],
    ['assets/pdf/precollection-healthcare-selling-deck.pdf', 'monthly', '0.6', PREV],
    ['assets/pdf/VitaCoreX_Institutional_Proof.pdf',         'monthly', '0.6', PREV]
  ],
  misc: [
    ['humans.txt',       'monthly', '0.2', TODAY],
    ['BingSiteAuth.xml', 'monthly', '0.2', PREV]
  ]
};

// ---------- Emit helpers ----------
const out = [];
out.push('<?xml version="1.0" encoding="UTF-8"?>');
out.push('<!-- Generated by scripts/generate-sitemap.js — audience-clustered layout (private clients first) -->');
out.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">');

let count = 0;
function urlEntry([p, changefreq, priority, lastmod]) {
  // Never list redirect stubs or noindex pages (they would contradict robots directives).
  if (p.endsWith('.html')) {
    const file = path.join(ROOT, p);
    if (fs.existsSync(file)) {
      const html = fs.readFileSync(file, 'utf8');
      if (/http-equiv="refresh"/i.test(html) || /<meta name="robots" content="noindex/i.test(html)) { DROPPED.add(p); return; }
    }
  }
  // Pages with pre-rendered /ru/ and /es/ copies (scripts/vx-shell.mjs) are listed in all three languages with hreflang alternates.
  const page = p === '' ? 'index.html' : p;
  const locales = (p === '' || p.endsWith('.html')) && fs.existsSync(path.join(ROOT, 'ru', page)) ? ['ru', 'es'] : [];
  const loc = (lc) => BASE + (lc === 'en' ? '' : '/' + lc) + '/' + p;
  const alts = locales.length ? ['en', ...locales].map((lc) => '    <xhtml:link rel="alternate" hreflang="' + lc + '" href="' + loc(lc) + '"/>').concat(['    <xhtml:link rel="alternate" hreflang="x-default" href="' + loc('en') + '"/>']) : [];
  for (const lc of ['en', ...locales]) {
    out.push('  <url>');
    out.push('    <loc>' + loc(lc) + '</loc>');
    alts.forEach((l) => out.push(l));
    out.push('    <lastmod>' + (lc === 'en' ? lastmod : TODAY) + '</lastmod>');
    out.push('    <changefreq>' + changefreq + '</changefreq>');
    out.push('    <priority>' + priority + '</priority>');
    out.push('  </url>');
    count++;
  }
}
function comment(t) { out.push('  <!-- ' + t + ' -->'); }
function banner(t) {
  out.push('');
  comment('============================================================');
  comment(t);
  comment('============================================================');
}
function group(title, list) { comment(title); list.forEach(urlEntry); }

// ---------- Home ----------
out.push('');
comment('Home');
urlEntry(['', 'weekly', '1.0', TODAY]);

// ---------- Shared core ----------
out.push('');
group('Shared — Core navigation', SHARED_CORE);

// ---------- Private clients ----------
banner('For Private Clients — primary lane');
group('Private · Directory, prices, request', PRIVATE_HUB);
group('Private · Documents & translations', PRIVATE_DOCUMENTS);
group('Private · Taxes & personal paperwork', PRIVATE_PERSONAL);
group('Private · Starting a business', PRIVATE_FOUNDERS);
group('Private · Other', PRIVATE_OTHER);

// ---------- Companies ----------
banner('For Companies (B2B)');
group('B2B · Hub', B2B_HUB);
group('B2B · Revenue Recovery', B2B_RECOVERY);
group('B2B · Core services', B2B_CORE);
group('B2B · Industries', B2B_INDUSTRIES);
group('B2B · Proof & case studies', B2B_PROOF);
group('B2B · Pricing & procurement', B2B_PRICING);

// ---------- Samples ----------
const samplesTotal = SAMPLES_B2B.length + SAMPLES_B2C.length + SAMPLES_SHARED.length;
banner('Sample deliverables (ADR-008) — ' + samplesTotal + ' pages under /samples/');
group('Samples · B2B', SAMPLES_B2B);
group('Samples · Private clients', SAMPLES_B2C);
group('Samples · Shared', SAMPLES_SHARED);

// ---------- Shared legal / utility ----------
out.push('');
group('Shared — Legal & compliance', SHARED_LEGAL);
out.push('');
group('Shared — Utility', SHARED_UTILITY);

// ---------- Non-HTML ----------
out.push('');
group('Well-Known / AI discovery', NON_HTML.wellKnown);
out.push('');
group('Feeds & LLM indexes', NON_HTML.feeds);
out.push('');
group('Executive PDFs', NON_HTML.pdfs);
out.push('');
group('Misc', NON_HTML.misc);

out.push('</urlset>');
out.push('');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), out.join('\n'), 'utf8');

// ---------- Coverage report ----------
const privateTotal = PRIVATE_HUB.length + PRIVATE_DOCUMENTS.length + PRIVATE_PERSONAL.length +
  PRIVATE_FOUNDERS.length + PRIVATE_OTHER.length;
const b2bTotal = B2B_HUB.length + B2B_RECOVERY.length + B2B_CORE.length + B2B_INDUSTRIES.length +
  B2B_PROOF.length + B2B_PRICING.length;
const nonHtml = NON_HTML.wellKnown.length + NON_HTML.feeds.length + NON_HTML.pdfs.length + NON_HTML.misc.length;
console.log('=== Sitemap generated ===');
console.log('  Home:                1');
console.log('  Shared core:         ' + SHARED_CORE.length);
console.log('  Private clients:     ' + privateTotal);
console.log('  B2B:                 ' + b2bTotal);
console.log('  Samples (B2B/private/shared): ' + SAMPLES_B2B.length + '/' + SAMPLES_B2C.length + '/' + SAMPLES_SHARED.length + ' = ' + samplesTotal);
console.log('  Shared legal:        ' + SHARED_LEGAL.length);
console.log('  Shared utility:      ' + SHARED_UTILITY.length);
console.log('  Non-HTML:            ' + nonHtml);
console.log('  Grand total <url>:   ' + count);
console.log('  Dropped (redirects, tokens, auth, app tools, retired): ' + DROPPED.size);
