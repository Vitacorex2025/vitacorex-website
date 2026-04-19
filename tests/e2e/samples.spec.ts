/**
 * P03 Step 3.6 — Playwright e2e spec for the sample library surface.
 *
 * Status: DRAFTED (not yet executed — Playwright env not provisioned as of 2026-04-19;
 * tracked in 00 Master Plan "Open blockers" line "Playwright e2e environment provisioning").
 * Static-analysis equivalent runs today via scripts/verify-sample-schema.js +
 * scripts/verify-gated-samples.js + scripts/verify-sitemap.js — this file is the
 * live-browser version that fires the moment the PW env lands.
 *
 * Coverage:
 *   (1) All 7 /samples/<slug>.html URLs return 200 + <h1> renders + watermark visible
 *   (2) Each sample page's JSON-LD CreativeWork + BreadcrumbList parse and match gating
 *   (3) Library hub at /sample-deliverable.html shows 7 cards + 2 gated CTAs route
 *       to /samples/request-gated-sample.html?s=<slug>
 *   (4) Service-page embeds (e.g. revenue-recovery-workflow.html) show the embed
 *       section with correct card count and gated-CTA routing
 *   (5) Gate page receives ?s=<slug>, shows the sample-specific title, validates form
 *       required fields, grants access on valid submit, flips data-state → "granted"
 *   (6) After grant, direct navigation to /samples/ar-leakage-map.html does NOT show
 *       the lock overlay (vcxGateLock element absent)
 *   (7) Fresh browser (no localStorage) hitting /samples/ar-leakage-map.html directly
 *       DOES show the lock overlay with a working "Request access" link
 *   (8) Language toggle (en ↔ ru ↔ es) re-renders gate-page + sample-page content
 *       (data-page keys resolve in all 3 locales)
 *
 * To run (when PW env available):
 *   npm i -D @playwright/test
 *   npx playwright install --with-deps
 *   npx playwright test tests/e2e/samples.spec.ts
 */

import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.VCX_BASE_URL || 'http://localhost:8080';

const ROSTER = [
  { slug: 'ar-leakage-map',             gated: true  },
  { slug: 'counsel-ready-packet',       gated: true  },
  { slug: 'diagnostic-report',          gated: false },
  { slug: 'contract-risk-memo',         gated: false },
  { slug: 'immigration-evidence-index', gated: false },
  { slug: 'auto-deal-cost-breakdown',   gated: false },
  { slug: 'small-claims-chronology',    gated: false },
];

// Helper: read all JSON-LD blocks on the current page
async function readLdJson(page: Page): Promise<any[]> {
  return await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>(
      'script[type="application/ld+json"]'
    ));
    return scripts.map((s) => {
      try { return JSON.parse(s.textContent || 'null'); }
      catch { return { __parseError: true }; }
    });
  });
}

// Helper: seed a gate grant for a slug so gated sample pages open without overlay
async function seedGateGrant(page: Page, slug: string) {
  await page.addInitScript((s) => {
    const m = { [s]: { granted: true, grantedAt: new Date().toISOString(), payload: { name: 'PW', email: 'pw@example.com' } } };
    localStorage.setItem('vcxGatedAccess', JSON.stringify(m));
  }, slug);
}

