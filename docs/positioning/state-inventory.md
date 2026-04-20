# State-Reference Inventory

- **Status**: live — baseline captured 2026-04-20 at P11 Step 11.2
- **Phase**: P11
- **Authority**: [ADR-014 U.S.-wide Positioning Pivot](../adr/ADR-014-us-wide-positioning-pivot.md) (accepted 2026-04-20, commit `22bcdd0`)
- **Purpose**: Comprehensive catalog of every Florida / FL / Tampa / Sunbiz / FCCPA / FS-559 / FS-605 reference across the site, with ADR-014 taxonomy disposition. Serves as:
  1. Input to P11 Step 11.6 (FL-page routing decisions)
  2. Baseline for future-state rollout (TX / CA / NY / etc.) per ADR-014 §6
  3. Audit evidence that every surviving FL reference is deliberate (legitimate ops fact · intentional carve-out · or explicitly pending review)

## How to use this document

- **For a new file added to the site**: grep your file for `Florida|FL|Tampa|Sunbiz|FCCPA`. If any match, categorize per §Taxonomy below and add a row to §Per-file disposition. If the match is a legitimate ops anchor (vendor address, geo.region meta, governing-law clause), category D applies — no action needed.
- **For Step 11.6 routing decisions**: §Step 11.6 routing recommendations is the canonical pending-decisions list.
- **For future-state rollout (adding Texas / California / etc.)**: §Future-state rollout checklist.
- **To re-run the survey**: see §Survey methodology.

## Taxonomy (per ADR-014)

| Category | ADR-014 §ref | Meaning | Disposition |
|----------|--------------|---------|-------------|
| **A — Page-level state-scoped carve-out** | §2 | Entire page is scoped to Florida because the service is state-specific (civil procedure, LLC/Sunbiz mechanics, local logistics) | Retain with explicit "Florida only" framing; route per Step 11.6 (retain-with-banner vs 301 vs hybrid) |
| **B — Geo page** | §4 | Local-SEO entry point for Florida cities; underlying service is U.S.-wide | Role pivot pending Step 11.6 (keep URL + canonical; rewrite hero/lead to national with one local-context paragraph) |
| **C — Card-level state-scoped carve-out** | §2 refinement (2026-04-20) | A single feature / card / tool on an otherwise U.S.-wide page that is genuinely state-specific | Preserve as-is inside the national page — refinement pattern documented in ADR-014 Implementation record |
| **D — Legitimate legal/ops anchor** | — | Vendor identity fact (company seat, office address, governing law, Sunbiz record, FCCPA compliance) — NOT a service-scope claim | Keep permanently; immune to P11 sweep |
| **E — Already neutralized** | §1 + §3 + §5 | Previously FL-anchored, shipped as U.S.-wide / state-aware / state-neutral in prior P11 commit | No action; historical record |
| **F — Pending review** | — | Ambiguous — needs categorization into A/B/C/D/E during Step 11.5 batch 3+ or Step 11.6 | Explicit flag for next session |
| **G — Out of scope** | — | App-internal (private-lookup state dropdown), sample authenticity (real FL matter per ADR-008), SEO-keyword hoard in JSON-LD (not user-visible copy) | Document why excluded; no action |

## Survey methodology

```bash
# Primary sweep — HTML files
rg -c "Florida|Флорид|Флориде" *.html

# FL as standalone token
rg -c "\bFL\b" *.html

# JS translation catalogs
rg -c "Florida|Флорид|Флориде" assets/js/*.js

# Florida-specific statute references
rg -c "Sunbiz|FCCPA|F\.S\. 559|F\.S\. 605|Chapter 454" *.html assets/js/*.js
```

Baseline counts (2026-04-20):

