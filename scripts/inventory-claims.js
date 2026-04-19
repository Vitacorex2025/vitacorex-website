#!/usr/bin/env node
/**
 * scripts/inventory-claims.js — P04 Step 4.1 claims inventory sweep
 * Governed by: docs/adr/ADR-007-claims-inventory-classification.md (§inventory-procedure)
 *
 * Scans the marketing-surface HTML for quantitative claim candidates:
 *   - percentages              `\d+%`
 *   - dollar amounts           `$340K`, `$1.2M`, `$2,500`
 *   - before/after arrows      `62 → 41`, `58 → 36`
 *   - outcome verbs            recovered · reduced · eliminated · saved · rescued · improved · boosted · increased
 *   - hedge/superlative words  "up to" · "as much as" · typical · proven · guaranteed · best · leading · #1
 *   - time-bound outcomes      "in 90 days", "in six months"
 *   - "X of N" fractions       `7 of 10`
 *
 * EXCLUDES (per ADR-007 §out-of-scope):
 *   - samples/**                 (ADR-008 governs)
 *   - pricing-and-engagement-tiers.html  (ADR-005 governs)
 *   - app/**                     (tool surface, not marketing)
 *   - utility pages              (404, thank-you, google/yandex verification, app shell)
 *
 * Script output:
 *   docs/claims-inventory.md    (human-reviewed table for Step 4.2 classification pass)
 *
 * Exit 0 on success, exit 1 on read/write error.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ---- EXCLUSION (per ADR-007 §out-of-scope) ---------------------------------

const EXCLUDE = [
  /^samples\//,                                      // ADR-008
  /^pricing-and-engagement-tiers\.html$/,            // ADR-005
  /^app\//,                                          // tool surface
  /^404\.html$/,                                     // utility
  /^thank-you\.html$/,                               // utility
  /^google[0-9a-f]+\.html$/,                         // SC verification
  /^yandex_[0-9a-f]+\.html$/,                        // SC verification
  /^app\.html$/,                                     // app shell
];

// ---- PATTERN DEFINITIONS ---------------------------------------------------

const PATTERNS = [
  { id: 'pct',   re: /\b\d{1,3}(?:\.\d+)?\s*%/g },
  { id: 'money', re: /\$\s?\d{1,3}(?:,\d{3})*(?:\.\d+)?(?:\s?[KMB])?/g },
  { id: 'arrow', re: /\b\d{2,}\s*(?:→|-&gt;|->|−|&minus;)\s*\d{2,}\b/g },
  { id: 'verb',  re: /\b(recovered|eliminated|guaranteed|boosts?|boosted|increased|reduced|saved|improved|rescues?|rescued)\b/gi },
  { id: 'hedge', re: /\b(up to|as much as|typically|typical|average|proven|guaranteed|best|leading|#1|eliminates?|prevents?)\b/gi },
  { id: 'xofn',  re: /\b\d+\s*of\s*\d+\b/g },
  { id: 'timed', re: /\bin\s+\d+\s*(days?|weeks?|months?|hours?)\b/gi },
];

// ---- CLASSIFIER DEFAULTS (per ADR-007 §classification-defaults) -----------

// ADR-005 pricing policy (not P04 outcome)
const POLICY_PCT   = /\b(15|18|22\.5)\s*%/;
const POLICY_MONEY = /\$\s?(149|219|349|649|725|1,?250|2,?500|3,?500|8,?500|110|125|299|49)\b/;

// Risky signals
const RISKY_WORDS = /\b(guaranteed|eliminates?|prevents?|proven|best|leading|#1|as much as|up to)\b/i;

// Metric-container context classes (likely outcome-metric block)
const OUTCOME_METRIC_CTX = /(vcx-impact-number|vcx-bento-big-number|vcx-example-metric|vcx-case-kpi|vcx-case-hero|csfl-|cssa-|case-study-hero|hero-stat|counter)/;

// Case-study pages → composite by definition
const CASE_STUDY_PAGE = /^case-study-/;

// ---- HTML STRIPPING --------------------------------------------------------

function stripScriptsAndStyles(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<style\b[\s\S]*?<\/style>/gi,   (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<!--[\s\S]*?-->/g,              (m) => m.replace(/[^\n]/g, ' '));
}

function stripTags(s) {
  return s.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
}

function decodeEntities(s) {
  return s
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rarr;/g, '→')
    .replace(/&minus;/g, '−')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

// ---- CLASSIFIER ------------------------------------------------------------

function classifyRow(match, patternId, filename, rawLine) {
  const l = rawLine.toLowerCase();

  // OUT OF SCOPE — ADR-005 pricing policy
  if (patternId === 'pct' && POLICY_PCT.test(match) && /success fee|recovered cash|aging|recovery/.test(l)) {
    return { klass: 'out-of-scope', action: 'skip — ADR-005 pricing policy (not P04 outcome)' };
  }
  if (patternId === 'money' && POLICY_MONEY.test(match)) {
    return { klass: 'out-of-scope', action: 'skip — ADR-005 pricing floor (not P04 outcome)' };
  }

  // RISKY — guarantees / superlatives / outcome promises
  if (RISKY_WORDS.test(match)) {
    return { klass: 'risky', action: 'REMOVE or rewrite to process statement per ADR-007 §rewrite-rubric' };
  }

  // COMPOSITE CASE STUDY — by page
  if (CASE_STUDY_PAGE.test(filename)) {
    return { klass: 'illustrative', action: 'Composite case-study — top banner + per-KPI caveat per ADR-007 §composite-case-study-contract' };
  }

  // ILLUSTRATIVE — outcome-metric container context
  if (OUTCOME_METRIC_CTX.test(rawLine)) {
    return { klass: 'illustrative', action: 'Add `.vcx-claim-caveat` within reading distance (inline micro-label or paragraph line)' };
  }

  // NEEDS SOURCE — "X% of [population]"
  if (patternId === 'pct' && /\b(of balances|of accounts|of payments|of invoices|of customers|of adults|of households|of renewals)\b/i.test(rawLine)) {
    return { klass: 'needs-source', action: 'Research citable source per ADR-007 §source-allowlist; if found → citable + <cite>; else → illustrative with caveat' };
  }

  // ILLUSTRATIVE — time-bound outcome
  if ((patternId === 'money' && /\b\d+\s*(day|week|month)s?\b/i.test(rawLine)) || patternId === 'timed') {
    return { klass: 'illustrative', action: 'Composite timing — add caveat within reading distance' };
  }

  // Unclassified — operator decision
  if (patternId === 'verb' || patternId === 'hedge') {
    return { klass: 'unclassified', action: 'Operator classify — may be harmless process language or outcome promise' };
  }

  return { klass: 'unclassified', action: 'Operator classify: citable / illustrative / internal / risky' };
}

// ---- SCANNER ---------------------------------------------------------------

function scanPage(relPath) {
  const abs = path.join(ROOT, relPath);
  const raw = fs.readFileSync(abs, 'utf8');
  const cleaned = stripScriptsAndStyles(raw);
  const lines = cleaned.split('\n');
  const rows = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const text = decodeEntities(stripTags(rawLine)).trim();
    if (text.length < 3) continue;

    for (const p of PATTERNS) {
      p.re.lastIndex = 0;
      let m;
      while ((m = p.re.exec(text)) !== null) {
        const match = m[0];
        const result = classifyRow(match, p.id, relPath, rawLine);
        if (result.klass === 'out-of-scope') continue;
        rows.push({
          page: relPath,
          line: i + 1,
          pattern: p.id,
          match,
          snippet: text.slice(0, 100),
          klass: result.klass,
          action: result.action,
        });
      }
    }
  }

  return rows;
}

function listPages() {
  return fs.readdirSync(ROOT, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.html'))
    .map((e) => e.name)
    .filter((n) => !EXCLUDE.some((r) => r.test(n)))
    .sort();
}

// ---- MARKDOWN EMITTER ------------------------------------------------------

function emit(rows, pages) {
  const byClass = {};
  const byPage = {};
  const byPattern = {};
  for (const r of rows) {
    byClass[r.klass] = (byClass[r.klass] || 0) + 1;
    byPage[r.page] = (byPage[r.page] || 0) + 1;
    byPattern[r.pattern] = (byPattern[r.pattern] || 0) + 1;
  }

  const L = [];
  L.push('---');
  L.push('title: Claims Inventory (per ADR-007)');
  L.push('adr: ADR-007');
  L.push('status: live (Step 4.1 complete; awaiting Step 4.2 classification pass)');
  L.push('generated_by: scripts/inventory-claims.js');
  L.push('created: 2026-04-19');
  L.push('last_reviewed: 2026-04-19');
  L.push(`pages_scanned: ${pages.length}`);
  L.push(`total_candidates: ${rows.length}`);
  L.push('tags: [claims, proof, inventory, adr-007, p04]');
  L.push('---');
  L.push('');
  L.push('# Claims Inventory (per ADR-007)');
  L.push('');
  L.push('> Auto-generated by `scripts/inventory-claims.js` (P04 Step 4.1). Scope per ADR-007 §scope: marketing surface only. **Excludes** samples (ADR-008), pricing ladder (ADR-005), `app/*` (tool surface), utility pages.');
  L.push('');
  L.push('## Summary');
  L.push('');
  L.push(`- **Pages scanned**: ${pages.length}`);
  L.push(`- **Candidate claims found**: ${rows.length}`);
  L.push('- Every row is a **candidate**. Step 4.2 assigns the **Final class** (Citable / Illustrative / Internal / Risky). Step 4.3 applies the rewrite. Step 4.4 sources Citable. Step 4.5 wraps composite case studies.');
  L.push('');
  L.push('### By default class');
  L.push('');
  L.push('| Default class | Count | Step 4.2/4.3 next action |');
  L.push('|---------------|-------|---------------------------|');
  const classOrder = ['risky', 'illustrative', 'needs-source', 'unclassified'];
  const nextByClass = {
    'risky': 'REMOVE or rewrite to process statement per ADR-007 §rewrite-rubric',
    'illustrative': 'Add `.vcx-claim-caveat` (inline) or composite banner (case studies)',
    'needs-source': 'Research source per ADR-007 §source-allowlist; elevate → citable or demote → illustrative',
    'unclassified': 'Operator review; assign final class',
  };
  for (const k of classOrder) {
    if (byClass[k]) L.push(`| **${k}** | ${byClass[k]} | ${nextByClass[k]} |`);
  }
  L.push('');
  L.push('### By pattern');
  L.push('');
  const patternDesc = {
    pct:   'percentages (e.g. `37%`, `94%`)',
    money: 'dollar amounts (`$340K`, `$1.2M`)',
    arrow: 'before/after arrows (`62 → 41`)',
    verb:  'outcome verbs (recovered · reduced · saved · eliminated · rescued)',
    hedge: 'hedges / superlatives (up to · typical · proven · leading)',
    xofn:  '"X of N" fractions (`7 of 10`)',
    timed: 'time-bound outcomes (`in 90 days`)',
  };
  L.push('| Pattern | Count | What it matches |');
  L.push('|---------|-------|-----------------|');
  for (const p of ['pct', 'money', 'arrow', 'verb', 'hedge', 'xofn', 'timed']) {
    if (byPattern[p]) L.push(`| ${p} | ${byPattern[p]} | ${patternDesc[p]} |`);
  }
  L.push('');
  L.push('### By page (sorted, most claims first)');
  L.push('');
  L.push('| Page | Candidates |');
  L.push('|------|------------|');
  const sortedPages = Object.entries(byPage).sort((a, b) => b[1] - a[1]);
  for (const [p, n] of sortedPages) L.push(`| \`${p}\` | ${n} |`);
  L.push('');
  L.push('## Classification workflow (Step 4.2)');
  L.push('');
  L.push('For each row below:');
  L.push('1. Read the `Snippet` to see context.');
  L.push('2. Override `Default class` in the `Final class` column if needed. Valid values: `citable` · `illustrative` · `internal` · `risky` · `out-of-scope`.');
  L.push('3. If `Final class = citable`, fill `Evidence ref` with the citation ID (e.g. `cite-cfpb-medical-debt-2024`) and add the row to `docs/claims-evidence.md`.');
  L.push('4. During Step 4.3 rewrite, fill `Resolved` with ISO date + commit hash.');
  L.push('');
  L.push('## Rows');
  L.push('');
  L.push('| # | Page | Line | Pattern | Match | Snippet | Default class | Final class | Evidence ref | Rewrite / action | Resolved |');
  L.push('|---|------|------|---------|-------|---------|---------------|-------------|--------------|------------------|----------|');
  const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ').replace(/`/g, '\\`');
  rows.forEach((r, i) => {
    L.push(`| ${i + 1} | \`${r.page}\` | ${r.line} | ${r.pattern} | \`${esc(r.match).slice(0, 40)}\` | ${esc(r.snippet).slice(0, 100)} | ${r.klass} | | | ${esc(r.action)} | |`);
  });
  L.push('');
  L.push('---');
  L.push('');
  L.push('## Rewrite log');
  L.push('');
  L.push('### 2026-04-19 — Step 4.1 inventory generated');
  L.push('');
  L.push(`- \`scripts/inventory-claims.js\` scanned **${pages.length} marketing pages**`);
  L.push(`- Found **${rows.length} candidate claims** across ${Object.keys(byPage).length} distinct pages`);
  L.push(`- Default classifier pre-suggested: ` + classOrder.filter((k) => byClass[k]).map((k) => `${byClass[k]} ${k}`).join(' · '));
  L.push(`- Out-of-scope rows (ADR-005 pricing + ADR-008 sample-watermark contexts) filtered at scan time, not counted here`);
  L.push('');
  L.push('*(Step 4.2 classification entries land here as operator resolves rows. Step 4.3+ rewrite commits land here too.)*');
  L.push('');

  return L.join('\n') + '\n';
}

// ---- MAIN ------------------------------------------------------------------

function main() {
  const pages = listPages();
  const all = [];
  for (const p of pages) {
    try {
      all.push(...scanPage(p));
    } catch (err) {
      console.error(`[inventory-claims] FAILED to scan ${p}: ${err.message}`);
      process.exit(1);
    }
  }

  // Deduplicate
  const seen = new Set();
  const deduped = [];
  for (const r of all) {
    const key = `${r.page}::${r.line}::${r.match}::${r.pattern}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(r);
    }
  }

  // Emit
  const md = emit(deduped, pages);
  const outPath = path.join(ROOT, 'docs', 'claims-inventory.md');
  fs.writeFileSync(outPath, md, 'utf8');

  // Summary
  const byClass = {};
  for (const r of deduped) byClass[r.klass] = (byClass[r.klass] || 0) + 1;
  console.log(`[inventory-claims] Scanned ${pages.length} marketing pages`);
  console.log(`[inventory-claims] Candidate claims: ${deduped.length}`);
  console.log(`[inventory-claims] By default class:`);
  for (const [k, v] of Object.entries(byClass).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k}: ${v}`);
  }
  console.log(`[inventory-claims] Wrote ${outPath}`);
}

main();
