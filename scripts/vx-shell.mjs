#!/usr/bin/env node
/* VitaCoreX v2 shell builder.
   - Generates ONE header + ONE footer from assets/data/vcx-catalog.json and assets/i18n/en.json
     and writes them into every public page between <!-- vx:header:start/end --> and
     <!-- vx:footer:start/end --> markers (legacy headers/footers are replaced on first run).
   - Ensures every page loads /assets/css/vcx-v2-shell.css and /assets/js/vcx-v2.js.
   - Static EN fill: leaf elements with data-t / data-svc-* get their English text from
     en.json / the catalog, so pages read correctly before JS runs. New data-t keys found in
     HTML are added to en.json (HTML text is the seed; en.json is the master afterwards).
   Usage: node scripts/vx-shell.mjs [--check]   (--check: report only, write nothing) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
/* --api=https://api.example.com  rewrites <meta name="vcx-api"> on every v2 page (release step). */
const API_ARG = (process.argv.find((a) => a.startsWith('--api=')) || '').slice(6);
if (API_ARG && !/^https?:\/\/[^\s"<>]+$/.test(API_ARG)) { console.error('invalid --api value'); process.exit(2); }
const catalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data/vcx-catalog.json'), 'utf8'));
const enPath = path.join(ROOT, 'assets/i18n/en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
let enChanged = false;
const report = { files: 0, changed: [], newKeys: [], conflicts: [], noFooter: [] };

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (c) => (c % 100 === 0 ? `$${(c / 100).toLocaleString('en-US')}` : `$${(c / 100).toFixed(2)}`);
const fmt = (k, p) => (en[k] || '').replace(/\{(\w+)\}/g, (m, x) => (p[x] ?? m));
const svc = (id) => catalog.services[id];

function priceInfo(id) {
  const s = svc(id); const p = s.price; const a = p.amount_cents; const o = { unit: s.unit.en };
  switch (p.display) {
    case 'fixed': return { ...o, amount: money(a), short: money(a), tag: en['price.tag.fixed'], cls: 'vx-tag--fixed' };
    case 'fixed_plus_fees': return { ...o, amount: money(a), short: fmt('price.plus_fees', { amount: money(a) }), tag: en['price.tag.fixed_fees'], cls: 'vx-tag--fixed' };
    case 'from': { const v = fmt('price.from', { amount: money(a) }); return { ...o, amount: v, short: v, tag: en['price.tag.after_review'], cls: 'vx-tag--quote' }; }
    case 'per_unit': return { ...o, amount: money(a), short: fmt('price.per_page_short', { amount: money(a) }), tag: en['price.tag.after_review'], cls: 'vx-tag--quote' };
    case 'per_word': return { ...o, amount: money(a), short: fmt('price.per_word_short', { amount: money(a) }), tag: en['price.tag.after_review'], cls: 'vx-tag--quote' };
    case 'free_scope': return { ...o, amount: en['price.no_charge'], short: en['price.no_charge'], tag: en['price.tag.free'], cls: 'vx-tag--free' };
    default: return { ...o, amount: en['price.quote'], short: en['price.quote'], tag: en['price.tag.individual'], cls: 'vx-tag--quote' };
  }
}
const priceHTML = (id, noTag) => { const pi = priceInfo(id); return `<div class="vx-price"><span class="vx-price__amount">${esc(pi.amount)}</span><span class="vx-price__unit">${esc(pi.unit)}</span>${noTag ? '' : ` <span class="vx-price__tag ${pi.cls}">${esc(pi.tag)}</span>`}</div>`; };
const reqHref = (id) => (svc(id).action === 'b2b' ? '/small-claims-documentation.html#check' : `/request.html?service=${id}`);
const pageHref = (id) => { const p = svc(id).page; return p && !p.startsWith('/request.html') ? p : reqHref(id); };

/* ---------- header ---------- */
const ICON_GLOBE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>';
const ICON_PHONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92Z"/></svg>';
const ICON_MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const privateGroups = catalog.groups.filter((g) => g.lane === 'private');
const langItem = (code, name, on) => `<li role="none"><button type="button" role="menuitemradio" aria-checked="${on}" data-vx-lang="${code}" lang="${code}">${name}</button></li>`;
const segBtn = (code, name, on) => `<button type="button" aria-pressed="${on}" data-vx-lang="${code}" lang="${code}">${name}</button>`;
const svcLink = (id) => `<li><a href="${pageHref(id)}"><span data-svc-name="${id}">${esc(svc(id).name.en)}</span><small data-svc-price-short="${id}">${esc(priceInfo(id).short)}</small></a></li>`;

function headerHTML() {
  const mega = privateGroups.map((g) => `<div class="vx-mega__group"><h3 data-t="group.${g.id}">${esc(g.name.en)}</h3><ul>${g.services.map(svcLink).join('')}</ul></div>`).join('');
  const drawerGroups = privateGroups.map((g) => `<h3 data-t="group.${g.id}">${esc(g.name.en)}</h3><ul>${g.services.map(svcLink).join('')}</ul>`).join('');
  return `<!-- vx:header:start -->
<a class="vx-skip" href="#main-content" data-t="skip">${esc(en.skip)}</a>
<header class="vx-hdr" role="banner">
<div class="vx-hdr__row">
<a class="vx-brand" href="/" aria-label="${esc(en['nav.home_aria'])}" data-t-attr="aria-label:nav.home_aria"><img src="/assets/img/logo-84.png" alt="" width="42" height="42"><span class="vx-brand__text"><span class="vx-brand__name">VitaCoreX</span><span class="vx-brand__tag">Consulting</span></span></a>
<nav class="vx-nav" aria-label="${esc(en['nav.primary_aria'])}" data-t-attr="aria-label:nav.primary_aria">
<div class="vx-nav__menu" data-open="false"><button type="button" class="vx-nav__trigger" aria-expanded="false" aria-controls="vx-mega"><span data-t="nav.services">${esc(en['nav.services'])}</span><span class="vx-caret" aria-hidden="true"></span></button>
<div class="vx-mega" id="vx-mega">${mega}<div class="vx-mega__foot"><a href="/services.html" data-t="nav.all_services">${esc(en['nav.all_services'])}</a><a href="/pricing.html" data-t="nav.all_prices">${esc(en['nav.all_prices'])}</a><a href="/request.html?service=legal_request" data-t="nav.not_sure">${esc(en['nav.not_sure'])}</a></div></div></div>
<a href="/small-claims-documentation.html" data-t="nav.business">${esc(en['nav.business'])}</a>
<a href="/pricing.html" data-t="nav.prices">${esc(en['nav.prices'])}</a>
<a href="/about.html" data-t="nav.about">${esc(en['nav.about'])}</a>
<a href="/contact.html" data-t="nav.contact">${esc(en['nav.contact'])}</a>
</nav>
<div class="vx-hdr__meta">
<div class="vx-lang" data-open="false"><button type="button" class="vx-lang__btn" aria-haspopup="menu" aria-expanded="false" aria-controls="vx-lang-list">${ICON_GLOBE}<span class="vx-sr" data-t="lang.choose_aria">${esc(en['lang.choose_aria'])}</span><span data-vx-lang-current>English</span><span class="vx-caret" aria-hidden="true"></span></button>
<ul class="vx-lang__list" id="vx-lang-list" role="menu">${langItem('en', 'English', true)}${langItem('ru', 'Русский', false)}${langItem('es', 'Español', false)}</ul></div>
<a class="vx-hdr__phone" href="tel:+18887948292" aria-label="${esc(en['nav.call_aria'])}" data-t-attr="aria-label:nav.call_aria">${ICON_PHONE}<span class="vx-hdr__phone-num">(888) 794-8292</span></a>
<a class="vx-btn vx-btn--accent vx-hdr__cta" href="/services.html" data-t="nav.choose">${esc(en['nav.choose'])}</a>
<button type="button" class="vx-menu-btn" aria-expanded="false" aria-controls="vx-drawer">${ICON_MENU}<span data-vx-menu-label data-t="nav.menu">${esc(en['nav.menu'])}</span></button>
</div>
</div>
<div class="vx-drawer" id="vx-drawer" data-open="false">
<div class="vx-drawer__lang" role="group" aria-labelledby="vx-drawer-lang-h"><p id="vx-drawer-lang-h">Language / Язык / Idioma</p><div class="vx-seg">${segBtn('en', 'English', true)}${segBtn('ru', 'Русский', false)}${segBtn('es', 'Español', false)}</div></div>
${drawerGroups}
<h3 data-t="nav.business">${esc(en['nav.business'])}</h3><ul><li><a href="/small-claims-documentation.html" data-t="footer.small_claims">${esc(en['footer.small_claims'])}</a></li></ul>
<ul><li><a href="/services.html" data-t="nav.all_services">${esc(en['nav.all_services'])}</a></li><li><a href="/pricing.html" data-t="nav.prices">${esc(en['nav.prices'])}</a></li><li><a href="/about.html" data-t="nav.about">${esc(en['nav.about'])}</a></li><li><a href="/contact.html" data-t="nav.contact">${esc(en['nav.contact'])}</a></li></ul>
<div class="vx-drawer__cta"><a class="vx-btn vx-btn--accent" href="/services.html" data-t="nav.choose">${esc(en['nav.choose'])}</a><a class="vx-btn vx-btn--ghost" href="tel:+18887948292">${ICON_PHONE}<span>(888) 794-8292</span></a></div>
</div>
</header>
<!-- vx:header:end -->`;
}

/* ---------- footer ---------- */
const IMM = {
  en: 'I AM NOT AN ATTORNEY LICENSED TO PRACTICE LAW AND MAY NOT GIVE LEGAL ADVICE OR ACCEPT FEES FOR LEGAL ADVICE. I AM NOT ACCREDITED TO REPRESENT YOU IN IMMIGRATION MATTERS.',
  ru: 'Я НЕ ЯВЛЯЮСЬ АДВОКАТОМ С ЛИЦЕНЗИЕЙ НА ЮРИДИЧЕСКУЮ ПРАКТИКУ И НЕ МОГУ ДАВАТЬ ЮРИДИЧЕСКИЕ КОНСУЛЬТАЦИИ ИЛИ ПРИНИМАТЬ ПЛАТУ ЗА ЮРИДИЧЕСКИЕ КОНСУЛЬТАЦИИ. Я НЕ АККРЕДИТОВАН ПРЕДСТАВЛЯТЬ ВАС ПО ИММИГРАЦИОННЫМ ВОПРОСАМ.',
  es: 'NO SOY ABOGADO CON LICENCIA PARA EJERCER LA ABOGACÍA Y NO PUEDO DAR ASESORAMIENTO LEGAL NI ACEPTAR HONORARIOS POR ASESORAMIENTO LEGAL. NO ESTOY ACREDITADO PARA REPRESENTARLE EN ASUNTOS DE INMIGRACIÓN.'
};
const NOTARY = {
  en: 'I AM NOT AN ATTORNEY LICENSED TO PRACTICE LAW IN THE STATE OF FLORIDA, AND I MAY NOT GIVE LEGAL ADVICE OR ACCEPT FEES FOR LEGAL ADVICE.',
  ru: 'Я НЕ ЯВЛЯЮСЬ АДВОКАТОМ С ЛИЦЕНЗИЕЙ НА ЮРИДИЧЕСКУЮ ПРАКТИКУ В ШТАТЕ ФЛОРИДА И НЕ МОГУ ДАВАТЬ ЮРИДИЧЕСКИЕ КОНСУЛЬТАЦИИ ИЛИ ПРИНИМАТЬ ПЛАТУ ЗА ЮРИДИЧЕСКИЕ КОНСУЛЬТАЦИИ.',
  es: 'NO SOY ABOGADO CON LICENCIA PARA EJERCER LA ABOGACÍA EN EL ESTADO DE FLORIDA Y NO PUEDO DAR ASESORAMIENTO LEGAL NI ACEPTAR HONORARIOS POR ASESORAMIENTO LEGAL.'
};
export const NOTICES = { IMM, NOTARY };

function footerHTML() {
  const fsvc = ['translation_certified', 'notary_ron_single', 'apostille_coordination', 'tax_1040_simple', 'company_basic', 'business_plan_basic', 'contracts_documents', 'immigration_simple', 'legal_request']
    .map((id) => `<li><a href="${pageHref(id)}" data-svc-name="${id}">${esc(svc(id).name.en)}</a></li>`).join('');
  return `<!-- vx:footer:start -->
<footer class="vx-ftr" role="contentinfo">
<div class="vx-ftr__inner">
<div class="vx-ftr__grid">
<div class="vx-ftr__brand"><a class="vx-brand" href="/" aria-label="${esc(en['nav.home_aria'])}" data-t-attr="aria-label:nav.home_aria"><img src="/assets/img/logo-84.png" alt="" width="42" height="42" loading="lazy"><span class="vx-brand__text"><span class="vx-brand__name">VitaCoreX</span><span class="vx-brand__tag">Consulting</span></span></a><p data-t="footer.desc">${esc(en['footer.desc'])}</p></div>
<nav aria-labelledby="vx-f-svc"><h2 id="vx-f-svc" data-t="footer.h.services">${esc(en['footer.h.services'])}</h2><ul>${fsvc}<li><a href="/services.html" data-t="nav.all_services">${esc(en['nav.all_services'])}</a></li></ul></nav>
<nav aria-labelledby="vx-f-biz"><h2 id="vx-f-biz" data-t="footer.h.business">${esc(en['footer.h.business'])}</h2><ul><li><a href="/small-claims-documentation.html" data-t="footer.small_claims">${esc(en['footer.small_claims'])}</a></li><li><a href="/small-claims-documentation.html#check" data-t="footer.check_case">${esc(en['footer.check_case'])}</a></li><li><a href="/net-recovery.html" data-t="footer.existing">${esc(en['footer.existing'])}</a></li></ul></nav>
<nav aria-labelledby="vx-f-co"><h2 id="vx-f-co" data-t="footer.h.company">${esc(en['footer.h.company'])}</h2><ul><li><a href="/about.html" data-t="nav.about">${esc(en['nav.about'])}</a></li><li><a href="/pricing.html" data-t="nav.prices">${esc(en['nav.prices'])}</a></li><li><a href="/contact.html" data-t="nav.contact">${esc(en['nav.contact'])}</a></li><li><a href="/careers.html" data-t="footer.careers">${esc(en['footer.careers'])}</a></li><li><a href="/privacy-policy.html" data-t="footer.privacy">${esc(en['footer.privacy'])}</a></li><li><a href="/terms-of-use.html" data-t="footer.terms">${esc(en['footer.terms'])}</a></li><li><a href="/cookie-policy.html" data-t="footer.cookies">${esc(en['footer.cookies'])}</a></li></ul></nav>
<div><h2 data-t="footer.h.contact">${esc(en['footer.h.contact'])}</h2><ul><li><a href="tel:+18887948292">(888) 794-8292</a></li><li><a href="mailto:info@vitacorexllc.com">info@vitacorexllc.com</a></li><li data-t="footer.hours">${esc(en['footer.hours'])}</li><li data-t="footer.location">${esc(en['footer.location'])}</li><li><a href="https://www.instagram.com/vitacorex_llc/" rel="noopener" target="_blank">Instagram</a> · <a href="https://www.facebook.com/profile.php?id=61554844507884" rel="noopener" target="_blank">Facebook</a></li></ul></div>
</div>
<div class="vx-ftr__notices" role="region" aria-label="${esc(en['footer.notices_aria'])}" data-t-attr="aria-label:footer.notices_aria">
<section class="vx-notice" aria-labelledby="vx-n-imm"><h3 id="vx-n-imm" data-t="notice.imm.title">${esc(en['notice.imm.title'])}</h3><p lang="en">${IMM.en}</p><p lang="ru">${IMM.ru}</p><p lang="es">${IMM.es}</p></section>
<section class="vx-notice" data-vx-show-lang="ru" hidden><h3 data-t="notice.notary.title">${esc(en['notice.notary.title'])}</h3><p lang="en">${NOTARY.en}</p><p lang="ru">${NOTARY.ru}</p></section>
<section class="vx-notice" data-vx-show-lang="es" hidden><h3 data-t="notice.notary.title">${esc(en['notice.notary.title'])}</h3><p lang="en">${NOTARY.en}</p><p lang="es">${NOTARY.es}</p></section>
<p class="vx-ftr__general" data-t="footer.general">${esc(en['footer.general'])}</p>
</div>
<div class="vx-ftr__bottom"><span data-t="footer.copyright">${esc(en['footer.copyright'])}</span><span>Tampa, FL</span></div>
</div>
</footer>
<!-- vx:footer:end -->`;
}

/* ---------- helpers ---------- */
function replaceBetween(html, start, end, block) {
  const a = html.indexOf(start), b = html.indexOf(end);
  if (a === -1 || b === -1) return null;
  return html.slice(0, a) + block + html.slice(b + end.length);
}
function removeElement(html, openRe, tag) {
  const m = openRe.exec(html); if (!m) return { html, at: -1 };
  const at = m.index; let depth = 0; const re = new RegExp(`<${tag}\\b|</${tag}>`, 'gi'); re.lastIndex = at;
  let x; while ((x = re.exec(html))) { if (x[0].startsWith('</')) { depth--; if (depth === 0) return { html: html.slice(0, at) + html.slice(x.index + x[0].length), at }; } else depth++; }
  return { html, at: -1 };
}
function addKey(key, text, file) {
  const v = text.replace(/\s+/g, ' ').trim();
  if (!v) return;
  if (!(key in en)) { en[key] = v; enChanged = true; report.newKeys.push(`${key} (${file})`); }
}
function fillLeaves(html, file) {
  // data-t leaves: <tag ... data-t="key" ...>text</tag> (text without tags)
  html = html.replace(/<(\w+)((?:\s[^>]*?)?\sdata-t="([^"]+)"[^>]*)>([^<]*)<\/\1>/g, (m, tag, attrs, key, text) => {
    addKey(key, decodeEntities(text), file);
    return `<${tag}${attrs}>${esc(en[key])}</${tag}>`;
  });
  // data-t-html blocks: balanced; seed only
  const reH = /<(\w+)(?:\s[^>]*?)?\sdata-t-html="([^"]+)"[^>]*>/g; let mm;
  while ((mm = reH.exec(html))) {
    const tag = mm[1], key = mm[2], startInner = mm.index + mm[0].length;
    let depth = 1; const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'gi'); re.lastIndex = startInner; let x, endInner = -1;
    while ((x = re.exec(html))) { if (x[0].startsWith('</')) { if (--depth === 0) { endInner = x.index; break; } } else depth++; }
    if (endInner === -1) continue;
    const inner = html.slice(startInner, endInner);
    if (!(key in en)) { en[key] = inner.replace(/\s+/g, ' ').trim(); enChanged = true; report.newKeys.push(`${key} (${file})`); }
    else if (inner.replace(/\s+/g, ' ').trim() !== en[key]) { html = html.slice(0, startInner) + en[key] + html.slice(endInner); reH.lastIndex = startInner + en[key].length; }
  }
  // catalog leaves
  html = html.replace(/<(\w+)((?:\s[^>]*?)?\sdata-svc-(name|short|unit|next|price-short)="([a-z0-9_]+)"[^>]*)>([^<]*)<\/\1>/g, (m, tag, attrs, kind, id) => {
    const s = svc(id); if (!s) { report.conflicts.push(`${file}: unknown service ${id}`); return m; }
    const v = kind === 'price-short' ? priceInfo(id).short : s[kind].en;
    return `<${tag}${attrs}>${esc(v)}</${tag}>`;
  });
  // price blocks: <div data-svc-price="id" ...>...</div> (inner replaced; no nested divs expected besides our own)
  html = html.replace(/<div((?:\s[^>]*?)?\sdata-svc-price="([a-z0-9_]+)"[^>]*)>(?:<div class="vx-price">[\s\S]*?<\/div>)?<\/div>/g, (m, attrs, id) => {
    if (!svc(id)) return m; return `<div${attrs}>${priceHTML(id, /data-no-tag/.test(attrs))}</div>`;
  });
  // service action links: text + href
  html = html.replace(/<a((?:\s[^>]*?)?\sdata-svc-action="([a-z0-9_]+)"[^>]*)>([^<]*)<\/a>/g, (m, attrs, id) => {
    const s = svc(id); if (!s) return m;
    let a = attrs; if (!/data-keep-href/.test(a)) a = a.replace(/\shref="[^"]*"/, '') + ` href="${reqHref(id)}"`;
    return `<a${a}>${esc(en['action.' + s.action])}</a>`;
  });
  html = prerender(html);
  return html;
}