- HTML files matched: **35** with `Florida|Флорид|Флориде` (203 total hits); **61** with `\bFL\b` (137 total hits)
- JS files matched: **11** with `Florida` (315 hits across `vcx-translations.js` 128 + `vcx-page-translations.js` 143 + 9 smaller files)
- Hottest HTML files: `llc-formation-florida.html` 30 · `florida-small-claims-help.html` 22 · `revenue-recovery-miami.html` 15 · `revenue-recovery-florida.html` 14 · `security-and-compliance.html` 12 · `revenue-recovery-orlando.html` 12 · `samples/small-claims-chronology.html` 9 · `faq.html` 8

## Per-file disposition

### Category A — Page-level state-scoped carve-outs (4 pages)

| File | FL hits | Disposition | Step 11.6 decision pending |
|------|---------|-------------|----------------------------|
| `florida-small-claims-help.html` | 22 Florida + 1 FL | **A — state-scoped** (Florida civil small-claims procedure, FS-34.01, $8k ceiling, `fsch_*` translation keys) | Retain-with-banner vs 301-to-`small-claims-documentation.html` + preserve URL via self-canonical on a state-guide variant |
| `small-claims-documentation.html` | 3 Florida + 1 FL | **A — corporate small-claims scope** (currently framed "state-aware" per `a6bb73c`; UPL block state-neutral per `56b8eee`) | Retain national frame + keep Florida as illustrative example; confirm in 11.6 |
| `llc-formation-florida.html` | 30 Florida + 3 FL | **A — Sunbiz-specific** (Florida Division of Corporations filing mechanics, unique from CA SoS / TX SOS / DE SoS processes) | Retain-with-banner; potentially rename URL to `florida-llc-formation.html` or add `/state-guides/` prefix in 11.6 |
| `immigration-services-tampa.html` | 5 Florida + 7 FL | **A + B hybrid** — local scheduling/logistics for Tampa immigrant communities; underlying packet service is federal | Role pivot per §4 (local-context paragraph + national hero); reference `immigration-packet-review.html` as primary service surface |

### Category B — Geo pages (5 pages)

| File | FL hits | Disposition | Step 11.6 decision pending |
|------|---------|-------------|----------------------------|
| `revenue-recovery-florida.html` | 14 Florida + 1 FL | **B — geo-SEO Florida statewide** | Role pivot: hero + lead rewritten to national; 1 local-context paragraph about Florida healthcare/logistics AR patterns; canonical self-preserved |
| `revenue-recovery-miami.html` | 15 Florida + 7 FL | **B — geo-SEO Miami metro** | Role pivot: local-context paragraph about Miami healthcare density + bilingual AR patterns |
| `revenue-recovery-orlando.html` | 12 Florida + 7 FL | **B — geo-SEO Orlando metro** | Role pivot: local-context paragraph about Orlando hospitality AR patterns |
| `revenue-recovery-tampa.html` | 6 Florida + 7 FL | **B — geo-SEO Tampa metro** | Role pivot: local-context paragraph about Tampa logistics corridor + healthcare systems |
| `immigration-services-tampa.html` | (see Cat. A) | **A + B hybrid** | See above |

### Category C — Card-level state-scoped carve-outs (1 card shipped, pattern available for future)

| File | Location | Disposition |
|------|----------|-------------|
| `additional-services.html` | card4 "Florida Official Source Locator" (lines 225–230 static HTML + EN/ES/RU translations in `vcx-translations.js` + inline `PAGE_DATA.*.card4_*` in line 23 blob) | **C — card-level carve-out** — shipped 2026-04-20 via `779a4a8` (Step 11.5 batch 2). A single feature card pointing at Florida government portals (SunPass, CFX, Florida Courts, PACER) embedded inside an otherwise U.S.-wide page. Pattern documented in ADR-014 Implementation record. |
| `additional-services.html` | Legal Assistant card description mentions "Florida official-source routing" via card4 | **C — accurate cross-reference** — describes the product's real FL routing feature, not a scope claim |
| `additional-services.html` | FAQ Q1 answer about "Florida Portal Locator" | **C — accurate tool description** |

### Category D — Legitimate legal/ops anchors (site-wide patterns)

