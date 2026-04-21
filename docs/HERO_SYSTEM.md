# VitaCoreX — Hero System
_Authored: 2026-04-21 • Source of truth: homepage `index.html` `.vcx-hero-2`_

## 1 • What's canonical
The homepage hero is the canonical reference. Class family: **`vcx-hero-2__*`**. Do not rename, rewire, or replace. New pages either reuse this exact markup or apply an **additive modifier** on top of it.

## 2 • Canonical homepage markup
```html
<section class="vcx-hero-2">
  <div class="vcx-hero-2__bg" data-beam-count="70">
    <!-- vcx-hero-cybercore.js injects the grid floor + beam scene here -->
  </div>
  <div class="vcx-hero-2__content" data-animate="none">
    <span class="vcx-eyebrow" data-page="home_hero_eyebrow">...</span>
    <h1 class="vcx-hero-2__title" data-page="home_hero_title">...</h1>
    <p class="vcx-hero-2__subtitle" data-page="home_hero_lead">...</p>
    <p class="vcx-hero-2__subtitle vcx-hero-2__subtitle--scope">...</p>
    <div class="vcx-hero-2__actions">
      <a class="vcx-btn-2 vcx-btn-2--primary">...</a>
      <a class="vcx-btn-2 vcx-btn-2--ghost">...</a>
    </div>
    <p class="vcx-hero-2__trust">...</p>
  </div>
</section>
```

## 3 • Hard rules
- `<h1>` lives ONLY inside the hero. Pages must not emit a second H1 elsewhere.
- Hero text is always white or `rgba(255,255,255,0.62..0.95)`.
- Primary CTA is the dark-teal gradient (`#1A5A54 → #236B64`), NOT the legacy bright-teal that failed AA.
- Ghost CTA is transparent + `1px` white-alpha border + white text. It must NEVER read as black text on dark bg (fixed Apr 2026).
- Eyebrow is `#5BBAA7` on dark hero; never inherits black from master override.
- Subtitle scope paragraph (the legal-boundary clause) is always present when the hero introduces a service claim.

## 4 • Variant modifiers
All variants are applied as **additional classes on the same `vcx-hero-2` element.** The base `.vcx-hero-2` rule applies. The modifier tunes padding, title size, and scope-paragraph treatment.

### 4.1 `.vcx-hero--compact`
- Use on: service pages (`corporate-legal-file-control`, `revenue-recovery-workflow`, `structured-case-intake`, `industries`, `resources`).
- Title size: `clamp(1.9rem, 3vw, 2.4rem)`.
- Padding: `40px 32px 32px`.

### 4.2 `.vcx-hero--app`
- Use on: `app/*` surfaces.
- Title size: `clamp(1.6rem, 2.4vw, 2.1rem)`.
- Padding: `32px 28px 24px`.
- Subtitle max-width widened to 620px (app pages often need more content).
- The cybercore scene should be downgraded to `data-beam-count="30"` on app hero (less busy).

### 4.3 `.vcx-hero--legal`
- Use on: pages with dense legal/boundary disclosures (`privacy.html`, `terms.html`, certain case studies).
- The scope subtitle gets a top border + extra padding to visually separate it.
- Amber accent NOT used in the hero itself — keep inside the body.

## 5 • Legacy / fallback hero
Pages that are not yet upgraded to `vcx-hero-2` (e.g. some partners/case-study pages) can use a scaffolded fallback:
```html
<section class="vcx-hero">
  <div class="vcx-hero__content">
    <span class="vcx-hero__eyebrow">...</span>
    <h1 class="vcx-hero__title">...</h1>
    <p class="vcx-hero__subtitle">...</p>
    <div class="vcx-hero__actions">
      <a class="btn btn-primary">...</a>
      <a class="btn btn-secondary">...</a>
    </div>
  </div>
</section>
```
- No JS dependency — static dark teal background `#07201C`.
- White text, teal accent eyebrow.
- Buttons inherit the site-wide button rules in `vcx-premium-2.css`.

## 6 • Background / motion
- The cybercore scene is injected by `assets/js/vcx-hero-cybercore.js`.
- `data-beam-count` tunes density. Production range: `30–90`. Default `70`.
- Canvas layer (`.vcx-hero-canvas`) uses `mix-blend-mode: screen` + saturation filter so teal waves pop on the dark base. Do not change.
- Under `prefers-reduced-motion: reduce`, the canvas animation freezes automatically (handled in `vcx-hero-particles.js`).

## 7 • Page-by-page audit plan
| Page | Current hero class | Target variant | Action |
|------|-------------------|----------------|--------|
| `index.html` | `vcx-hero-2` | — (canonical) | No change |
| `corporate-legal-file-control.html` | legacy | `vcx-hero-2 vcx-hero--compact` | Wrap + add modifier |
| `revenue-recovery-workflow.html` | legacy | `vcx-hero-2 vcx-hero--compact` | Wrap + add modifier |
| `structured-case-intake.html` | legacy | `vcx-hero-2 vcx-hero--compact` | Wrap + add modifier |
| `additional-services.html` | legacy | `vcx-hero-2 vcx-hero--compact` | Wrap + add modifier |
| `pricing-and-engagement-tiers.html` | legacy | `vcx-hero-2 vcx-hero--compact` | Wrap + add modifier |
| `resources.html` | legacy | `vcx-hero-2 vcx-hero--compact` | Wrap + add modifier |
| `industries.html` | legacy | `vcx-hero-2 vcx-hero--compact` | Wrap + add modifier |
| `contact.html` | legacy | `vcx-hero` | Keep fallback (no particles) |
| `careers.html` | legacy | `vcx-hero` | Keep fallback |
| `app/contract-intelligence/` | in-page | `vcx-hero-2 vcx-hero--app` | Apply modifier |
| `app/immigration-forms/` | in-page | `vcx-hero-2 vcx-hero--app` | Apply modifier |
| `app/dealer-contract-check/` | in-page | `vcx-hero-2 vcx-hero--app` | Apply modifier |
| `app/private-lookup/` | in-page | `vcx-hero-2 vcx-hero--app` | Apply modifier |
| `app/deadline-calendar/` | in-page | `vcx-hero-2 vcx-hero--app` | Apply modifier |
| `privacy.html`, `terms.html` | legacy | `vcx-hero-2 vcx-hero--legal` | Wrap + apply modifier |

## 8 • QA checklist
- [ ] H1 appears exactly once per page.
- [ ] Title color reads `rgb(255,255,255)` (not `#000` from master override).
- [ ] Scope paragraph visible on every service page hero.
- [ ] Primary CTA contrast ≥ AA on white text.
- [ ] Ghost CTA readable on dark bg (2026-04 regression tracked in `BUG_LOG.md`).
- [ ] `prefers-reduced-motion`: beams stop animating, subtitle fades are instant.
- [ ] Hero height does not exceed 90 vh on mobile (430×932).

## 9 • Open items
1. Partner pages (`partners.html`, `partners-*.html`) still use a legacy gradient header. Upgrade in I2.
2. One case-study page (`case-study-subscription-saas.html`) has a one-off hero gradient that diverges. Normalize in I2.
3. Mobile nav burger `☰` font rendering was broken by UTF-8 double-encoding; repaired on 2026-04-20 with ftfy. Do not re-run the PowerShell cache-buster that caused it — see `BUG_LOG.md` entry BL-004.
