#!/usr/bin/env node
/**
 * scripts/update-footer-legal.js
 *
 * One-off script to propagate the new unified footer legal statement
 * and the short trust line across every HTML file on the site.
 *
 * What it does:
 *   1. Replaces the static English fallback text inside any element
 *      with `data-i18n="footer_disc"` or `data-common="footer_disc"`
 *      with the new verbatim disclosure paragraph.
 *   2. Ensures every footer that carries a disclosure element also has
 *      a trust-line element (`data-common="footer_trust_line"`). If
 *      missing, inserts one immediately after the disclosure element.
 *
 * Safe to re-run: idempotent — if the new text is already present and
 * a trust-line element already exists, the file is untouched.
 *
 * Usage:  node scripts/update-footer-legal.js
 *
 * Exit codes:
 *   0 — done
 *   1 — fatal error
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const NEW_DISC = 'VitaCoreX LLC is a Florida-registered company providing remote administrative, workflow, documentation, and file-control support across the United States where permitted by applicable law. VitaCoreX is not a law firm, does not provide legal advice, is not a licensed collection agency, does not collect debts, and does not represent clients in court or before government agencies. State-specific court, collection, privacy, immigration, and unauthorized-practice-of-law rules are confirmed before engagement.';
const NEW_TRUST = 'Florida-registered LLC &middot; U.S.-wide remote support where permitted &middot; Not a law firm &middot; Not a collection agency &middot; No legal advice &middot; No debt collection &middot; Scope confirmed at intake';

// Match any element with data-i18n="footer_disc" or data-common="footer_disc"
// and capture its inner content. Handles both <p> and <span> with varying
// attributes and classes.
const DISC_RE = /(<(?:p|span|div)[^>]*?data-(?:i18n|common)="footer_disc"[^>]*?>)([\s\S]*?)(<\/(?:p|span|div)>)/g;

// Trust-line element presence check.
const TRUST_RE = /data-(?:i18n|common)="footer_trust_line"/;

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'docs') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.isFile() && e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function processFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  let html = fs.readFileSync(filePath, 'utf8');
  const original = html;

  let discUpdated = 0;
  let trustInserted = 0;

  // --- Step 1: Replace disclosure inner text ---
  html = html.replace(DISC_RE, (match, openTag, inner, closeTag) => {
    // Skip if the text looks like it's already the new version (idempotent).
    const trimmed = inner.trim();
    if (trimmed.startsWith('VitaCoreX LLC is a Florida-registered company')) {
      return match;
    }
    discUpdated++;
    return openTag + NEW_DISC + closeTag;
  });

  // --- Step 2: Insert trust-line element if absent ---
  // Only insert in files that (a) contain a footer_disc element and (b) do
  // NOT already contain a footer_trust_line element. Insertion point:
  // immediately after the first footer_disc element.
  const hasDisc = /data-(?:i18n|common)="footer_disc"/.test(html);
  const hasTrust = TRUST_RE.test(html);

  if (hasDisc && !hasTrust) {
    // Find the first footer_disc element and insert the trust line after it.
    // We capture the full element and its closing tag, then inject.
    html = html.replace(DISC_RE, (match, openTag, inner, closeTag, offset) => {
      // Only modify the first match — subsequent matches should pass through.
      // Use a sentinel flag on the regex state via a function wrapper.
      if (processFile.__injected) return match;
      processFile.__injected = true;

      // Detect if the disclosure was in a <p> or <span> so we mirror the
      // element type for the trust line (keeps valid HTML in inline
      // contexts like the contract-intelligence combined <div>).
      const elMatch = openTag.match(/^<(p|span|div)\b/i);
      const el = (elMatch ? elMatch[1] : 'p').toLowerCase();

      // Detect whether original uses data-i18n or data-common to mirror.
      const attr = openTag.includes('data-common=') ? 'data-common' : 'data-i18n';

      // Pick a class that makes sense for the context.
      let klass = 'footer-trust-line';
      if (openTag.includes('class="footer-disc"')) klass = 'footer-trust-line footer-trust-line--compact';
      else if (openTag.includes('class="small-note"')) klass = 'small-note footer-trust-line';

      const trustEl = `<${el} class="${klass}" ${attr}="footer_trust_line">${NEW_TRUST}</${el}>`;
      trustInserted++;
      return match + trustEl;
    });
    // Clear the sentinel after processing this file.
    processFile.__injected = false;
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`updated ${rel}  (disc:${discUpdated}, trust:${trustInserted})`);
    return true;
  }
  return false;
}

function main() {
  const files = walk(ROOT);
  let changed = 0;
  for (const f of files) {
    processFile.__injected = false;
    if (processFile(f)) changed++;
  }
  console.log(`\n=== Footer legal update ===`);
  console.log(`  Files scanned:  ${files.length}`);
  console.log(`  Files updated:  ${changed}`);
}

main();
