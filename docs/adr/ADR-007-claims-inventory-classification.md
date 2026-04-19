# ADR-007 — Claims Inventory Classification

- **Status**: proposed
- **Date**: 2026-04-19 (proposed at P04 kickoff)
- **Phase**: P04 Proof and Claims Audit
- **Supersedes**: none
- **Depends on**: ADR-005 (Pricing Tier Architecture) · ADR-006 (Navigation B2B/B2C Split) · ADR-008 (Sample Deliverable Standards)
- **Unblocks**: P05 (Legal Language Hardening) · P09 (SEO Content Clusters — helpful-content rewrite needs the same citation discipline) · P11 (U.S.-wide Positioning Pivot — national claims must survive state-neutralization)
- **Obsidian**: [[Upgrade 2026-04/Phases/P04 Proof and Claims Audit]]

---

## Context

Audit 2026-04-18 §4 and §10 Priority #4 ("Proof + убрать непроверяемые claims — Новому бренду нужны доказательства") identified an across-site credibility hole: **specific quantitative claims are rendered as hard facts without a visible source, a visible caveat, or an underlying citable engagement**.

A reconnaissance sweep of the current codebase (2026-04-19, pre-P04) found **503 regex-matched claim candidates across 46 HTML files**. Spot audit of the highest-risk pages:

### Homepage (`index.html`)

- "100% Counsel-Ready" (bento grid big number)
- "37% · 68% · 90%" — impact counter grid (no units, no denominators, no source)
- Engagement examples block:
  - "$340K · Recovered across 6 locations in 90 days" + "$1.1M in receivables 30–180 days old" + "DSO reduced from 62 → 41 days"
  - "$1.2M" + "$2.8M in recoverable AR" + "DSO reduced from 58 → 36 days" + "Bad debt write-offs down 41% year over year"
  - "$485K · Fuel card AR recovered in 120 days"
- Pricing strip: "success fee only on recovered cash (15 / 18 / 22.5% by aging)" — **rates, not outcomes; citable as policy, not as proof**

### Case studies (`case-study-*.html`)

- Healthcare: hero = **"Twelve clinics. $2.8M identified. $1.2M recovered in six months"** · "23% of balances over 90 days lacked documentation" · "90% file-readiness minimum bar" · "−41% YoY" · "94%"
- Fleet: "78% of accounts retained — no customer relationship severed" · "78% (vs 20–30% typical post-collection)" · "Qualification takes less than a week"
- SaaS: **"Mid-market SaaS rescues 67% of failed subscription payments in 60 days"** · "$780K in failed renewals" · "67% (vs 20% prior)" · "89% customer LTV preserved"

### Service pages

- Recovery-rate fee schedule (15/18/22.5%) — governance, not outcome
- Pricing floors ($149 / $219 / $349 / $649 / $2,500 / $8,500) — **locked by ADR-005, not re-scoped here**

### Samples (`/samples/<slug>.html`)

Numbers already carry ADR-008 §redaction discipline (dollar bands, relative dates, `[REDACTED]`) and the sample banner. **P04 does not re-legislate samples — ADR-008 already governs them.** P04's scope is the **marketing surface** (homepage, case studies, service pages, industry pages, landing pages, about, FAQ).

### The credibility problem

For each hard number on the marketing surface, a buyer (and a regulator) has to answer three questions:

1. **Where did this come from?** — Is it one engagement? Pattern across many? Industry benchmark? Composite illustration?
2. **Is the caveat visible?** — If composite/illustrative, does the page *say so* next to the number, or does the reader have to find a footnote?
3. **Could this claim be read as a promise of outcome?** — Because if it can, it crosses from marketing into regulated-activity territory (UPL, consumer protection, FCCPA, FTC deception).

Today: none of the three is answered consistently. Case studies read as if they are single client engagements but use no client name, no year, no geography, no verifier — leaving the reader unsure whether these are real, composite, or hypothetical. That ambiguity is worse than either extreme:
- If real → buyers wonder why there's no proof pack / reference sheet
- If composite → buyers wonder why it's not labeled
- If hypothetical → buyers wonder why specificity was used at all

A new brand with a legal-adjacent positioning cannot carry that ambiguity. The audit directive is clear: **every quantitative claim is either (a) backed by a citable source, (b) labeled "illustrative / representative / composite", or (c) removed**.

