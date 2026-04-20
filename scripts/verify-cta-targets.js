#!/usr/bin/env node
/**
 * scripts/verify-cta-targets.js — P17 Step 17.2 CTA target verifier
 * Governed by: Phases/P17 Broken Buttons and CTA Audit.md (§Step 17.2)
 *
 * Consumes:  docs/qa/cta-inventory.md   (Step 17.1 output)
 * Produces:  docs/qa/cta-broken.md      (triage input for Step 17.3)
 *
 * Validation matrix (per inventory row):
 *   Category          Check                                              Pass criteria
 *   ----------------  -------------------------------------------------  -----------------------------
 *   primary-nav       internal file exists + anchor exists               file on disk; #id/#name present
 *   footer            internal file exists + anchor exists               (same)
 *   in-body           internal file exists + anchor exists               (same)
 *   anchor            same-file anchor exists                            id/name in source file
 *   external          HTTP HEAD (fallback GET on 405) with 10s timeout   200-308 OK; 4xx/5xx/timeout bad
 *   mailto            syntax                                             has valid-looking @domain.tld
 *   tel               syntax                                             E.164-compatible digit count
 *   form-submit       form action internal file exists (if not self)    file on disk
 *   action-script     SKIP (Playwright spec in Step 17.5 covers these)   -
 *
 * Flag-derived failures (already flagged by Step 17.1 auditor):
 *   dead-anchor    — <a> with no href/onclick/role (visible text, zero behavior)
 *   no-handler     — <button>/[role=button] with no inline handler AND no data-* or aria wiring
 *   orphan-input   — <input type=submit|image> outside any <form>
 *
 * External HEAD policy:
 *   - Concurrency: 4
 *   - Timeout: 10s per request (not per total redirect chain)
 *   - Redirect follow: up to 5 hops
 *   - 405 Method Not Allowed → retry GET
 *   - 401/403/999 → flagged as `external-http-opaque` (bot-block; triage as likely-invalid)
 *   - DNS/TCP errors → `external-network-error`
 *
 * Exit codes:
 *   0 — all validated rows PASS
 *   1 — I/O / parse / fatal runtime error
 *   2 — broken rows present (expected on initial Step 17.2 run; used by Step 17.6 as red build)
 *
 * Idempotency:
 *   - Internal checks (file existence, anchor presence) are byte-stable
 *   - External HEAD results may vary with upstream availability; timestamped output header
 *
 * Run:
 *   node scripts/verify-cta-targets.js
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(ROOT, 'docs', 'qa', 'cta-inventory.md');
const OUTPUT = path.join(ROOT, 'docs', 'qa', 'cta-broken.md');

const INTERNAL_HOST = /(^|\.)vitacorexllc\.com$/i;
const EXTERNAL_CONCURRENCY = 4;
const EXTERNAL_TIMEOUT_MS = 10_000;
const REDIRECT_MAX_HOPS = 5;
const USER_AGENT = 'VitaCoreX-CTA-Verifier/1.0 (+https://vitacorexllc.com/)';

// ---- INVENTORY PARSER ------------------------------------------------------

function parseInventory(md) {
  // Locate the "## Full inventory" header and consume its markdown table.
  const lines = md.split(/\r?\n/);
  const rows = [];
  let i = 0;
  for (; i < lines.length; i++) {
    if (/^##\s+Full inventory\s*$/.test(lines[i])) break;
  }
  if (i >= lines.length) {
    throw new Error('Full inventory section not found in ' + INPUT);
  }
  // Skip blank + header + separator rows
  while (i < lines.length && !/^\|.*\|$/.test(lines[i])) i++;
  // Header row
  if (!/^\|\s*File\s*\|/i.test(lines[i])) {
    throw new Error('Full inventory header row not matched at line ' + (i + 1));
  }
  i++;
  // Separator row (`|---|---|...`)
  if (!/^\|[\s:-]+\|/.test(lines[i])) {
    throw new Error('Full inventory separator row not matched at line ' + (i + 1));
  }
  i++;
  // Data rows
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (!/^\|.*\|$/.test(line)) break;
    // Split cells but respect escaped pipes (`\|`)
    const cells = splitPipeRow(line);
    if (cells.length < 8) continue;
    const [fileCell, lineCell, element, label, targetCell, category, audience, flagsCell] = cells;
    const file = unwrapCode(fileCell);
    const target = targetCell.trim() === '—' ? null : unwrapCode(targetCell);
    const flags = flagsCell.trim() === '—' ? [] : flagsCell.split(',').map((s) => s.trim()).filter(Boolean);
    rows.push({
      file,
      line: parseInt(lineCell.trim(), 10) || 0,
      element: element.trim(),
      label: label.trim(),
      target,
      category: category.trim(),
      audience: audience.trim(),
      flags,
    });
  }
  return rows;
}

function splitPipeRow(line) {
  // Split on unescaped `|`, trim leading/trailing empties from the row borders.
  const out = [];
  let cur = '';
  for (let j = 0; j < line.length; j++) {
    const c = line[j];
    if (c === '\\' && line[j + 1] === '|') {
      cur += '|';
      j++;
      continue;
    }
    if (c === '|') {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += c;
  }
  out.push(cur);
  // Drop the empty cells produced by the leading/trailing `|`
  if (out.length && out[0].trim() === '') out.shift();
  if (out.length && out[out.length - 1].trim() === '') out.pop();
  return out;
}

function unwrapCode(cell) {
  const s = cell.trim();
  if (s.startsWith('`') && s.endsWith('`')) {
    return s.slice(1, -1).replace(/\\`/g, '`');
  }
  return s;
}

// ---- INTERNAL RESOLVERS ----------------------------------------------------

const fileTextCache = new Map();

function readFileCached(abs) {
  if (fileTextCache.has(abs)) return fileTextCache.get(abs);
  const txt = fs.readFileSync(abs, 'utf8');
  fileTextCache.set(abs, txt);
  return txt;
}

function resolveInternalTarget(sourceFileRel, target) {
  // Strip absolute URL prefix if internal host
  let raw = target;
  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      if (!INTERNAL_HOST.test(u.hostname)) {
        return { kind: 'external', url: raw };
      }
      raw = u.pathname + (u.hash || '');
    } catch (_) {
      return { kind: 'unresolvable', reason: 'external-bad-url', detail: 'malformed absolute URL' };
    }
  }
  if (raw.startsWith('//')) {
    // Protocol-relative → treat as external
    return { kind: 'external', url: 'https:' + raw };
  }

  // Pure anchor in same file
  if (raw.startsWith('#')) {
    return { kind: 'anchor-same', anchor: raw.slice(1) };
  }

  // Drop query string (not file-system significant)
  let hash = '';
  let noQuery = raw;
  const hashIdx = noQuery.indexOf('#');
  if (hashIdx >= 0) {
    hash = noQuery.slice(hashIdx + 1);
    noQuery = noQuery.slice(0, hashIdx);
  }
  const queryIdx = noQuery.indexOf('?');
  if (queryIdx >= 0) noQuery = noQuery.slice(0, queryIdx);

  if (noQuery === '') {
    // Just ?query or #hash of same file — treat as same-file anchor (or same-file no-op)
    return hash ? { kind: 'anchor-same', anchor: hash } : { kind: 'self' };
  }

  // Resolve relative path
  const sourceDir = path.dirname(path.join(ROOT, sourceFileRel));
  let candidate;
  if (noQuery.startsWith('/')) {
    // Rooted — relative to repo root
    candidate = path.join(ROOT, noQuery.replace(/^\/+/, ''));
  } else {
    candidate = path.resolve(sourceDir, noQuery);
  }

  // Directory paths → try index.html
  let abs = candidate;
  try {
    const st = fs.statSync(abs);
    if (st.isDirectory()) abs = path.join(abs, 'index.html');
  } catch (_) {
    // Not on disk as-is; check if it is a dir-with-trailing-slash-missing
    if (!noQuery.endsWith('.html') && !noQuery.endsWith('.pdf') && !noQuery.endsWith('.xml') && !noQuery.endsWith('.txt')) {
      const withIndex = path.join(abs, 'index.html');
      if (fs.existsSync(withIndex)) abs = withIndex;
    }
  }

  return { kind: 'internal-file', abs, rel: path.relative(ROOT, abs).replace(/\\/g, '/'), anchor: hash || null };
}

function anchorExistsIn(absFile, anchor) {
  if (!anchor) return true;
  let txt;
  try {
    txt = readFileCached(absFile);
  } catch (_) {
    return false;
  }
  const esc = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(
    `(?:\\bid\\s*=\\s*(?:"${esc}"|'${esc}'|${esc}\\b)|\\bname\\s*=\\s*(?:"${esc}"|'${esc}'|${esc}\\b))`,
    'i'
  );
  return re.test(txt);
}

// ---- SYNTAX VALIDATORS -----------------------------------------------------

function checkMailto(target) {
  // mailto:user@host.tld[?query]
  const m = /^mailto:([^?\s]+)(\?.*)?$/i.exec(target);
  if (!m) return { ok: false, reason: 'mailto-bad-syntax', detail: 'missing address' };
  const addr = m[1];
  // Minimal RFC-5321-ish check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@.]+$/.test(addr)) {
    return { ok: false, reason: 'mailto-bad-syntax', detail: addr };
  }
  return { ok: true };
}

function checkTel(target) {
  // tel:+1234567890 (E.164: optional +, 7-15 digits total)
  const m = /^tel:(.+)$/i.exec(target);
  if (!m) return { ok: false, reason: 'tel-bad-syntax', detail: 'no scheme body' };
  const digits = m[1].replace(/[\s()\-.]/g, '');
  if (!/^\+?[0-9]{7,15}$/.test(digits)) {
    return { ok: false, reason: 'tel-bad-syntax', detail: m[1] };
  }
  return { ok: true };
}

// ---- EXTERNAL HEAD ---------------------------------------------------------

function rawFetch(urlStr, method, timeoutMs) {
  return new Promise((resolve) => {
    let u;
    try {
      u = new URL(urlStr);
    } catch (e) {
      return resolve({ ok: false, reason: 'external-bad-url', detail: String(e.message) });
    }
    const lib = u.protocol === 'https:' ? https : u.protocol === 'http:' ? http : null;
    if (!lib) return resolve({ ok: false, reason: 'external-bad-url', detail: 'unsupported protocol ' + u.protocol });

    const req = lib.request(
      {
        method,
        host: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: (u.pathname || '/') + (u.search || ''),
        headers: {
          'User-Agent': USER_AGENT,
          Accept: '*/*',
          'Accept-Encoding': 'identity',
        },
        timeout: timeoutMs,
      },
      (res) => {
        resolve({ ok: true, status: res.statusCode, headers: res.headers });
        res.resume(); // discard body
      }
    );
    req.on('timeout', () => {
      req.destroy(new Error('timeout'));
      resolve({ ok: false, reason: 'external-timeout', detail: `${timeoutMs}ms` });
    });
    req.on('error', (e) => {
      const code = e && (e.code || e.errno) ? String(e.code || e.errno) : String(e.message || e);
      if (code === 'timeout') return; // already resolved in 'timeout' handler
      resolve({ ok: false, reason: 'external-network-error', detail: code });
    });
    req.end();
  });
}