These FL references are **vendor identity facts or governing-law clauses**, not service-scope claims. All remain permanently.

| Pattern | Surfaces | Count | Why legitimate |
|---------|----------|-------|----------------|
| `<meta name="geo.region" content="US-FL">` | ~51 HTML files | 51 | Vendor operating region — consumed by search engines + local-SEO crawlers to locate the business; IS-3166-2 US-FL is correct because the company operates from Florida |
| JSON-LD `Organization.address.addressRegion: "FL"` | ~50 HTML files | 50 | `schema.org/PostalAddress` contract — encodes vendor registered address (Tampa, FL); AI assistants + knowledge graph ingestion depend on correct region code |
| `Tampa, FL` / `Tampa FL` in footer vendor signatures | 30+ HTML files | ~40 | Office address — operationally required for SLA contact, procurement verification, wire-transfer mailing address |
| `about.html` §Founding fact — "Active Florida LLC" / "2025 — Tampa, Florida" / "Florida Sunbiz entity record" / `abt_fact1_*` / `abt_fact2_*` / `abt_proc_note` | `about.html` lines 230/231/235/253 + EN/RU/ES translations | 4 (+ translations) | Vendor identity — independently verifiable via Florida Division of Corporations (Sunbiz); essential for procurement due-diligence |
| `security-and-compliance.html` §reg_b5 "Florida-specific" (registered in Florida + follows FCCPA as workflow reference) | lines 80/81/175/181/275/281/542/543 (EN/RU/ES + static HTML) | 8 | Compliance transparency — describes where VCX is registered (fact) and which state consumer-protection statute guides workflow (fact); NOT a scope claim (reg_b2_body explicitly says "FCCPA referenced as workflow guardrails, not applicable-statute") |
| `privacy-policy.html` governing-law clause (Florida law governs the Privacy Policy) | line ~212 | 1 | Legal seat — contract choice-of-law is vendor-bound, not service-bound; retained after Step 11.5 batch 2 survey |
| `terms-of-use.html` governing-law / venue / arbitration clauses (Florida) | line ~205 | 1 | Legal seat — same reasoning as privacy-policy |
| SEO keyword hoard (`Florida X` tokens in `<meta keywords>` and JSON-LD `knowsAbout` arrays on pages like `index.html`, `about.html`, `faq.html`, immigration form pages) | ~8 files | ~60 individual keywords | Search-ranking signal — `knowsAbout` in JSON-LD is not user-visible copy; "Florida debt recovery law" / "LLC formation Florida" in this array = indexing hints to AI assistants, not brand positioning. Retained. |
| `index.html` JSON-LD `areaServed: [{"Country":"United States"},{"State":"Florida"}]` | line 1172 | 1 | **Additive** semantic — "serves US nationally AND Florida specifically" (reflecting state-scoped carve-outs in Cat. A); retained |
| `index.html` JSON-LD FAQ Q6 "Can VitaCoreX help with LLC formation in Florida?" | line 1169 | 1 | Accurate — LLC formation IS state-scoped to Florida (ADR §2); answer correctly says "documentation for Florida LLC formation" |
| `faq.html` FAQ about LLC formation in Florida (Q15, Q16) | lines 319/321/328 + JSON-LD line 431 | 4 | Accurate — LLC formation IS state-scoped |
| `faq.html` "VitaCoreX LLC is based in Tampa, Florida. We serve clients nationwide..." | line 375 + JSON-LD line 435 | 2 | Vendor identity + explicit national service scope — exemplary framing |
| JSON-LD `Organization.knowsAbout` includes `"Florida FCCPA"`, `"Florida Statute 559"`, `"Florida Statute 605"` | `index.html` line 1172 + other pages | 5 | Compliance transparency — same reasoning as security-and-compliance §reg_b5 |

### Category E — Already neutralized in prior P11 commits

Historical record — no current action needed. These surfaces have been shifted from Florida-first framing to U.S.-wide / state-aware / state-neutral during prior P11 work.

