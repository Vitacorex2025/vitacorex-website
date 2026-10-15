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
const write = (p, s) => fs.writeFileSync(path.join(ROOT, p), s.replace(/\u00a0/g, ' ').replace(/\u2011/g, '-')); // no typographic no-break spaces or hyphens in machine-read listings
const catalog = JSON.parse(read('assets/data/vcx-catalog.json'));
const I = Object.fromEntries(['en', 'ru', 'es'].map((l) => [l, JSON.parse(read(`assets/i18n/${l}.json`))]));
const SITE = 'https://vitacorexllc.com';
const money = (c) => (c % 100 === 0 ? `$${(c / 100).toLocaleString('en-US')}` : `$${(c / 100).toFixed(2)}`);
const fmt = (l, k, p = {}) => (I[l][k] ?? I.en[k] ?? '').replace(/\u00a0/g, ' ').replace(/\{(\w+)\}/g, (m, x) => (p[x] ?? m));
// listings are plain text for crawlers and AI agents: typographic no-break spaces become ordinary spaces
const loc = (o, l) => ((o && (o[l] ?? o.en)) || '').replace(/\u00a0/g, ' ');
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
    case 'per_unit': case 'per_word': case 'per_hour': return `${money(a)} ${unit}`;
    case 'free_scope': return `${fmt(l, 'price.no_charge')} — ${unit}`;
    case 'percent': return `${p.percent}% — ${unit}`;
    default: return `${fmt(l, 'price.quote')} — ${unit}`;
  }
}
function shortText(id, l) {
  const p = catalog.services[id].price, a = p.amount_cents;
  if (p.display === 'per_unit') return fmt(l, 'price.per_page_short', { amount: money(a) });
  if (p.display === 'per_word') return fmt(l, 'price.per_word_short', { amount: money(a) });
  if (p.display === 'per_hour') return fmt(l, 'price.per_hour_short', { amount: money(a) });
  if (p.display === 'percent') return `${p.percent}%`;
  return priceText(id, l).split(' — ')[0];
}
const LABEL = {
  en: { price: 'Price', inc: 'Included', exc: 'Not included / extra', next: 'Next step', page: 'Page' },
  ru: { price: 'Цена', inc: 'Входит', exc: 'Не входит / оплачивается отдельно', next: 'Следующий шаг', page: 'Страница' },
  es: { price: 'Precio', inc: 'Incluye', exc: 'No incluye / se cobra aparte', next: 'Siguiente paso', page: 'Página' },
};
const privateGroups = catalog.groups.filter((g) => g.lane === 'private');

const bizGroups = catalog.groups.filter((g) => g.lane === 'business');
const BIZ_NOTES = {
  en: ['Each case starts with a case check (state, court, claim basics); we confirm the scope for your state and court before you pay.',
    'On the per-case retainer we handle the documents, the court calendar and the hearing for your company under a power of attorney, where the court allows it.',
    'Retainer clients get a free receivables analysis and a free 30-day recovery pilot. Flat prices, never a percentage of what you recover.',
    'Court filing fees and service of process are paid at cost.'],
  ru: ['Каждое дело начинается с проверки (штат, суд, суть требования); объём работы для вашего штата и суда подтверждаем до оплаты.',
    'На ретейнере мы ведём документы, судебный календарь и заседание за вашу компанию по доверенности — там, где это допускает суд.',
    'Клиенты на ретейнере получают бесплатный анализ дебиторской задолженности и бесплатный 30-дневный пилот по возврату. Фиксированные цены, никогда не процент от возвращённого.',
    'Судебные сборы и вручение документов — по фактической стоимости.'],
  es: ['Cada caso empieza con una revisión (estado, tribunal, datos del reclamo); confirmamos el alcance para su estado y tribunal antes de que pague.',
    'Con el retainer por caso llevamos los documentos, el calendario judicial y la audiencia por su empresa con un poder, donde el tribunal lo permite.',
    'Los clientes con retainer reciben gratis un análisis de cuentas por cobrar y un piloto de recuperación de 30 días. Precios fijos, nunca un porcentaje de lo recuperado.',
    'Las tasas judiciales y la notificación se pagan al costo.'],
};
const bullets = (l) => BIZ_NOTES[l].map((x) => `- ${x}`).join('\n') + '\n\n';
function blocks(l, groups = privateGroups) {
  const L = LABEL[l];
  return groups.map((g) => `### ${loc(g.name, l)}\n\n` + g.services.map((id) => {
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
  // start at the first group heading in the file, whatever its old name was: when groups are renamed or reordered,
  // starting at the current first group would leave the old blocks above it as stale duplicates
  const b = src.indexOf(biz), a = src.indexOf('\n### ') + 1;
  if (a === 0 || b === -1 || b < a) throw new Error(`${file}: section markers not found (${first} / ${biz})`);
  // the business section runs to the next H2 and is regenerated too, so the B2B lineup never goes stale
  const e = src.indexOf('\n## ', b) + 1 || src.length;
  write(file, src.slice(0, a) + blocks(l) + '\n' + blocks(l, bizGroups) + '\n' + bullets(l) + src.slice(e));
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
  let out = src.slice(0, body0) + rows + src.slice(body1);
  const bh = out.indexOf('\n## Companies'); if (bh === -1) throw new Error('llms.txt: companies heading not found');
  const be = out.indexOf('\n## ', bh + 1) + 1;
  const brows = bizGroups.flatMap((g) => g.services).map((id) => {
    const s = catalog.services[id];
    return `| ${s.name.en} | ${shortText(id, 'en')} | ${s.unit.en}; ${s.short.en.replace(/\|/g, '/')} | ${pageUrl(s, id).replace(SITE, '')} |`;
  }).join('\n');
  out = out.slice(0, bh + 1) + '## Companies — small claims and financial recovery (B2B lane)\n\n| Service | Price | Unit / what it covers | Page |\n|---|---|---|---|\n'
    + brows + '\n\n' + bullets('en') + out.slice(be);
  write(file, out);
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