async function verifyExternal(origUrl) {
  let cur = origUrl;
  let method = 'HEAD';
  for (let hop = 0; hop < REDIRECT_MAX_HOPS; hop++) {
    const r = await rawFetch(cur, method, EXTERNAL_TIMEOUT_MS);
    if (!r.ok) return { ok: false, reason: r.reason, detail: r.detail, finalUrl: cur };
    const { status, headers } = r;
    if (status >= 200 && status < 300) return { ok: true, status, finalUrl: cur };
    if (status === 304) return { ok: true, status, finalUrl: cur };
    if (status >= 300 && status < 400) {
      const loc = headers.location;
      if (!loc) return { ok: false, reason: 'external-redirect-no-location', detail: `HTTP ${status}`, finalUrl: cur };
      try {
        cur = new URL(loc, cur).href;
      } catch (_) {
        return { ok: false, reason: 'external-redirect-bad-location', detail: loc, finalUrl: cur };
      }
      method = 'HEAD';
      continue;
    }
    if (status === 405 && method === 'HEAD') {
      method = 'GET';
      continue;
    }
    if (status === 401 || status === 403 || status === 999) {
      return { ok: false, reason: 'external-http-opaque', detail: `HTTP ${status}`, finalUrl: cur };
    }
    if (status >= 400 && status < 500) {
      return { ok: false, reason: 'external-http-4xx', detail: `HTTP ${status}`, finalUrl: cur };
    }
    if (status >= 500) {
      return { ok: false, reason: 'external-http-5xx', detail: `HTTP ${status}`, finalUrl: cur };
    }
    return { ok: false, reason: 'external-http-unknown', detail: `HTTP ${status}`, finalUrl: cur };
  }
  return { ok: false, reason: 'external-redirect-loop', detail: `exceeded ${REDIRECT_MAX_HOPS} hops`, finalUrl: cur };
}

