# Sample Deliverables — Doc Index

> Per-sample reference documentation for the 7 HTML samples shipped under `/samples/` by P03.
> Governed by [ADR-008 — Sample Deliverable Standards](../adr/ADR-008-sample-deliverable-standards.md) (accepted 2026-04-19).

## Purpose

Each `docs/samples/<slug>.md` captures the **non-HTML** context a future editor needs before touching a sample page:

- **What the sample shows** (narrative purpose, operator value proposition)
- **Audience + gating status** per ADR-008 roster
- **Where it is referenced** (library hub card + service-page embed + schema-audit row)
- **Schema contract** (CreativeWork field set + BreadcrumbList chain + `isAccessibleForFree` lock)
- **Redaction rubric applied** (what became `[REDACTED]`, what stayed verbatim, why)
- **i18n namespace** (`smp_<slug>_*`) + trilingual parity evidence
- **Change log + version** pointer into the rendered JSON-LD `version` / `dateModified`

## Roster (locked in ADR-008 §roster)

| # | Slug | Sample | Audience | Gating | Doc |
|---|------|--------|----------|--------|-----|
| 1 | `ar-leakage-map` | AR Leakage Map | B2B | **gated** | [ar-leakage-map.md](./ar-leakage-map.md) |
| 2 | `counsel-ready-packet` | Counsel-Ready Packet Index | B2B | **gated** | [counsel-ready-packet.md](./counsel-ready-packet.md) |
| 3 | `diagnostic-report` | 30-Day Diagnostic Report | B2B | open | [diagnostic-report.md](./diagnostic-report.md) |
| 4 | `contract-risk-memo` | Contract Risk Flag Memo | B2C | open | [contract-risk-memo.md](./contract-risk-memo.md) |
| 5 | `immigration-evidence-index` | Immigration Evidence Index | B2C | open | [immigration-evidence-index.md](./immigration-evidence-index.md) |
| 6 | `auto-deal-cost-breakdown` | Auto Deal Cost Breakdown | B2C | open | [auto-deal-cost-breakdown.md](./auto-deal-cost-breakdown.md) |
| 7 | `small-claims-chronology` | Small Claims Chronology | shared | open | [small-claims-chronology.md](./small-claims-chronology.md) |

## Editing guardrails

Any edit to a sample's HTML, JSON-LD, or redaction scope MUST:

1. Update the companion `docs/samples/<slug>.md` → bump the `version` + `last_reviewed` fields.
2. Bump the JSON-LD `dateModified` (and `version` if the structure changes, per ADR-008 §versioning).
3. Re-run the full audit battery:
   - `node scripts/verify-sample-schema.js` → PASS
   - `node scripts/verify-gated-samples.js` → PASS (for the 2 gated samples)
   - `node scripts/verify-sitemap.js` → PASS (roster + hub + gate page intact)
   - `node scripts/verify-home-cards.js` → PASS (home dual-entry cards untouched)
4. Keep `smp_<slug>_*` EN/RU/ES catalog entries in parity — no RU/ES empties.
5. Preserve the `.vcx-sample-watermark` + `.vcx-sample-banner` runtime injection path (DOM element must remain class-findable by `assets/js/vcx-sample.js`). Watermark is a regulatory control, not a stylistic one — never remove.

## Cross-references

- **ADR**: [ADR-008 Sample Deliverable Standards](../adr/ADR-008-sample-deliverable-standards.md)
- **Schema audit**: [`scripts/verify-sample-schema.js`](../../scripts/verify-sample-schema.js) (3-section deep audit, exit 1 on any failure)
- **Gating regression guard**: [`scripts/verify-gated-samples.js`](../../scripts/verify-gated-samples.js) (4-gate permanent guard)
- **Playwright e2e spec**: [`tests/e2e/samples.spec.ts`](../../tests/e2e/samples.spec.ts) (drafted — fires when PW env lands)
- **Library hub**: [`sample-deliverable.html`](../../sample-deliverable.html) (CollectionPage with 7 hasPart CreativeWork)
- **Gate page**: [`samples/request-gated-sample.html`](../../samples/request-gated-sample.html) (`?s=<slug>` query bridge · robots noindex · WebPage schema)
- **Runtime assets**: [`assets/css/vcx-sample.css`](../../assets/css/vcx-sample.css) · [`assets/js/vcx-sample.js`](../../assets/js/vcx-sample.js) · [`assets/css/vcx-sample-gate.css`](../../assets/css/vcx-sample-gate.css) · [`assets/js/vcx-sample-gate.js`](../../assets/js/vcx-sample-gate.js) · [`assets/css/vcx-sample-embed.css`](../../assets/css/vcx-sample-embed.css)

## Status

- **Roster**: 7 of 7 live (all HTML · all JSON-LD · all trilingual · all audited).
- **Gating**: 2 of 2 gated samples wired (CSS + JS + gate-page routing + library-hub + service-page embed CTAs all route through gate).
- **Schema audit**: all 3 sections (A samples · B hub · C gate) PASS.
- **Playwright e2e**: 8 suites drafted; run-blocked on PW env provisioning (tracked in `Upgrade 2026-04/00 Master Plan.md` Open Blockers).
- **Last roster change**: 2026-04-19 (ADR-008 acceptance).