### Adjacent constraints

- **ADR-005** locks pricing numbers (entry/full/custom). P04 does not re-price; it audits *outcome* claims, not *pricing* claims.
- **ADR-006** locks audience framing. B2C claims and B2B claims have different regulatory surfaces (FTC deception for B2C, commercial/professional claims for B2B). Classification rules must respect both.
- **ADR-008** locks sample redaction discipline. Samples are *evidence artifacts*, not marketing claims. P04 covers the marketing surface.
- **P05 Legal Language Hardening** (ADR-009 planned) will build the disclaimer architecture. P04 must hand P05 a clean surface: claims classified and either rewritten or removed, so P05 can bolt on legal language without first having to rescue claims.
- **P11 U.S.-wide Positioning** (ADR-014 proposed) will pivot Florida-first → nationwide. Claims must survive that pivot: "Tampa" / "Florida" in a claim either needs to be (a) removed from the claim (b) kept because the claim is legally state-specific, or (c) generalized to "across U.S. engagements".

---

## Decision

Adopt a **four-class taxonomy** for every quantitative claim on the marketing surface, a **visible-caveat discipline** for Illustrative/Composite claims, a **citable-evidence bibliography** (`docs/claims-evidence.md`) indexed by ADR-007, and a **regression verifier** (`scripts/verify-claims-discipline.js`) that prevents unclassified claims from shipping.

### The four classes

| # | Class | Definition | Fate on the page |
|---|-------|------------|------------------|
| 1 | **Citable** | Comes from a public, durable, external source: CFPB, Urban Institute, BLS, FTC, FRBNY, industry-standard study (HFMA, ACA International, MBA Annual Statistical Report), or a peer-reviewed paper. | **Keep verbatim.** Add `<cite>` / footnote link to source. Source archived in `docs/claims-evidence.md`. |
| 2 | **Illustrative** | Derived from VCX engagement patterns — true in pattern, not attributable to one client, used to show shape. Includes "what a typical engagement looks like" numbers. | **Keep with visible caveat.** Inline label: "*representative example*" / "*illustrative figure*" / "*composite based on engagement patterns*". Section-level banner on case studies. No claim survives without the caveat within reading distance (same paragraph or same visible card). |
| 3 | **Internal** | Came from a real VCX engagement but not from a public source. Client data, not releasable, not citable externally. | **Demote to Illustrative** (the default) or **elevate to Citable** only if the client signs a case-study release (ADR-008 §sample-redaction rubric extended). Until release: treat as Illustrative with the standard caveat. |
| 4 | **Risky** | Implies (a) regulated activity VCX does not perform (legal advice, debt collection, CPA tax opinions), (b) outcome guarantees ("will recover X%", "guaranteed", "eliminate"), (c) superlatives without basis ("best", "fastest", "leading"), or (d) numbers whose source VCX cannot reconstruct. | **REMOVE.** Replaced with a process statement ("what we do") or a range statement ("observed band"), not an outcome statement. |

### Classification procedure (applied once in P04, enforced forever)

1. **Inventory pass**: every `*.html` on the marketing surface is scanned by `scripts/inventory-claims.js` (new, Step 4.1). Output: `docs/claims-inventory.md` with one row per candidate claim: `page · line · exact_text · initial_class · rewrite_plan · source_url_if_citable · resolved_at`.
2. **Human classification pass**: operator reads each row, confirms or overrides the initial class, commits.
3. **Rewrite pass**: `scripts/rewrite-claims.js` is **not** automated — rewrites are surgical Edit calls per page so context is preserved. The inventory file drives which pages get touched in which order.
4. **Regression pass**: `scripts/verify-claims-discipline.js` (new, Step 4.6) hard-fails the build if:
   - A page contains a `%`, `$`, or "X of N" pattern outside a `<cite>`-wrapped block, outside the ADR-005 pricing namespace, and outside an ADR-008 sample watermarked block, without an accompanying `.vcx-claim-caveat` class within the same section.
   - A new claim appears in a diff and is not referenced by `docs/claims-inventory.md`.

### Visible-caveat contract (class 2 Illustrative)

Every Illustrative number ships with one of these three anchors, picked by surface density:

