#!/usr/bin/env node
/**
 * scripts/audit-ctas.js — P17 Step 17.1 CTA inventory sweep
 * Governed by: Phases/P17 Broken Buttons and CTA Audit.md (§Step 17.1)
 *
 * Walks every HTML file in the repo (except verification stubs) and emits a
 * structured row per interactive element. Consumer:
 *   - Step 17.2 `scripts/verify-cta-targets.js` reads the inventory and
 *     HEAD-checks every target.
 *   - Step 17.3 manual triage uses the broken subset.
 *
 * Captured elements:
 *   - <a href="...">                    — navigation CTAs
 *   - <button type="submit|button|...">  — action CTAs
 *   - <input type="submit|button|image"> — form CTAs
 *   - <form action="...">                — form targets (context)
 *   - [role="button"] on non-button tags — rare but interactive
 *
 * Per-row metadata:
 *   file · line · element · label · target · category · audience · flags
 *
 * Categories (mutually exclusive, forced — zero "unknown" rows on success):
 *   primary-nav · footer · in-body · form-submit · external · mailto · tel ·
 *   anchor · action-script · media-play
 *
 * Audience (from <body data-audience="..."> set by P02.4):
 *   b2b · b2c · shared · none
 *
 * Exit codes:
 *   0 — OK, inventory written
 *   1 — I/O or parse error
 *   2 — unclassified rows remain (quality gate per phase file success criteria)
 *
 * Idempotent: same repo state → byte-identical output.
 * Run: node scripts/audit-ctas.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'qa', 'cta-inventory.md');

// Directories skipped entirely (tooling, not shippable HTML)
const SKIP_DIRS = new Set(['node_modules', '.git', '.tmp', 'scripts', 'docs', 'assets', 'vcx-api']);

// File patterns excluded even under walked dirs
const EXCLUDE_FILE = [
  /^google[0-9a-f]+\.html$/,                      // Search Console verification
  /^yandex_[0-9a-f]+\.html$/,                     // Yandex verification
  /^BingSiteAuth\.xml$/,                          // Bing verification (not HTML anyway)
];

// Host considered "internal" for external/internal classification
const INTERNAL_HOST = /(^|\.)vitacorexllc\.com$/i;

// ---- FS WALK ---------------------------------------------------------------

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
      continue;
    }
    if (!ent.name.endsWith('.html')) continue;
    if (EXCLUDE_FILE.some((re) => re.test(ent.name))) continue;
    out.push(path.join(dir, ent.name));
  }
  return out;
}

// ---- HTML UTILITIES --------------------------------------------------------

function stripCommentsAndMachineOnly(html) {
  // Preserve line counts by replacing non-newlines with spaces inside stripped regions.
  return html
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<script\b[\s\S]*?<\/script>/gi, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<style\b[\s\S]*?<\/style>/gi, (m) => m.replace(/[^\n]/g, ' '));
}

function lineOf(src, idx) {
  // 1-indexed. Count newlines up to (but not including) the match byte-offset.
  let n = 1;
  for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

function attr(openTag, name) {
  // Pull a single attribute value. Supports "..." and '...' quoting; returns null if absent.
  const re = new RegExp('\\b' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i');
  const m = openTag.match(re);
  if (!m) return null;
  return (m[1] ?? m[2] ?? m[3] ?? '').trim();
}

function dataAttrs(openTag) {
  // Extract every data-* attribute. Returns an array of "data-foo=bar" strings.
  // Used to give triage reviewers context on event-delegated handlers (data-lang,
  // data-action, data-route, etc. typically mean "wired via JS event delegation").
  const out = [];
  const re = /\bdata-([a-z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let m;
  while ((m = re.exec(openTag)) !== null) {
    // Skip i18n markers — not handler signals, just translation hooks
    if (/^i18n(-|$)/.test(m[1])) continue;
    if (/^common$/.test(m[1])) continue; // data-common is i18n-style key
    if (/^page$/.test(m[1])) continue;   // data-page same
    if (/^shared$/.test(m[1])) continue;
    const val = (m[2] ?? m[3] ?? m[4] ?? '').trim();
    out.push(`data-${m[1]}=${val || '""'}`);
  }
  return out;
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

function collapseWs(s) {
  return s.replace(/\s+/g, ' ').trim();
}

function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + '…';
}

function labelFromInner(inner, openTag) {
  // Prefer visible text; fall back to aria-label, then alt of first <img>, then value attr.
  const text = collapseWs(decodeEntities(stripTags(inner)));
  if (text) return truncate(text, 60);
  const aria = attr(openTag, 'aria-label');
  if (aria) return truncate(collapseWs(aria), 60);
  const imgAlt = inner.match(/<img\b[^>]*\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (imgAlt) {
    const v = (imgAlt[2] ?? imgAlt[3] ?? '').trim();
    if (v) return truncate(collapseWs(v), 60);
  }
  const title = attr(openTag, 'title');
  if (title) return truncate(collapseWs(title), 60);
  return '(no label)';
}

// ---- CATEGORY CLASSIFIER ---------------------------------------------------

function categorize({ tag, href, onclick, type, inNav, inFooter, role, target }) {
  if (tag === 'form') return 'form-submit'; // captured as submit context
  if (tag === 'input') {
    if (/^(submit|image)$/i.test(type || '')) return 'form-submit';
    if (/^button$/i.test(type || '')) return onclick ? 'action-script' : 'in-body';
    return 'in-body';
  }
  if (tag === 'button') {
    if (/^submit$/i.test(type || '') || !type) return 'form-submit'; // default type in <form>
    if (onclick) return 'action-script';
    return 'action-script'; // button w/o submit + w/o onclick is still interactive by label
  }
  // <a> or [role=button]
  if (href != null) {
    if (/^mailto:/i.test(href)) return 'mailto';
    if (/^tel:/i.test(href)) return 'tel';
    if (/^javascript:/i.test(href)) return 'action-script';
    if (/^#/.test(href)) return 'anchor';
    if (/^https?:/i.test(href)) {
      try {
        const u = new URL(href);
        if (!INTERNAL_HOST.test(u.hostname)) return 'external';
        // same-host absolute → treat as internal in-body/nav/footer
      } catch (_) {
        return 'external'; // malformed absolute → flag as external for triage
      }
    }
    if (inNav) return 'primary-nav';
    if (inFooter) return 'footer';
    return 'in-body';
  }
  if (onclick) return 'action-script';
  if (role === 'button') return 'action-script';
  return 'unknown';
}

// ---- REGION DETECTION (nav vs footer vs body) ------------------------------

function buildRegionMap(src) {
  // Produces an array of {start, end, kind} spans where kind ∈ {nav, header, footer}.
  // A match is in the region if its index falls inside any span of that kind.
  // PRIORITY ORDER: footer > header > nav — matters when nested (e.g. the site
  // template wraps footer links in `<footer><nav class="footer-links">...</nav></footer>`;
  // we want those counted as `footer`, not `primary-nav`). regionOf() returns the
  // first matching span, so footer spans are pushed first, header next, nav last.
  const spans = [];
  const pairs = [
    ['footer', /<footer\b[\s\S]*?<\/footer>/gi],
    ['header', /<header\b[\s\S]*?<\/header>/gi],
    ['nav', /<nav\b[\s\S]*?<\/nav>/gi],
  ];
  for (const [kind, re] of pairs) {
    let m;
    while ((m = re.exec(src)) !== null) {
      spans.push({ start: m.index, end: m.index + m[0].length, kind });
    }
  }
  return spans;
}

function regionOf(spans, idx) {
  for (const s of spans) {
    if (idx >= s.start && idx < s.end) return s.kind;
  }
  return null;
}

// ---- FORM CONTEXT (for submit buttons) -------------------------------------

function buildFormMap(src) {
  // Spans covering <form>...</form>; each gets the form's action attr.
  const spans = [];
  const re = /<form\b([^>]*)>([\s\S]*?)<\/form>/gi;
  let m;
  while ((m = re.exec(src)) !== null) {
    spans.push({
      start: m.index,
      end: m.index + m[0].length,
      action: attr('<form ' + m[1] + '>', 'action') || '',
      method: attr('<form ' + m[1] + '>', 'method') || 'GET',
    });
  }
  return spans;
}

function formOf(spans, idx) {
  for (const s of spans) {
    if (idx >= s.start && idx < s.end) return s;
  }
  return null;
}

// ---- MAIN EXTRACTION -------------------------------------------------------

function auditFile(absPath) {
  const raw = fs.readFileSync(absPath, 'utf8');
  const src = stripCommentsAndMachineOnly(raw); // preserves line numbers

  // Body audience
  const bodyMatch = src.match(/<body\b[^>]*data-audience\s*=\s*"([^"]+)"/i);
  const audience = bodyMatch ? bodyMatch[1] : 'none';

  const regions = buildRegionMap(src);
  const forms = buildFormMap(src);

  const rows = [];

  // <a href="..."> (or <a> without href)
  const reA = /<a\b([^>]*?)>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = reA.exec(src)) !== null) {
    const openTag = '<a ' + m[1] + '>';
    const href = attr(openTag, 'href');
    const onclick = attr(openTag, 'onclick');
    const role = attr(openTag, 'role');
    const target = attr(openTag, 'target');
    const label = labelFromInner(m[2], openTag);
    const idx = m.index;
    const regionKind = regionOf(regions, idx);
    const inNav = regionKind === 'nav' || regionKind === 'header';
    const inFooter = regionKind === 'footer';
    const category = categorize({ tag: 'a', href, onclick, inNav, inFooter, role, target });
    rows.push({
      line: lineOf(src, idx),
      element: 'a',
      label,
      target: href ?? onclick ?? '(none)',
      category,
      audience,
      flags: [
        target === '_blank' ? 'new-tab' : null,
        attr(openTag, 'rel')?.includes('noopener') ? null : (target === '_blank' ? 'missing-noopener' : null),
        href == null && !onclick && role !== 'button' ? 'dead-anchor' : null,
      ].filter(Boolean),
    });
  }

  // <button ...>label</button>
  const reBtn = /<button\b([^>]*?)>([\s\S]*?)<\/button>/gi;
  while ((m = reBtn.exec(src)) !== null) {
    const openTag = '<button ' + m[1] + '>';
    const type = attr(openTag, 'type');
    const onclick = attr(openTag, 'onclick');
    const dataAction = attr(openTag, 'data-action') || attr(openTag, 'data-route') || attr(openTag, 'data-target');
    const dAttrs = dataAttrs(openTag);
    const ariaCtl = attr(openTag, 'aria-controls');   // ARIA pattern: controls another element
    const ariaExp = attr(openTag, 'aria-expanded');    // ARIA pattern: toggle state
    const hasAria = !!(ariaCtl || ariaExp);
    const label = labelFromInner(m[2], openTag);
    const idx = m.index;
    const regionKind = regionOf(regions, idx);
    const inNav = regionKind === 'nav' || regionKind === 'header';
    const inFooter = regionKind === 'footer';
    const form = formOf(forms, idx);
    const wired = onclick || form || dataAction || dAttrs.length > 0 || hasAria;
    let category = categorize({ tag: 'button', onclick, type, inNav, inFooter });
    let target = onclick ?? dataAction ?? '(handler)';
    if (category === 'form-submit' && form) target = form.action || '(self)';
    rows.push({
      line: lineOf(src, idx),
      element: 'button',
      label,
      target,
      category,
      audience,
      flags: [
        !wired ? 'no-handler' : null,
        !onclick && !form && dAttrs.length > 0 ? `delegated:${dAttrs.slice(0, 2).join(',')}` : null,
        !onclick && !form && dAttrs.length === 0 && hasAria ? `aria-wired:${ariaCtl ? 'controls' : 'expanded'}` : null,
        form ? `form-method:${form.method}` : null,
      ].filter(Boolean),
    });
  }

  // <input type="submit|button|image" ...>
  const reInput = /<input\b([^>]*?)\/?>/gi;
  while ((m = reInput.exec(src)) !== null) {
    const openTag = '<input ' + m[1] + '>';
    const type = attr(openTag, 'type');
    if (!/^(submit|button|image)$/i.test(type || '')) continue;
    const onclick = attr(openTag, 'onclick');
    const value = attr(openTag, 'value');
    const ariaLabel = attr(openTag, 'aria-label');
    const label = collapseWs(decodeEntities(value || ariaLabel || (type === 'image' ? (attr(openTag, 'alt') || '(image button)') : '(no label)')));
    const idx = m.index;
    const regionKind = regionOf(regions, idx);
    const inNav = regionKind === 'nav' || regionKind === 'header';
    const inFooter = regionKind === 'footer';
    const form = formOf(forms, idx);
    const category = categorize({ tag: 'input', onclick, type, inNav, inFooter });
    let target = onclick ?? '(form-action)';
    if ((category === 'form-submit') && form) target = form.action || '(self)';
    rows.push({
      line: lineOf(src, idx),
      element: `input[type=${(type || '').toLowerCase()}]`,
      label: truncate(label, 60),
      target,
      category,
      audience,
      flags: [
        !onclick && !form ? 'orphan-input' : null,
      ].filter(Boolean),
    });
  }

  // Non-button/non-a [role="button"] carriers
  const reRoleBtn = /<([a-z0-9]+)\b([^>]*\brole\s*=\s*"button"[^>]*)>([\s\S]*?)<\/\1>/gi;
  while ((m = reRoleBtn.exec(src)) !== null) {
    const tag = m[1].toLowerCase();
    if (tag === 'a' || tag === 'button') continue; // already captured
    const openTag = `<${tag} ${m[2]}>`;
    const onclick = attr(openTag, 'onclick');
    const dataAction = attr(openTag, 'data-action') || attr(openTag, 'data-route');
    const dAttrs = dataAttrs(openTag);
    const label = labelFromInner(m[3], openTag);
    const idx = m.index;
    const regionKind = regionOf(regions, idx);
    const inNav = regionKind === 'nav' || regionKind === 'header';
    const inFooter = regionKind === 'footer';
    rows.push({
      line: lineOf(src, idx),
      element: `${tag}[role=button]`,
      label,
      target: onclick ?? dataAction ?? '(handler)',
      category: categorize({ tag: 'a', href: null, onclick, inNav, inFooter, role: 'button' }),
      audience,
      flags: [
        !onclick && !dataAction && dAttrs.length === 0 ? 'no-handler' : null,
        !onclick && dAttrs.length > 0 ? `delegated:${dAttrs.slice(0, 2).join(',')}` : null,
      ].filter(Boolean),
    });
  }

  // <form> itself — capture as one row for the form target, keyed to action attr
  const reForm = /<form\b([^>]*?)>/gi;
  while ((m = reForm.exec(src)) !== null) {
    const openTag = '<form ' + m[1] + '>';
    const action = attr(openTag, 'action');
    const method = attr(openTag, 'method') || 'GET';
    const name = attr(openTag, 'name') || attr(openTag, 'id') || '(unnamed)';
    const idx = m.index;
    rows.push({
      line: lineOf(src, idx),
      element: 'form',
      label: `form:${name}`,
      target: action || '(self)',
      category: 'form-submit',
      audience,
      flags: [
        !action ? 'self-post' : null,
        method.toUpperCase(),
      ].filter(Boolean),
    });
  }

  // Sort by line for stable output
  rows.sort((a, b) => a.line - b.line);
  return rows;
}

// ---- MARKDOWN ESCAPING -----------------------------------------------------

function escPipe(s) {
  return String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function codeCell(s) {
  if (s == null || s === '') return '—';
  return '`' + escPipe(String(s)).replace(/`/g, '\\`') + '`';
}

// ---- ENTRY -----------------------------------------------------------------

function main() {
  const files = walk(ROOT).map((f) => ({ abs: f, rel: path.relative(ROOT, f).replace(/\\/g, '/') }));
  files.sort((a, b) => a.rel.localeCompare(b.rel));

  const allRows = [];
  const perFile = {};
  const catCount = {};
  const audCount = {};

  for (const f of files) {
    const rows = auditFile(f.abs);
    perFile[f.rel] = rows.length;
    for (const r of rows) {
      r.file = f.rel;
      allRows.push(r);
      catCount[r.category] = (catCount[r.category] || 0) + 1;
      audCount[r.audience] = (audCount[r.audience] || 0) + 1;
    }
  }

  const totalCtas = allRows.length;
  const unknownRows = allRows.filter((r) => r.category === 'unknown');

  // Build markdown
  const lines = [];
  lines.push('---');
  lines.push('title: CTA Inventory — VitaCoreX Site');
  lines.push('generated: 2026-04-19');
  lines.push('generator: scripts/audit-ctas.js (P17 Step 17.1)');
  lines.push('governs: Phases/P17 Broken Buttons and CTA Audit.md');
  lines.push('consumed_by: scripts/verify-cta-targets.js (Step 17.2)');
  lines.push('idempotent: true');
  lines.push('---');
  lines.push('');
  lines.push('# CTA Inventory — VitaCoreX Site');
  lines.push('');
  lines.push('> **This file is machine-generated.** Do not hand-edit — regenerate via `node scripts/audit-ctas.js`. Re-running on an unchanged repo produces byte-identical output.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total interactive elements**: ${totalCtas}`);
  lines.push(`- **Files audited**: ${files.length}`);
  lines.push(`- **Unclassified rows (must be 0)**: ${unknownRows.length}`);
  lines.push('');

  lines.push('### By category');
  lines.push('');
  lines.push('| Category | Count |');
  lines.push('|----------|-------|');
  const catOrder = ['primary-nav', 'footer', 'in-body', 'form-submit', 'external', 'mailto', 'tel', 'anchor', 'action-script', 'media-play', 'unknown'];
  for (const k of catOrder) {
    if (catCount[k]) lines.push(`| ${k} | ${catCount[k]} |`);
  }
  for (const [k, v] of Object.entries(catCount)) {
    if (!catOrder.includes(k)) lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('### By audience');
  lines.push('');
  lines.push('| Audience | Count |');
  lines.push('|----------|-------|');
  const audOrder = ['b2b', 'b2c', 'shared', 'none'];
  for (const k of audOrder) {
    if (audCount[k]) lines.push(`| ${k} | ${audCount[k]} |`);
  }
  for (const [k, v] of Object.entries(audCount)) {
    if (!audOrder.includes(k)) lines.push(`| ${k} | ${v} |`);
  }
  lines.push('');

  lines.push('### By file (top 30 by CTA count)');
  lines.push('');
  lines.push('| File | CTAs |');
  lines.push('|------|------|');
  const fileStats = Object.entries(perFile).sort((a, b) => b[1] - a[1]).slice(0, 30);
  for (const [f, n] of fileStats) lines.push(`| \`${f}\` | ${n} |`);
  lines.push('');

  lines.push('## Full inventory');
  lines.push('');
  lines.push('| File | Line | Element | Label | Target | Category | Audience | Flags |');
  lines.push('|------|------|---------|-------|--------|----------|----------|-------|');
  for (const r of allRows) {
    lines.push(
      `| \`${r.file}\` | ${r.line} | ${r.element} | ${escPipe(r.label)} | ${codeCell(r.target)} | ${r.category} | ${r.audience} | ${r.flags.length ? r.flags.map(escPipe).join(', ') : '—'} |`
    );
  }
  lines.push('');

  lines.push('## Methodology');
  lines.push('');
  lines.push('- **Walked**: every `*.html` file under repo root except verification stubs (`google*.html`, `yandex_*.html`) and tool dirs (`node_modules/`, `.git/`, `.tmp/`, `scripts/`, `docs/`, `assets/`, `vcx-api/`).');
  lines.push('- **Stripped**: HTML comments, `<script>`, `<style>` — with line-count preservation (non-newlines replaced with spaces) so reported line numbers match the source file.');
  lines.push('- **Captured elements**: `<a>`, `<button>`, `<input type=submit|button|image>`, `<form>`, `[role="button"]` on non-a/non-button carriers.');
  lines.push('- **Category classifier** (mutually exclusive):');
  lines.push('  - `primary-nav` — inside `<nav>` or `<header>` region');
  lines.push('  - `footer` — inside `<footer>` region');
  lines.push('  - `in-body` — anywhere else, internal navigation link');
  lines.push('  - `form-submit` — `<button type=submit>`, `<input type=submit|image>`, or `<form>` itself');
  lines.push('  - `external` — `href` starts with `http(s)://` and host is not `vitacorexllc.com`');
  lines.push('  - `mailto` / `tel` / `anchor` — href scheme-specific');
  lines.push('  - `action-script` — has `onclick`, `javascript:` href, or `role="button"` without a valid target');
  lines.push('  - `unknown` — classifier gap (regression signal — exit code 2)');
  lines.push('- **Audience**: read from `<body data-audience="...">` (set by P02 Step 2.4). Pages without the attribute classified as `none`.');
  lines.push('- **Label extraction priority**: visible innerText → `aria-label` → first `<img alt>` → `title` → `(no label)`.');
  lines.push('- **Flags**:');
  lines.push('  - `new-tab` — `target="_blank"` set');
  lines.push('  - `missing-noopener` — new-tab link without `rel="noopener"` (security/performance)');
  lines.push('  - `dead-anchor` — `<a>` with no `href`, `onclick`, or `role` (visible text but no behavior)');
  lines.push('  - `no-handler` — button with no `onclick`, no `form`, no `data-*`, no `role` — likely dead');
  lines.push('  - `delegated:data-foo,data-bar` — button w/o inline handler but HAS data-* attributes → wired via JS event delegation (e.g. language switcher, accordion toggle). Verify in Step 17.5 Playwright spec; NOT automatically broken.');
  lines.push('  - `orphan-input` — `<input type=submit|image>` outside any `<form>`');
  lines.push('  - `self-post` — `<form>` with no `action` (submits to self)');
  lines.push('  - `form-method:GET|POST` — form method context');
  lines.push('');
  lines.push('## Regeneration');
  lines.push('');
  lines.push('```sh');
  lines.push('node scripts/audit-ctas.js');
  lines.push('```');
  lines.push('');
  lines.push('Exit codes: `0` OK · `1` I/O or parse error · `2` unclassified rows remain (see `unknown` category above).');
  lines.push('');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n'), 'utf8');

  // stdout summary
  console.log('=== CTA Inventory ===');
  console.log(`  Files audited: ${files.length}`);
  console.log(`  Total CTAs:    ${totalCtas}`);
  console.log('  By category:');
  for (const k of catOrder) if (catCount[k]) console.log(`    ${k.padEnd(15)} ${catCount[k]}`);
  for (const [k, v] of Object.entries(catCount)) if (!catOrder.includes(k)) console.log(`    ${k.padEnd(15)} ${v}`);
  console.log('  By audience:');
  for (const k of audOrder) if (audCount[k]) console.log(`    ${k.padEnd(10)} ${audCount[k]}`);
  for (const [k, v] of Object.entries(audCount)) if (!audOrder.includes(k)) console.log(`    ${k.padEnd(10)} ${v}`);
  console.log(`  Output: ${path.relative(ROOT, OUT).replace(/\\/g, '/')}`);
  if (unknownRows.length > 0) {
    console.error(`FAIL: ${unknownRows.length} unclassified row(s) — classifier gap:`);
    for (const r of unknownRows.slice(0, 10)) {
      console.error(`  ${r.file}:${r.line}  ${r.element}  "${r.label}"  target=${r.target}`);
    }
    process.exit(2);
  }
  console.log('OK — 0 unclassified rows.');
}

try {
  main();
} catch (e) {
  console.error('scripts/audit-ctas.js — fatal:', e && e.stack ? e.stack : e);
  process.exit(1);
}
