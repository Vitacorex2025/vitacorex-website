#!/usr/bin/env node
/* Notify IndexNow search engines (Bing, Yandex, Seznam, Naver …) about every URL in sitemap.xml.
   RELEASE STEP ONLY: run after the approved build is live on https://vitacorexllc.com — never against a preview.
   The key file /vitacorex2025indexnow.txt (content = key) is already published at the site root.
   Usage: node scripts/indexnow-submit.mjs [--dry-run] */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOST = 'vitacorexllc.com';
const KEY = fs.readFileSync(path.join(ROOT, 'vitacorex2025indexnow.txt'), 'utf8').trim();
const DRY = process.argv.includes('--dry-run');
const urls = [...fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(`https://${HOST}/`));
const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/vitacorex2025indexnow.txt`, urlList: urls.slice(0, 10000) };
if (DRY) { console.log(JSON.stringify({ urls: urls.length, sample: urls.slice(0, 5) }, null, 1)); process.exit(0); }
const live = await fetch(body.keyLocation).then((r) => r.ok && r.text()).catch(() => null);
if (!live || live.trim() !== KEY) { console.error('Key file is not live on the production host; refusing to submit.'); process.exit(2); }
const res = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify(body) });
console.log('IndexNow', res.status, res.statusText, `(${urls.length} URLs)`);
if (res.status !== 200 && res.status !== 202) process.exit(1); // 200/202 = accepted; anything else fails the CI step