/* Static EN pre-render for JS-rendered catalog blocks (no-JS/SEO parity with vcx-v2.js). */
function serviceCardEN(id) {
  const s = svc(id); if (!s) return '';
  const details = s.page && !s.page.startsWith('/request.html');
  return `<article class="vx-scard" data-service="${id}"><h3>${esc(s.name.en)}</h3><p>${esc(s.short.en)}</p>${priceHTML(id)}<div class="vx-scard__actions"><a class="vx-btn vx-btn--accent" href="${reqHref(id)}">${esc(en['action.' + s.action])}</a>${details ? `<a class="vx-btn vx-btn--line" href="${s.page}">${esc(en['action.details'])}</a>` : ''}</div></article>`;
}
function pricingEN() {
  return catalog.groups.map((g) => {
    const rows = g.services.map((id) => {
      const s = svc(id), pi = priceInfo(id);
      const extra = (s.extra.en || []).slice(0, 2).join('; ');
      const link = s.page && !s.page.startsWith('/request.html') ? `<a href="${s.page}">${esc(s.name.en)}</a>` : esc(s.name.en);
      return `<tr><th scope="row">${link}<small>${esc(s.unit.en)}</small></th><td class="vx-ptable__price" data-label="${esc(en['pricing.col.price'])}">${esc(pi.short)}<small>${esc(pi.tag)}</small></td><td data-label="${esc(en['pricing.col.extra'])}">${esc(extra)}</td><td class="vx-ptable__go"><a class="vx-btn vx-btn--line" href="${reqHref(id)}">${esc(en['action.' + s.action])}</a></td></tr>`;
    }).join('');
    return `<table class="vx-ptable"><caption>${esc(g.name.en)}</caption><thead><tr><th scope="col">${esc(en['pricing.col.service'])}</th><th scope="col">${esc(en['pricing.col.price'])}</th><th scope="col">${esc(en['pricing.col.extra'])}</th><th scope="col"><span class="vx-sr">${esc(en['pricing.col.action'])}</span></th></tr></thead><tbody>${rows}</tbody></table>`;
  }).join('');
}
function prerender(html) {
  const re = /<div((?:\s[^>]*?)?\sdata-vx-render="(service-cards|pricing)"[^>]*)>/g; let m; let out = html;
  const jobs = [];
  while ((m = re.exec(html))) {
    const start = m.index + m[0].length; let depth = 1; const r2 = /<div\b[^>]*>|<\/div>/g; r2.lastIndex = start; let x, end = -1;
    while ((x = r2.exec(html))) { if (x[0] === '</div>') { if (--depth === 0) { end = x.index; break; } } else depth++; }
    if (end === -1) continue;
    let inner;
    if (m[2] === 'pricing') inner = pricingEN();
    else {
      const g = /data-group="([a-z_]+)"/.exec(m[1]); const ids = /data-services="([^"]+)"/.exec(m[1]);
      const list = g ? (catalog.groups.find((y) => y.id === g[1]) || { services: [] }).services : (ids ? ids[1].split(/[\s,]+/) : []);
      inner = list.map(serviceCardEN).join('');
    }
    jobs.push([start, end, inner]);
  }
  for (const [s, e, inner] of jobs.reverse()) out = out.slice(0, s) + inner + out.slice(e);
  return out;
}
function decodeEntities(s) { return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–'); }

function ensureHead(html) {
  const css = '<link rel="stylesheet" href="/assets/css/vcx-v2-shell.css?v=1">';
  const js = '<script src="/assets/js/vcx-v2.js?v=1" defer></script>';
  if (!html.includes('/assets/css/vcx-v2-shell.css')) html = html.replace('</head>', `${css}\n</head>`);
  if (!html.includes('/assets/js/vcx-v2.js')) html = html.replace('</head>', `${js}\n</head>`);
  return html;
}

/* ---------- run ---------- */
const SKIP = new Set(['google4ac6122041612c23.html', 'yandex_7c27f4f2ed32ff4d.html', 'curated-preview.html', 'app.html', 'index.html.bak-4cells']);
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !SKIP.has(f));
const HEADER = headerHTML();
const FOOTER = footerHTML();

