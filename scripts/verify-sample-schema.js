/* P03 Step 3.6 — Schema.org deep audit for the sample library surface.
 *
 * Validates:
 *   (A) 7 sample pages under /samples/<slug>.html each have:
 *       - CreativeWork block with all required fields
 *       - BreadcrumbList block (3-level: Home → Samples → Page)
 *       - isAccessibleForFree matches the ADR-008 gating roster
 *       - inLanguage contains en+ru+es (trilingual contract)
 *       - @id / url / dateCreated / dateModified / version / license / genre /
 *         educationalUse / creator / publisher present and well-formed
 *   (B) sample-deliverable.html (library hub) has:
 *       - Organization block
 *       - BreadcrumbList (2-level)
 *       - CollectionPage with exactly 7 hasPart CreativeWorks that mirror
 *         the ADR-008 roster + gating
 *   (C) samples/request-gated-sample.html (gate) has:
 *       - WebPage block
 *       - BreadcrumbList (3-level)
 *       - is consistent with noindex (no SearchAction, etc.)
 *
 * Exit 0 on PASS, 1 on any failure.
 *
 * Run: node scripts/verify-sample-schema.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

// ADR-008 roster — slug → expected gating (isAccessibleForFree = !gated)
const ROSTER = {
  'ar-leakage-map':             { gated: true,  audience: 'b2b' },
  'counsel-ready-packet':       { gated: true,  audience: 'b2b' },
  'diagnostic-report':          { gated: false, audience: 'b2b' },
  'contract-risk-memo':         { gated: false, audience: 'b2c' },
  'immigration-evidence-index': { gated: false, audience: 'b2c' },
  'auto-deal-cost-breakdown':   { gated: false, audience: 'b2c' },
  'small-claims-chronology':    { gated: false, audience: 'shared' },
};

const BASE_URL = 'https://vitacorexllc.com';

// Robust JSON-LD extractor (attribute order agnostic)
function extractLdJson(html) {
  const out = [];
  const re = /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const start = m.index + m[0].length;
    const end = html.indexOf('</script>', start);
    if (end === -1) continue;
    const body = html.slice(start, end);
    try { out.push(JSON.parse(body)); }
    catch (e) { out.push({ __parseError: e.message, __raw: body.slice(0, 120) }); }
  }
  return out;
}

let fail = 0;
function bad(msg) { console.log('  \u2717 ' + msg); fail++; }
function ok(msg)  { console.log('  \u2713 ' + msg); }

// ---------- (A) 7 SAMPLES ----------
console.log('\n=== (A) 7 sample pages: CreativeWork + BreadcrumbList ===');
Object.keys(ROSTER).forEach((slug) => {
  const cfg = ROSTER[slug];
  const p = path.join(ROOT, 'samples', slug + '.html');
  console.log('\n  --- ' + slug + ' (gated=' + cfg.gated + ') ---');
  if (!fs.existsSync(p)) { bad('file missing: ' + p); return; }
  const html = fs.readFileSync(p, 'utf8');
  const blocks = extractLdJson(html);
  if (!blocks.length) { bad('no JSON-LD on page'); return; }
  const parseFail = blocks.filter((b) => b.__parseError);
  if (parseFail.length) { parseFail.forEach((b) => bad('JSON-LD parse failed: ' + b.__parseError + ' near ' + b.__raw)); return; }

  const cw = blocks.find((b) => b['@type'] === 'CreativeWork');
  const bc = blocks.find((b) => b['@type'] === 'BreadcrumbList');
  if (!cw) { bad('missing CreativeWork block'); }
  if (!bc) { bad('missing BreadcrumbList block'); }

  if (cw) {
    // Required fields
    const required = ['@context', '@id', 'name', 'description', 'url', 'inLanguage',
      'isAccessibleForFree', 'educationalUse', 'genre', 'license',
      'dateCreated', 'dateModified', 'version', 'creator', 'publisher'];
    required.forEach((k) => { if (cw[k] === undefined) bad('CreativeWork missing field: ' + k); });

    // URL + @id shape
    const expectedUrl = BASE_URL + '/samples/' + slug + '.html';
    if (cw.url !== expectedUrl) bad('CreativeWork.url expected ' + expectedUrl + ' got ' + cw.url);
    if (cw['@id'] && cw['@id'].indexOf(expectedUrl) !== 0) bad('CreativeWork.@id should start with ' + expectedUrl);

    // Gating semantics
    const wantFree = !cfg.gated;
    if (cw.isAccessibleForFree !== wantFree)
      bad('isAccessibleForFree=' + cw.isAccessibleForFree + ' expected ' + wantFree);

    // Trilingual inLanguage
    const langs = Array.isArray(cw.inLanguage) ? cw.inLanguage : [cw.inLanguage];
    ['en', 'ru', 'es'].forEach((l) => { if (langs.indexOf(l) === -1) bad('inLanguage missing ' + l); });

    // creator / publisher shape
    if (!cw.creator || cw.creator['@type'] !== 'Organization') bad('creator must be Organization');
    if (!cw.publisher || cw.publisher['@type'] !== 'Organization') bad('publisher must be Organization');

    // license + genre + educationalUse literal check
    if (typeof cw.license !== 'string' || cw.license.indexOf(BASE_URL) !== 0) bad('license must be VCX URL');
    if (cw.genre !== 'redacted-sample') bad('genre must be redacted-sample, got ' + cw.genre);
    if (cw.educationalUse !== 'procurement-evaluation') bad('educationalUse must be procurement-evaluation');

    // dateCreated / dateModified ISO-date shape
    [['dateCreated', cw.dateCreated], ['dateModified', cw.dateModified]].forEach(([k, v]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) bad(k + ' must be YYYY-MM-DD, got ' + v);
    });
    if (!/^\d+\.\d+/.test(cw.version || '')) bad('version must be MAJOR.MINOR, got ' + cw.version);

    ok('CreativeWork shape valid (gated=' + cfg.gated + ' · trilingual · all fields)');
  }

  if (bc) {
    const items = bc.itemListElement || [];
    if (items.length !== 3) bad('BreadcrumbList must have 3 levels, got ' + items.length);
    if (items[0] && items[0].name !== 'Home') bad('breadcrumb[0].name expected Home');
    if (items[1] && items[1].name !== 'Samples') bad('breadcrumb[1].name expected Samples');
    // items[2].name is sample-specific → just check it exists
    if (items[2] && !items[2].name) bad('breadcrumb[2].name missing');
    const expectedUrl = BASE_URL + '/samples/' + slug + '.html';
    if (items[2] && items[2].item !== expectedUrl) bad('breadcrumb[2].item expected ' + expectedUrl + ' got ' + items[2].item);
    if (items[0] && items[0].item !== BASE_URL + '/') bad('breadcrumb[0].item expected ' + BASE_URL + '/');
    if (items[1] && items[1].item !== BASE_URL + '/sample-deliverable.html') bad('breadcrumb[1].item expected /sample-deliverable.html');
    ok('BreadcrumbList 3-level chain valid');
  }
});

// ---------- (B) LIBRARY HUB ----------
console.log('\n=== (B) Library hub: Organization + BreadcrumbList + CollectionPage ===');
{
  const p = path.join(ROOT, 'sample-deliverable.html');
  if (!fs.existsSync(p)) { bad('sample-deliverable.html missing'); }
  else {
    const html = fs.readFileSync(p, 'utf8');
    const blocks = extractLdJson(html);
    const org = blocks.find((b) => b['@type'] === 'Organization');
    const bc  = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    const cp  = blocks.find((b) => b['@type'] === 'CollectionPage');
    if (!org) bad('hub missing Organization'); else ok('Organization present');
    if (!bc)  bad('hub missing BreadcrumbList');
    else {
      const items = bc.itemListElement || [];
      if (items.length !== 2) bad('hub BreadcrumbList must be 2-level, got ' + items.length);
      else ok('Hub BreadcrumbList 2-level chain valid');
    }
    if (!cp) bad('hub missing CollectionPage');
    else {
      const parts = Array.isArray(cp.hasPart) ? cp.hasPart : [];
      if (parts.length !== 7) bad('CollectionPage hasPart must be 7, got ' + parts.length);
      else {
        // Each hasPart URL + isAccessibleForFree must match roster
        parts.forEach((w) => {
          if (w['@type'] !== 'CreativeWork') bad('hasPart[*] @type must be CreativeWork');
          const slug = (w.url || '').match(/\/samples\/([a-z0-9-]+)\.html$/);
          if (!slug) { bad('hasPart.url malformed: ' + w.url); return; }
          const cfg = ROSTER[slug[1]];
          if (!cfg) { bad('hasPart references unknown slug: ' + slug[1]); return; }
          const wantFree = !cfg.gated;
          if (w.isAccessibleForFree !== wantFree)
            bad('hasPart[' + slug[1] + '].isAccessibleForFree=' + w.isAccessibleForFree + ' expected ' + wantFree);
        });
        // All 7 roster slugs must appear
        const urls = parts.map((w) => w.url);
        Object.keys(ROSTER).forEach((slug) => {
          const u = BASE_URL + '/samples/' + slug + '.html';
          if (urls.indexOf(u) === -1) bad('CollectionPage missing roster slug: ' + slug);
        });
        ok('CollectionPage hasPart = 7 CreativeWorks, all roster slugs present + gating matches');
      }
      // inLanguage trilingual
      const langs = Array.isArray(cp.inLanguage) ? cp.inLanguage : [];
      ['en', 'ru', 'es'].forEach((l) => { if (langs.indexOf(l) === -1) bad('CollectionPage.inLanguage missing ' + l); });
    }
  }
}

// ---------- (C) GATE PAGE ----------
console.log('\n=== (C) Gate page: WebPage + BreadcrumbList ===');
{
  const p = path.join(ROOT, 'samples', 'request-gated-sample.html');
  if (!fs.existsSync(p)) { bad('gate page missing'); }
  else {
    const html = fs.readFileSync(p, 'utf8');
    const blocks = extractLdJson(html);
    const wp = blocks.find((b) => b['@type'] === 'WebPage');
    const bc = blocks.find((b) => b['@type'] === 'BreadcrumbList');
    if (!wp) bad('gate missing WebPage'); else ok('WebPage block present');
    if (!bc) bad('gate missing BreadcrumbList');
    else {
      const items = bc.itemListElement || [];
      if (items.length !== 3) bad('gate BreadcrumbList must be 3-level, got ' + items.length);
      else ok('Gate BreadcrumbList 3-level chain valid');
    }
    // robots must be noindex (sanity tie-in)
    const robots = (html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i) || [])[1] || '';
    if (!/noindex/i.test(robots)) bad('gate robots must include noindex, got "' + robots + '"');
    else ok('robots=noindex sanity confirmed');
  }
}

console.log('\n' + (fail ? '\nFAIL: ' + fail + ' issue(s).' : '\nPASS.'));
process.exit(fail ? 1 : 0);