// ---- CONCURRENCY LIMITER ---------------------------------------------------

async function runLimit(items, limit, worker, onProgress) {
  const results = new Array(items.length);
  let nextIdx = 0;
  let done = 0;
  async function pump() {
    while (true) {
      const i = nextIdx++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
      done++;
      if (onProgress) onProgress(done, items.length);
    }
  }
  const pool = [];
  for (let k = 0; k < limit; k++) pool.push(pump());
  await Promise.all(pool);
  return results;
}

// ---- PER-ROW CLASSIFIER ----------------------------------------------------

function classifyRow(row) {
  // Returns one of:
  //   { kind: 'skip' }                        — not verifiable statically
  //   { kind: 'flag', reason, detail }        — broken per Step 17.1 flag
  //   { kind: 'anchor-same', anchor }         — validate in source file
  //   { kind: 'internal-file', abs, rel, anchor }
  //   { kind: 'external', url }
  //   { kind: 'mailto', target }
  //   { kind: 'tel', target }
  //   { kind: 'self' }                        — form action empty or same-file no-op
  //   { kind: 'unresolvable', reason, detail }

  // Flag-derived failures first (auditor already decided these are broken)
  if (row.flags.includes('dead-anchor')) {
    return { kind: 'flag', reason: 'dead-anchor', detail: '<a> with no href/onclick/role' };
  }
  if (row.flags.includes('orphan-input')) {
    return { kind: 'flag', reason: 'orphan-input', detail: '<input type=submit|image> outside any <form>' };
  }
  if (row.flags.includes('no-handler')) {
    // Honor delegated:/aria-wired: — those have handler wired via JS or ARIA
    const hasDelegated = row.flags.some((f) => /^delegated:/.test(f));
    const hasAria = row.flags.some((f) => /^aria-wired:/.test(f));
    if (!hasDelegated && !hasAria) {
      return { kind: 'flag', reason: 'no-handler', detail: '<button>/[role=button] with no handler wiring' };
    }
  }

  // action-script is Step 17.5 Playwright territory
  if (row.category === 'action-script') return { kind: 'skip' };

  // Skip non-target sentinels
  if (!row.target) return { kind: 'skip' };
  const t = row.target;
  if (t === '(handler)' || t === '(self)' || t === '(form-action)' || t === '(none)') {
    return { kind: 'skip' };
  }

  // JS-expression target (auditor's form-submit fallthrough for <button onclick="fn()">
  // with no `type` attribute and no enclosing <form>). Target is the onclick text, not
  // a URL. Treat as action-script behavior — covered by Step 17.5 Playwright spec.
  // Pattern: identifier followed by `(` — e.g., dcalRegister(), foo.bar(), doThing('x')
  if (/^[A-Za-z_$][\w$]*\s*[.(]/.test(t) && !/^https?:\/\//i.test(t) && !/^(mailto|tel|javascript|data):/i.test(t)) {
    // Extra guard: if it ALSO contains `(` before any slash/dot-file-ext, it's clearly JS
    if (t.includes('(') && t.includes(')')) return { kind: 'skip' };
  }

  // mailto / tel by category (classifier-agnostic)
  if (row.category === 'mailto' || /^mailto:/i.test(t)) return { kind: 'mailto', target: t };
  if (row.category === 'tel' || /^tel:/i.test(t)) return { kind: 'tel', target: t };

  // Absolute URL routing
  if (/^https?:\/\//i.test(t)) {
    const res = resolveInternalTarget(row.file, t);
    return res;
  }
  if (/^javascript:/i.test(t)) return { kind: 'skip' };
  if (/^data:/i.test(t)) return { kind: 'skip' };

  // Anchor / internal path
  return resolveInternalTarget(row.file, t);
}

// ---- MAIN ------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('FATAL: input inventory not found:', INPUT);
    console.error('Run `node scripts/audit-ctas.js` first.');
    process.exit(1);
  }

  const md = fs.readFileSync(INPUT, 'utf8');
  const rows = parseInventory(md);
  console.log(`Parsed ${rows.length} rows from cta-inventory.md`);

  // Bucket by check type
  const internalChecks = []; // { row, resolved }
  const externalChecks = []; // { row, url }
  const mailtoChecks = [];
  const telChecks = [];
  const anchorSameChecks = []; // { row, anchor }
  const flagBroken = [];       // { row, reason, detail }
  const skipped = [];
  const unresolvable = [];

  for (const row of rows) {
    const c = classifyRow(row);
    if (c.kind === 'skip') {
      skipped.push(row);
      continue;
    }
    if (c.kind === 'flag') {
      flagBroken.push({ row, reason: c.reason, detail: c.detail });
      continue;
    }
    if (c.kind === 'self') {
      skipped.push(row);
      continue;
    }
    if (c.kind === 'anchor-same') {
      anchorSameChecks.push({ row, anchor: c.anchor });
      continue;
    }
    if (c.kind === 'internal-file') {
      internalChecks.push({ row, abs: c.abs, rel: c.rel, anchor: c.anchor });
      continue;
    }
    if (c.kind === 'external') {
      externalChecks.push({ row, url: c.url });
      continue;
    }
    if (c.kind === 'mailto') {
      mailtoChecks.push({ row, target: c.target });
      continue;
    }
    if (c.kind === 'tel') {
      telChecks.push({ row, target: c.target });
      continue;
    }
    if (c.kind === 'unresolvable') {
      unresolvable.push({ row, reason: c.reason, detail: c.detail });
      continue;
    }
    // Defensive
    unresolvable.push({ row, reason: 'classifier-unhandled', detail: c.kind });
  }

  console.log(`  flag-broken (dead-anchor/no-handler/orphan-input): ${flagBroken.length}`);
  console.log(`  internal-file checks: ${internalChecks.length}`);
  console.log(`  anchor-same checks: ${anchorSameChecks.length}`);
  console.log(`  external HEAD checks: ${externalChecks.length}`);
  console.log(`  mailto checks: ${mailtoChecks.length}`);
  console.log(`  tel checks: ${telChecks.length}`);
  console.log(`  skipped (action-script/no target): ${skipped.length}`);
  console.log(`  unresolvable: ${unresolvable.length}`);

  const broken = [];

  // Internal file checks
  for (const c of internalChecks) {
    if (!fs.existsSync(c.abs)) {
      broken.push({ row: c.row, reason: 'internal-file-missing', detail: c.rel });
      continue;
    }
    if (c.anchor) {
      if (!anchorExistsIn(c.abs, c.anchor)) {
        broken.push({ row: c.row, reason: 'internal-anchor-missing', detail: `${c.rel}#${c.anchor}` });
      }
    }
  }

  // Anchor-same checks
  for (const c of anchorSameChecks) {
    const absSource = path.join(ROOT, c.row.file);
    if (!anchorExistsIn(absSource, c.anchor)) {
      broken.push({ row: c.row, reason: 'internal-anchor-missing', detail: `${c.row.file}#${c.anchor}` });
    }
  }

  // Mailto + tel syntax
  for (const c of mailtoChecks) {
    const r = checkMailto(c.target);
    if (!r.ok) broken.push({ row: c.row, reason: r.reason, detail: r.detail });
  }
  for (const c of telChecks) {
    const r = checkTel(c.target);
    if (!r.ok) broken.push({ row: c.row, reason: r.reason, detail: r.detail });
  }

  // Unresolvable (classifier said so)
  for (const u of unresolvable) {
    broken.push({ row: u.row, reason: u.reason, detail: u.detail });
  }

  // External: dedupe by URL (same URL referenced from many pages → single HEAD)
  const uniqExternalUrls = Array.from(new Set(externalChecks.map((c) => c.url)));
  console.log(`  external unique URLs: ${uniqExternalUrls.length}`);

  let extDone = 0;
  const urlResult = new Map();
  await runLimit(
    uniqExternalUrls,
    EXTERNAL_CONCURRENCY,
    async (url) => {
      const r = await verifyExternal(url);
      urlResult.set(url, r);
      return r;
    },
    (done, total) => {
      extDone = done;
      if (done === total || done % 10 === 0) {
        process.stdout.write(`  external progress: ${done}/${total}\r`);
      }
    }
  );
  if (uniqExternalUrls.length) console.log(`  external progress: ${extDone}/${uniqExternalUrls.length}`);

  for (const c of externalChecks) {
    const r = urlResult.get(c.url);
    if (!r) continue; // shouldn't happen
    if (!r.ok) {
      broken.push({ row: c.row, reason: r.reason, detail: (r.detail || '') + (r.finalUrl && r.finalUrl !== c.url ? ` (final=${r.finalUrl})` : '') });
    }
  }

  // Prepend flag-broken (they came first in classifier)
  const allBroken = [...flagBroken, ...broken];

  // Sort by file then line for stable output
  allBroken.sort((a, b) => {
    if (a.row.file !== b.row.file) return a.row.file.localeCompare(b.row.file);
    return a.row.line - b.row.line;
  });

  // Build markdown
  const reasonCount = {};
  for (const b of allBroken) reasonCount[b.reason] = (reasonCount[b.reason] || 0) + 1;

  const nowIso = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const totalChecked = rows.length - skipped.length;
  const lines = [];
  lines.push('---');
  lines.push('title: CTA Broken List — VitaCoreX Site');
  lines.push(`generated: ${nowIso}`);
  lines.push('generator: scripts/verify-cta-targets.js (P17 Step 17.2)');
  lines.push('governs: Phases/P17 Broken Buttons and CTA Audit.md');
  lines.push('input: docs/qa/cta-inventory.md');
  lines.push('consumed_by: docs/qa/cta-triage.md (P17 Step 17.3 manual triage)');
  lines.push('idempotent: "internal checks byte-stable; external HEAD results may vary with upstream availability"');
  lines.push('---');
  lines.push('');
  lines.push('# CTA Broken List — VitaCoreX Site');
  lines.push('');
  lines.push('> **Machine-generated.** Each row = one CTA that failed automated validation. Do not hand-edit — regenerate via `node scripts/verify-cta-targets.js`. Manual triage in Step 17.3 (`docs/qa/cta-triage.md`) assigns a disposition (fix / remove / defer / invalid) per row.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Inventory rows parsed**: ${rows.length}`);
  lines.push(`- **Rows actively validated**: ${totalChecked}`);
  lines.push(`- **Rows skipped (action-script / no target / self-ref)**: ${skipped.length}`);
  lines.push(`- **Broken rows (triage required)**: ${allBroken.length}`);
  lines.push(`- **External unique URLs HEAD-checked**: ${uniqExternalUrls.length}`);
  lines.push('');

  if (Object.keys(reasonCount).length) {
    lines.push('### By failure reason');
    lines.push('');
    lines.push('| Reason | Count |');
    lines.push('|--------|-------|');
    const reasonOrder = [
      'internal-file-missing',
      'internal-anchor-missing',
      'external-http-4xx',
      'external-http-5xx',
      'external-http-opaque',
      'external-http-unknown',
      'external-timeout',
      'external-network-error',
      'external-bad-url',
      'external-redirect-loop',
      'external-redirect-no-location',
      'external-redirect-bad-location',
      'mailto-bad-syntax',
      'tel-bad-syntax',
      'dead-anchor',
      'no-handler',
      'orphan-input',
    ];
    for (const k of reasonOrder) {
      if (reasonCount[k]) lines.push(`| ${k} | ${reasonCount[k]} |`);
    }
    for (const [k, v] of Object.entries(reasonCount)) {
      if (!reasonOrder.includes(k)) lines.push(`| ${k} | ${v} |`);
    }
    lines.push('');
  } else {
    lines.push('_No broken rows detected — all validated CTAs PASS._');
    lines.push('');
  }

  if (allBroken.length) {
    lines.push('## Broken rows');
    lines.push('');
    lines.push('| File | Line | Element | Label | Target | Category | Audience | Reason | Detail |');
    lines.push('|------|------|---------|-------|--------|----------|----------|--------|--------|');
    for (const b of allBroken) {
      const r = b.row;
      lines.push(
        `| \`${r.file}\` | ${r.line} | ${r.element} | ${escPipe(r.label)} | ${codeCell(r.target)} | ${r.category} | ${r.audience} | ${b.reason} | ${escPipe(b.detail || '—')} |`
      );
    }
    lines.push('');
  }

  lines.push('## Methodology');
  lines.push('');
  lines.push('### Internal link resolution');
  lines.push('');
  lines.push('- `href` starting with `/` → resolved relative to repo root.');
  lines.push('- `href` relative (no leading `/`) → resolved relative to the source file\'s directory.');
  lines.push('- `https://vitacorexllc.com/...` or `https://www.vitacorexllc.com/...` → stripped to path, resolved as relative-to-root.');
  lines.push('- Directory targets (no `.html` / `.pdf` / `.xml` / `.txt` extension) → tried as `<dir>/index.html`.');
  lines.push('- Query strings (`?foo=bar`) stripped before filesystem lookup.');
  lines.push('- Hash fragment (`#anchor`) — after file is confirmed, the target file is scanned for `id="anchor"` or `name="anchor"` (case-insensitive).');
  lines.push('');
  lines.push('### External HEAD');
  lines.push('');
  lines.push(`- Concurrency cap: ${EXTERNAL_CONCURRENCY}`);
  lines.push(`- Timeout: ${EXTERNAL_TIMEOUT_MS / 1000}s per request`);
  lines.push(`- Redirects: follow up to ${REDIRECT_MAX_HOPS} hops`);
  lines.push(`- User-Agent: \`${USER_AGENT}\``);
  lines.push('- Unique URLs are HEAD-checked once (same URL referenced from many pages → single network call).');
  lines.push('- `HTTP 405` → automatic retry with `GET` (some CDNs reject `HEAD`).');
  lines.push('- `HTTP 401 / 403 / 999` → flagged `external-http-opaque`. These are typically bot-blocking responses (LinkedIn returns `999`, many sites return `403` to non-browser UAs). Treat as "likely-invalid, verify manually in browser" during Step 17.3 triage.');
  lines.push('');
  lines.push('### Flag-derived failures (inherited from Step 17.1 auditor)');
  lines.push('');
  lines.push('- `dead-anchor` — `<a>` tag has no `href`, no `onclick`, and no `role` attribute. Visible text but zero behavior.');
  lines.push('- `no-handler` — `<button>` or `[role=button]` with no inline `onclick` AND no `form` ancestor AND no `data-*` delegation attributes AND no `aria-controls` / `aria-expanded` wiring. Likely dead.');
  lines.push('  - Buttons with `delegated:data-*` flag are NOT marked broken (wired via JS event delegation — verify in Step 17.5 Playwright spec).');
  lines.push('  - Buttons with `aria-wired:*` flag are NOT marked broken (ARIA disclosure/controls pattern — verify in Step 17.5).');
  lines.push('- `orphan-input` — `<input type=submit|button|image>` not contained in any `<form>` and no `onclick` fallback.');
  lines.push('');
  lines.push('### Skipped (non-verifiable statically)');
  lines.push('');
  lines.push('- Category `action-script` — JS handlers (onclick, javascript: hrefs, role=button with delegated data-*). Covered by Step 17.5 Playwright click spec.');
  lines.push('- Targets `(handler)`, `(self)`, `(form-action)`, `(none)` — auditor sentinels for non-URL behavior.');
  lines.push('- `data:` URIs — inline resources, not verifiable.');
  lines.push('');
  lines.push('## Regeneration');
  lines.push('');
  lines.push('```sh');
  lines.push('node scripts/verify-cta-targets.js');
  lines.push('```');
  lines.push('');
  lines.push('Exit codes: `0` all PASS · `1` I/O or parse error · `2` broken rows remain (red build under Step 17.6 regression gate).');
  lines.push('');

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');

  // stdout summary
  console.log('');
  console.log('=== CTA Target Verifier ===');
  console.log(`  Inventory rows:       ${rows.length}`);
  console.log(`  Validated:            ${totalChecked}`);
  console.log(`  Skipped:              ${skipped.length}`);
  console.log(`  Broken:               ${allBroken.length}`);
  if (Object.keys(reasonCount).length) {
    console.log('  By reason:');
    for (const [k, v] of Object.entries(reasonCount).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${k.padEnd(34)} ${v}`);
    }
  }
  console.log(`  Output: ${path.relative(ROOT, OUTPUT).replace(/\\/g, '/')}`);

  if (allBroken.length > 0) {
    process.exit(2);
  }
  console.log('OK — all validated rows PASS.');
}

// ---- MARKDOWN ESCAPING -----------------------------------------------------

function escPipe(s) {
  return String(s == null ? '' : s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function codeCell(s) {
  if (s == null || s === '') return '—';
  return '`' + escPipe(String(s)).replace(/`/g, '\\`') + '`';
}

// ---- BOOT ------------------------------------------------------------------

main().catch((e) => {
  console.error('scripts/verify-cta-targets.js — fatal:', e && e.stack ? e.stack : e);
  process.exit(1);
});
