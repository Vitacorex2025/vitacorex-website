/* P03 Step 3.4 — Idempotent injector for .vcx-sample-embed on service pages.
 *
 * - Maps 8 service pages → 1 or 2 sample cards per page (roster in ADR-008)
 * - Inserts markup between sentinel comments VCX_SAMPLE_EMBED:START/END
 *   so re-runs are idempotent (existing block replaced in place; no dup)
 * - Adds <link rel="stylesheet" href="assets/css/vcx-sample-embed.css"> to <head>
 *   if not present
 * - Exits non-zero on any page that lacks the expected anchors
 *
 * Run:   node scripts/inject-sample-embed.js
 * Dry:   node scripts/inject-sample-embed.js --dry
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');

// Sample → page mapping per ADR-008 + P03 Step 3.4
const MAPPING = {
  'contract-review-service.html': {
    sectionAudience: 'b2c',
    cards: [{
      slug: 'contract-risk-memo', audience: 'b2c', gated: false,
      titleKey: 'smp_embed_contract_title', descKey: 'smp_embed_contract_desc',
    }],
  },
  'immigration-packet-review.html': {
    sectionAudience: 'b2c',
    cards: [{
      slug: 'immigration-evidence-index', audience: 'b2c', gated: false,
      titleKey: 'smp_embed_immigration_title', descKey: 'smp_embed_immigration_desc',
    }],
  },
  'auto-deal-review.html': {
    sectionAudience: 'b2c',
    cards: [{
      slug: 'auto-deal-cost-breakdown', audience: 'b2c', gated: false,
      titleKey: 'smp_embed_auto_title', descKey: 'smp_embed_auto_desc',
    }],
  },
  'florida-small-claims-help.html': {
    sectionAudience: 'shared',
    cards: [{
      slug: 'small-claims-chronology', audience: 'shared', gated: false,
      titleKey: 'smp_embed_smallclaims_title', descKey: 'smp_embed_smallclaims_desc',
    }],
  },
  'small-claims-documentation.html': {
    sectionAudience: 'shared',
    cards: [{
      slug: 'small-claims-chronology', audience: 'shared', gated: false,
      titleKey: 'smp_embed_smallclaims_title', descKey: 'smp_embed_smallclaims_desc',
    }],
  },
  'revenue-recovery-workflow.html': {
    sectionAudience: 'b2b',
    cards: [
      {
        slug: 'ar-leakage-map', audience: 'b2b', gated: true,
        titleKey: 'smp_embed_ar_leakage_title', descKey: 'smp_embed_ar_leakage_desc',
      },
      {
        slug: 'counsel-ready-packet', audience: 'b2b', gated: true,
        titleKey: 'smp_embed_counsel_title', descKey: 'smp_embed_counsel_desc',
      },
    ],
  },
  'pre-collection-pilot.html': {
    sectionAudience: 'b2b',
    cards: [{
      slug: 'diagnostic-report', audience: 'b2b', gated: false,
      titleKey: 'smp_embed_diagnostic_title', descKey: 'smp_embed_diagnostic_desc',
    }],
  },
  'solutions.html': {
    sectionAudience: 'b2b',
    cards: [{
      slug: 'diagnostic-report', audience: 'b2b', gated: false,
      titleKey: 'smp_embed_diagnostic_title', descKey: 'smp_embed_diagnostic_desc',
    }],
  },
};

// EN fallback literals — so crawlers without JS see real text, not data-page keys
const LITERAL = {
  smp_embed_eyebrow:           'Sample deliverable',
  smp_embed_pill_b2b:          'For companies',
  smp_embed_pill_b2c:          'Private clients',
  smp_embed_pill_shared:       'Companies & private clients',
  smp_embed_pill_open:         'Open sample',
  smp_embed_pill_gated:        'Gated \u2014 request access',
  smp_embed_cta_open:          'See the sample',
  smp_embed_cta_request:       'Request access',
  smp_embed_cta_library:       'Browse the full sample library',
  smp_embed_ar_leakage_title:  'AR Leakage Map',
  smp_embed_ar_leakage_desc:   'Aging-bucket ledger, leakage band, prioritized recovery roadmap \u2014 the document a CFO reviews before approving an AR consulting engagement. Representative engagement, numbers redacted.',
  smp_embed_counsel_title:     'Counsel-Ready Packet Index',
  smp_embed_counsel_desc:      'Tabbed file index your attorney can open and act on immediately \u2014 the standard we deliver to corporate legal ops for unpaid-invoice and civil matters. Representative engagement, parties redacted.',
  smp_embed_diagnostic_title:  '30-Day Diagnostic Report',
  smp_embed_diagnostic_desc:   'Diagnostic output for AR portfolios that do not qualify for the free Net Recovery Pilot \u2014 workflow findings, documentation gap log, prioritized roadmap.',
  smp_embed_contract_title:    'Contract Risk Flag Memo',
  smp_embed_contract_desc:     'Clause index, risk-flag log, plain-English summary, signature-stage go/no-go brief \u2014 watermarked sample of exactly what a contract review packet contains.',
  smp_embed_immigration_title: 'Immigration Evidence Index',
  smp_embed_immigration_desc:  'Evidence organization and cross-reference index for immigration filings (I-130 / I-485 / N-400 support). Not legal advice, not form selection \u2014 document organization only.',
  smp_embed_auto_title:        'Auto Deal Cost Breakdown',
  smp_embed_auto_desc:         'Line-by-line fee audit of a dealer purchase: add-ons flagged, disclosure gaps, total-cost-of-ownership projection. What you see before signing at the dealer.',
  smp_embed_smallclaims_title: 'Small Claims Chronology',
  smp_embed_smallclaims_desc:  'Dated event timeline, exhibits index, counsel-ready packet structure \u2014 the document organization we prepare for Florida small-claims matters (not legal representation).',
};

const CSS_LINK = '<link rel="stylesheet" href="assets/css/vcx-sample-embed.css">';
const START_TAG = '<!-- VCX_SAMPLE_EMBED:START -->';
const END_TAG   = '<!-- VCX_SAMPLE_EMBED:END -->';

function audiencePillKey(aud) {
  if (aud === 'b2b') return 'smp_embed_pill_b2b';
  if (aud === 'b2c') return 'smp_embed_pill_b2c';
  return 'smp_embed_pill_shared';
}

function renderCard(card) {
  const pillAudKey = audiencePillKey(card.audience);
  const pillAudTxt = LITERAL[pillAudKey];
  const pillStateKey = card.gated ? 'smp_embed_pill_gated' : 'smp_embed_pill_open';
  const pillStateTxt = LITERAL[pillStateKey];
  const pillStateClass = card.gated ? ' vcx-sample-embed__pill--gated' : '';

  // Step 3.5 — gated samples route their primary CTA to the request gate
  // page with ?s=<slug>; open samples route straight to the sample URL.
  const primaryHref = card.gated
    ? 'samples/request-gated-sample.html?s=' + card.slug
    : 'samples/' + card.slug + '.html';
  const primaryCtaKey = card.gated ? 'smp_embed_cta_request' : 'smp_embed_cta_open';
  const primaryCtaTxt = LITERAL[primaryCtaKey];
  const primaryDataGated = card.gated ? ' data-gated-cta="1"' : '';

  return [
    '<article class="vcx-sample-embed__card" data-sample="' + card.slug + '">',
      '<div class="vcx-sample-embed__meta">',
        '<span class="vcx-sample-embed__eyebrow" data-page="smp_embed_eyebrow">' + LITERAL.smp_embed_eyebrow + '</span>',
        '<span class="vcx-sample-embed__pill" data-page="' + pillAudKey + '">' + pillAudTxt + '</span>',
        '<span class="vcx-sample-embed__pill' + pillStateClass + '" data-page="' + pillStateKey + '">' + pillStateTxt + '</span>',
      '</div>',
      '<h2 class="vcx-sample-embed__title" data-page="' + card.titleKey + '">' + LITERAL[card.titleKey] + '</h2>',
      '<p class="vcx-sample-embed__desc" data-page="' + card.descKey + '">' + LITERAL[card.descKey] + '</p>',
      '<div class="vcx-sample-embed__ctas">',
        '<a class="vcx-sample-embed__cta" href="' + primaryHref + '" data-page="' + primaryCtaKey + '"' + primaryDataGated + '>' + primaryCtaTxt + '</a>',
        '<a class="vcx-sample-embed__cta-secondary" href="sample-deliverable.html" data-page="smp_embed_cta_library">' + LITERAL.smp_embed_cta_library + '</a>',
      '</div>',
    '</article>',
  ].join('');
}

function renderSection(conf) {
  const isPair = conf.cards.length > 1;
  const cls = 'vcx-sample-embed' + (isPair ? ' vcx-sample-embed--pair' : '');
  return [
    START_TAG,
    '<section class="' + cls + '" data-audience="' + conf.sectionAudience + '" aria-label="Sample deliverables">',
      '<div class="vcx-sample-embed__grid">',
        conf.cards.map(renderCard).join(''),
      '</div>',
    '</section>',
    END_TAG,
  ].join('');
}

function ensureStylesheet(html) {
  if (html.indexOf('assets/css/vcx-sample-embed.css') !== -1) return { html, added: false };
  // Insert before </head>
  const idx = html.indexOf('</head>');
  if (idx === -1) throw new Error('No </head> found');
  const out = html.slice(0, idx) + CSS_LINK + '\n' + html.slice(idx);
  return { html: out, added: true };
}

function findInsertionAnchor(html) {
  // Insert immediately before the first <footer ... (space, not slash)
  // that appears AFTER </header>. This puts the embed as the last
  // content section of the page.
  const headerEnd = html.indexOf('</header>');
  if (headerEnd === -1) throw new Error('No </header> anchor');
  const fromFooter = html.indexOf('<footer', headerEnd);
  if (fromFooter === -1) throw new Error('No <footer opening tag after </header>');
  return fromFooter;
}

function injectOrReplace(html, markup) {
  const startIdx = html.indexOf(START_TAG);
  if (startIdx !== -1) {
    const endIdx = html.indexOf(END_TAG, startIdx);
    if (endIdx === -1) throw new Error('START_TAG without END_TAG');
    const before = html.slice(0, startIdx);
    const after = html.slice(endIdx + END_TAG.length);
    return { html: before + markup + after, mode: 'replaced' };
  }
  const anchor = findInsertionAnchor(html);
  const out = html.slice(0, anchor) + markup + '\n' + html.slice(anchor);
  return { html: out, mode: 'inserted' };
}

function processPage(basename, conf) {
  const p = path.join(ROOT, basename);
  if (!fs.existsSync(p)) {
    console.log('  \u2717 MISSING FILE: ' + basename);
    return { ok: false };
  }
  let html = fs.readFileSync(p, 'utf8');
  const before = html;

  // 1. stylesheet
  const css = ensureStylesheet(html);
  html = css.html;

  // 2. inject / replace embed section
  const markup = renderSection(conf);
  const result = injectOrReplace(html, markup);
  html = result.html;

  if (html === before) {
    console.log('  = ' + basename + ' (no change — already current)');
    return { ok: true, changed: false };
  }

  if (!DRY) fs.writeFileSync(p, html, 'utf8');
  console.log('  \u2713 ' + basename + ' (' + result.mode
    + (css.added ? ' + CSS link added' : '')
    + ', ' + conf.cards.length + ' card' + (conf.cards.length > 1 ? 's' : '') + ')');
  return { ok: true, changed: true };
}

console.log('--- inject-sample-embed ' + (DRY ? '(DRY RUN)' : '') + ' ---');
let fail = 0;
let changed = 0;
for (const [basename, conf] of Object.entries(MAPPING)) {
  try {
    const r = processPage(basename, conf);
    if (!r.ok) fail++;
    if (r.changed) changed++;
  } catch (e) {
    console.log('  \u2717 ' + basename + ' — ' + e.message);
    fail++;
  }
}
console.log('\nTouched: ' + changed + '/' + Object.keys(MAPPING).length + ' page(s).');
console.log(fail ? '\nFAIL: ' + fail + ' error(s).' : '\nPASS.');
process.exit(fail ? 1 : 0);
