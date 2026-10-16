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
import crypto from 'node:crypto';
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
/* Localized static pages (/ru/, /es/): the same pipeline runs with LC/D switched (SEO + no flash of English). */
const DICTS = { en, ru: JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/i18n/ru.json'), 'utf8')), es: JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/i18n/es.json'), 'utf8')) };
const NATIVE = { en: 'English', ru: 'Русский', es: 'Español' };
let LC = 'en'; let D = en;
const T = (k) => (D[k] ?? en[k] ?? '');
const loc = (o) => (o ? (o[LC] ?? o.en) : '');
const locList = (o) => (o ? (o[LC] || o.en || []) : []);
const report = { files: 0, changed: [], newKeys: [], conflicts: [], noFooter: [] };

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const money = (c) => (c % 100 === 0 ? `$${(c / 100).toLocaleString('en-US')}` : `$${(c / 100).toFixed(2)}`);
const fmt = (k, p) => (T(k) || '').replace(/\{(\w+)\}/g, (m, x) => (p[x] ?? m));
const svc = (id) => catalog.services[id];

function priceInfo(id) {
  const s = svc(id); const p = s.price; const a = p.amount_cents; const o = { unit: loc(s.unit) };
  switch (p.display) {
    case 'fixed': return { ...o, amount: money(a), short: money(a), tag: T('price.tag.fixed'), cls: 'vx-tag--fixed' };
    case 'fixed_plus_fees': return { ...o, amount: money(a), short: fmt(p.fees_label ? `price.plus_fees_${p.fees_label}` : 'price.plus_fees', { amount: money(a) }), tag: T('price.tag.fixed_fees'), cls: 'vx-tag--fixed' };
    case 'from': { const v = fmt('price.from', { amount: money(a) }); return { ...o, amount: v, short: v, tag: T('price.tag.after_review'), cls: 'vx-tag--quote' }; }
    case 'per_unit': return { ...o, amount: money(a), short: fmt('price.per_page_short', { amount: money(a) }), tag: T('price.tag.after_review'), cls: 'vx-tag--quote' };
    case 'per_hour': return { ...o, amount: money(a), short: p.minimum_units > 1 ? fmt('price.per_hour_min_short', { amount: money(a), units: p.minimum_units }) : fmt('price.per_hour_short', { amount: money(a) }),
      ...(p.prepay_units ? { tag: fmt('price.tag.prepay', { amount: money(a * p.prepay_units) }), cls: 'vx-tag--fixed' } : { tag: T('price.tag.after_review'), cls: 'vx-tag--quote' }) };
    case 'per_word': return { ...o, amount: money(a), short: fmt('price.per_word_short', { amount: money(a) }), tag: T('price.tag.after_review'), cls: 'vx-tag--quote' };
    case 'free_scope': return { ...o, amount: T('price.no_charge'), short: T('price.no_charge'), tag: T('price.tag.free'), cls: 'vx-tag--free' };
    // success fee: a share of what debtors actually pay; no amount in cents
    case 'percent': return { ...o, amount: p.percent + '%', short: p.percent + '%', tag: T('price.tag.success'), cls: 'vx-tag--fixed' };
    default: return { ...o, amount: T('price.quote'), short: T('price.quote'), tag: T('price.tag.individual'), cls: 'vx-tag--quote' };
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
  const feature = '';
  const menuIds = (g) => g.menu || g.services;
  const plain = (href, key) => `<li><a href="${href}"><span data-t="${key}">${esc(en[key])}</span></a></li>`;
  // the business lane carries prices like every other group, and comes right after court everywhere (mega DOM, drawer)
  const bizLinks = ['b2b_small_claims_packet', 'b2b_small_claims_support', 'b2b_small_claims_retainer', 'b2b_small_claims_hourly', 'b2b_recovery_analysis', 'b2b_recovery_rollout'].map(svcLink).join('');
  const biz = `<div class="vx-mega__group vx-mega__group--biz"><h3 data-t="mega.biz.title">${esc(en['mega.biz.title'])}</h3><ul>${bizLinks}</ul></div>`;
  const megaGroup = (g) => `<div class="vx-mega__group vx-mega__group--${g.id}"><h3 data-t="group.${g.id}">${esc(g.name.en)}</h3><ul>${menuIds(g).map(svcLink).join('')}</ul></div>`;
  const mega = feature + megaGroup(privateGroups[0]) + biz + privateGroups.slice(1).map(megaGroup).join('');
  const drawerGroup = (g) => `<h3 data-t="group.${g.id}">${esc(g.name.en)}</h3><ul>${menuIds(g).map(svcLink).join('')}</ul>`;
  const drawerGroups = drawerGroup(privateGroups[0]) + `<h3 data-t="nav.business">${esc(en['nav.business'])}</h3><ul>${bizLinks}</ul>` + privateGroups.slice(1).map(drawerGroup).join('');
  return `<!-- vx:header:start -->
<a class="vx-skip" href="#main-content" data-t="skip">${esc(en.skip)}</a>
<header class="vx-hdr" role="banner">
<div class="vx-hdr__row">
<a class="vx-brand" href="/" aria-label="${esc(en['nav.home_aria'])}" data-t-attr="aria-label:nav.home_aria"><img src="/assets/img/logo-84.png" alt="" width="42" height="42"><span class="vx-brand__text"><span class="vx-brand__name">VitaCoreX</span><span class="vx-brand__tag">Consulting</span></span></a>
<nav class="vx-nav" aria-label="${esc(en['nav.primary_aria'])}" data-t-attr="aria-label:nav.primary_aria">
<div class="vx-nav__menu" data-open="false"><button type="button" class="vx-nav__trigger" aria-expanded="false" aria-controls="vx-mega"><span data-t="nav.services">${esc(en['nav.services'])}</span><span class="vx-caret" aria-hidden="true"></span></button>
<div class="vx-mega" id="vx-mega">${mega}<div class="vx-mega__foot"><span class="vx-mega__links"><a href="/services.html" data-t="nav.all_services">${esc(en['nav.all_services'])}</a><a href="/pricing.html" data-t="nav.all_prices">${esc(en['nav.all_prices'])}</a></span><span class="vx-mega__unsure"><span data-t="mega.feature.title">${esc(en['mega.feature.title'])}</span><a class="vx-btn vx-btn--ghost" href="/request.html?service=legal_request" data-t="mega.feature.cta">${esc(en['mega.feature.cta'])}</a></span></div></div></div>
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
  const fsvc = ['name_change_adult_fl', 'fee_waiver_application', 'immigration_simple', 'company_basic', 'tax_1040_simple', 'translation_certified', 'notary_ron_single', 'apostille_coordination']
    .map((id) => `<li><a href="${pageHref(id)}" data-svc-name="${id}">${esc(svc(id).name.en)}</a></li>`).join('');
  const li = (href, key) => `<li><a href="${href}" data-t="${key}">${esc(en[key])}</a></li>`;
  return `<!-- vx:footer:start -->
<footer class="vx-ftr" role="contentinfo">
<p class="vx-ftr__ghost" aria-hidden="true" data-t="v5.ftr.ghost">${esc(en['v5.ftr.ghost'])}</p>
<div class="vx-ftr__inner">
<div class="vx-ftr__lead">
<div class="vx-ftr__brand"><a class="vx-brand" href="/" aria-label="${esc(en['nav.home_aria'])}" data-t-attr="aria-label:nav.home_aria"><img src="/assets/img/logo-84.png" alt="" width="42" height="42" loading="lazy"><span class="vx-brand__text"><span class="vx-brand__name">VitaCoreX</span><span class="vx-brand__tag">Consulting</span></span></a><p class="vx-ftr__statement" data-t-html="h3.title">${en['h3.title']}</p><p class="vx-ftr__statement-sub" data-t="footer.statement">${esc(en['footer.statement'])}</p></div>
<div class="vx-ftr__reach"><h2 class="vx-sr" data-t="footer.h.contact">${esc(en['footer.h.contact'])}</h2><a class="vx-ftr__phone" href="tel:+18887948292">${ICON_PHONE}<span>(888) 794-8292</span></a><a class="vx-ftr__mail" href="mailto:info@vitacorexllc.com">info@vitacorexllc.com</a><p><span data-t="footer.hours">${esc(en['footer.hours'])}</span><br><span data-t="footer.location">${esc(en['footer.location'])}</span></p></div>
</div>
<div class="vx-ftr__grid">
<nav aria-labelledby="vx-f-svc"><h2 id="vx-f-svc" data-t="footer.h.services">${esc(en['footer.h.services'])}</h2><ul>${fsvc}<li><a class="vx-ftr__all" href="/services.html" data-t="nav.all_services">${esc(en['nav.all_services'])}</a></li></ul></nav>
<nav aria-labelledby="vx-f-biz"><h2 id="vx-f-biz" data-t="footer.h.business">${esc(en['footer.h.business'])}</h2><ul>${li('/small-claims-documentation.html', 'footer.small_claims')}${li('/small-claims-documentation.html#check', 'footer.check_case')}${li('/financial-recovery.html', 'fr.nav')}</ul></nav>
<nav aria-labelledby="vx-f-co"><h2 id="vx-f-co" data-t="footer.h.company">${esc(en['footer.h.company'])}</h2><ul>${li('/about.html', 'nav.about')}${li('/pricing.html', 'nav.prices')}${li('/contact.html', 'nav.contact')}${li('/careers.html', 'footer.careers')}</ul></nav>
<nav aria-labelledby="vx-f-legal"><h2 id="vx-f-legal" data-t="footer.h.legal">${esc(en['footer.h.legal'])}</h2><ul>${li('/privacy-policy.html', 'footer.privacy')}${li('/terms-of-use.html', 'footer.terms')}${li('/cookie-policy.html', 'footer.cookies')}</ul></nav>
</div>
<div class="vx-ftr__notices" role="region" aria-label="${esc(en['footer.notices_aria'])}" data-t-attr="aria-label:footer.notices_aria">
<section class="vx-notice vx-notice--imm" aria-labelledby="vx-n-imm"><h3 id="vx-n-imm" data-t="notice.imm.title">${esc(en['notice.imm.title'])}</h3><div class="vx-notice__cols"><p lang="en">${IMM.en}</p><p lang="ru">${IMM.ru}</p><p lang="es">${IMM.es}</p></div></section>
<section class="vx-notice" data-vx-show-lang="ru" hidden><h3 data-t="notice.notary.title">${esc(en['notice.notary.title'])}</h3><div class="vx-notice__cols vx-notice__cols--2"><p lang="en">${NOTARY.en}</p><p lang="ru">${NOTARY.ru}</p></div></section>
<section class="vx-notice" data-vx-show-lang="es" hidden><h3 data-t="notice.notary.title">${esc(en['notice.notary.title'])}</h3><div class="vx-notice__cols vx-notice__cols--2"><p lang="en">${NOTARY.en}</p><p lang="es">${NOTARY.es}</p></div></section>
</div>
<div class="vx-ftr__bottom"><span data-t="footer.copyright">${esc(en['footer.copyright'])}</span><span class="vx-ftr__social"><a href="https://www.instagram.com/vitacorex_llc/" rel="noopener" target="_blank">Instagram</a><a href="https://www.facebook.com/profile.php?id=61554844507884" rel="noopener" target="_blank">Facebook</a></span></div>
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
/* v5 template strings (data-t5-tpl): the same substitutions as vcx-v2.js, so RU/ES static copies are complete without JS */
function fillTpl(html) {
  html = html.replace(/<(\w+)((?:\s[^>]*?)?\sdata-t5-tpl="([^"]+)"[^>]*)>([^<]*)<\/\1>/g, (m, tag, attrs, key) => {
    let v = T(key); if (!v) return m;
    const lk = /data-t5-lang="([^"]+)"/.exec(attrs); if (lk) v = v.replace('{lang}', T(lk[1]) || '');
    const n = /data-t5-n="([^"]+)"/.exec(attrs); if (n) v = v.replace('{n}', n[1]);
    const sid = /data-t5-svc="([^"]+)"/.exec(attrs); const s = sid && svc(sid[1]);
    if (s && s.price && s.price.amount_cents != null) v = v.replace('{money}', money(s.price.amount_cents)).replace('{ex}', money(2 * s.price.amount_cents));
    return v.includes('{') ? m : `<${tag}${attrs}>${esc(v)}</${tag}>`;
  });
  return html.replace(/(\sdata-vx5-src-lang="1")(?:\slang="[a-z]+")?/g, `$1 lang="${LC === 'ru' ? 'ru' : 'es'}"`);
}
function fillLeaves(html, file) {
  html = fillTpl(html);
  // data-t leaves: <tag ... data-t="key" ...>text</tag> (text without tags)
  html = html.replace(/<(\w+)((?:\s[^>]*?)?\sdata-t="([^"]+)"[^>]*)>([^<]*)<\/\1>/g, (m, tag, attrs, key, text) => {
    if (LC === 'en') addKey(key, decodeEntities(text), file);
    return `<${tag}${attrs}>${esc(T(key))}</${tag}>`;
  });
  // data-t-html blocks: balanced; seed only
  const reH = /<(\w+)(?:\s[^>]*?)?\sdata-t-html="([^"]+)"[^>]*>/g; let mm;
  while ((mm = reH.exec(html))) {
    const tag = mm[1], key = mm[2], startInner = mm.index + mm[0].length;
    let depth = 1; const re = new RegExp(`<${tag}\\b[^>]*>|</${tag}>`, 'gi'); re.lastIndex = startInner; let x, endInner = -1;
    while ((x = re.exec(html))) { if (x[0].startsWith('</')) { if (--depth === 0) { endInner = x.index; break; } } else depth++; }
    if (endInner === -1) continue;
    const inner = html.slice(startInner, endInner);
    if (LC === 'en' && !(key in en)) { en[key] = inner.replace(/\s+/g, ' ').trim(); enChanged = true; report.newKeys.push(`${key} (${file})`); }
    else if (inner.replace(/\s+/g, ' ').trim() !== T(key)) { html = html.slice(0, startInner) + T(key) + html.slice(endInner); reH.lastIndex = startInner + T(key).length; }
  }
  // catalog leaves
  html = html.replace(/<(\w+)((?:\s[^>]*?)?\sdata-svc-(name|short|unit|next|price-short)="([a-z0-9_]+)"[^>]*)>([^<]*)<\/\1>/g, (m, tag, attrs, kind, id) => {
    const s = svc(id); if (!s) { report.conflicts.push(`${file}: unknown service ${id}`); return m; }
    const v = kind === 'price-short' ? priceInfo(id).short : loc(s[kind]);
    return `<${tag}${attrs}>${esc(v)}</${tag}>`;
  });
  // catalog lists: <ul data-svc-list="id:included|extra">…</ul> → English items (runtime swaps language)
  html = html.replace(/<ul((?:\s[^>]*?)?\sdata-svc-list="([a-z0-9_]+):(included|extra)"[^>]*)>[\s\S]*?<\/ul>/g, (m, attrs, id, kind) => {
    const s = svc(id); if (!s || !s[kind]) return m;
    return `<ul${attrs}>${locList(s[kind]).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  });
  // price blocks: <div data-svc-price="id" ...>...</div> (inner replaced; no nested divs expected besides our own)
  html = html.replace(/<div((?:\s[^>]*?)?\sdata-svc-price="([a-z0-9_]+)"[^>]*)>(?:<div class="vx-price">[\s\S]*?<\/div>)?<\/div>/g, (m, attrs, id) => {
    if (!svc(id)) return m; return `<div${attrs}>${priceHTML(id, /data-no-tag/.test(attrs))}</div>`;
  });
  // inline price holders (v5 services index rows): <span data-svc-price="id" data-no-tag><span class="vx-price">…</span></span>
  html = html.replace(/<span((?:\s[^>]*?)?\sdata-svc-price="([a-z0-9_]+)"[^>]*)>(?:<span class="vx-price">(?:<span[^>]*>[^<]*<\/span>\s*)*<\/span>)?<\/span>/g, (m, attrs, id) => {
    if (!svc(id)) return m; const pi = priceInfo(id); const tag = /data-no-tag/.test(attrs) ? '' : ` <span class="vx-price__tag ${pi.cls}">${esc(pi.tag)}</span>`;
    return `<span${attrs}><span class="vx-price"><span class="vx-price__amount">${esc(pi.amount)}</span><span class="vx-price__unit">${esc(pi.unit)}</span>${tag}</span></span>`;
  });
  // action labels inside buttons (v5 index rows): <span data-svc-action="id">label</span>
  html = html.replace(/<span((?:\s[^>]*?)?\sdata-svc-action="([a-z0-9_]+)"[^>]*)>([^<]*)<\/span>/g, (m, attrs, id) => {
    const s = svc(id); return s ? `<span${attrs}>${esc(T('action.' + s.action))}</span>` : m;
  });
  // service action links: text + href
  html = html.replace(/<a((?:\s[^>]*?)?\sdata-svc-action="([a-z0-9_]+)"[^>]*)>([^<]*)<\/a>/g, (m, attrs, id) => {
    const s = svc(id); if (!s) return m;
    let a = attrs; if (!/data-keep-href/.test(a)) a = a.replace(/\shref="[^"]*"/, '') + ` href="${reqHref(id)}"`;
    return `<a${a}>${esc(T('action.' + s.action))}</a>`;
  });
  html = fillAttrs(html);
  html = prerender(html);
  html = prerenderEstimate(html);
  html = inlineIcons(html);
  return html;
}

/* data-t-attr="placeholder:key;aria-label:key2" → static attribute values in the page language. */
function fillAttrs(html) {
  return html.replace(/<[a-zA-Z][^>]*\sdata-t-attr="([^"]+)"[^>]*>/g, (tagSrc, spec) => {
    let out = tagSrc;
    for (const pair of spec.split(';')) {
      const bits = pair.split(':').map((x) => (x || '').trim()); const attr = bits[0], key = bits[1];
      if (!attr || !key || !(key in D || key in en)) continue;
      const v = esc(T(key)); const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
      out = re.test(out) ? out.replace(re, (m0, a, b) => a + v + b) : out.replace(/\sdata-t-attr=/, () => ` ${attr}="${v}" data-t-attr=`);
    }
    return out;
  });
}

/* Static icons: <span data-icon="globe"></span> → inline SVG (same set as assets/js/vcx-icons.js). */
const ICONS = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/vcx-icons.js'), 'utf8');
  const m = /var P = (\{[\s\S]*?\n  \});/.exec(src);
  return m ? Function(`"use strict"; return (${m[1]});`)() : {};
})();
function inlineIcons(html) {
  return html.replace(/<span([^>]*?)\sdata-icon="([a-z]+)"([^>]*)>(?:<svg[\s\S]*?<\/svg>)?<\/span>/g, (m, a, name, b) => {
    const d = ICONS[name]; if (!d) { report.conflicts.push('unknown icon ' + name); return m; }
    return `<span${a} data-icon="${name}"${b.replace(/\sdata-icon-done="1"/, '')} data-icon-done="1"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg></span>`;
  });
}

/* Static EN pre-render for JS-rendered catalog blocks (no-JS/SEO parity with vcx-v2.js). */
function serviceCardEN(id) {
  const s = svc(id); if (!s) return '';
  const details = s.page && !s.page.startsWith('/request.html');
  return `<article class="vx-scard" data-service="${id}"><h3>${esc(loc(s.name))}</h3><p>${esc(loc(s.short))}</p>${priceHTML(id)}<div class="vx-scard__actions"><a class="vx-btn vx-btn--accent" href="${reqHref(id)}">${esc(T('action.' + s.action))}</a>${details ? `<a class="vx-btn vx-btn--line" href="${s.page}">${esc(T('action.details'))}</a>` : ''}</div></article>`;
}
/* Service index rows (services.html) — same template as assets/js/vcx-v2-index.js rowHTML(). */
function indexRowEN(id) {
  const s = svc(id); if (!s) return '';
  const pi = priceInfo(id); const page = s.page && !s.page.startsWith('/request.html') ? s.page : null;
  const list = (k) => locList(s[k]).map((x) => `<li>${esc(x)}</li>`).join('');
  const name = page ? `<a href="${page}">${esc(loc(s.name))}</a>` : esc(loc(s.name));
  return `<article class="vx-irow" data-service="${id}" data-pay="${s.action === 'order' || s.action === 'book_pay' ? '1' : '0'}"><div class="vx-irow__main"><h3>${name}</h3><p>${esc(loc(s.short))}</p></div><div class="vx-irow__price"><span class="vx-irow__amount"><span class="vx-pmark vx-pmark--${pi.cls.replace('vx-tag--', '')}" aria-hidden="true"></span>${esc(pi.short)}<span class="vx-sr"> (${esc(pi.tag)})</span></span><span class="vx-irow__unit">${esc(pi.unit)}</span></div><div class="vx-irow__go"><a class="vx-btn vx-btn--line" href="${reqHref(id)}">${esc(T('action.' + s.action))}</a></div><details class="vx-irow__more"><summary>${esc(T('ix.more'))}</summary><div class="vx-irow__lists"><div><h4>${esc(T('scope.included'))}</h4><ul>${list('included')}</ul></div><div><h4>${esc(T('scope.extra'))}</h4><ul>${list('extra')}</ul></div></div></details></article>`;
}
function serviceIndexEN() {
  // every group in catalog order (court, for companies, business, taxes, documents): the B2B lane is a normal group with prices
  return catalog.groups.map((g) => `<section class="vx-index__group" id="${g.id}" data-group="${g.id}" aria-labelledby="ix-${g.id}"><h2 class="vx-index__gtitle" id="ix-${g.id}">${esc(loc(g.name))}</h2>${g.services.map(indexRowEN).join('')}</section>`).join('');
}
function pricingEN() {
  return catalog.groups.map((g) => {
    const rows = g.services.map((id) => {
      const s = svc(id), pi = priceInfo(id);
      const extra = locList(s.extra).slice(0, 2).join(' · ');
      const link = s.page && !s.page.startsWith('/request.html') ? `<a href="${s.page}">${esc(loc(s.name))}</a>` : esc(loc(s.name));
      return `<tr><th scope="row">${link}<small>${esc(loc(s.unit))}</small></th><td class="vx-ptable__price" data-label="${esc(T('pricing.col.price'))}"><span class="vx-pmark vx-pmark--${pi.cls.replace('vx-tag--', '')}" aria-hidden="true"></span>${esc(pi.short)}<span class="vx-sr"> (${esc(pi.tag)})</span></td><td data-label="${esc(T('pricing.col.extra'))}">${esc(extra)}</td><td class="vx-ptable__go"><a class="vx-btn vx-btn--line" href="${reqHref(id)}">${esc(T('action.' + s.action))}</a></td></tr>`;
    }).join('');
    return `<table class="vx-ptable"><caption>${esc(loc(g.name))}</caption><thead><tr><th scope="col">${esc(T('pricing.col.service'))}</th><th scope="col">${esc(T('pricing.col.price'))}</th><th scope="col">${esc(T('pricing.col.extra'))}</th><th scope="col"><span class="vx-sr">${esc(T('pricing.col.action'))}</span></th></tr></thead><tbody>${rows}</tbody></table>`;
  }).join('');
}
function prerender(html) {
  const re = /<div((?:\s[^>]*?)?\sdata-vx-render="(service-cards|pricing|service-index)"[^>]*)>/g; let m; let out = html;
  const jobs = [];
  while ((m = re.exec(html))) {
    const start = m.index + m[0].length; let depth = 1; const r2 = /<div\b[^>]*>|<\/div>/g; r2.lastIndex = start; let x, end = -1;
    while ((x = r2.exec(html))) { if (x[0] === '</div>') { if (--depth === 0) { end = x.index; break; } } else depth++; }
    if (end === -1) continue;
    let inner;
    if (m[2] === 'pricing') inner = pricingEN();
    else if (m[2] === 'service-index') inner = serviceIndexEN();
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
/* Full-cost estimator, English default state (first county, new name, default copies) — mirrors assets/js/vcx-v2-estimate.js. */
function prerenderEstimate(html) {
  const m = /data-vx-estimate="([a-z0-9_]+)"/.exec(html); if (!m) return html;
  const s = svc(m[1]); const F = s && s.third_party_fees; if (!F) return html;
  const range = (a, b) => (a === b ? money(a) : `${money(a)}–${money(b)}`);
  const row = (item, payee, amount) => `<tr><th scope="row">${esc(item)}</th><td>${esc(payee)}</td><td class="vx-est__num">${esc(amount)}</td></tr>`;
  const c = F.counties[0], fee = s.price.amount_cents, copies = F.default_copies || 3;
  const fmin = c.filing_cents ?? c.filing_min_cents, fmax = c.filing_cents ?? c.filing_max_cents;
  let fam = range(fmin, fmax); if (!c.verified && fmin === fmax) fam = fmt('nc.est.about', { amount: fam });
  const cc = F.certified_copy_cents * copies;
  const min = fee + fmin + F.background_check_cents + F.fingerprint_service_min_cents + cc;
  const max = fee + fmax + F.background_check_cents + F.fingerprint_service_max_cents + cc;
  const rows = row(T('nc.est.r_ours'), 'VitaCoreX', money(fee)) + row(T('nc.est.r_filing'), T('nc.est.p_clerk'), fam)
    + row(T('nc.est.r_check'), T('nc.est.p_fdle'), money(F.background_check_cents))
    + row(T('nc.est.r_prints'), T('nc.est.p_vendor'), range(F.fingerprint_service_min_cents, F.fingerprint_service_max_cents))
    + row(fmt('nc.est.r_copies', { n: copies }), T('nc.est.p_clerk'), money(cc));
  const opts = F.counties.map((x) => `<option value="${x.id}">${esc(x.name || T('nc.est.county_other'))}</option>`).join('');
  return html
    .replace(/(<select[^>]*data-est="county"[^>]*>)[\s\S]*?(<\/select>)/, (m0, a, b) => a + opts + b)
    .replace(/(<tbody data-est="rows">)[\s\S]*?(<\/tbody>)/, (m0, a, b) => a + rows + b)
    .replace(/(<strong[^>]*data-est="total"[^>]*>)[^<]*(<\/strong>)/, (m0, a, b) => a + esc(fmt('nc.est.about', { amount: range(min, max) })) + b)
    .replace(/(<p[^>]*data-est="paynote"[^>]*>)[^<]*(<\/p>)/, (m0, a, b) => a + esc(fmt('nc.est.paynote', { ours: money(fee), rest: range(min - fee, max - fee) })) + b)
    .replace(/(<output data-est="copies"[^>]*>)[^<]*(<\/output>)/, (m0, a, b) => a + copies + b);
}
function decodeEntities(s) { return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&mdash;/g, '—').replace(/&ndash;/g, '–'); }

function ensureHead(html) {
  const css = '<link rel="stylesheet" href="/assets/css/vcx-v2-shell.css?v=1">';
  const js = '<script src="/assets/js/vcx-v2.js?v=1" defer></script>';
  const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400..600;1,60,400&display=swap">';
  if (!html.includes('/assets/css/vcx-v2-shell.css')) html = html.replace('</head>', `${css}\n</head>`);
  if (!html.includes('family=Source+Serif+4')) {
    const i = html.indexOf('<link rel="stylesheet" href="/assets/css/vcx-v2-shell.css');
    html = i === -1 ? html.replace('</head>', `${fonts}\n</head>`) : html.slice(0, i) + fonts + '\n' + html.slice(i);
  }
  if (!html.includes('/assets/js/vcx-v2.js')) html = html.replace('</head>', `${js}\n</head>`);
  // v4: static italic (one accent word per page; 19 KB instead of the 127 KB variable italic)
  html = html.replace('1,8..60,400..600&display=swap', '1,60,400&display=swap');
  // v5 design layer ("Architecture of Order", variant B) replaces v4 (guilloché/rosette motif) on every page
  html = html.replace(/\n?<link rel="stylesheet" href="\/assets\/css\/vcx-v4\.css[^>]*>/g, '').replace(/\n?<script src="\/assets\/js\/vcx-v4-motif\.js[^>]*><\/script>/g, '');
  if (!html.includes('/assets/css/vcx-v5.css')) {
    const anchor = html.includes('/assets/css/vcx-v2.css') ? /<link rel="stylesheet" href="\/assets\/css\/vcx-v2\.css[^>]*>/ : /<link rel="stylesheet" href="\/assets\/css\/vcx-v2-shell\.css[^>]*>/;
    html = html.replace(anchor, (m) => `${m}\n<link rel="stylesheet" href="/assets/css/vcx-v5.css?v=1">`);
  }
  return html;
}

/* v7 "Assembly" layer on every rebuilt page: styles + script after the v2 engine; the body carries the site revision date and
   the date prices were checked (catalog_version) for the footer title block; the intro plays on the home hero once per visit */
const REV_DATE = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
const PRICES_DATE = (/^(\d{4}-\d{2}-\d{2})/.exec(catalog.catalog_version || '') || [])[1] || '';
const V7_INTRO = "<!-- vx7:intro --><script>try{if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)&&!sessionStorage.getItem('vx7i')){document.documentElement.classList.add('vx7-intro');sessionStorage.setItem('vx7i','1')}}catch(e){}</script><!-- /vx7:intro -->";
function addV7(html) {
  if (!html.includes('/assets/v7/vx7.css')) html = html.replace(/(<link rel="stylesheet" href="\/assets\/css\/vcx-v5\.css[^>]*>)/, '$1\n<link rel="stylesheet" href="/assets/v7/vx7.css?v=1">');
  if (!html.includes('/assets/v7/vx7.js')) html = html.replace(/(<script src="\/assets\/js\/vcx-v2\.js[^>]*><\/script>)/, '$1\n<script src="/assets/v7/vx7.js?v=1" defer></script>');
  // website chat launcher (owner 2026-10-16); the Vapi widget itself loads only when a visitor opens the chat
  if (!html.includes('/assets/js/vcx-chat.js')) html = html.replace(/(<script src="\/assets\/js\/vcx-v2\.js[^>]*><\/script>)/, '$1\n<script src="/assets/js/vcx-chat.js?v=1" defer></script>');
  html = html.replace(/<!-- vx7:intro -->[\s\S]*?<!-- \/vx7:intro -->\n?/, '');
  if (html.includes('class="vx6-hero"')) html = html.replace('</head>', V7_INTRO + '\n</head>');
  html = html.replace(/<body([^>]*)>/, (m, attrs) => {
    let a = attrs.replace(/\sdata-vx7-(rev|prices)="[^"]*"/g, '');
    a = a.replace(/\bclass="([^"]*)"/, (m2, c) => `class="${c.split(/\s+/).includes('vx7') ? c : c + ' vx7'}"`);
    return `<body${a} data-vx7-rev="${REV_DATE}" data-vx7-prices="${PRICES_DATE}">`;
  });
  return html;
}

/* v6 page heroes: a page-specific darkened Tampa landscape (frames of our own drone footage and photos, graded to ink teal) */
/* stills chosen and graded from our own footage (media-curation 2026-10-15): one family per kind of page —
   court/legal = towers, business = skyline + river, personal = water, supporting documents = bridges and lines; X steers the phone slice */
const LAND = { 'services.html': 'skyline-river', 'pricing.html': 'skyline-river', 'small-claims-documentation.html': 'downtown-glass', 'financial-recovery.html': 'downtown-orbit', 'net-recovery.html': 'downtown-orbit', 'civil-case-referral.html': 'skyline-clouds', 'contract-review-service.html': 'downtown-core', 'careers.html': 'downtown-core', 'business-filings.html': 'skyline-bridge', 'tax-preparation.html': 'skyline-bridge', 'llc-formation-florida.html': 'river-towers', 'founder-services.html': 'river-boats', 'business-plans.html': 'river-boats', 'name-change.html': 'river-wide', 'fee-waiver.html': 'river-low-sun', 'immigration-packet-review.html': 'gulf-horizon', 'n-400-naturalization.html': 'gulf-beach', 'translations.html': 'rail-bridge', 'online-notary.html': 'shoreline', 'apostille.html': 'pier', 'about.html': 'river-park' };
const LAND_POS = { 'downtown-orbit': '62% 40%', 'downtown-core': '55% 40%', 'downtown-glass': '58% 40%', 'skyline-clouds': '45% 35%', 'skyline-river': '66% 30%', 'skyline-bridge': '60% 30%', 'river-towers': '68% 35%', 'river-boats': '40% 35%', 'rail-bridge': '62% 35%', 'pier': '62% 45%', 'shoreline': '60% 45%', 'river-wide': '70% 45%', 'river-low-sun': '60% 45%', 'river-park': '75% 40%', 'gulf-horizon': '72% 45%', 'gulf-beach': '72% 40%' };
function addTrait(html, f) {
  html = html.replace(/<svg class="vx-phero__art"[\s\S]*?<\/svg>/, '');
  const id = LAND[f]; if (!id) return html;
  return html.replace(/<img class="vx-phero__img"[^>]*>/, `<img class="vx-phero__img" src="/assets/img/scene/${id}-1920.webp" srcset="/assets/img/scene/${id}-960.webp 960w, /assets/img/scene/${id}-1920.webp 1920w" sizes="100vw" alt="" width="1920" height="1080" fetchpriority="high" decoding="async" style="object-position:${LAND_POS[id] || '50% 50%'}">`);
}

/* Cache busting: the data version in vcx-v2.js follows the i18n + catalog content, and every local CSS/JS link
   carries a hash of its file, so a release never mixes new pages with stale strings, prices or styles. */
const sha = (buf) => crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10);
const DATA_V = sha(['en', 'ru', 'es'].map((l) => fs.readFileSync(path.join(ROOT, `assets/i18n/${l}.json`), 'utf8')).join('') + fs.readFileSync(path.join(ROOT, 'assets/data/vcx-catalog.json'), 'utf8'));
{
  const jp = path.join(ROOT, 'assets/js/vcx-v2.js'); const js = fs.readFileSync(jp, 'utf8');
  const next = js.replace(/var VERSION = '[^']*';/, `var VERSION = '${DATA_V}';`);
  if (next !== js && !process.argv.includes('--check')) fs.writeFileSync(jp, next);
}
const FILE_V = new Map();
function bust(html) {
  return html.replace(/(href|src)="(\/assets\/[^"?#]+\.(?:css|js))(?:\?v=[^"]*)?"/g, (m, attr, url) => {
    if (!FILE_V.has(url)) { const f = path.join(ROOT, url); FILE_V.set(url, fs.existsSync(f) ? sha(fs.readFileSync(f)) : null); }
    const v = FILE_V.get(url); return v ? `${attr}="${url}?v=${v}"` : m;
  });
}

/* ---------- run ---------- */
const SKIP = new Set(['google4ac6122041612c23.html', 'yandex_7c27f4f2ed32ff4d.html', 'curated-preview.html', 'app.html', 'index.html.bak-4cells']);
const pages = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !SKIP.has(f));
/* noindex sample deliverables still linked from sample-deliverable.html: same header, footer and runtime as the other old pages */
/* (auto-deal-cost-breakdown.html is a standalone "no longer offered" notice with its own layout and stays as it is) */
pages.push(...fs.readdirSync(path.join(ROOT, 'samples')).filter((f) => f.endsWith('.html') && f !== 'auto-deal-cost-breakdown.html').map((f) => `samples/${f}`));
const HEADER = headerHTML();
const FOOTER = footerHTML();

/* ---------- multilingual URLs ---------- */
const SITE = 'https://vitacorexllc.com';
const LOCALES = ['ru', 'es'];
const isStub = (h) => /http-equiv="refresh"/i.test(h) && h.length < 4000;
const isNoindex = (h) => /<meta name="robots" content="[^"]*noindex/i.test(h);
const isV2Page = (h) => /<body[^>]*\bclass="[^"]*\bvx\b/.test(h) && !/data-vx-legacy="1"/.test(h);
/* Pages that get /ru/ and /es/ copies: rebuilt (v2), indexable, not stubs. */
const LOCALIZED = new Set(pages.filter((f) => { const h = fs.readFileSync(path.join(ROOT, f), 'utf8'); return !isStub(h) && isV2Page(h) && !isNoindex(h); }));
/* the same list in vcx-v2.js, so links written at runtime (strings, catalog rows) stay in the reader's language */
{
  const jp = path.join(ROOT, 'assets/js/vcx-v2.js'); const js = fs.readFileSync(jp, 'utf8');
  const next = js.replace(/var LOCAL_PAGES = '[^']*';/, `var LOCAL_PAGES = ' ${[...LOCALIZED].sort().join(' ')} ';`);
  if (next !== js && !process.argv.includes('--check')) fs.writeFileSync(jp, next);
}
const urlPath = (f, lc) => (lc === 'en' ? '' : `/${lc}`) + (f === 'index.html' ? '/' : `/${f}`);
function hreflangBlock(f) {
  const links = ['en', ...LOCALES].map((lc) => `<link rel="alternate" hreflang="${lc}" href="${SITE}${urlPath(f, lc)}">`).join('');
  return `<!-- vx:hreflang:start -->${links}<link rel="alternate" hreflang="x-default" href="${SITE}${urlPath(f, 'en')}"><!-- vx:hreflang:end -->`;
}
function setHreflang(html, f) {
  const block = hreflangBlock(f);
  const next = replaceBetween(html, '<!-- vx:hreflang:start -->', '<!-- vx:hreflang:end -->', block);
  if (next != null) return next;
  return html.replace(/(<link rel="canonical"[^>]*>)/, (m) => `${m}\n${block}`);
}
/* <title> and meta description from the page's data-t-title/data-t-desc keys, in the current language */
function applyTitleDesc(html) {
  const tk = /<html[^>]*\sdata-t-title="([^"]+)"/.exec(html); const dk = /<html[^>]*\sdata-t-desc="([^"]+)"/.exec(html);
  if (tk && T(tk[1])) html = html.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(T(tk[1]))}</title>`);
  if (dk && T(dk[1])) html = html.replace(/(<meta name="description" content=")[^"]*(")/, (m0, a1, b1) => a1 + esc(T(dk[1])) + b1);
  return html;
}
function localizePage(html, f) {
  html = html.replace(/<html lang="[a-z]+"/, `<html lang="${LC}" data-vx-page-lang="${LC}"`);
  html = applyTitleDesc(html);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, (m0, a1, b1) => a1 + SITE + urlPath(f, LC) + b1);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, (m0, a1, b1) => a1 + SITE + urlPath(f, LC) + b1);
  // internal links to localized pages stay in the language
  html = html.replace(/\shref="\/([a-z0-9-]+\.html)?([?#][^"]*)?"/g, (m0, file, rest) => {
    const target = file || 'index.html';
    if (!LOCALIZED.has(target)) return m0;
    return ` href="/${LC}/${file || ''}${rest || ''}"`;
  });
  // language controls: static state for the page language
  html = html.replace(/aria-checked="(true|false)" data-vx-lang="([a-z]{2})"/g, (m0, v, lc) => `aria-checked="${lc === LC}" data-vx-lang="${lc}"`);
  html = html.replace(/aria-pressed="(true|false)" data-vx-lang="([a-z]{2})"/g, (m0, v, lc) => `aria-pressed="${lc === LC}" data-vx-lang="${lc}"`);
  html = html.replace(/<span data-vx-lang-current>[^<]*<\/span>/g, () => `<span data-vx-lang-current>${NATIVE[LC]}</span>`);
  // language-specific required notices (e.g. Fla. Stat. 117.05(10) notary notice) visible without JS
  html = html.replace(/(<[a-z]+[^>]*\sdata-vx-show-lang="([^"]+)")([^>]*?)\shidden([^>]*>)/g, (m0, a1, langs, mid, end) => (langs.split(/\s+/).includes(LC) ? a1 + mid + end : m0));
  return html;
}

