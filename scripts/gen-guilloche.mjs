#!/usr/bin/env node
/* VitaCoreX security-print motif: generates static guilloché SVGs (the fine line work used on
   certificates, passports and banknotes) into assets/img/motif/. Pure math, no runtime JS:
   - rosette.svg  : layered epitrochoid rosette for the hero and the footer
   - band.svg     : interlaced sine band for section dividers (tileable horizontally)
   - seal.svg     : small rosette for badges, stamps and the "seal" button
   Strokes use currentColor-free explicit teal tints so the files work as <img> and CSS backgrounds.
   Usage: node scripts/gen-guilloche.mjs */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const OUT = path.join(ROOT, 'assets/img/motif');
fs.mkdirSync(OUT, { recursive: true });
const f = (n) => (Math.round(n * 10) / 10).toString();

/* Closed curve sampler → compact SVG path */
function pathOf(fn, steps) {
  let d = '';
  for (let i = 0; i <= steps; i++) { const [x, y] = fn((i / steps) * Math.PI * 2); d += (i ? 'L' : 'M') + f(x) + ' ' + f(y); }
  return d + 'Z';
}
/* Epitrochoid: rolling circle r outside fixed circle R, pen at distance d. Closes after r/gcd(R,r) turns. */
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
function epitrochoid(R, r, d, cx, cy, rot = 0) {
  const turns = r / gcd(R, r);
  return (t) => { t *= turns; const k = (R + r) / r; return [cx + (R + r) * Math.cos(t + rot) - d * Math.cos(k * t + rot), cy + (R + r) * Math.sin(t + rot) - d * Math.sin(k * t + rot)]; };
}
/* Modulated ring: r(θ) = base + amp·sin(n·θ + phase) */
const ring = (base, amp, n, phase, cx, cy) => (t) => { const r = base + amp * Math.sin(n * t + phase); return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };

function svg(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" fill="none" stroke-linecap="round" stroke-linejoin="round"><title>${title}</title>${body}</svg>\n`;
}

/* 1. Rosette (600×600): outer modulated rings + two epitrochoid layers + inner rings */
{
  const c = 300; let body = '';
  for (let k = 0; k < 14; k++) body += `<path d="${pathOf(ring(232 + k * 4.2, 9, 36, k * 0.42, c, c), 720)}" stroke="#7CD2DE" stroke-opacity="${(0.22 + 0.02 * (k % 3)).toFixed(2)}" stroke-width=".6"/>`;
  for (let k = 0; k < 6; k++) body += `<path d="${pathOf(epitrochoid(96, 8, 54 + k * 4, c, c, k * 0.09), 2600)}" stroke="#2BB3C0" stroke-opacity=".28" stroke-width=".5"/>`;
  for (let k = 0; k < 8; k++) body += `<path d="${pathOf(ring(70 + k * 3.4, 5, 24, k * 0.6, c, c), 480)}" stroke="#A9E6EE" stroke-opacity=".3" stroke-width=".5"/>`;
  body += `<circle cx="${c}" cy="${c}" r="292" stroke="#7CD2DE" stroke-opacity=".25" stroke-width=".7"/><circle cx="${c}" cy="${c}" r="296" stroke="#7CD2DE" stroke-opacity=".18" stroke-width=".5" stroke-dasharray="1.5 3"/>`;
  fs.writeFileSync(path.join(OUT, 'rosette.svg'), svg(600, 600, body, 'Guilloché rosette'));
}

/* 2. Band (1200×64, tiles horizontally): interlaced sine strands */
{
  const W = 1200, H = 64, mid = H / 2; let body = '';
  const wave = (amp, len, ph) => { let d = ''; for (let x = 0; x <= W; x += 4) { const y = mid + amp * Math.sin((x / len) * Math.PI * 2 + ph); d += (x ? 'L' : 'M') + x + ' ' + f(y); } return d; };
  for (let k = 0; k < 9; k++) body += `<path d="${wave(22 - k * 1.2, 75, k * 0.35)}" stroke="#2BB3C0" stroke-opacity="${(0.16 + k * 0.012).toFixed(3)}" stroke-width=".6"/>`;
  for (let k = 0; k < 9; k++) body += `<path d="${wave(22 - k * 1.2, 75, Math.PI + k * 0.35)}" stroke="#0F6E79" stroke-opacity="${(0.12 + k * 0.01).toFixed(3)}" stroke-width=".6"/>`;
  fs.writeFileSync(path.join(OUT, 'band.svg'), svg(W, H, body, 'Guilloché band'));
}

/* 3. Seal (160×160): compact rosette with a dotted rim, for badges and the seal button */
{
  const c = 80; let body = '';
  for (let k = 0; k < 7; k++) body += `<path d="${pathOf(ring(58 + k * 2.4, 3.2, 28, k * 0.5, c, c), 560)}" stroke="#7CD2DE" stroke-opacity=".55" stroke-width=".55"/>`;
  for (let k = 0; k < 4; k++) body += `<path d="${pathOf(epitrochoid(30, 5, 20 + k * 3, c, c, k * 0.15), 1400)}" stroke="#A9E6EE" stroke-opacity=".5" stroke-width=".45"/>`;
  body += `<circle cx="${c}" cy="${c}" r="77" stroke="#7CD2DE" stroke-opacity=".6" stroke-width=".8" stroke-dasharray="1 2.6"/>`;
  fs.writeFileSync(path.join(OUT, 'seal.svg'), svg(160, 160, body, 'Guilloché seal'));
}
for (const n of ['rosette.svg', 'band.svg', 'seal.svg']) console.log(n, Math.round(fs.statSync(path.join(OUT, n)).size / 1024) + ' KB');