| Surface | Caveat anchor | Example |
|---------|---------------|---------|
| **Single inline number** (hero, bento grid, KPI card) | Suffix or prefix with `.vcx-claim-caveat` micro-label: "*illustrative*" / "*representative example*" | `<span>$340K</span><span class="vcx-claim-caveat">illustrative</span>` |
| **Paragraph / list with multiple numbers** | One caveat line immediately above or below the block, not at the page bottom | `<p class="vcx-claim-caveat">Composite across healthcare engagement patterns. Not a single-client outcome.</p>` |
| **Full case study** | `vcx-case-study-banner` at the top of the page: "Composite engagement — based on patterns across N VCX matters. Individual client details are not disclosed." AND per-number suffix `<span class="vcx-claim-caveat">composite</span>` on every hero / KPI cell | Case study top banner + per-KPI composite tag |

**Styling contract** (added to `assets/css/vcx-claims.css`, new in Step 4.3):

```css
.vcx-claim-caveat {
  font-size: .72em;
  font-style: italic;
  color: #5E6C7B;
  letter-spacing: .02em;
  margin-left: .4em;
  white-space: nowrap;
}
.vcx-claim-caveat::before { content: "· "; }
.vcx-case-study-banner {
  background: #FFF8E1;
  border-left: 4px solid #D49A00;
  padding: 12px 16px;
  font-size: .9rem;
  color: #5A4400;
  margin: 0 0 24px;
}
@media print {
  .vcx-claim-caveat { color: #3A4A5B; }
  .vcx-case-study-banner { break-inside: avoid; }
}
```

The caveat is **never** visually hidden, **never** collapsed behind a tooltip, **never** a footnote-only reference. If a number's caveat is not within the reader's first-glance scan, the caveat is not doing its job.

### Citation contract (class 1 Citable)

Every Citable claim uses:

```html
<span>Medical debt affects 41% of U.S. adults<sup><a href="#cite-cfpb-medical-debt-2024" class="vcx-cite-link">1</a></sup></span>
```

With a matching entry in `docs/claims-evidence.md`:

```markdown
## cite-cfpb-medical-debt-2024
- **Claim cited**: "Medical debt affects 41% of U.S. adults"
- **Used on**: industry-healthcare-dental.html, resources.html
- **Source**: CFPB, "Medical Debt Burden in the United States", Feb 2024
- **URL**: https://www.consumerfinance.gov/data-research/research-reports/medical-debt-burden-in-the-united-states/
- **Retrieved**: 2026-04-19
- **Archive**: https://web.archive.org/web/2026*/consumerfinance.gov/...
```

**Evidence file rules**:
- One heading per citation ID (kebab-case, starts with source prefix: `cite-cfpb-*`, `cite-bls-*`, `cite-hfma-*`, etc.)
- Every citation has a retrieved-on date and an archive URL (Wayback or archive.today). **No archive URL = citation fails regression.**
- Archive captures are re-verified annually by `scripts/verify-citations.js` — citations pointing at dead links are flagged but not auto-removed (operator decides).
- No broken citation may ship: `scripts/verify-citations.js` hard-fails on HTTP 404 for both live URL and archive URL.

### Rewrite rubric (class 4 Risky)

| Risky pattern | Rewrite template |
|---------------|------------------|
| "We recover up to X%" (outcome guarantee) | "Observed recovery bands vary by aging and portfolio quality. See Net Recovery Pilot terms for our rate schedule." |
| "Eliminates bad debt" | "Reduces documentation gaps and standardizes escalation — outcomes depend on portfolio." |
| "Guaranteed results" | **REMOVE.** No replacement. |
| "Best / leading / #1 in [scope]" | **REMOVE** unless backed by a citable ranking. |
| "Save X hours / faster by Y%" | "Operators report reduced handoff time after standardizing file readiness. Magnitude varies by starting state." |
| "Avoid legal fees" / "Avoid court costs" | **REMOVE.** VCX does not advise on legal cost avoidance. |
| "Increase revenue by X%" (not tied to specific engagement) | "Illustrative: one engagement recovered [$band] from [scope]. Not typical, not guaranteed." |

### Composite case-study contract (class 2 variant)

The three existing case studies (`case-study-healthcare-network.html`, `case-study-fleet-logistics.html`, `case-study-subscription-saas.html`) are **composite** by nature (no client name, year, or geography disclosed). P04 locks them as:

