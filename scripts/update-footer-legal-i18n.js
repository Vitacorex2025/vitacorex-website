#!/usr/bin/env node
/**
 * scripts/update-footer-legal-i18n.js
 *
 * Second pass for footer legal update: updates inline `window.SITE_I18N`
 * translation blocks on app pages (contract-intelligence, dealer-contract-check,
 * immigration-forms, etc.) that carry their own per-page translations which
 * would otherwise override the global vcx-translations.js / shell-i18n.js
 * values at runtime.
 *
 * For each HTML file:
 *   - Locate each `"en": { ... }`, `"ru": { ... }`, `"es": { ... }` block.
 *   - Replace the `"footer_disc": "..."` value with the new unified text for
 *     that language.
 *   - If `"footer_trust_line"` is absent, insert it right after footer_disc.
 *
 * Idempotent: if the block already has the new footer_disc AND a
 * footer_trust_line, it is untouched.
 *
 * Usage:  node scripts/update-footer-legal-i18n.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const DISC = {
  en: 'VitaCoreX LLC is a Florida-registered company providing remote administrative, workflow, documentation, and file-control support across the United States where permitted by applicable law. VitaCoreX is not a law firm, does not provide legal advice, is not a licensed collection agency, does not collect debts, and does not represent clients in court or before government agencies. State-specific court, collection, privacy, immigration, and unauthorized-practice-of-law rules are confirmed before engagement.',
  ru: 'VitaCoreX LLC \u2014 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u044f, \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u0430\u044f \u0432\u043e \u0424\u043b\u043e\u0440\u0438\u0434\u0435, \u043e\u043a\u0430\u0437\u044b\u0432\u0430\u044e\u0449\u0430\u044f \u0443\u0434\u0430\u043b\u0451\u043d\u043d\u0443\u044e \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u0438\u0432\u043d\u0443\u044e, \u043e\u043f\u0435\u0440\u0430\u0446\u0438\u043e\u043d\u043d\u0443\u044e, \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0430\u0440\u043d\u0443\u044e \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0443 \u0438 \u0443\u0441\u043b\u0443\u0433\u0438 \u043f\u043e \u043a\u043e\u043d\u0442\u0440\u043e\u043b\u044e \u0434\u043e\u0441\u044c\u0435 \u043d\u0430 \u0442\u0435\u0440\u0440\u0438\u0442\u043e\u0440\u0438\u0438 \u0421\u0428\u0410 \u0442\u0430\u043c, \u0433\u0434\u0435 \u044d\u0442\u043e \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u043e \u043f\u0440\u0438\u043c\u0435\u043d\u0438\u043c\u044b\u043c \u0437\u0430\u043a\u043e\u043d\u043e\u0434\u0430\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e\u043c. VitaCoreX \u043d\u0435 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u0444\u0438\u0440\u043c\u043e\u0439, \u043d\u0435 \u0434\u0430\u0451\u0442 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0441\u043e\u0432\u0435\u0442\u043e\u0432, \u043d\u0435 \u044f\u0432\u043b\u044f\u0435\u0442\u0441\u044f \u043b\u0438\u0446\u0435\u043d\u0437\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u044b\u043c \u043a\u043e\u043b\u043b\u0435\u043a\u0442\u043e\u0440\u0441\u043a\u0438\u043c \u0430\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e\u043c, \u043d\u0435 \u0432\u0437\u044b\u0441\u043a\u0438\u0432\u0430\u0435\u0442 \u0434\u043e\u043b\u0433\u0438 \u0438 \u043d\u0435 \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043b\u044f\u0435\u0442 \u043a\u043b\u0438\u0435\u043d\u0442\u043e\u0432 \u0432 \u0441\u0443\u0434\u0435 \u0438\u043b\u0438 \u043f\u0435\u0440\u0435\u0434 \u0433\u043e\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043d\u043d\u044b\u043c\u0438 \u043e\u0440\u0433\u0430\u043d\u0430\u043c\u0438. \u041f\u0440\u0430\u0432\u0438\u043b\u0430 \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u043e\u0433\u043e \u0448\u0442\u0430\u0442\u0430 \u043f\u043e \u0441\u0443\u0434\u0430\u043c, \u0432\u0437\u044b\u0441\u043a\u0430\u043d\u0438\u044e, \u043a\u043e\u043d\u0444\u0438\u0434\u0435\u043d\u0446\u0438\u0430\u043b\u044c\u043d\u043e\u0441\u0442\u0438, \u0438\u043c\u043c\u0438\u0433\u0440\u0430\u0446\u0438\u0438 \u0438 \u043d\u0435\u0430\u0432\u0442\u043e\u0440\u0438\u0437\u043e\u0432\u0430\u043d\u043d\u043e\u0439 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u043f\u0440\u0430\u043a\u0442\u0438\u043a\u0435 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u044e\u0442\u0441\u044f \u0434\u043e \u043d\u0430\u0447\u0430\u043b\u0430 \u0440\u0430\u0431\u043e\u0442\u044b.',
  es: 'VitaCoreX LLC es una empresa registrada en Florida que ofrece soporte remoto administrativo, de flujo de trabajo, documental y de control de expedientes en todo Estados Unidos donde lo permita la ley aplicable. VitaCoreX no es un bufete de abogados, no brinda asesoramiento legal, no es una agencia de cobro con licencia, no cobra deudas y no representa a clientes ante tribunales ni agencias gubernamentales. Las reglas espec\u00edficas de cada estado sobre tribunales, cobro, privacidad, inmigraci\u00f3n y pr\u00e1ctica no autorizada del derecho se confirman antes de iniciar la colaboraci\u00f3n.'
};

const TRUST = {
  en: 'Florida-registered LLC \u00b7 U.S.-wide remote support where permitted \u00b7 Not a law firm \u00b7 Not a collection agency \u00b7 No legal advice \u00b7 No debt collection \u00b7 Scope confirmed at intake',
  ru: 'LLC, \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u0430\u044f \u0432\u043e \u0424\u043b\u043e\u0440\u0438\u0434\u0435 \u00b7 \u0423\u0434\u0430\u043b\u0451\u043d\u043d\u0430\u044f \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u043f\u043e \u0421\u0428\u0410 \u0442\u0430\u043c, \u0433\u0434\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043d\u043e \u00b7 \u041d\u0435 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0444\u0438\u0440\u043c\u0430 \u00b7 \u041d\u0435 \u043a\u043e\u043b\u043b\u0435\u043a\u0442\u043e\u0440\u0441\u043a\u043e\u0435 \u0430\u0433\u0435\u043d\u0442\u0441\u0442\u0432\u043e \u00b7 \u0411\u0435\u0437 \u044e\u0440\u0438\u0434\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0441\u043e\u0432\u0435\u0442\u043e\u0432 \u00b7 \u0411\u0435\u0437 \u0432\u0437\u044b\u0441\u043a\u0430\u043d\u0438\u044f \u0434\u043e\u043b\u0433\u043e\u0432 \u00b7 \u041e\u0431\u044a\u0451\u043c \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0430\u0435\u0442\u0441\u044f \u043d\u0430 \u043f\u0440\u0438\u0451\u043c\u0435',
  es: 'LLC registrada en Florida \u00b7 Soporte remoto en EE. UU. donde est\u00e9 permitido \u00b7 No es bufete de abogados \u00b7 No es agencia de cobros \u00b7 Sin asesoramiento legal \u00b7 Sin cobro de deudas \u00b7 Alcance confirmado en la admisi\u00f3n'
};

// Escape for use inside a double-quoted JS string literal.
function jsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

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

  // Only touch files that actually define window.SITE_I18N.
  if (!/window\.SITE_I18N\s*=/.test(html)) return false;

  let updated = 0;

  // For each language, find the language block and update footer_disc inside.
  // Structure: "<lang>": { ... "footer_disc": "...", ... }
  // We use a dumb but reliable approach: locate the opening `"lang": {` and
  // then within the next ~20KB find `"footer_disc": "..."`.
  for (const lang of ['en', 'ru', 'es']) {
    const blockRe = new RegExp('"' + lang + '"\\s*:\\s*\\{', 'g');
    let match;
    while ((match = blockRe.exec(html)) !== null) {
      const startIdx = match.index + match[0].length;
      // Find the matching closing brace by counting depth.
      let depth = 1;
      let i = startIdx;
      while (i < html.length && depth > 0) {
        const ch = html[i];
        if (ch === '"') {
          // Skip string literal.
          i++;
          while (i < html.length) {
            if (html[i] === '\\') { i += 2; continue; }
            if (html[i] === '"') { i++; break; }
            i++;
          }
          continue;
        }
        if (ch === '{') depth++;
        else if (ch === '}') depth--;
        i++;
      }
      const blockEnd = i;
      const block = html.substring(startIdx, blockEnd);

      // Find and replace footer_disc value.
      const discRe = /"footer_disc"\s*:\s*"((?:[^"\\]|\\.)*)"/;
      const discMatch = block.match(discRe);
      if (!discMatch) continue;

      const newDisc = '"footer_disc": "' + jsEscape(DISC[lang]) + '"';
      let newBlock = block.replace(discRe, newDisc);

      // If footer_trust_line is absent, insert it right after footer_disc.
      if (!/"footer_trust_line"\s*:/.test(newBlock)) {
        newBlock = newBlock.replace(
          /"footer_disc"\s*:\s*"(?:[^"\\]|\\.)*"(\s*,?)/,
          (m, trailingComma) => {
            const comma = trailingComma.trim() === ',' ? ',' : ',';
            return m + '\n    "footer_trust_line": "' + jsEscape(TRUST[lang]) + '"' + (trailingComma.includes(',') ? '' : ',');
          }
        );
      }

      if (newBlock !== block) {
        html = html.substring(0, startIdx) + newBlock + html.substring(blockEnd);
        updated++;
        // Reset regex lastIndex — string length changed.
        blockRe.lastIndex = 0;
      }
    }
  }

  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`updated ${rel}  (blocks:${updated})`);
    return true;
  }
  return false;
}

function main() {
  const files = walk(ROOT);
  let changed = 0;
  for (const f of files) {
    if (processFile(f)) changed++;
  }
  console.log(`\n=== SITE_I18N footer_disc / footer_trust_line propagation ===`);
  console.log(`  Files scanned:  ${files.length}`);
  console.log(`  Files updated:  ${changed}`);
}

main();
