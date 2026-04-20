# State Rollout Playbook

> **Status**: accepted — P11 Step 11.7 follow-up
> **Source contract**: [ADR-014 §6 Future-state rollout contract](../adr/ADR-014-us-wide-positioning-pivot.md#6-future-state-rollout-contract)
> **Sibling docs**: [state-inventory.md](./state-inventory.md) · [step-11-6-routing-decisions.md](./step-11-6-routing-decisions.md)
> **Last updated**: 2026-04-20 (created Session 11 `<commit-sha-pending>`)

---

## Purpose

This playbook is the executable companion to ADR-014 §6. It converts the 6-bullet "what must change" list in the ADR into a concrete, ordered, gated sequence a future operator can follow when VitaCoreX adds its **second** (or third, fourth, …) state-scoped service — e.g., Texas small claims, California LLC formation, New York civil filings.

The playbook is **not** about adding Florida-originated national services to a new state. Those are already available U.S.-wide (per ADR-014 §1). It is specifically about **state-scoped carve-outs** — services that require state-specific procedure knowledge (small claims procedure, LLC formation mechanics, state-specific civil forms) where UPL exposure means VCX must serve each state deliberately, not implicitly.

## When to use this playbook

Run this playbook when **all three** conditions hold:

1. A **new state** (not Florida) is being onboarded as a supported jurisdiction for a state-scoped service.
2. The state-scoped service has a **dedicated scope-limited page** (e.g., `florida-small-claims-help.html` is the Florida analogue).
3. The service has **UPL exposure** that requires per-state disclaimer review (not merely document preparation that's already U.S.-wide safe).

Do **not** run this playbook for:

- Adding a new **national** service (national services go through Step 11.5 batch N, not this playbook).
- Adding a **geo-SEO entry point** (like `revenue-recovery-dallas.html` — those follow the role-pivot pattern in ADR-014 §4, not state-scoped carve-out).
- **Expanding hours / language / pricing** in an existing served state (no jurisdictional change).

## Trigger criteria

A "second state" rollout should be considered when the following **three signals** are all present:

| Signal | Source | Threshold |
|--------|--------|-----------|
| Inbound demand | GA + contact-form `intent=state-rollout-interest` CTA | ≥ 10 distinct submissions from the same non-FL state over 90 days |
| UPL safe harbor | State-specific research | Document-preparation safe harbor confirmed (e.g., TX Supreme Court Rule) |
| Service capacity | Internal | Team has at least one operator with domain knowledge of that state's target procedure |

Absence of any signal → defer rollout and log the deferral in the inventory §Deferred rollouts section (create that section if it doesn't yet exist; first deferral creates it).

## Prerequisites (before Step 1)

Confirm these baseline items are still in place from the P11 national-default pivot:

- ✅ Hero / geo pages / disclaimers are already national (per ADR-014 §1 + §4 + §5 — P11 Phase 1 delivered `5a7d1f1`+`b4c2d48`; role-pivot batch delivered `e1fc1c7` + `d3cfaec` + `af8af9d`)
- ✅ `vcx-state-banner` component exists (`assets/css/vcx-state-banner.css`) with keys `state_banner_fl_only` + `state_banner_rollout_cta` (P11 Step 11.6a `e10f5f2`)
- ✅ `Organization.areaServed` is already `Country:United States` in JSON-LD (P11 Phase 1 + Step 11.7 `56b8eee`)
- ✅ `assets/js/private-lookup.js` state enum already includes all 50 states (no change needed during rollout)
- ✅ Footer vendor address stays at Tampa, FL as an `<address>` element (operational requirement — do not move)

If any ✅ is not confirmed, **stop**: the national-default pivot is not fully landed and rollout will sit on an unstable foundation.

---

## Execution playbook

### Step R1 — UPL research and disclaimer variant authoring

**Goal**: produce a per-state UPL assessment and, if warranted, a disclaimer variant.

**Inputs**:
- Target state (e.g., Texas)
- Target service (e.g., small claims documentation, LLC formation)
- Existing disclaimer variants in [ADR-014 Appendix A](../adr/ADR-014-us-wide-positioning-pivot.md#appendix-a--state-neutral-disclaimer-variants-locked)

**Outputs**:
- New memo in `docs/research/upl-{state-slug}.md` documenting: (a) state's document-preparation safe harbor rule with citation, (b) any state-specific UPL carve-outs (e.g., Texas Supreme Court Rule 5.01, California B&P Code §6450), (c) recommended disclaimer variant if the default national disclaimer is insufficient.
- If a new variant is warranted: add to ADR-014 Appendix A as a **new** subsection (do not modify existing locked variants); file an ADR amendment or a supplementary ADR.

**Gate**: research memo reviewed; ADR amendment drafted (if needed).

### Step R2 — Decide: does this state need its own scope-scoped page?

**Decision matrix**:

| Existing Florida page | New-state page needed? | Rationale |
|-----------------------|------------------------|-----------|
| `florida-small-claims-help.html` | YES if service offered in new state | Small claims procedure is state-specific (JP Court in TX, Superior Court in CA, etc.) |
| `llc-formation-florida.html` | YES if service offered in new state | LLC formation mechanics differ per state SOS portal |
| `revenue-recovery-florida.html` | NO — already role-pivoted national per §4 | AR consulting is document-layer national; FL retained as specialty |
| `immigration-services-tampa.html` | NO — federal USCIS, already role-pivoted national per §4 | Federal service; office identity preserved |
| `revenue-recovery-{miami,orlando,tampa}.html` | NO — geo-SEO entry points, already role-pivoted per §4 | Metro specialty framing; URL retained for SEO equity |

Only state-scoped Florida pages trigger new-state page creation. Role-pivoted pages are already national and do not need per-state variants.

### Step R3 — Create new state-scoped pages (if applicable)

For each state-scoped service:

1. **Page path**: follow the convention `/{state-slug}-{service-slug}.html` OR `/state-guides/{state-slug}-{service-slug}.html` (see Open question below).
   - E.g., `texas-small-claims-help.html` or `/state-guides/texas-small-claims-help.html`
2. **Source**: clone the Florida analogue; swap state-specific content (court name, rule citations, SOS portal URLs, fees table, jurisdictional limits).
3. **Preserve**: URL structure, canonical patterns, hreflang 4× (en/ru/es/x-default), breadcrumb pattern, footer vendor-address.
4. **Swap**: state-specific procedure, state-specific disclaimer variant (if authored in R1), state banner wiring (see R4).
5. **JSON-LD**: `LocalBusiness.areaServed` set to the new state (e.g., `{"@type":"State","name":"Texas"}`); `Organization.address` stays Tampa; `Organization.areaServed` stays `Country:United States`.
6. **Translation keys**: new state-specific keys in `vcx-translations.js` with `*_tx_*` or equivalent prefix; EN/RU/ES parity mandatory before first ship.
7. **Cache-buster bump**: `vcx-translations.js?v=N → ?v=N+1` sitewide if new keys ship.

**Open question (deferred in Step 11.6 ratification)**: Should state pages migrate to `/state-guides/` subdirectory? Decision deferred until second state ships. At that point, the operator chooses:
- **Keep flat** (`texas-small-claims-help.html` at root) — mirrors `florida-small-claims-help.html` pattern, zero URL-restructuring, but root gets cluttered with multiple state pages.
- **Migrate to subdirectory** (`/state-guides/texas-small-claims-help.html` + move `florida-small-claims-help.html` to `/state-guides/florida-small-claims-help.html` with 301) — cleaner long-term, but requires 301 on an indexed FL page and hreflang rewiring.

Recommend the operator pick at R3 time and amend this playbook + state-inventory.md with the chosen convention as a binding contract going forward.

### Step R4 — Update state-banner copy on the old FL pages

The `vcx-state-banner` component shipped in Step 11.6a serves 2 FL pages (`florida-small-claims-help.html` + `llc-formation-florida.html`) with copy that says "Florida only". When coverage expands to include a second state, the banner must reflect the expanded coverage.

**Mechanism decision (BINDING per this playbook)**: **update the value** of existing key `state_banner_fl_only`; do **not** rename the key.

Rationale: the key is a slot (DOM reference unchanged); the value is the copy (fluid). Renaming the key would require updates to every page's `data-page` / `data-common` binding, component CSS selector tests, and translation-key baselines — all for no functional gain. Updating the value flows through the existing cache-buster mechanism.

**Copy update pattern** (example: adding Texas as 2nd state):

| Locale | Old value (Florida only) | New value (Florida + Texas) |
|--------|-------------------------|------------------------------|
| EN | This service is available in Florida only. Other states are not currently served. | This service is available in Florida and Texas only. Other states are not currently served. |
| RU | Эта услуга доступна только во Флориде. Другие штаты пока не обслуживаются. | Эта услуга доступна только во Флориде и Техасе. Другие штаты пока не обслуживаются. |
| ES | Este servicio está disponible solo en Florida. Otros estados no son atendidos actualmente. | Este servicio está disponible solo en Florida y Texas. Otros estados no son atendidos actualmente. |

**Constraint**: the copy MUST enumerate every served state. "Florida and others" is forbidden — the ADR-014 §2 contract is that state-scoped pages are explicit about which states they cover.

**Cache-buster**: bump `vcx-translations.js?v=N → ?v=N+1` sitewide after the value update lands. CSS file does not need a bump (no style change).

**`state_banner_rollout_cta`**: no change. The CTA stays "Interested in rollout to your state? →" — it remains a call-to-action for unserved states, which still exist (47 of them, after FL + TX).

**ADR-014 Appendix B amendment**: this playbook's copy update pattern IS an amendment to the locked Appendix B. Append a new "Appendix B — Amendment log" subsection to ADR-014 citing the playbook and the commit SHA when the first expansion ships.

### Step R5 — CTA target decision

The `state_banner_rollout_cta` href in production is `contact.html?intent=state-rollout-interest` (per Step 11.6a ratified contract). This continues to work for a 2nd state — the intent captures "interested in a state not currently served" regardless of which states are served.

**Optional**: create per-state intent variants if analytics demand more granularity:
- `contact.html?intent=state-rollout-interest-california`
- `contact.html?intent=state-rollout-interest-newyork`
- etc.

Recommend **do not** add per-state intents unless analytics specifically call for it. Keeps the contact form's routing logic simple.

### Step R6 — state-inventory.md updates

Every rollout MUST update the inventory. Required edits:

1. **Add state-scoped page rows** for the new pages (e.g., `texas-small-claims-help.html`) under **Cat. A** (now "FL + new-state scoped" — rename the section if needed).
2. **Move resolved items** from Cat. F (pending review) to Cat. E (historical neutralized) with commit SHA.
3. **Update §Step 11.6 routing decisions** cross-ref to note the expansion.
4. **Update §"When VCX adds a second state"** section with a completed marker: replace the "When VCX adds a second state" conditional with "VCX added $STATE on $DATE (commit `$SHA`)".
5. **Add a NEW forward-looking section** "When VCX adds a THIRD state" that mirrors the §6 ADR contract for the next iteration.

### Step R7 — No-op inventory (document what DOESN'T change)

Explicitly confirm these stay unchanged (NO edits during rollout):

| Asset | Why it doesn't change |
|-------|----------------------|
| `home_hero_eyebrow` EN/RU/ES | Already national per §5 (delivered P11 Phase 1 `5a7d1f1`) |
| Footer vendor address `<address>` element | Vendor seat stays at Tampa, FL (operational contact) |
| JSON-LD `Organization.address` | Vendor address, not service scope |
| JSON-LD `Organization.areaServed` | Already `Country:United States` |
| Role-pivoted geo pages (Miami, Orlando, Tampa metros + immigration-services-tampa + revenue-recovery-florida) | National-default with §4 local specialty; not state-scoped |
| `assets/js/private-lookup.js` state enum | Already includes all 50 states |
| `vcx-state-banner.css` styles | Component rendering unchanged; only copy changes via translation values |
| National disclaimers (Appendix A default + debt-collection-adjacent variants) | Already state-neutral |

Document all 8 NO-OPs in the rollout commit message to preserve the audit trail.

### Step R8 — Verification gates

Follow the standard P11 4-gate sign-off:

**TEST gate**:
- Live-prod smoke on every edited page: `<title>`, `<meta description>`, hero eyebrow, H1, scope-scoped disclaimer, JSON-LD `areaServed`, state-banner render copy.
- EN/RU/ES parity check on every modified translation key.
- Zero stale "Florida only" copy on any page where the banner updated.
- Cache-buster bump verified live-prod (`?v=N+1` serving, `?v=N` gone).

**BUG gate**:
- JSON-LD schema validation on every state-scoped page (Google Rich Results Test or equivalent).
- Broken-link scan on new state-scoped pages (internal CTAs + canonical + hreflang + breadcrumb targets).
- Translation-key uniqueness check (no duplicates in EN/RU/ES blocks).
- Cat. D preservation check: `geo.region`, `Organization.address`, footer `<address>`, hreflang 4× — all unchanged.

**SAVE gate**:
- Atomic commit per sub-step where possible (avoid mixing R3 page creation with R4 banner copy updates if the batch is large).
- Follow P11 precedent: 1 phase-commit per session × 4-gate PASS.

**DOC gate**:
- Execution log entry (`Upgrade 2026-04/Execution-Log/{date}.md`) with full change ledger.
- Master Plan P11 Priority Matrix + Active Work row entries.
- Phase doc (`Phases/P11 US-wide Positioning Pivot.md` or its successor) Evidence Record section.
- state-inventory.md updates per R6.
- This playbook itself may need updates (e.g., clarifying a convention ratified during rollout) — amend inline with the commit that ratifies the convention.

---

## Exit criteria

Rollout is **complete** when all of the following are true:

- [ ] Every new state-scoped page serves HTTP 200 with correct canonical + hreflang + JSON-LD
- [ ] state-banner copy updated sitewide to enumerate all served states
- [ ] EN/RU/ES parity on every modified translation key
- [ ] Cache-buster bumped and `?v=old` 404s or returns stale-cache notice
- [ ] state-inventory.md reflects new state (Cat. A additions + §"When VCX adds a second state" replaced)
- [ ] ADR-014 Appendix B amendment log entry landed
- [ ] 4-gate sign-off PASS in Execution log
- [ ] Internal analytics event configured (e.g., GA4 custom dimension `served_state`) if the operator tracks per-state engagement

---

## Rollback protocol

If a UPL surprise surfaces mid-rollout (e.g., a state-specific licensure requirement discovered after pages ship), execute this rollback:

1. **Immediate (< 1 hour)**: revert the commit that introduced the new state-scoped page(s); push to `origin/main`; GitHub Pages deploy will remove the pages within ~15s.
2. **State-banner copy**: revert to prior locked copy (Florida-only or Florida-plus-previous-states); bump cache-buster.
3. **Disclaimer variant**: if the variant authored in R1 was merged into ADR-014 Appendix A, mark it as "withdrawn pending re-research" in the amendment log; do not delete.
4. **state-inventory.md**: move the new rows to a new **Cat. G (withdrawn)** section with rollback commit SHA + reason.
5. **Communication**: update the contact-form `intent=state-rollout-interest` response to acknowledge the pause.
6. **Root-cause memo**: `docs/research/upl-{state-slug}-rollback-{date}.md` documenting the surprise and what R1 research missed.

Rollback is cheap because the P11 architecture deliberately kept state-scoped pages as additive opt-ins, not destructive reshapes. The national-default foundation is unaffected by rollback.

---

## Ownership and cadence

- **Owner**: whichever operator initiates the rollout (single-threaded during execution; do not parallelize R1–R8 across operators).
- **Cadence**: one phase-commit per session, mirroring P11 discipline. Expected session count for a full 2nd-state rollout: **3–5 sessions** (R1 research; R3 page authoring; R4 banner copy; R6 inventory updates; R8 verification + close).
- **Sign-off**: ADR amendment (if Appendix A variant added) requires the same acceptance path as the original ADR-014.

---

## Worked example — adding Texas (illustrative)

This section is illustrative; it does **not** commit VCX to TX rollout.

### R1 — UPL research
- Memo: `docs/research/upl-texas.md`
- Safe harbor: Texas Government Code §81.101 (unauthorized practice of law); Texas Supreme Court's document-preparation exception for LegalZoom-pattern services.
- Disclaimer variant: likely a minor edit of the Florida-scoped variant (swap "Florida civil procedure / Florida Sunbiz filings" → "Texas civil procedure / Texas SOS filings").

### R2 — Decision matrix
- Texas small claims → YES (JP Court procedure; different fee schedule; different jurisdictional limits)
- Texas LLC → YES (TX SOS portal differs from FL Sunbiz)
- Revenue recovery / immigration / AR consulting / national services → NO (already U.S.-wide)

### R3 — New pages
- `texas-small-claims-help.html` (clone from `florida-small-claims-help.html`; swap procedure)
- `texas-llc-formation.html` (clone from `llc-formation-florida.html`; swap mechanics)
- JSON-LD `LocalBusiness.areaServed` = `{"@type":"State","name":"Texas"}` on each
- Translation keys with `*_tx_*` prefix; EN/RU/ES parity

### R4 — Banner copy update
- Update `state_banner_fl_only` value from "Florida only" → "Florida and Texas only" (all 3 locales)
- Cache-buster bump `vcx-translations.js?v=29 → ?v=30`
- ADR-014 Appendix B amendment log: "2026-MM-DD: expanded to Florida + Texas — commit `$SHA`"

### R5 — CTA target
- Keep `contact.html?intent=state-rollout-interest` unchanged.

### R6 — Inventory updates
- Add `texas-small-claims-help.html` + `texas-llc-formation.html` rows to Cat. A (renamed "FL + TX scoped")
- Replace §"When VCX adds a second state" with §"Texas added 2026-MM-DD (`$SHA`)"
- Add new §"When VCX adds a third state"

### R7 — No-ops confirmed
- Hero / footer / JSON-LD Organization / role-pivoted pages / private-lookup.js / banner CSS — all unchanged.

### R8 — Verification
- 4-gate sign-off per session; expected ~3 sessions for TX full rollout.

---

## Links

- ADR: [ADR-014 U.S.-wide Positioning Pivot](../adr/ADR-014-us-wide-positioning-pivot.md)
- State inventory: [state-inventory.md](./state-inventory.md)
- Step 11.6 routing contract: [step-11-6-routing-decisions.md](./step-11-6-routing-decisions.md)
- Phase doc: `Upgrade 2026-04/Phases/P11 US-wide Positioning Pivot.md`
- Execution log: `Upgrade 2026-04/Execution-Log/2026-04-20.md` (P11 sessions 1–11)

## Living document rules

- **Amend inline** when a rollout ratifies a convention (e.g., the `/state-guides/` subdirectory question in R3).
- **Do not delete** worked example content — move to an "Archived worked examples" section if the state lands.
- **Version via commit SHA** not semver — each amendment cites its commit.
- **R-step numbering is stable** — if a new step is inserted, suffix it (R4a, R4b) rather than renumbering.
- **ADR precedence**: if this playbook conflicts with ADR-014, the ADR wins; file a playbook amendment to reconcile.