const EN_BUILT = new Map();
/* ---------- SEO head: one JSON-LD graph + Open Graph per page and language ---------- */
const OG_LOCALE = { en: 'en_US', ru: 'ru_RU', es: 'es_ES' };
const IN_LANG = { en: 'en-US', ru: 'ru', es: 'es' };
const textOf = (h) => decodeEntities(String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
function offerFor(id) {
  const s = svc(id), p = s.price, a = p.amount_cents, url = SITE + (LC === 'en' ? '' : '/' + LC) + (s.page && !s.page.startsWith('/request.html') ? s.page : '/request.html?service=' + id);
  const o = { '@type': 'Offer', url, priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: priceInfo(id).short + (loc(s.unit) ? ' — ' + loc(s.unit) : '') };
  if (['fixed', 'fixed_plus_fees', 'per_unit', 'per_word'].includes(p.display)) o.price = (a / 100).toFixed(2);
  else if (p.display === 'from') o.priceSpecification = { '@type': 'PriceSpecification', minPrice: (a / 100).toFixed(2), priceCurrency: 'USD' };
  else if (p.display === 'free_scope') o.price = '0';
  else if (p.display === 'per_hour') o.priceSpecification = { '@type': 'UnitPriceSpecification', price: (a / 100).toFixed(2), priceCurrency: 'USD', unitCode: 'HUR',
    ...(p.minimum_units > 1 ? { eligibleQuantity: { '@type': 'QuantitativeValue', minValue: p.minimum_units, unitCode: 'HUR' } } : {}) };
  return o;
}
function seoHead(html, f) {
  const pageUrl = SITE + urlPath(f, LC);
  const title = textOf((/<title>([^<]*)<\/title>/.exec(html) || [])[1]);
  const desc = textOf((/<meta name="description" content="([^"]*)"/.exec(html) || [])[1]);
  const h1 = textOf((/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html) || [])[1]) || title;
  const home = SITE + urlPath('index.html', LC);
  const org = { '@type': ['ProfessionalService', 'LocalBusiness'], '@id': SITE + '/#org', name: 'VitaCoreX LLC', alternateName: ['VitaCoreX', 'ВитаКорекс'], url: SITE + '/',
    logo: SITE + '/assets/img/logo.png', image: SITE + '/assets/img/og/og-' + LC + '.jpg', telephone: '+1-888-794-8292', email: 'info@vitacorexllc.com',
    address: { '@type': 'PostalAddress', addressLocality: 'Tampa', addressRegion: 'FL', addressCountry: 'US' },
    areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'State', name: 'Florida' }],
    availableLanguage: ['English', 'Russian', 'Spanish'], knowsLanguage: ['en', 'ru', 'es'],
    openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    priceRange: '$$', founder: { '@id': SITE + '/#steven-miller' },
    sameAs: ['https://www.instagram.com/vitacorex_llc/', 'https://www.facebook.com/profile.php?id=61554844507884'],
    description: T('home.meta.desc') || desc };
  const graph = [org,
    { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'VitaCoreX', inLanguage: ['en-US', 'ru', 'es'], publisher: { '@id': SITE + '/#org' },
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: home.replace(/\/$/, '') + '/services.html?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
    { '@type': f === 'about.html' ? 'AboutPage' : f === 'contact.html' ? 'ContactPage' : 'WebPage', '@id': pageUrl + '#webpage', url: pageUrl, name: title, description: desc, inLanguage: IN_LANG[LC],
      isPartOf: { '@id': SITE + '/#website' }, about: { '@id': SITE + '/#org' }, breadcrumb: { '@id': pageUrl + '#breadcrumb' } },
    { '@type': 'BreadcrumbList', '@id': pageUrl + '#breadcrumb', itemListElement: f === 'index.html'
      ? [{ '@type': 'ListItem', position: 1, name: 'VitaCoreX', item: home }]
      : [{ '@type': 'ListItem', position: 1, name: 'VitaCoreX', item: home }, { '@type': 'ListItem', position: 2, name: h1, item: pageUrl }] }];
  // services described on this page (catalog `page`)
  const ids = Object.keys(catalog.services).filter((id) => (catalog.services[id].page || '') === '/' + f);
  for (const id of ids) {
    const sv = svc(id);
    graph.push({ '@type': 'Service', '@id': pageUrl + '#' + id, name: loc(sv.name), description: loc(sv.short), serviceType: loc(sv.name), provider: { '@id': SITE + '/#org' },
      areaServed: id.endsWith('_fl') ? { '@type': 'State', name: 'Florida' } : { '@type': 'Country', name: 'United States' }, availableLanguage: ['English', 'Russian', 'Spanish'], offers: offerFor(id) });
  }
  // FAQ from the rendered page
  const faq = []; const reF = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*<div>([\s\S]*?)<\/div>\s*<\/details>/g; let m;
  while ((m = reF.exec(html))) { const q = textOf(m[1]), a = textOf(m[2]); if (q && a) faq.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }); }
  if (faq.length) graph.push({ '@type': 'FAQPage', '@id': pageUrl + '#faq', inLanguage: IN_LANG[LC], mainEntity: faq });
  if (f === 'about.html') {
    // education as stated by the owner (2026-10-15); the notary commission is a separate license credential
    // which of the two degrees is the master's was not stated, so the level is set only where it is unambiguous
    const degree = (name, about, lvl) => ({ '@type': 'EducationalOccupationalCredential', credentialCategory: 'degree', ...(lvl ? { educationalLevel: lvl } : {}), name, about });
    const team = [
      ['steven-miller', 'Steven Miller', 'team.steven.role', 'team.steven.edu', [degree('Law degree (United States)', 'Law'), degree('Law degree (Russia)', 'Law'),
        { '@type': 'EducationalOccupationalCredential', credentialCategory: 'license', name: 'Florida Notary Public', recognizedBy: { '@type': 'GovernmentOrganization', name: 'State of Florida' } }]],
      ['michael-lyapin', 'Michael Lyapin', 'team.michael.role', 'team.michael.edu', [degree('Accounting degree (United States)', 'Accounting'), degree('Accounting degree (Russia)', 'Accounting')]],
      ['polina-zaic', 'Polina Zaic', 'team.polina.role', 'team.polina.edu', [degree("Master's degree in linguistics", 'Linguistics', "Master's degree")]]];
    for (const [slug, name, rk, ek, cred] of team) graph.push({ '@type': 'Person', '@id': SITE + '/#' + slug, name, jobTitle: T(rk), description: T(ek).replace(/<br\s*\/?>/g, '; '), hasCredential: cred, image: SITE + '/assets/img/team/' + slug + '-384.jpg', worksFor: { '@id': SITE + '/#org' } });
  }
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c').replace(/\u2011/g, '-'); // structured data keeps a plain hyphen (N-400)
  const ld = `<!-- vx:jsonld:start --><script type="application/ld+json">${json}</script><!-- vx:jsonld:end -->`;
  // drop hand-written JSON-LD on generated pages (the graph above replaces it), then insert/replace ours
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, (m0) => (m0.includes('vx:jsonld') ? m0 : ''));
  const nx = replaceBetween(html, '<!-- vx:jsonld:start -->', '<!-- vx:jsonld:end -->', ld);
  html = nx != null ? nx : html.replace('</head>', ld + '\n</head>');
  // Open Graph / Twitter (replaced as one block)
  const og = [['og:type', 'website'], ['og:site_name', 'VitaCoreX'], ['og:url', pageUrl], ['og:title', title], ['og:description', desc], ['og:image', SITE + '/assets/img/og/og-' + LC + '.jpg'], ['og:image:width', '1200'], ['og:image:height', '630'], ['og:locale', OG_LOCALE[LC]]]
    .map(([k, v]) => `<meta property="${k}" content="${esc(v)}">`).concat(['en', 'ru', 'es'].filter((x) => x !== LC).map((x) => `<meta property="og:locale:alternate" content="${OG_LOCALE[x]}">`))
    .concat([`<meta name="twitter:card" content="summary_large_image">`, `<meta name="twitter:title" content="${esc(title)}">`, `<meta name="twitter:description" content="${esc(desc)}">`, `<meta name="twitter:image" content="${SITE}/assets/img/og/og-${LC}.jpg">`]).join('');
  html = html.replace(/<meta (?:property|name)="(?:og:[a-z:_]+|twitter:[a-z:_]+)" content="[^"]*">\s*/g, '');
  const ogBlock = `<!-- vx:og:start -->${og}<!-- vx:og:end -->`;
  const nx2 = replaceBetween(html, '<!-- vx:og:start -->', '<!-- vx:og:end -->', ogBlock);
  return nx2 != null ? nx2 : html.replace('</head>', ogBlock + '\n</head>');
}

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
    if (at === -1) { r = removeElement(html, /<footer\b(?![^>]*vcx-sample-disclaimer)/, 'footer'); at = r.at; html = r.html; } // a sample's own disclaimer is content
    if (at === -1) { report.noFooter.push(f); at = html.lastIndexOf('</body>'); }
    html = html.slice(0, at) + '\n' + FOOTER + '\n' + html.slice(at);
  } else html = next;
  html = ensureHead(html);
  if (isV2) html = addTrait(html, f);
  if (isV2 && !isStub(html)) html = addV7(html);
  html = bust(html);
  /* pinch zoom must work (WCAG 1.4.4): old pages carried maximum-scale=1, user-scalable=no */
  html = html.replace(/(<meta[^>]*\bcontent="[^"]*?)\s*,\s*maximum-scale=1(?:\.0)?\s*,\s*user-scalable=no([^"]*")/g, '$1$2');
  if (API_ARG) html = html.replace(/<meta name="vcx-api" content="[^"]*">/g, `<meta name="vcx-api" content="${API_ARG.replace(/\/$/, '')}">`);
  if (!isV2 && !/data-vx-legacy=/.test(html)) html = html.replace(/<body\b/, '<body data-vx-legacy="1"');
  if (!/id="main-content"/.test(html)) html = html.replace(/<main\b/, '<main id="main-content"');
  html = fillLeaves(html, f);
  if (LOCALIZED.has(f)) html = seoHead(setHreflang(applyTitleDesc(html), f), f);
  if (html !== orig) { report.changed.push(f); if (!CHECK) fs.writeFileSync(p, html); }
  if (LOCALIZED.has(f)) EN_BUILT.set(f, html);
}
/* /ru/ and /es/ copies from the finished English pages */
const localeReport = {};
for (const lc of LOCALES) {
  LC = lc; D = DICTS[lc]; localeReport[lc] = 0;
  const dir = path.join(ROOT, lc); if (!CHECK) fs.mkdirSync(dir, { recursive: true });
  for (const [f, enHtml] of EN_BUILT) {
    let html = fillLeaves(enHtml, f);
    html = seoHead(localizePage(html, f), f);
    const out = path.join(dir, f);
    const prev = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
    if (html !== prev) { localeReport[lc]++; if (!CHECK) fs.writeFileSync(out, html); }
  }
  // remove stale copies of pages that are no longer localized
  if (!CHECK && fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) if (f.endsWith('.html') && !LOCALIZED.has(f)) fs.unlinkSync(path.join(dir, f));
}
LC = 'en'; D = en;
if (enChanged && !CHECK) fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log(JSON.stringify({ files: report.files, changed: report.changed.length, newKeys: report.newKeys.length, localized: LOCALIZED.size, localeWrites: localeReport, conflicts: report.conflicts, noFooter: report.noFooter }, null, 1));
if (report.newKeys.length) console.log('new keys:\n  ' + report.newKeys.slice(0, 400).join('\n  '));