1. **Banner mandatory**: top of page, above hero, `vcx-case-study-banner` class. Copy:
   > "**Composite engagement record.** Based on patterns across VCX matters in this industry. Individual client details are not disclosed. Outcomes vary by portfolio condition at intake."
2. **Hero suffix**: every hero number tagged `<span class="vcx-claim-caveat">composite</span>`.
3. **KPI cells**: each KPI cell carries the same suffix.
4. **i18n parity**: banner + suffix exist as translation keys `cs_banner_*` / `cs_claim_composite` EN/RU/ES.
5. **JSON-LD**: case study `@type` stays `Article` but adds `disambiguatingDescription: "Composite engagement — no single-client identity disclosed"` and `genre: "composite-case-study"`.

### Source allowlist (class 1)

Accepted citation sources, in declining order of authority:

1. U.S. federal agency — CFPB, FTC, BLS, FRBNY, SBA, USCIS, IRS, DOJ
2. State agency — Florida OFR, Florida DBPR, Florida AGO (for state-specific claims surviving P11)
3. Non-profit research org — Urban Institute, Pew, Brookings, NBER
4. Industry association data — HFMA, ACA International, MBA, ABA (banking), ATA (transportation)
5. Peer-reviewed journal — via DOI or publisher URL
6. Named vendor research — **only** when the methodology is published (e.g., Federal Reserve SHED, HFMA Pulse of the Healthcare Revenue Cycle)

**NOT accepted**:
- Marketing pages of competitors / vendors
- Press releases (unless the underlying report is attached)
- Blog posts without cited methodology
- ChatGPT / LLM output
- "A study found" without specific attribution

### Classification defaults (pre-inventory)

To accelerate the Step 4.1 inventory pass, these defaults apply unless operator overrides:

| Observed pattern | Default class |
|------------------|---------------|
| Specific dollar + specific client scope + no source | Illustrative / composite |
| Percentage with no denominator ("68%", "94%") | Illustrative **and** rewrite to show denominator or drop |
| DSO reduction (specific "X → Y days") | Illustrative composite |
| Recovery-rate fee schedule (15/18/22.5%) | **Citable** (ADR-005 §pricing — policy, not outcome) |
| Pricing floor ($149, $2,500, $8,500) | **Citable** (ADR-005, not P04 scope) |
| Industry statistics with attributable source | Citable |
| Industry statistics without attribution | Risky → remove or research to find source |
| "Up to X%" / "as much as" | Risky (outcome implication) |
| "Typical" / "average" without denominator | Risky |
| "Proven" / "guaranteed" / "eliminate" | Risky |
| Sample-page numbers inside `.vcx-sample-watermark` context | **Out of P04 scope** (ADR-008 governs) |
| Pricing-ladder numbers inside `pricing-and-engagement-tiers.html` | **Out of P04 scope** (ADR-005 governs) |

---

## Alternatives considered

### A. "Just remove every number"
Rejected. Zero-number marketing is worse than disciplined-number marketing — the audit specifically said "new brand needs proof". Removing all numbers leaves the site with no evidence of work having been done.

### B. "Full case-study releases from clients"
Rejected for now. Getting 3+ healthcare/fleet/SaaS clients to sign case-study releases takes 2-6 months and may produce two usable releases, not three. P04 cannot block on that. Releases are welcome when they land — the composite → attributed upgrade is a one-commit operation (swap banner, add client name, add logo).

### C. "Footnote-only caveats"
Rejected. Reader does not see footnotes on first scan. FTC deception standard for B2C and commercial reasonable-reader standard for B2B both bias toward caveats in first-glance reading order. Inline caveats satisfy both; footnote-only caveats satisfy neither.

### D. "Remove all case studies until real ones land"
Rejected. The case studies today carry the *shape* of what VCX delivers and are substantively accurate as composite patterns. Removing them would cost more credibility than a properly labeled composite costs. The banner + caveat discipline is a cheap fix compared with the silence alternative.

### E. "Classify in ADR-007, enforce in the CMS, not in source"
Rejected. There is no CMS today. HTML is the source. Enforcement must bind at the source-file level via `scripts/verify-claims-discipline.js`, not a runtime flag. A runtime flag can be toggled; a build-fail cannot.

### F. "Separate `citations.json` instead of `claims-evidence.md`"
Rejected for maintainability. `claims-evidence.md` is human-readable, reviewed by the same humans who edit marketing copy, and can carry `retrieved` + `archive` + `notes` without schema gymnastics. A JSON version may be generated from the MD if P10 Analytics needs it.