| File | Commit(s) | What was neutralized |
|------|-----------|---------------------|
| `index.html` (hero) | `5a7d1f1` | `home_hero_eyebrow` EN/RU/ES: `"Tampa, FL · For companies and private clients"` → `"For companies and private clients across the United States"` |
| `index.html` (bento card 5) | `5a7d1f1` + `b4c2d48` | `bento_5_text` EN/RU/ES: `"across Florida / по всей Флориде / en toda Florida"` → `"across the U.S. / по всей территории США / de todo EE. UU."` |
| Top-nav time widget | `5a7d1f1` | `Tampa, FL` time zone label → `U.S. Eastern` (51 HTML files × 96 occurrences) |
| `vcx-footer.js` | `5a7d1f1` | privateClients column: `nav_fl_small_claims` swapped for state-neutral `nav_small_claims_desk`; new `stateTools` block renders FL items as muted inline strip |
| `contract-review-service.html` | `a6bb73c` | Title/H1/meta-description: "Contract review...Florida-focused" → "Contract Review & Documentation Packets — fixed-fee, U.S.-wide"; FAQ Q5/A5 reframed "any state" |
| `auto-deal-review.html` | `a6bb73c` | Title "Auto Deal Review Florida" → "Auto Purchase Contract Review"; meta + keywords drop "Florida" |
| `small-claims-documentation.html` | `a6bb73c` | `scd_hero_lede` + `scd_compare_foot` + `scd_faq_q4/a4` state-aware framing |
| `revenue-recovery-workflow.html` | `a6bb73c` | `rrw_comp_p`: "Florida FCCPA / Florida UETA" → "applicable state rules (confirmed at intake)" |
| `solutions.html` | `a6bb73c` | `sol_t3_p1`: "Florida F.S. 559/605" → "jurisdiction-specific rules confirmed at intake" |
| 5 service pages UPL blocks | `56b8eee` | `scd_upl_text`/`pet_upl_text`/`crs_upl_text`/`ipr_upl_text`/`adr_upl_text` + footer variants: "Florida Bar rules on UPL" → "UPL rules vary by state" (EN/RU/ES) |
| `partners.html` UPL | `a7a7d8b` | Florida Bar / Rule 4-5.4 / Chapter 454 FL Statutes reframed as illustrative examples rather than scope limits |
| `additional-services.html` card5 + card8 | `779a4a8` | `as_card5_p`/`as_card5_li1`/`as_card5_scope` + `as_card8_h3`/`as_card8_p`/`as_card8_scope` EN/RU/ES state-neutralized; SEO meta + JSON-LD FAQ + inline PAGE_DATA aligned |
| `i-130-petition.html` | `f438d60` | Title `\| VitaCoreX Tampa FL` → `\| VitaCoreX LLC`; meta description U.S.-wide ("available nationwide"); keywords drop `Tampa FL immigration` token; og:title + og:description + twitter:title + twitter:description mirror; JSON-LD `Service.areaServed` `{Place:Tampa, Florida}` → `{Country:United States}`. Preserved Cat. D ops anchors: `geo.region US-FL` meta, `geo.placename Tampa` meta, JSON-LD Organization block, body intro "throughout Tampa, Florida and nationwide", footer vendor signature. |
| `i-485-adjustment.html` | `f438d60` | Same 8-edit pattern as i-130; meta description "Form I-485 Adjustment of Status document preparation and filing support, available nationwide..." |
| `n-400-naturalization.html` | `f438d60` | Same 8-edit pattern as i-130; meta description "Form N-400 Application for Naturalization document preparation and citizenship interview support, available nationwide..." |

### Category F — Pending review (Step 11.5 batch 3+ or Step 11.6)

These surfaces have FL references that have **not been explicitly categorized** during prior P11 work. Need decision during next P11 sub-batches.

