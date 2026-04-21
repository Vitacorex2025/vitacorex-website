# VitaCoreX — Obsidian-style Source of Truth Index
_Authored: 2026-04-21 • Use as the single entry-point to all living docs_

> This repository does **not** ship with a separate Obsidian vault. The `docs/` directory is the canonical knowledge store and serves as the Obsidian-equivalent. This file is the index. Everything that would live in an Obsidian "home note" lives here.

## 1 • Structural / design docs (this refresh)
- [[MASTER_PLAN]] — high-level plan, increments I1–I4, constraints.
- [[DESIGN_SYSTEM_LAYOUT_RULES]] — palette, typography, component contracts, forbidden hacks.
- [[HERO_SYSTEM]] — canonical hero, variants, per-page plan.
- [[PAGE_AUDIT_MATRIX]] — every page × every quality dimension.
- [[QA_TEST_REPORT]] — I1 smoke results + reduced-motion/keyboard audits.
- [[BUG_LOG]] — BL-001…BL-007 append-only.
- [[IMPLEMENTATION_SUMMARY]] — what shipped in this commit.

## 2 • Pre-existing product docs (do not overwrite — they are source of truth for product)
- `VCX_API_MAP.md` — API routes.
- `VCX_CHANGELOG.md` — product changelog.
- `VCX_CHAT_ATTACHMENTS.md` • `VCX_CHAT_POLICY.md` • `VCX_CHAT_RUNTIME_FIXES.md`
- `VCX_CONTRACT_GENERATOR.md` • `VCX_CONTRACT_GENERATOR_QA.md`
- `VCX_DATA_MODEL.md`
- `VCX_FINAL_QA.md`
- `VCX_IMPLEMENTATION_PLAN.md`
- `VCX_MASTER_AUDIT.md`
- `VCX_MOBILE_CHAT_FIXES.md` • `VCX_MOBILE_QA.md`
- `VCX_PHASE2_QA.md` • `VCX_PHASE4_*` • `VCX_PHASE5_LEGAL_MODE.md`
- `VCX_PHASE6_CHAT_TO_MATTER.md` • `VCX_PHASE6_QA.md` • `VCX_PHASE6B_PREFILL_QUALITY.md`
- `VCX_PHASE7_FLOATING_CHAT.md` • `VCX_PHASE7_QA.md`
- `VCX_PRODUCT_COMPLETENESS_AUDIT.md`
- `VCX_ROADMAP_30_60_90.md`
- `claims-evidence.md` • `claims-inventory.md`
- `GUARDRAIL_DEVIATIONS.md`
- `docs/adr/` — architectural decision records
- `docs/positioning/` — messaging & positioning
- `docs/qa/` — past QA reports
- `docs/samples/` — sample assets

## 3 • Cross-links
| If you're… | Start at |
|-----------|---------|
| Picking up this multi-increment program | `MASTER_PLAN.md` |
| Building a new page or section | `DESIGN_SYSTEM_LAYOUT_RULES.md` |
| Adding/moving a hero | `HERO_SYSTEM.md` |
| Tracking unfinished items | `PAGE_AUDIT_MATRIX.md` |
| Debugging a regression | `BUG_LOG.md` (check BL-004 for encoding trap) |
| Verifying what just shipped | `IMPLEMENTATION_SUMMARY.md` |

## 4 • File conventions
- All new docs in Markdown (`.md`), UTF-8 (never cp-1252 — see BL-004).
- Wikilinks `[[FILE]]` resolve against the `docs/` directory.
- Dates in ISO `YYYY-MM-DD`.
- Palette hexes in lowercase without alpha unless needed (`#2d8a82`). Alpha values use rgba notation.
- Code fences marked with language hint when possible.

## 5 • Update cadence
- `MASTER_PLAN.md` — edited per increment.
- `DESIGN_SYSTEM_LAYOUT_RULES.md` — edited only when a new component is introduced.
- `HERO_SYSTEM.md` — edited when a page switches hero variant.
- `PAGE_AUDIT_MATRIX.md` — edited per page touched.
- `QA_TEST_REPORT.md` — edited per QA pass.
- `BUG_LOG.md` — append-only, one entry per real incident.
- `OBSIDIAN_SOURCE_OF_TRUTH.md` (this file) — refreshed when cross-refs change.
- `IMPLEMENTATION_SUMMARY.md` — overwritten per increment shipped.

## 6 • Quick reference — rail classes
```
.vcx-rail-section[--dark|--parchment|--teal]
  .vcx-rail-head[--center]
    .vcx-rail-head__eyebrow
    .vcx-rail-head__title
    .vcx-rail-head__lede
    .vcx-rail-head__nav  (+ .vcx-rail-btn[data-rail-prev|data-rail-next])
  .vcx-rail[--wide|--narrow]
    .vcx-rail__viewport
      .vcx-rail__track
        .vcx-rail-card[--dark]
          .vcx-rail-card__icon
          .vcx-rail-card__eyebrow
          .vcx-rail-card__title
          .vcx-rail-card__desc
          .vcx-rail-card__meta
          .vcx-rail-card__cta
  .vcx-rail-progress > .vcx-rail-progress__bar
  .vcx-pinned-rail[data-scroll-drive="true"]
    .vcx-pinned-rail__stage
      .vcx-pinned-rail__anchor
        .vcx-pinned-rail__title
        .vcx-pinned-rail__lede
        .vcx-pinned-rail__count
      .vcx-pinned-rail__viewport
        .vcx-pinned-rail__track
          .vcx-pinned-rail__card
        .vcx-pinned-rail__dots > .vcx-pinned-rail__dot
  .vcx-dashboard-rail
    .vcx-dashboard-rail__tile[--dark]
      .vcx-dashboard-rail__metric
      .vcx-dashboard-rail__label
      .vcx-dashboard-rail__body
  .vcx-tool-shelf
    .vcx-tool-shelf__item
      .vcx-tool-shelf__ico
      .vcx-tool-shelf__label
        .vcx-tool-shelf__sub
  .vcx-proof-note
  .vcx-legal-boundary
```

## 7 • Quick reference — hero classes
```
<section class="vcx-hero-2 [vcx-hero--compact|vcx-hero--app|vcx-hero--legal]">
  <div class="vcx-hero-2__bg" data-beam-count="70"></div>
  <div class="vcx-hero-2__content">
    <span class="vcx-eyebrow">...</span>
    <h1 class="vcx-hero-2__title">...</h1>
    <p class="vcx-hero-2__subtitle">...</p>
    <p class="vcx-hero-2__subtitle vcx-hero-2__subtitle--scope">...</p>
    <div class="vcx-hero-2__actions">
      <a class="vcx-btn-2 vcx-btn-2--primary">Primary</a>
      <a class="vcx-btn-2 vcx-btn-2--ghost">Ghost</a>
    </div>
    <p class="vcx-hero-2__trust">...</p>
  </div>
</section>
```

## 8 • Emergency contacts (hard-gotchas)
- **If you see Cyrillic or emoji turn into `Ð` / `â` / `ðŸ`** → BL-004. Stop. Run `python -c "import ftfy;print(ftfy.fix_text(open('FILE','rb').read().decode('utf-8')))"` to confirm damage, then run the fix script.
- **If `h2` on a dark section rendered black** → BL-001. The master override won. Add the selector to `vcx-redesign.css` section B14.
- **If the ghost CTA reads black-on-dark** → BL-002. See B14 ghost-CTA subblock.
