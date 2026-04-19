/* P02 Step 2.6 — Generate sitemap.xml clustered by audience (ADR-006).
 *
 * Source of truth for classification: mirrors assets/js/vcx-nav.js
 * (AUD_B2B / AUD_B2C) and scripts/add-audience-attr.js. Every HTML page
 * with a classified audience is emitted under its cluster header.
 *
 * Dropped: redirect stubs, 404, verification tokens, auth pages, widgets.
 * Preserved: well-known JSON-LD, PDFs, feeds, llms.txt, humans.txt, Bing auth.
 *
 * Run: node scripts/generate-sitemap.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://vitacorexllc.com';
const TODAY = '2026-04-19';

// ---------- Classification (mirrors vcx-nav.js) ----------
const B2B = [
  'solutions.html',
  'revenue-recovery-workflow.html',
  'revenue-recovery-florida.html',
  'revenue-recovery-miami.html',
  'revenue-recovery-orlando.html',
  'revenue-recovery-tampa.html',
  'corporate-legal-file-control.html',
  'pre-collection-pilot.html',
  'small-claims-documentation.html',
  'structured-case-intake.html',
  'industries.html',
  'industry-contract-services.html',
  'industry-fleet-logistics.html',
  'industry-healthcare-dental.html',
  'industry-subscription-recurring.html',
  'case-study-fleet-logistics.html',
  'case-study-healthcare-network.html',
  'case-study-subscription-saas.html',
  'vitacorex-vs-traditional-agency.html',
  'pricing-and-engagement-tiers.html',
  'sample-deliverable.html',
  'partners.html',
  'security-and-compliance.html'
];

// NOTE: business-plans.html is a redirect stub → additional-services.html.
// Kept in nav link (ADR-006 lists it as "new dedicated"), but excluded
// from sitemap until a real page is authored (tracked as P02 backlog).
const B2C = [
  'additional-services.html',
  'contract-review-service.html',
  'auto-deal-review.html',
  'florida-small-claims-help.html',
  'llc-formation-florida.html',
  'diagnostic-review.html',
  'immigration-packet-review.html',
  'immigration-services-tampa.html',
  'i-130-petition.html',
  'i-485-adjustment.html',
  'n-400-naturalization.html'
];

const SHARED_CORE = [
  'about.html',
  'contact.html',
  'careers.html',
  'resources.html',
  'faq.html'
];

const SHARED_LEGAL = [
  'privacy-policy.html',
  'terms-of-use.html',
  'cookie-policy.html',
  'secure-coordination.html',
  'sub-processors-and-dpa.html'
];

const SHARED_UTILITY = [
  'thank-you.html'
];

// P03 Step 3.2 — Sample deliverables (ADR-008). Live under /samples/<slug>.html
// and are audience-classified the same as B2B/B2C pages (body[data-audience]).
const SAMPLES_B2B = [
  'ar-leakage-map.html',           // gated
  'counsel-ready-packet.html',     // gated
  'diagnostic-report.html'         // ungated (replica of /sample-deliverable.html)
];
const SAMPLES_B2C = [
  'contract-risk-memo.html',
  'immigration-evidence-index.html',
  'auto-deal-cost-breakdown.html'
];
const SAMPLES_SHARED = [
  'small-claims-chronology.html'
];

// Pages intentionally DROPPED (redirect stubs + verification + 404 + auth + widgets)
const DROPPED = new Set([
  '404.html', 'app.html', 'index.html',
  'auto-purchase.html', 'business-plans.html', 'contracts.html', 'corporate-paralegal.html',
  'immigration-documents.html', 'net-recovery.html',
  'google4ac6122041612c23.html', 'yandex_7c27f4f2ed32ff4d.html',
  'app/sign-in/index.html', 'app/review/index.html', 'app/deadline-calendar/widget.html'
]);

// App tools exposed in sitemap (shared audience — authenticated tools for both lanes)
const APP_TOOLS = [
  'app/deadline-calendar/',
  'app/contract-intelligence/',
  'app/dealer-contract-check/',
  'app/immigration-forms/',
  'app/legal-assistant/',
  'app/matter-status/',
  'app/private-lookup/',
  'app/vcx-contract-review/',
  'app/vcx-intake/',
  'app/vcx-packet-room/',
  'app/vcx-recovery-pilot/'
];

// Non-HTML URLs preserved from the previous sitemap (assets, feeds, well-known)
const NON_HTML = {
  wellKnown: [
    ['/.well-known/ai-plugin.json',            'weekly',  '0.4'],
    ['/.well-known/knowledge-graph.jsonld',    'weekly',  '0.5'],
    ['/.well-known/author-entity.jsonld',      'weekly',  '0.5'],
    ['/.well-known/wikidata-claims.json',      'monthly', '0.4'],
    ['/.well-known/voice-actions.jsonld',      'weekly',  '0.5']
  ],
  feeds: [
    ['/feed.xml',       'weekly',  '0.6'],
    ['/llms.txt',       'weekly',  '0.5'],
    ['/llms-full.txt',  'weekly',  '0.5'],
    ['/llms-ru.txt',    'weekly',  '0.5'],
    ['/llms-es.txt',    'weekly',  '0.5']
  ],
  pdfs: [
    ['/assets/pdf/lead-magnet-healthcare.pdf',                'monthly', '0.6'],
    ['/assets/pdf/healthcare-cfo-brief.pdf',                  'monthly', '0.6'],
    ['/assets/pdf/dental-institutional-deck.pdf',             'monthly', '0.6'],
    ['/assets/pdf/precollection-executive-review.pdf',        'monthly', '0.6'],
    ['/assets/pdf/precollection-healthcare-selling-deck.pdf', 'monthly', '0.6'],
    ['/assets/pdf/VitaCoreX_Institutional_Proof.pdf',         'monthly', '0.6']
  ],
  misc: [
    ['/humans.txt',       'monthly', '0.2'],
    ['/BingSiteAuth.xml', 'monthly', '0.2']
  ]
};

// ---------- Emit helpers ----------
const out = [];
out.push('<?xml version="1.0" encoding="UTF-8"?>');
out.push('<!-- Generated by scripts/generate-sitemap.js — ADR-006 audience-clustered layout -->');
out.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

function urlEntry(loc, changefreq, priority) {
  out.push('  <url>');
  out.push('    <loc>' + loc + '</loc>');
  out.push('    <lastmod>' + TODAY + '</lastmod>');
  out.push('    <changefreq>' + changefreq + '</changefreq>');
  out.push('    <priority>' + priority + '</priority>');
  out.push('  </url>');
}

function cluster(title, pages, changefreq, priority) {
  out.push('');
  out.push('  <!-- ' + title + ' -->');
  pages.forEach(p => urlEntry(BASE + '/' + p, changefreq, priority));
}

// ---------- Homepage ----------
out.push('');
out.push('  <!-- Home -->');
urlEntry(BASE + '/', 'weekly', '1.0');

// ---------- Shared core (about/contact/careers/resources/faq) ----------
cluster('Shared — Core navigation', SHARED_CORE, 'weekly', '0.8');

// ---------- B2B cluster ----------
out.push('');
out.push('  <!-- ============================================================ -->');
out.push('  <!-- For Companies (B2B) — 23 pages · ADR-006 dual-door Lane A    -->');
out.push('  <!-- ============================================================ -->');
// Hub
urlEntry(BASE + '/solutions.html', 'weekly', '0.9');
out.push('  <!-- B2B · Revenue Recovery -->');
['revenue-recovery-workflow.html','revenue-recovery-florida.html',
 'revenue-recovery-miami.html','revenue-recovery-orlando.html','revenue-recovery-tampa.html']
  .forEach(p => urlEntry(BASE + '/' + p, 'weekly', '0.8'));
out.push('  <!-- B2B · Core services -->');
['corporate-legal-file-control.html','pre-collection-pilot.html',
 'small-claims-documentation.html','structured-case-intake.html']
  .forEach(p => urlEntry(BASE + '/' + p, 'weekly', '0.8'));
out.push('  <!-- B2B · Industries -->');
['industries.html','industry-contract-services.html','industry-fleet-logistics.html',
 'industry-healthcare-dental.html','industry-subscription-recurring.html']
  .forEach(p => urlEntry(BASE + '/' + p, 'weekly', '0.7'));
out.push('  <!-- B2B · Proof & case studies -->');
['case-study-fleet-logistics.html','case-study-healthcare-network.html','case-study-subscription-saas.html',
 'vitacorex-vs-traditional-agency.html','sample-deliverable.html']
  .forEach(p => urlEntry(BASE + '/' + p, 'weekly', '0.7'));
out.push('  <!-- B2B · Pricing & procurement -->');
urlEntry(BASE + '/pricing-and-engagement-tiers.html', 'weekly', '0.9');
urlEntry(BASE + '/security-and-compliance.html',      'weekly', '0.7');
urlEntry(BASE + '/partners.html',                     'weekly', '0.6');

// ---------- B2C cluster ----------
out.push('');
out.push('  <!-- ============================================================ -->');
out.push('  <!-- For Private Clients (B2C) — 12 pages · ADR-006 Lane B        -->');
out.push('  <!-- ============================================================ -->');
urlEntry(BASE + '/additional-services.html', 'weekly', '0.9');
out.push('  <!-- B2C · Contract & auto-deal -->');
['contract-review-service.html','auto-deal-review.html']
  .forEach(p => urlEntry(BASE + '/' + p, 'weekly', '0.8'));
out.push('  <!-- B2C · Immigration packets -->');
['immigration-packet-review.html','immigration-services-tampa.html',
 'i-130-petition.html','i-485-adjustment.html','n-400-naturalization.html']
  .forEach(p => urlEntry(BASE + '/' + p, 'weekly', '0.8'));
out.push('  <!-- B2C · Florida small claims -->');
urlEntry(BASE + '/florida-small-claims-help.html', 'weekly', '0.8');
out.push('  <!-- B2C · Business formation -->');
urlEntry(BASE + '/llc-formation-florida.html', 'weekly', '0.8');
// business-plans.html is a redirect stub → omitted (see NOTE above)
out.push('  <!-- B2C · Diagnostic bridge -->');
urlEntry(BASE + '/diagnostic-review.html', 'weekly', '0.7');

// ---------- P03 samples (ADR-008) ----------
out.push('');
out.push('  <!-- ============================================================ -->');
out.push('  <!-- Sample deliverables (P03 · ADR-008) — 7 pages under /samples/ -->');
out.push('  <!-- ============================================================ -->');
out.push('  <!-- Samples · B2B -->');
SAMPLES_B2B.forEach(p => urlEntry(BASE + '/samples/' + p, 'monthly', '0.6'));
out.push('  <!-- Samples · B2C -->');
SAMPLES_B2C.forEach(p => urlEntry(BASE + '/samples/' + p, 'monthly', '0.6'));
out.push('  <!-- Samples · Shared -->');
SAMPLES_SHARED.forEach(p => urlEntry(BASE + '/samples/' + p, 'monthly', '0.6'));

// ---------- Shared legal ----------
cluster('Shared — Legal & compliance', SHARED_LEGAL, 'monthly', '0.5');

// ---------- Shared utility ----------
cluster('Shared — Utility', SHARED_UTILITY, 'monthly', '0.3');

// ---------- App tools ----------
out.push('');
out.push('  <!-- App tools (authenticated) — shared audience -->');
APP_TOOLS.forEach(p => urlEntry(BASE + '/' + p, 'weekly', '0.5'));

// ---------- Non-HTML preserved from prior sitemap ----------
out.push('');
out.push('  <!-- Well-Known / AI discovery -->');
NON_HTML.wellKnown.forEach(([loc, cf, pr]) => urlEntry(BASE + loc, cf, pr));
out.push('');
out.push('  <!-- Feeds & LLM indexes -->');
NON_HTML.feeds.forEach(([loc, cf, pr]) => urlEntry(BASE + loc, cf, pr));
out.push('');
out.push('  <!-- Executive PDFs -->');
NON_HTML.pdfs.forEach(([loc, cf, pr]) => urlEntry(BASE + loc, cf, pr));
out.push('');
out.push('  <!-- Misc -->');
NON_HTML.misc.forEach(([loc, cf, pr]) => urlEntry(BASE + loc, cf, pr));

out.push('</urlset>');
out.push('');

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), out.join('\n'), 'utf8');

// ---------- Coverage report ----------
const samplesTotal = SAMPLES_B2B.length + SAMPLES_B2C.length + SAMPLES_SHARED.length;
const total = B2B.length + B2C.length + SHARED_CORE.length + SHARED_LEGAL.length + SHARED_UTILITY.length + APP_TOOLS.length + samplesTotal + 1;
console.log('=== Sitemap generated ===');
console.log('  Home:                1');
console.log('  Shared core:         ' + SHARED_CORE.length);
console.log('  B2B:                 ' + B2B.length);
console.log('  B2C:                 ' + B2C.length);
console.log('  Samples (B2B/B2C/shared): ' + SAMPLES_B2B.length + '/' + SAMPLES_B2C.length + '/' + SAMPLES_SHARED.length + ' = ' + samplesTotal);
console.log('  Shared legal:        ' + SHARED_LEGAL.length);
console.log('  Shared utility:      ' + SHARED_UTILITY.length);
console.log('  App tools:           ' + APP_TOOLS.length);
console.log('  Total HTML URLs:     ' + total);
console.log('  Well-known:          ' + NON_HTML.wellKnown.length);
console.log('  Feeds:               ' + NON_HTML.feeds.length);
console.log('  PDFs:                ' + NON_HTML.pdfs.length);
console.log('  Misc:                ' + NON_HTML.misc.length);
const nonHtml = NON_HTML.wellKnown.length + NON_HTML.feeds.length + NON_HTML.pdfs.length + NON_HTML.misc.length;
console.log('  Grand total <url>:   ' + (total + nonHtml));
console.log('  Dropped (redirects + tokens + auth + widgets): ' + DROPPED.size);