| File | FL hits | Suspected disposition | Action |
|------|---------|----------------------|--------|
| `immigration-documents.html` | 0 Florida + 1 FL | **D** (geo.region meta only) | No action — confirmed D |
| `revenue-recovery-florida.html` | 14 Florida + 1 FL | **B** (geo page — role pivot pending) | See Cat. B |
| `additional-services.html` | 7 Florida + 2 FL | **Mix C + D** — card4 (C) + Legal Assistant description (C) + FAQ Q1 (C) + SEO keywords (D) + footer (D) — all categorized | Confirmed — no action |

**Resolved Cat. F → Cat. E flips** (2026-04-20, Step 11.6 design pass):

- `i-130-petition.html` · `i-485-adjustment.html` · `n-400-naturalization.html` — shipped U.S.-wide framing in `f438d60` (P11 Step 11.5 batch 3); rows moved to Cat. E above.

### Category G — Out of scope

| Surface | FL hits | Why out of scope |
|---------|---------|------------------|
| `app/private-lookup/index.html` | 17 Florida + 2 FL | State enum dropdown (`<option value="FL" selected>Florida (FL)</option>` × 50 states) — FL is one of 50 options, not a scope claim. App-internal. |
| `assets/js/private-lookup.js` | 17 Florida | State enum backend — mirrors HTML dropdown |
| `assets/js/vcx-legal-assistant.js` | 2 Florida | Legal Assistant app internal (references `additional-services.html` card4 tool) |
| `assets/js/vcx-ai-assistant.js` | 1 Florida | AI chat system prompt fragment |
| `assets/js/vcx-contract-review.js` | 4 Florida | Contract review app internal |
| `assets/js/vcx-chat-launcher.js` | 5 Florida | Chat-launcher app internal |
| `assets/js/vcx-i18n.js` | 7 Florida | i18n fallback strings |
| `assets/js/vcx-nav.js` | 1 Florida | Nav component comment |
| `assets/js/vitacorex-public.js` | 3 Florida | Public widget init |
| `samples/small-claims-chronology.html` | 9 Florida | **Sample authenticity** (ADR-008) — sample IS a redacted real Florida small-claims matter; Florida is a factual attribute of the sample, not a scope claim |
| `samples/auto-deal-cost-breakdown.html` | 2 Florida | Sample-specific — redacted real auto deal in Florida |
| `samples/diagnostic-report.html` | 1 Florida | Sample-specific |
| `samples/immigration-evidence-index.html` | 1 Florida | Sample-specific |
| `samples/counsel-ready-packet.html` | 0 Florida + 1 FL | Sample-specific (office address) |
| `samples/request-gated-sample.html` | 0 Florida + 1 FL | Gate page vendor address |
| `samples/ar-leakage-map.html` | 0 Florida + 1 FL | Sample-specific (office address) |
| `samples/contract-risk-memo.html` | 0 Florida + 3 FL | Sample-specific (office address / geo.region) |
| `404.html` | 1 Florida + 5 FL | Vendor identity on error page |

## Step 11.6 routing recommendations

> **✅ RATIFIED 2026-04-20** — see [step-11-6-routing-decisions.md](./step-11-6-routing-decisions.md) for the binding contract. This section preserved as historical input / traceability record. For implementation, use the ratified contract; divergences from the table below are documented there.

Input for next P11 sub-batch — not binding until ratified in Step 11.6 session.