---

## Consequences

### Positive

- Every surviving number on the site has a documented class, a visible caveat (if Illustrative), or a citation (if Citable). A buyer / regulator / procurement reviewer has one file (`docs/claims-inventory.md`) to audit.
- Case studies become usable: today they read as unverifiable, post-P04 they read as explicitly composite with operator-owned methodology. That is paradoxically more credible than specific-unverified.
- P05 inherits a clean surface. Legal disclaimer architecture in ADR-009 doesn't need to rescue claims; it bolts onto already-audited claims.
- P09 (blog) inherits the citation discipline — new helpful-content posts use the same `<cite>` + `claims-evidence.md` machinery from day one.
- P11 (U.S.-wide pivot) becomes safer: geography inside a claim is either (a) intentional (state-law-bound) or (b) removed during the claims rewrite.
- `scripts/verify-claims-discipline.js` catches claims-drift in future PRs automatically. No claim ships un-classified.

### Negative

- P04 is content-heavy: the inventory pass will surface hundreds of numbers. Rewrite pass touches 20+ HTML files. Translation keys grow by ~40–60 new `cs_banner_*` / `vcx_claim_caveat_*` entries in EN/RU/ES = 120–180 catalog entries.
- Classification is judgment-dense. Operator must make ~500 small calls. Using the "defaults" table above accelerates but does not eliminate judgment.
- Case-study banners are visually assertive (amber). Some will read this as de-credibilizing; the rebuttal is "a labeled composite is more credible than an unlabeled one."

### Reversible via

- Class reassignments: inventory file is version-controlled. Switching a row from Illustrative → Citable is a one-commit operation once a source lands.
- Case-study promotion: if a client signs a release, the banner is removed, client name/logo added, `genre` flipped to `case-study` — single PR.
- Source retirement: if a citation dies, the row flags red via `scripts/verify-citations.js` and operator chooses replace vs. remove. No cascade.

### Non-reversible

- Numbers classified **Risky → removed** are gone. If operator wants them back, the replacement must enter as Citable or Illustrative with caveat. No "undo the audit" path.
- `scripts/verify-claims-discipline.js` is a permanent regression gate. Turning it off silently re-opens the credibility hole.

---

## Inventory + evidence file contracts

### `docs/claims-inventory.md` (master inventory, updated on every rewrite)

```markdown
---
title: Claims Inventory (per ADR-007)
adr: ADR-007
status: live
last_reviewed: YYYY-MM-DD
---

## Scope

Every quantitative claim on the marketing surface. Samples (ADR-008) and pricing (ADR-005) excluded.

## Inventory table

| Page | Section | Exact text | Initial class | Final class | Rewrite / action | Evidence ref | Resolved |
|------|---------|------------|---------------|-------------|------------------|--------------|----------|
| index.html | bento "100% Counsel-Ready" | "100%" | Risky | Illustrative | Added `.vcx-claim-caveat` "on qualifying files" | — | 2026-04-19 |
| index.html | impact grid | "37% · 68% · 90%" | Risky | Removed | Grid retired; replaced with process-statement card | — | 2026-04-19 |
| index.html | engagement ex. 1 | "$340K · 6 locations · 90 days" | Illustrative | Illustrative | Added composite caveat | — | 2026-04-19 |
| case-study-healthcare-network.html | hero | "Twelve clinics. $2.8M identified. $1.2M recovered in six months." | Illustrative | Illustrative | Added top banner + `composite` caveat on hero | — | 2026-04-19 |
| … | … | … | … | … | … | … | … |

## Rewrite log

### 2026-04-19
- index.html: 12 claims classified → 8 Illustrative (caveat added), 2 Risky (removed), 2 Citable (pending sources)
- case-study-healthcare-network.html: 9 claims → all Illustrative-composite with banner
- …
```

### `docs/claims-evidence.md` (source bibliography)

