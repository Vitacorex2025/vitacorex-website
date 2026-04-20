# P11 Step 11.6 — FL Page Routing Decisions (Ratified)

- **Status**: ratified 2026-04-20 at P11 Step 11.6 design pass
- **Phase**: P11
- **Authority**: [ADR-014 U.S.-wide Positioning Pivot](../adr/ADR-014-us-wide-positioning-pivot.md) §2 + §4 (accepted 2026-04-20, `22bcdd0`)
- **Input**: [state-inventory.md §Step 11.6 routing recommendations](./state-inventory.md#step-116-routing-recommendations) (baseline 2026-04-20, `5d188c2`)
- **Purpose**: Convert the non-binding routing recommendations from state-inventory §Step 11.6 into a binding contract that unblocks downstream implementation. Each of the 8 pages surfaced by Cat. A + Cat. B gets one ratified route. The `vcx-state-banner` component ship-vs-waive open question is resolved. Any divergence from ADR-014 §2 is flagged and justified.

## How to use this document

- **For Step 11.6 implementation sessions (Step 11.6a / 11.6b / 11.6c below)**: each page row is the implementation contract. Copy text, URL, canonical, banner decision, and success signals are binding.
- **For future-state rollout (ADR-014 §6)**: the routing patterns established here are the template. Adding Texas LLC formation follows the same pattern as Florida LLC formation (retain + state-banner with updated `state_banner_fl_tx_only_*` copy).
- **For questioning a route**: routes are reversible via a follow-up Step 11.6 amendment doc, but reopening a ratified route mid-implementation requires ADR-014 amendment.

## Decision inputs

1. **ADR-014 §2** — names 4 state-scoped pages that "carry a visible 'Florida only' banner at top of body, rendered by new component `vcx-state-banner` (CSS + translations — built in P11 Step 11.6)"
2. **ADR-014 §4** — names 5 geo pages that "keep their URLs and canonical tags (no 301s, no index drops). Their role shifts... each geo page gains a single 'Local context' paragraph"
3. **ADR-014 Appendix B** — locks state-banner EN/RU/ES copy + `state_banner_fl_only_*` / `state_banner_rollout_cta_*` translation key names + `assets/css/vcx-state-banner.css` component path
4. **ADR-014 Implementation record §Layer 2** — "if any §2 page is retained with state-scoped framing, the banner ships; if all §2 pages either 301 or are rewritten to national framing with card-level carve-outs, the banner is redundant"
5. **state-inventory.md Cat. A / Cat. B / Cat. E rows** — per-page baseline evidence
6. **Prior P11 shipped-state divergences** — `small-claims-documentation.html` already state-aware-framed in `a6bb73c` + `56b8eee` (Cat. E); state-banner on a page that already communicates scope via state-aware copy would be redundant

## Ratified routes (8 pages)

### Category A — Page-level state-scoped (4 pages)

| # | File | Ratified route | Banner? | URL action | Cross-refs | Divergence from ADR-014 §2? |
|---|------|----------------|---------|------------|------------|------------------------------|
| 1 | `florida-small-claims-help.html` | **Retain + state-banner** | **Yes** — `state_banner_fl_only_*` at top of body | **No change** — URL preserved, canonical self | state-inventory Cat. A row 1 | No — matches §2 literally |
| 2 | `small-claims-documentation.html` | **Retain as-is** (already state-aware national) | **No** — current state-aware copy communicates scope; banner would be redundant + contradict national framing | **No change** | state-inventory Cat. E (shipped `a6bb73c` + `56b8eee`) | **Yes — accepted**: ADR §2 lists this file as state-scoped but prior P11 work already shipped state-aware national framing. Banner would regress that work. Route = retain current E state. |
| 3 | `llc-formation-florida.html` | **Retain + state-banner** | **Yes** — `state_banner_fl_only_*` at top of body | **No change** — URL preserved (defer `/state-guides/florida-llc-formation.html` rename to future phase; SEO equity preservation priority) | state-inventory Cat. A row 3 | No — matches §2 literally |
| 4 | `immigration-services-tampa.html` | **Role pivot per §4** | **No** — underlying service is federal (USCIS); page value is local scheduling + bilingual Tampa communities; banner would mislead users into thinking the immigration packet service itself is FL-only | **No change** — URL preserved, canonical self | state-inventory Cat. A row 4 (A+B hybrid) + `immigration-packet-review.html` is primary national surface | **Yes — accepted**: ADR §2 lists this file as state-scoped but the inventory correctly identifies it as A+B hybrid where the B half (geo-SEO local logistics) dominates. Packet service is federal (USCIS same in every state). Route = §4 role pivot, not §2 state-banner. |

### Category B — Geo pages (4 pages)

Note: `immigration-services-tampa.html` is A+B hybrid and is routed above under Cat. A row 4 with Cat. B §4 treatment.

| # | File | Ratified route | Local-context paragraph topic | URL action | Cross-refs |
|---|------|----------------|-------------------------------|------------|------------|
| 5 | `revenue-recovery-florida.html` | **Role pivot per §4** | Florida healthcare/logistics AR patterns | **No change** — URL preserved, canonical self | state-inventory Cat. B row 1 |
| 6 | `revenue-recovery-miami.html` | **Role pivot per §4** | Miami healthcare density + bilingual AR patterns | **No change** | state-inventory Cat. B row 2 |
| 7 | `revenue-recovery-orlando.html` | **Role pivot per §4** | Orlando hospitality AR patterns | **No change** | state-inventory Cat. B row 3 |
| 8 | `revenue-recovery-tampa.html` | **Role pivot per §4** | Tampa logistics corridor + healthcare systems | **No change** | state-inventory Cat. B row 4 |

### Routing pattern definitions

**"Retain + state-banner"** (pages 1 + 3):
- Preserve URL, title, H1, canonical, `<address>`, JSON-LD `Organization`
- Keep existing Florida-specific procedure/process copy
- Inject `vcx-state-banner` component at top of `<body>` (first element inside `<main>` or equivalent)
- Banner renders `state_banner_fl_only_*` + `state_banner_rollout_cta_*` per ADR-014 Appendix B
- Disclaimer remains Florida-variant (ADR-014 Appendix A "Florida-scoped pages" variant)
- JSON-LD `Service.areaServed` = `{"@type":"State","name":"Florida"}` (semantically accurate — service is FL-only)
- Footer unchanged

**"Retain as-is (already state-aware national)"** (page 2):
- No copy changes
- Status remains Cat. E (already neutralized in prior P11 commits `a6bb73c` + `56b8eee`)
- Disclaimer stays national-default (Appendix A "Default" variant) — already shipped in `56b8eee`
- JSON-LD `Service.areaServed` stays `{"@type":"Country","name":"United States"}` (matches national framing)
- Footer unchanged

**"Role pivot per §4"** (pages 4 + 5 + 6 + 7 + 8):
- Preserve URL, canonical self, JSON-LD `Organization`
- Rewrite H1 + lead paragraph to national framing
- Rewrite `<title>` + meta description to national framing
- Add ONE "Local context" paragraph unique to the market (healthcare density, hospitality, logistics corridor, bilingual communities)
- Remove "where we operate" / "serving X only" implications
- Disclaimer → national-default (Appendix A "Default" variant)
- JSON-LD `Service.areaServed` = `{"@type":"Country","name":"United States"}`; `Place.name` (if used for local SEO) retains city/state for geo-SEO signal but `Service.areaServed` is national
- Footer unchanged
- **NO banner** — the page pivots away from state-scoped framing; banner would contradict the pivot
- CTAs route to national service surfaces (`revenue-recovery-workflow.html`, `immigration-packet-review.html`, `solutions.html`, etc.)

## `vcx-state-banner` component — ship-vs-waive resolution

**Decision: SHIP.**

**Evidence**: 2 of 8 pages (`florida-small-claims-help.html` + `llc-formation-florida.html`) take the "Retain + state-banner" route. Per ADR-014 Implementation record §Layer 2 criterion ("if any §2 page is retained with state-scoped framing, the banner ships"), the ship condition is triggered.

**Component contract (from ADR-014 Appendix B)**:

- Asset path: `assets/css/vcx-state-banner.css`
- Translation keys (to be added to `assets/js/vcx-translations.js`):
  - `state_banner_fl_only_en` / `state_banner_fl_only_ru` / `state_banner_fl_only_es`
  - `state_banner_rollout_cta_en` / `state_banner_rollout_cta_ru` / `state_banner_rollout_cta_es`
- EN copy: *"This service is available in Florida only. Other states are not currently served."* + CTA: *"Interested in rollout to your state? →"*
- RU copy: *"Эта услуга доступна только во Флориде. Другие штаты пока не обслуживаются."* + CTA: *"Заинтересованы в расширении на ваш штат? →"*
- ES copy: *"Este servicio está disponible solo en Florida. Otros estados no son atendidos actualmente."* + CTA: *"¿Interesado en expansión a su estado? →"*
- HTML usage: first element inside `<main>` on ship-with-banner pages; self-contained (no JS required beyond i18n hookup already present in `vcx-i18n.js`)
- CTA target: TBD during Step 11.6a implementation (candidates: `contact.html` with `?intent=state-rollout-interest` query param, or a dedicated `/interest/state-rollout/` landing — deferred to implementation session with lean-toward query-param reuse of existing contact surface)
- Visual treatment: muted / informational (not alert-styled) — communicates scope factually, not as warning
- Responsive: full-width desktop; stacks CTA below copy on mobile
- Accessibility: `role="note"` on container; `aria-label="Service scope: Florida only"` for screen readers

**Build sequence**: Step 11.6a builds the component standalone (CSS + translation keys) with no page wiring; Step 11.6b wires on both pages; Step 11.6c executes role-pivot batch on 5 pages.

## Execution sequence

Step 11.6 implementation is a **multi-commit sub-batch** (not a single commit). Each step below is one commit; each commit follows the 4-gate sign-off protocol (TEST / BUG / SAVE / DOC).

| Step | Commit scope | Files touched | Gating signals |
|------|--------------|---------------|----------------|
| **11.6a** | Build `vcx-state-banner` component | `assets/css/vcx-state-banner.css` (new) · `assets/js/vcx-translations.js` (add 6 keys: EN/RU/ES × 2) · `assets/js/vcx-page-translations.js` (if page-scoped keys needed; likely not) · cache-busters updated sitewide | Component renders in isolation via a disposable test page or inline smoke; translations resolve EN/RU/ES; responsive check pass |
| **11.6b** | Wire banner on 2 pages | `florida-small-claims-help.html` + `llc-formation-florida.html` — inject banner as first element of `<main>` + update cache-busters for touched asset refs | Banner renders at top of `<main>`; 3-locale visible parity; JSON-LD `Service.areaServed` confirmed `State:Florida` on both; disclaimer unchanged (Florida variant) |
| **11.6c** | Role-pivot batch (5 pages) | `immigration-services-tampa.html` + `revenue-recovery-florida.html` + `revenue-recovery-miami.html` + `revenue-recovery-orlando.html` + `revenue-recovery-tampa.html` — H1/lead/title/meta rewrite + local-context paragraph + JSON-LD `areaServed` → Country/United States + disclaimer → national default | 5 pages render national framing with 1 local paragraph each; JSON-LD `areaServed` = `Country:United States` on all 5; disclaimer uses national default; no 301; canonical self preserved |

Step ordering is **strict** (11.6a before 11.6b; 11.6b can run before or after 11.6c; recommended 11.6a → 11.6b → 11.6c for linear review).

Budget estimate: 3 commits, 3 sessions, ~8–12 files touched total. Each step independently verifiable on live-prod.

## Cross-doc updates landing with this ratification

This commit (docs-only) ships alongside:

1. **This doc** — `docs/positioning/step-11-6-routing-decisions.md` (new)
2. **state-inventory.md Cat. F → Cat. E flip** — move `i-130-petition.html` + `i-485-adjustment.html` + `n-400-naturalization.html` rows from Cat. F (pending) to Cat. E (already neutralized) citing commit `f438d60` (P11 Step 11.5 batch 3). Remove the three rows from the Cat. F table; add three rows to the Cat. E table with the f438d60 SHA + "Title/meta/keywords/og/twitter/JSON-LD Service.areaServed → national framing" description.
3. **state-inventory.md §Step 11.6 routing recommendations** — add a "RATIFIED" banner at top of the section pointing at this doc; keep the per-page table as-is for historical traceability (the recommendations were the input; this doc is the ratified output).

No source-file (HTML/JS/CSS) changes ship with this commit. This is pure design-pass doc work.

## Open questions deferred beyond Step 11.6 design pass

1. **`/state-guides/` URL restructuring** — whether to rename `llc-formation-florida.html` → `/state-guides/florida-llc-formation.html` (+ `florida-small-claims-help.html` → `/state-guides/florida-small-claims-help.html`) during P11 or defer to P12+. Decision: **defer**. Reasoning: current URLs carry SEO equity; renaming requires 301 + sitemap + internal-link updates; value realized only when a second state ships. Revisit when Texas / California pages enter roadmap.

2. **State-rollout interest-list CTA target** — whether CTA routes to `contact.html?intent=state-rollout` or a dedicated `/interest/state-rollout/` page. Decision: **defer to Step 11.6a**. Reasoning: implementation-level detail; either works; pick during component build.

3. **`assets/css/vcx-state-banner.css` visual design specifics** — exact padding, color tokens, border treatment. Decision: **defer to Step 11.6a**. Reasoning: aligns to existing design tokens (VCX blue + neutral backgrounds); spec is straightforward; no ADR-level design decision required.

4. **Local-context paragraph copy for 5 role-pivot pages** — exact EN/RU/ES strings. Decision: **defer to Step 11.6c**. Reasoning: copy work; topic direction ratified here (healthcare density / hospitality / logistics / bilingual / federal-scheduling); exact wording during execution session.

## Divergences from ADR-014 §2 — accepted

Two pages in ADR-014 §2's state-scoped list take non-banner routes:

1. **`small-claims-documentation.html`** → ratified as "retain as-is (already state-aware national)" instead of §2's state-banner route. Justification: prior P11 work (`a6bb73c` state-aware hero/compare/FAQ + `56b8eee` national-default UPL disclaimer) shipped this page as national-default with Florida as illustrative example. Adding a state-banner would regress that shipped state and contradict the national framing. The page communicates scope via copy, not banner.

2. **`immigration-services-tampa.html`** → ratified as "role pivot per §4" instead of §2's state-banner route. Justification: the underlying service (immigration packet organization) is federal — USCIS forms are the same in every state. The page's Florida-anchored framing is about local scheduling and bilingual Tampa communities, not about legal scope. A state-banner would mislead users into thinking the packet service itself is FL-only. §4 role pivot is the correct pattern: keep URL/canonical for local-SEO equity, rewrite hero/lead to national, one local-context paragraph about Tampa immigrant communities + federal scheduling logistics.

Both divergences are **accepted** (not errors to correct). They sharpen ADR-014 rather than contradict it — ADR-014 itself acknowledges §2 is provisional pending Step 11.6 routing decisions (§Implementation record Layer 2), and §4's role-pivot pattern is a better fit for pages where the service is jurisdictionally neutral even if the local framing is geo-scoped.

Future-state rollout (§6) inherits these refinements: Texas LLC formation → retain + state-banner (follows page 3 pattern); Texas immigration services local pages → role pivot §4 (follows page 4 pattern); Texas small-claims-documentation-equivalent → state-aware national or page-level state-scoped, decided per-content (not automatic).

## Links

- Authority ADR: [ADR-014 U.S.-wide Positioning Pivot](../adr/ADR-014-us-wide-positioning-pivot.md) (accepted `22bcdd0`)
- Input inventory: [state-inventory.md](./state-inventory.md) (`5d188c2`)
- Upstream P11 commits affecting these routing decisions:
  - `5a7d1f1` — Layer 5 hero + footer + header
  - `a6bb73c` — Layer 1 batch 1 service-page state-neutralization (includes `small-claims-documentation.html`)
  - `56b8eee` — Layer 3 UPL disclaimer state-neutral default
  - `779a4a8` — Card-level carve-out pattern (Cat. C refinement)
  - `f438d60` — Step 11.5 batch 3 immigration-form pages (i-130/i-485/n-400) national-default — unblocks Cat. F → Cat. E flip landing with this commit
- Phase doc: `Upgrade 2026-04/Phases/P11 US-wide Positioning Pivot.md` §Step 11.6 design pass Evidence Record
- Execution log: `Upgrade 2026-04/Execution-Log/2026-04-20.md` Session 5