| File | Recommended route | Rationale |
|------|-------------------|-----------|
| `florida-small-claims-help.html` | **Retain + state-banner** (A) | Florida small-claims procedure (civil, non-commercial) differs materially from other states; retaining with "Florida only" banner + keeping URL = clean SEO + explicit scope. State-banner component (`vcx-state-banner`) to be built if this route chosen. Alternative: 301 to `small-claims-documentation.html` (which is state-aware corporate small-claims) — but loses the consumer-facing FL civil small-claims content. Preferred: retain. |
| `small-claims-documentation.html` | **No change** (already E) | State-aware framing shipped in `a6bb73c` + `56b8eee` |
| `llc-formation-florida.html` | **Retain + state-banner** (A) OR **move to `/state-guides/florida-llc-formation.html`** | Sunbiz process is irreducibly Florida-specific. Prefer retain current URL for SEO equity; add state-banner. URL rename to `/state-guides/` adds a redirect but is cleaner for future TX/CA rollout. |
| `immigration-services-tampa.html` | **Role pivot per §4** (A+B hybrid → B) | The service itself is federal (USCIS same in every state); the page's value is local scheduling + bilingual communities in Tampa. Rewrite hero + lead to national, keep 1 local-context paragraph about Tampa communities, canonical to itself |
| `revenue-recovery-florida.html` | **Role pivot per §4** (B) | Current framing implies "where we operate"; rewrite to national with one Florida local-context paragraph |
| `revenue-recovery-miami.html` | **Role pivot per §4** (B) | Same — local-context paragraph about Miami healthcare + bilingual AR |
| `revenue-recovery-orlando.html` | **Role pivot per §4** (B) | Same — local-context paragraph about Orlando hospitality AR |
| `revenue-recovery-tampa.html` | **Role pivot per §4** (B) | Same — local-context paragraph about Tampa logistics corridor |

**Open question for 11.6 session**: does `vcx-state-banner` component ship (if at least one page takes "retain + state-banner" route) or get waived (if all Cat. A pages either 301 or convert to state-guide URLs)? Per ADR-014 Implementation record §Layer 2, component build is contingent on 11.6 outcome.

## Future-state rollout checklist

When VCX adds a second state (e.g., Texas), the following updates land together per ADR-014 §6:

1. **UPL research** — confirm document-preparation safe harbor in target state (TX = Supreme Court of Texas Rule, etc.); produce state-specific UPL disclaimer variant if warranted
2. **New state-scoped pages** (if LLC/small-claims equivalents offered):
   - `/state-guides/texas-llc-formation.html` (Texas SOS mechanics)
   - `/state-guides/texas-small-claims.html` (Texas JP Court procedure)
3. **State-banner text update** on old state-scoped pages to reflect expanded coverage: EN/RU/ES translations for `state_banner_fl_tx_only_*` etc.
4. **Footer** — no change (vendor address stays Tampa, FL — vendor seat didn't move)
5. **JSON-LD `Organization.areaServed`** — no change (already `Country:United States`)
6. **Hero / geo pages / disclaimers** — no change (already national)
7. **`assets/js/private-lookup.js`** state enum — no change (already includes all 50 states)
8. **Update this document** — add Texas rows to Cat. A/B/C; move resolved Cat. F items
9. **Update `docs/positioning/state-rollout-playbook.md`** (scheduled for Step 11.7 or P12) with Texas-specific execution steps

## Living document rules

- **Re-run survey** (§Survey methodology) before starting any P11 session; diff against §Per-file disposition baseline
- **New file with FL reference** → add row to §Per-file disposition before the file is merged
- **Category flip** (e.g., F → A via Step 11.6 decision) → update row + move to correct section
- **Category E entries** are permanent historical record — do not delete; they anchor commit-to-surface traceability
- **Never delete Category D rows** — removing a legitimate ops anchor without ADR-level review is a regression

## Links

- ADR: [ADR-014 U.S.-wide Positioning Pivot](../adr/ADR-014-us-wide-positioning-pivot.md) (accepted 2026-04-20, `22bcdd0`)
- ADR Implementation record §Layer 2 (card-level carve-out refinement)
- Step 11.6 ratified routing contract: [step-11-6-routing-decisions.md](./step-11-6-routing-decisions.md) (ratified 2026-04-20)
- Execution log: `Upgrade 2026-04/Execution-Log/2026-04-20.md` Sessions 3 + 4 + 5
- Phase doc: `Upgrade 2026-04/Phases/P11 US-wide Positioning Pivot.md`
- Audit source: `Upgrade 2026-04/Research/Site Audit 2026-04-19` §5