```markdown
---
title: Claims Evidence (per ADR-007 §citation-contract)
adr: ADR-007
status: live
last_reviewed: YYYY-MM-DD
---

## Citation index

### cite-cfpb-medical-debt-2024
- **Claim cited**: "Medical debt affects 41% of U.S. adults"
- **Used on**: industry-healthcare-dental.html (line ~247)
- **Source**: CFPB, "Medical Debt Burden in the United States"
- **Published**: Feb 2024
- **URL**: https://www.consumerfinance.gov/data-research/research-reports/medical-debt-burden-in-the-united-states/
- **Retrieved**: 2026-04-19
- **Archive**: https://web.archive.org/web/20240301000000*/consumerfinance.gov/...
- **Methodology**: CFPB Consumer Credit Panel, nationally representative
- **Notes**: Operator verified figure appears in report p.12 §3

### cite-bls-hourly-wage-healthcare-2024
- …
```

---

## Execution sequencing (drives the P04 steps)

This ADR sequences the six P04 steps as:

| Step | ADR reference | Output |
|------|---------------|--------|
| **4.1** | §inventory-procedure | `scripts/inventory-claims.js` + `docs/claims-inventory.md` populated with candidates |
| **4.2** | §four-classes + §classification-defaults | Inventory file has Final class resolved for every row |
| **4.3** | §rewrite-rubric + §visible-caveat-contract | HTML files + `assets/css/vcx-claims.css` + i18n keys shipped; inventory `Resolved` column populated |
| **4.4** | §citation-contract + §source-allowlist | `docs/claims-evidence.md` populated; `<cite>` / footnote markup in place for Citable rows |
| **4.5** | §composite-case-study-contract | Three case studies carry banner + per-KPI suffix + JSON-LD `genre: composite-case-study` |
| **4.6** | §regression-pass | `scripts/verify-claims-discipline.js` + `scripts/verify-citations.js` green; `decision.claims-inventory-locked` in memory; ADR-007 status flipped to **accepted** |

---

## Memory entities to create (Step 4.6)

```
decision.claims-inventory-locked = {
  adr: "ADR-007",
  locked_at: "2026-04-19",
  inventory_file: "docs/claims-inventory.md",
  evidence_file: "docs/claims-evidence.md",
  verifier: "scripts/verify-claims-discipline.js",
  classes: ["citable", "illustrative", "internal", "risky"],
  case_studies_composite: ["healthcare-network", "fleet-logistics", "subscription-saas"],
  case_studies_attributed: []
}
```

---

## Out of scope (explicitly)

- **Pricing claims** — governed by ADR-005. $149 / $219 / $2,500 / $8,500 / 15-18-22.5% fee schedule are *policy*, not *outcome*. Not re-audited here.
- **Sample-page redacted numbers** — governed by ADR-008 §redaction. Watermarked + banner-framed; they cannot be read as live outcome claims.
- **Factual brand statements** — "Florida-registered LLC", "Sunbiz #L24000XXXXXX", "EIN XX-XXXXXXX" — these are verifiable identity claims, not outcome claims. Kept verbatim.
- **Testimonials** — none currently. When added (post-P06 GBP phase), they will need their own sub-ADR (ADR-015 or later) because FTC Endorsement Guide rules apply.
- **Security / compliance certifications** — none currently claimed. If added (SOC 2, HIPAA BAA list), they become Citable by definition (certificate URL = source).

---

## Links

- Obsidian phase note: [[Upgrade 2026-04/Phases/P04 Proof and Claims Audit]]
- Audit finding: [[Research/Site Audit 2026-04-18#4 Что добавить]] §4, [[Research/Site Audit 2026-04-18#10 Приоритеты]] row 4
- Depends on: [ADR-005](ADR-005-pricing-tier-architecture.md) · [ADR-006](ADR-006-navigation-b2b-b2c-split.md) · [ADR-008](ADR-008-sample-deliverable-standards.md)
- Unblocks: [ADR-009 Legal Disclaimer Architecture](../adr/README.md) (P05 planned)
- Inventory (produced in Step 4.1): `docs/claims-inventory.md`
- Evidence (produced in Step 4.4): `docs/claims-evidence.md`
- Verifiers (produced in Steps 4.1 + 4.6): `scripts/inventory-claims.js` · `scripts/verify-claims-discipline.js` · `scripts/verify-citations.js`
- Styling: `assets/css/vcx-claims.css` (new in Step 4.3)
- i18n: `cs_banner_*` · `vcx_claim_caveat_*` · `vcx_cite_*` namespaces in `assets/js/vcx-translations.js`

---

*Proposed 2026-04-19 by operator. Awaiting acceptance before Step 4.1 fires.*