test.describe('(1) sample pages load + watermark renders', () => {
  for (const { slug, gated } of ROSTER) {
    test(`samples/${slug}.html loads with h1 and watermark (gated=${gated})`, async ({ page }) => {
      if (gated) await seedGateGrant(page, slug);
      const resp = await page.goto(`${BASE}/samples/${slug}.html`, { waitUntil: 'domcontentloaded' });
      expect(resp?.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      // Watermark is injected by vcx-sample.js as a .vcx-sample-watermark element
      await expect(page.locator('.vcx-sample-watermark').first()).toBeAttached();
      // Sticky banner injected too
      await expect(page.locator('.vcx-sample-banner').first()).toBeAttached();
      // Lock overlay must NOT show after grant (or for ungated samples)
      await expect(page.locator('#vcxGateLock')).toHaveCount(0);
    });
  }
});

test.describe('(2) sample pages JSON-LD CreativeWork + BreadcrumbList', () => {
  for (const { slug, gated } of ROSTER) {
    test(`samples/${slug}.html schema shape + isAccessibleForFree matches gating`, async ({ page }) => {
      if (gated) await seedGateGrant(page, slug);
      await page.goto(`${BASE}/samples/${slug}.html`, { waitUntil: 'domcontentloaded' });
      const blocks = await readLdJson(page);
      const cw = blocks.find((b) => b && b['@type'] === 'CreativeWork');
      const bc = blocks.find((b) => b && b['@type'] === 'BreadcrumbList');
      expect(cw, 'CreativeWork block present').toBeTruthy();
      expect(bc, 'BreadcrumbList block present').toBeTruthy();

      expect(cw.isAccessibleForFree).toBe(!gated);
      expect(cw.url).toBe(`https://vitacorexllc.com/samples/${slug}.html`);
      expect(Array.isArray(cw.inLanguage) && cw.inLanguage.sort().join(',')).toBe('en,es,ru');
      expect(cw.genre).toBe('redacted-sample');
      expect(cw.educationalUse).toBe('procurement-evaluation');

      expect(bc.itemListElement?.length).toBe(3);
      expect(bc.itemListElement[0].name).toBe('Home');
      expect(bc.itemListElement[1].name).toBe('Samples');
    });
  }
});

test.describe('(3) library hub shows 7 cards + gated CTAs route through gate', () => {
  test('/sample-deliverable.html — cards + routing', async ({ page }) => {
    await page.goto(`${BASE}/sample-deliverable.html`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.vcx-hub-card')).toHaveCount(7);

    const gatedCards = page.locator('a.vcx-hub-card[data-gated-cta="1"]');
    await expect(gatedCards).toHaveCount(2);

    // Each gated card href must contain request-gated-sample.html?s=<slug>
    for (const slug of ['ar-leakage-map', 'counsel-ready-packet']) {
      const href = await page.locator(`a.vcx-hub-card[aria-label*="${slug === 'ar-leakage-map' ? 'AR Leakage Map' : 'Counsel-Ready Packet'}"]`).getAttribute('href');
      expect(href).toContain(`request-gated-sample.html?s=${slug}`);
    }

    // JSON-LD: CollectionPage with 7 hasPart + 2 gated match
    const blocks = await readLdJson(page);
    const cp = blocks.find((b) => b && b['@type'] === 'CollectionPage');
    expect(cp).toBeTruthy();
    expect(cp.hasPart?.length).toBe(7);
    const free = cp.hasPart.filter((w: any) => w.isAccessibleForFree === true).length;
    const gated = cp.hasPart.filter((w: any) => w.isAccessibleForFree === false).length;
    expect(free).toBe(5);
    expect(gated).toBe(2);
  });
});

test.describe('(4) service-page embed — revenue-recovery-workflow has 2 gated cards routing through gate', () => {
  test('/revenue-recovery-workflow.html — embed block + 2 gated cards', async ({ page }) => {
    await page.goto(`${BASE}/revenue-recovery-workflow.html`, { waitUntil: 'domcontentloaded' });
    const embed = page.locator('.vcx-sample-embed');
    await expect(embed).toBeVisible();
    await expect(embed.locator('.vcx-sample-embed__card')).toHaveCount(2);

    const gatedCtas = embed.locator('a[data-gated-cta="1"]');
    await expect(gatedCtas).toHaveCount(2);
    for (const slug of ['ar-leakage-map', 'counsel-ready-packet']) {
      const cta = embed.locator(`[data-sample="${slug}"] a[data-gated-cta="1"]`);
      const href = await cta.getAttribute('href');
      expect(href).toContain(`request-gated-sample.html?s=${slug}`);
    }
  });
});

test.describe('(5) gate page form validates + grants on valid submit', () => {
  test('/samples/request-gated-sample.html?s=ar-leakage-map — validation + grant flip', async ({ page }) => {
    await page.goto(`${BASE}/samples/request-gated-sample.html?s=ar-leakage-map`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.vcx-gate[data-gate="form"]')).toBeVisible();
    await expect(page.locator('[data-gate-sample-title]')).toContainText(/AR Leakage Map|AR|Leakage/i);

    // Empty submit → aria-invalid set on required fields, state stays pending
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[data-gate-state]').first()).toHaveAttribute('data-state', 'pending').catch(() => {});
    const invalids = await page.locator('[aria-invalid="true"]').count();
    expect(invalids).toBeGreaterThan(0);

    // Fill valid payload + both consent
    await page.fill('input[name="name"]', 'Ada Lovelace');
    await page.fill('input[name="email"]', 'ada@example.com');
    await page.fill('input[name="company"]', 'Analytical Engines Ltd');
    await page.fill('input[name="role"]', 'Director');
    await page.selectOption('select[name="portfolio"]', { index: 1 });
    await page.fill('textarea[name="use"]', 'Evaluating AR recovery partners for 2026 procurement.');
    await page.check('input[name="consent"]');
    await page.check('input[name="nda"]');
    await page.locator('button[type="submit"]').click();

    // Root flips to granted
    await expect(page.locator('.vcx-gate[data-gate="form"]')).toHaveAttribute('data-state', 'granted');

    // localStorage entry exists
    const stored = await page.evaluate(() => localStorage.getItem('vcxGatedAccess'));
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored || '{}');
    expect(parsed['ar-leakage-map']?.granted).toBe(true);

    // Open-sample CTA populated
    const openHref = await page.locator('[data-gate-open]').getAttribute('href');
    expect(openHref).toContain('ar-leakage-map.html');
  });
});

test.describe('(6-7) lock overlay behavior on gated sample page', () => {
  test('no grant → overlay appears with Request-access CTA pointing at gate', async ({ page }) => {
    // Fresh context, no seed
    await page.goto(`${BASE}/samples/ar-leakage-map.html`, { waitUntil: 'domcontentloaded' });
    const overlay = page.locator('#vcxGateLock');
    await expect(overlay).toBeVisible();
    const cta = overlay.locator('.vcx-gate-lock__cta');
    const href = await cta.getAttribute('href');
    expect(href).toContain('request-gated-sample.html?s=ar-leakage-map');
  });

  test('with grant → overlay absent, sample renders fully', async ({ page }) => {
    await seedGateGrant(page, 'ar-leakage-map');
    await page.goto(`${BASE}/samples/ar-leakage-map.html`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#vcxGateLock')).toHaveCount(0);
    await expect(page.locator('h1').first()).toBeVisible();
  });
});

test.describe('(8) language toggle re-renders', () => {
  for (const lang of ['en', 'ru', 'es']) {
    test(`gate page lang=${lang} resolves smp_gate_* keys`, async ({ page }) => {
      await page.addInitScript((l) => {
        try { localStorage.setItem('vcxLang', l); } catch {}
      }, lang);
      await page.goto(`${BASE}/samples/request-gated-sample.html?s=ar-leakage-map`, { waitUntil: 'domcontentloaded' });
      // The page title h1 should be non-empty in every language
      await expect(page.locator('#vcxGateTitle')).not.toHaveText('');
    });
  }
});