for (const f of pages) {
  const p = path.join(ROOT, f);
  let html = fs.readFileSync(p, 'utf8'); const orig = html;
  if (/http-equiv="refresh"/i.test(html) && html.length < 4000) continue; // tiny redirect stubs
  report.files++;
  const isV2 = /<body[^>]*\bclass="[^"]*\bvx\b/.test(html);
  // header
  let next = replaceBetween(html, '<!-- vx:header:start -->', '<!-- vx:header:end -->', HEADER);
  if (next == null) {
    html = html.replace(/<a class="vcx-skip-link"[^>]*>[\s\S]*?<\/a>\s*/, '');
    let r = removeElement(html, /<header class="vcx-header-glass"/, 'header'); let at = r.at; html = r.html;
    r = removeElement(html, /<header class="vcx-header"/, 'header'); if (at === -1) at = r.at; html = r.html;
    if (at === -1) { const b = html.search(/<body[^>]*>/); at = b + html.slice(b).indexOf('>') + 1; }
    html = html.slice(0, at) + '\n' + HEADER + '\n' + html.slice(at);
  } else html = next;
  // footer
  next = replaceBetween(html, '<!-- vx:footer:start -->', '<!-- vx:footer:end -->', FOOTER);
  if (next == null) {
    let r = removeElement(html, /<footer class="vcx-footer-modern"/, 'footer'); let at = r.at; html = r.html;
    if (at === -1) { r = removeElement(html, /<footer class="vcx-footer"/, 'footer'); at = r.at; html = r.html; }
    if (at === -1) { r = removeElement(html, /<footer\b/, 'footer'); at = r.at; html = r.html; }
    if (at === -1) { report.noFooter.push(f); at = html.lastIndexOf('</body>'); }
    html = html.slice(0, at) + '\n' + FOOTER + '\n' + html.slice(at);
  } else html = next;
  html = ensureHead(html);
  if (API_ARG) html = html.replace(/<meta name="vcx-api" content="[^"]*">/g, `<meta name="vcx-api" content="${API_ARG.replace(/\/$/, '')}">`);
  if (!isV2 && !/data-vx-legacy=/.test(html)) html = html.replace(/<body\b/, '<body data-vx-legacy="1"');
  if (!/id="main-content"/.test(html)) html = html.replace(/<main\b/, '<main id="main-content"');
  html = fillLeaves(html, f);
  if (html !== orig) { report.changed.push(f); if (!CHECK) fs.writeFileSync(p, html); }
}
if (enChanged && !CHECK) fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log(JSON.stringify({ files: report.files, changed: report.changed.length, newKeys: report.newKeys.length, conflicts: report.conflicts, noFooter: report.noFooter }, null, 1));
if (report.newKeys.length) console.log('new keys:\n  ' + report.newKeys.slice(0, 400).join('\n  '));
