#!/usr/bin/env node
/* Regenerates the catalog-derived parts of the AI/SEO listings from assets/data/vcx-catalog.json + i18n,
   so prices and wording never drift from the site:
   - llms.txt: the "Private clients — services and prices" table body
   - llms-full.txt / llms-ru.txt / llms-es.txt: the private-client service blocks (up to the companies section)
   - .well-known/service-catalog.jsonld: one ListItem per catalog service
   Usage: node scripts/gen-ai-listings.mjs */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s);
const catalog = JSON.parse(read('assets/data/vcx-catalog.json'));
const I = Object.fromEntries(['en', 'ru', 'es'].map((l) => [l, JSON.parse(read(`assets/i18n/${l}.json`))]));
const SITE = 'https://vitacorexllc.com';
const money = (c) => (c % 100 === 0 ? `$${(c / 100).toLocaleString('en-US')}` : `$${(c / 100).toFixed(2)}`);
const fmt = (l, k, p = {}) => (I[l][k] ?? I.en[k] ?? '').replace(/\{(\w+)\}/g, (m, x) => (p[x] ?? m));
const loc = (o, l) => (o && (o[l] ?? o.en)) || '';
const pageUrl = (s, id, l = 'en') => {
  const own = s.page && !s.page.startsWith('/request.html') ? s.page : null;
  // localized copies (/ru/, /es/) exist for indexable rebuilt pages; listings in those languages point to them
  if (own && l !== 'en' && fs.existsSync(path.join(ROOT, l, own.replace(/^\//, '')))) return `${SITE}/${l}${own}`;
  return SITE + (own || `/request.html?service=${id}`);
};

function priceText(id, l) {
  const s = catalog.services[id], p = s.price, a = p.amount_cents, unit = loc(s.unit, l);
  switch (p.display) {
    case 'fixed': return `${money(a)} — ${unit}`;
    case 'fixed_plus_fees': return `${fmt(l, p.fees_label ? `price.plus_fees_${p.fees_label}` : 'price.plus_fees', { amount: money(a) })} — ${unit}`;
    case 'from': return `${fmt(l, 'price.from', { amount: money(a) })} — ${fmt(l, 'price.tag.after_review').toLowerCase()} (${unit})`;
    case 'per_unit': case 'per_word': return `${money(a)} ${unit}`;
    case 'free_scope': return `${fmt(l, 'price.no_charge')} — ${unit}`;
    default: return `${fmt(l, 'price.quote')} — ${unit}`;
  }
}
function shortText(id, l) {
  const p = catalog.services[id].price, a = p.amount_cents;
  if (p.display === 'per_unit') return fmt(l, 'price.per_page_short', { amount: money(a) });
  if (p.display === 'per_word') return fmt(l, 'price.per_word_short', { amount: money(a) });
  return priceText(id, l).split(' — ')[0];
}
const LABEL = {
  en: { price: 'Price', inc: 'Included', exc: 'Not included / extra', next: 'Next step', page: 'Page' },
  ru: { price: 'Цена', inc: 'Входит', exc: 'Не входит / оплачивается отдельно', next: 'Следующий шаг', page: 'Страница' },
  es: { price: 'Precio', inc: 'Incluye', exc: 'No incluye / se cobra aparte', next: 'Siguiente paso', page: 'Página' },
};
const privateGroups = catalog.groups.filter((g) => g.lane === 'private');

function blocks(l) {
  const L = LABEL[l];
  return privateGroups.map((g) => `### ${loc(g.name, l)}\n\n` + g.services.map((id) => {
    const s = catalog.services[id];
    return [`#### ${loc(s.name, l)}`, `- ${L.price}: ${priceText(id, l)}`, `- ${loc(s.short, l)}`,
      `- ${L.inc}: ${(s.included?.[l] || s.included?.en || []).join('; ')}`, `- ${L.exc}: ${(s.extra?.[l] || s.extra?.en || []).join('; ')}`,
      `- ${L.next}: ${loc(s.next, l)}`, `- ${L.page}: ${pageUrl(s, id, l)}`].join('\n') + '\n';
  }).join('\n')).join('\n');
}
/* Replace from the first private-group heading to the business-group heading (exclusive). */
function replaceBlocks(file, l) {
  const src = read(file);
  const first = `### ${loc(privateGroups[0].name, l)}`;
  const biz = `### ${loc(catalog.groups.find((g) => g.lane === 'business').name, l)}`;
  const a = src.indexOf(first), b = src.indexOf(biz);
  if (a === -1 || b === -1 || b < a) throw new Error(`${file}: section markers not found (${first} / ${biz})`);
  write(file, src.slice(0, a) + blocks(l) + '\n' + src.slice(b));
}

function replaceTable() {
  const file = 'llms.txt', src = read(file);
  const head = '## Private clients — services and prices';
  const a = src.indexOf(head); if (a === -1) throw new Error('llms.txt: table heading not found');
  const t0 = src.indexOf('|---|', a), body0 = src.indexOf('\n', t0) + 1;
  let body1 = body0; while (src.startsWith('|', body1)) body1 = src.indexOf('\n', body1) + 1;
  const rows = privateGroups.flatMap((g) => g.services).map((id) => {
    const s = catalog.services[id];
    return `| ${s.name.en} | ${shortText(id, 'en')} | ${s.unit.en}; ${s.short.en.replace(/\|/g, '/')} | ${pageUrl(s, id).replace(SITE, '')} |`;
  }).join('\n') + '\n';
  write(file, src.slice(0, body0) + rows + src.slice(body1));
}

function catalogJsonld() {
  const file = '.well-known/service-catalog.jsonld', doc = JSON.parse(read(file));
  const ids = catalog.groups.flatMap((g) => g.services);
  doc.itemListElement = ids.map((id, i) => {
    const s = catalog.services[id], p = s.price, url = pageUrl(s, id);
    const group = catalog.groups.find((g) => g.services.includes(id));
    const offer = { '@type': 'Offer', url, priceCurrency: 'USD', availability: 'https://schema.org/InStock', description: priceText(id, 'en') };
    if (['fixed', 'fixed_plus_fees', 'per_unit', 'per_word'].includes(p.display)) offer.price = (p.amount_cents / 100).toFixed(2);
    else if (p.display === 'from') offer.priceSpecification = { '@type': 'PriceSpecification', minPrice: String(p.amount_cents / 100), priceCurrency: 'USD' };
    else if (p.display === 'free_scope') offer.price = '0';
    return { '@type': 'ListItem', position: i + 1, item: {
      '@type': 'Service', '@id': `${SITE}/#service-${id.replace(/_/g, '-')}`, name: s.name.en, alternateName: [s.name.ru, s.name.es],
      description: s.short.en, serviceType: s.name.en, category: group.name.en, url, provider: { '@id': `${SITE}/#organization` },
      areaServed: id.endsWith('_fl') ? { '@type': 'State', name: 'Florida' } : { '@type': 'Country', name: 'United States' },
      availableLanguage: ['English', 'Russian', 'Spanish'], offers: offer } };
  });
  doc.numberOfItems = doc.itemListElement.length;
  write(file, JSON.stringify(doc, null, 2) + '\n');
}

replaceTable();
replaceBlocks('llms-full.txt', 'en');
replaceBlocks('llms-ru.txt', 'ru');
replaceBlocks('llms-es.txt', 'es');
catalogJsonld();
console.log('ai listings regenerated:', catalog.groups.flatMap((g) => g.services).length, 'services');
