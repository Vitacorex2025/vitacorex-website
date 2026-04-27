#!/usr/bin/env node
/**
 * move-footer-bottom.js
 *
 * Moves the copyright <p> and social <div> from inside .footer-company
 * to a new .footer-bottom bar that appears below all footer columns,
 * separated by a top border.
 *
 * Idempotent: re-running on an already-migrated page is a no-op.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// All top-level HTML files in the site root (skip docs/, node_modules/, .git/)
function collectHtmlFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.name === 'node_modules' || entry.name === 'docs' || entry.name === 'vcx-api') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectHtmlFiles(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// Matches the copyright <p> inside footer-meta. Known variants:
//   <p class="small-note footer-copyright" data-i18n="footer_copy">© 2025 VitaCoreX LLC. All rights reserved.</p>
//   <p class="small-note">© 2025 VitaCoreX LLC. All rights reserved.</p>
//   <p class="small-note" data-common="footer_copy">&copy; 2025–2026 VitaCoreX LLC. All rights reserved.</p>
//   <p class="footer-copy" data-common="footer_copy">&copy; 2025–2026 VitaCoreX LLC. All rights reserved.</p>
// Accepts: multiple class variants, optional data-i18n/data-common, © or &copy;, year 2025-2030
const COPYRIGHT_RE = /^[ \t]*<p class="(?:small-note(?: footer-copyright)?|footer-copy)"(?:\s+data-(?:i18n|common)="footer_copy")?>(?:&copy;|©)\s*20\d{2}\s*VitaCoreX LLC\.\s*All rights reserved\.<\/p>\r?\n/m;

// Matches the foot-social div block (opening tag on its own line, through closing </div>)
const SOCIAL_RE = /^[ \t]*<div class="foot-social">\r?\n(?:[ \t]*<a [^>]*href="https:\/\/www\.(?:instagram|facebook)[^>]*>[\s\S]*?<\/a>\r?\n)+[ \t]*<\/div>\r?\n/m;

// Insertion point: just before the closing </footer>
const FOOTER_END_RE = /^([ \t]*)<\/footer>\r?$/m;

// Idempotency guard
const ALREADY_MIGRATED_RE = /<div class="footer-bottom"/;

function migrate(html) {
  if (ALREADY_MIGRATED_RE.test(html)) {
    return { html, changed: false, reason: 'already-migrated' };
  }

  const copyMatch = html.match(COPYRIGHT_RE);
  const socialMatch = html.match(SOCIAL_RE);

  if (!copyMatch && !socialMatch) {
    return { html, changed: false, reason: 'no-footer-pattern' };
  }

  // Copyright-only: wrap just the copyright in footer-bottom (no social section)
  // Social-only: unlikely but wrap just social
  // Both: standard case

  let i18nAttr = '';
  let copyText = '© 2025 VitaCoreX LLC. All rights reserved.';
  if (copyMatch) {
    const copyTextMatch = copyMatch[0].match(/<p[^>]*>(.*?)<\/p>/);
    if (copyMatch[0].includes('data-i18n="footer_copy"')) i18nAttr = ' data-i18n="footer_copy"';
    else if (copyMatch[0].includes('data-common="footer_copy"')) i18nAttr = ' data-common="footer_copy"';
    if (copyTextMatch) copyText = copyTextMatch[1];
  }

  let socialInner = '';
  if (socialMatch) {
    socialInner = socialMatch[0]
      .replace(/^[ \t]*<div class="foot-social">\r?\n/, '')
      .replace(/[ \t]*<\/div>\r?\n$/, '');
  }

  // Remove matched blocks from their original positions
  let next = html;
  if (copyMatch) next = next.replace(COPYRIGHT_RE, '');
  if (socialMatch) next = next.replace(SOCIAL_RE, '');

  // Build the new bottom bar
  let bottom = `<div class="footer-bottom">\n`;
  if (copyMatch) {
    bottom += `<p class="footer-bottom__copy"${i18nAttr}>${copyText}</p>\n`;
  }
  if (socialMatch) {
    bottom += `<div class="footer-bottom__social">\n` +
              socialInner.replace(/\r?\n$/, '') + `\n` +
              `</div>\n`;
  }
  bottom += `</div>\n`;

  // Insert just before </footer>
  next = next.replace(FOOTER_END_RE, (m, indent) => `${bottom}${indent}</footer>`);

  return { html: next, changed: true, reason: copyMatch && socialMatch ? 'migrated-full' : (copyMatch ? 'migrated-copy-only' : 'migrated-social-only') };
}

function main() {
  const files = collectHtmlFiles(ROOT);
  const stats = { total: files.length, migrated: 0, skipped: 0, skipReasons: {} };

  for (const file of files) {
    const orig = fs.readFileSync(file, 'utf8');
    const result = migrate(orig);
    if (result.changed) {
      fs.writeFileSync(file, result.html, 'utf8');
      stats.migrated++;
    } else {
      stats.skipped++;
      stats.skipReasons[result.reason] = (stats.skipReasons[result.reason] || 0) + 1;
    }
  }

  console.log(`Scanned ${stats.total} HTML files`);
  console.log(`Migrated: ${stats.migrated}`);
  console.log(`Skipped:  ${stats.skipped}`);
  for (const [reason, count] of Object.entries(stats.skipReasons)) {
    console.log(`  ${reason}: ${count}`);
  }
}

main();
