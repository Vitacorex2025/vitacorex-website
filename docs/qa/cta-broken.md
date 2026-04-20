---
title: CTA Broken List — VitaCoreX Site
generated: 2026-04-20T07:48:18Z
generator: scripts/verify-cta-targets.js (P17 Step 17.2)
governs: Phases/P17 Broken Buttons and CTA Audit.md
input: docs/qa/cta-inventory.md
consumed_by: docs/qa/cta-triage.md (P17 Step 17.3 manual triage)
idempotent: "internal checks byte-stable; external HEAD results may vary with upstream availability"
---

# CTA Broken List — VitaCoreX Site

> **Machine-generated.** Each row = one CTA that failed automated validation. Do not hand-edit — regenerate via `node scripts/verify-cta-targets.js`. Manual triage in Step 17.3 (`docs/qa/cta-triage.md`) assigns a disposition (fix / remove / defer / invalid) per row.

## Summary

- **Inventory rows parsed**: 2809
- **Rows actively validated**: 2399
- **Rows skipped (action-script / no target / self-ref)**: 410
- **Broken rows (triage required)**: 22
- **External unique URLs HEAD-checked**: 7

### By failure reason

| Reason | Count |
|--------|-------|
| internal-anchor-missing | 5 |
| external-http-4xx | 5 |
| external-http-opaque | 2 |
| no-handler | 10 |

## Broken rows

| File | Line | Element | Label | Target | Category | Audience | Reason | Detail |
|------|------|---------|-------|--------|----------|----------|--------|--------|
| `about.html` | 213 | a | View Steven Miller on LinkedIn | `https://www.linkedin.com/in/steven-miller-ab17783a5/` | external | shared | external-http-opaque | HTTP 999 |
| `about.html` | 253 | a | LinkedIn | `https://www.linkedin.com/in/steven-miller-ab17783a5/` | external | shared | external-http-opaque | HTTP 999 |
| `app/private-lookup/index.html` | 359 | button | New Route | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/private-lookup/index.html` | 449 | button | (no label) | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/private-lookup/index.html` | 450 | button | (no label) | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/review/index.html` | 119 | button | Refresh | `(handler)` | form-submit | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/vcx-contract-review/index.html` | 129 | button | Analyze Contract | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/vcx-packet-room/index.html` | 96 | button | Access Portal | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `case-study-healthcare-network.html` | 567 | a | Review evidence standards | `index.html#v52-evidence` | in-body | b2b | internal-anchor-missing | index.html#v52-evidence |
| `corporate-legal-file-control.html` | 243 | button | Estimate cost exposure | `(handler)` | action-script | b2b | no-handler | <button>/[role=button] with no handler wiring |
| `faq.html` | 168 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html#roi-framework` | in-body | shared | internal-anchor-missing | pricing-and-engagement-tiers.html#roi-framework |
| `faq.html` | 179 | a | Security & Compliance | `security-and-compliance.html#procurement-artifacts` | in-body | shared | internal-anchor-missing | security-and-compliance.html#procurement-artifacts |
| `faq.html` | 249 | a | Security & Compliance | `security-and-compliance.html#incident-response` | in-body | shared | internal-anchor-missing | security-and-compliance.html#incident-response |
| `immigration-services-tampa.html` | 166 | a | LinkedIn | `https://www.linkedin.com/company/vitacorex-llc` | external | b2c | external-http-4xx | HTTP 404 |
| `index.html` | 860 | button | Generate engagement recommendation | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `index.html` | 1179 | button | AI Assistant | `(handler)` | form-submit | shared | no-handler | <button>/[role=button] with no handler wiring |
| `index.html` | 1197 | button | (no label) | `(handler)` | form-submit | shared | no-handler | <button>/[role=button] with no handler wiring |
| `llc-formation-florida.html` | 230 | a | LinkedIn | `https://www.linkedin.com/company/vitacorex-llc` | external | b2c | external-http-4xx | HTTP 404 |
| `revenue-recovery-miami.html` | 135 | a | LinkedIn | `https://www.linkedin.com/company/vitacorex-llc` | external | b2b | external-http-4xx | HTTP 404 |
| `revenue-recovery-orlando.html` | 135 | a | LinkedIn | `https://www.linkedin.com/company/vitacorex-llc` | external | b2b | external-http-4xx | HTTP 404 |
| `revenue-recovery-tampa.html` | 135 | a | LinkedIn | `https://www.linkedin.com/company/vitacorex-llc` | external | b2b | external-http-4xx | HTTP 404 |
| `sub-processors-and-dpa.html` | 234 | a | Security & Compliance, Section 5 | `security-and-compliance.html#regulatory` | in-body | shared | internal-anchor-missing | security-and-compliance.html#regulatory |

## Methodology

### Internal link resolution

- `href` starting with `/` → resolved relative to repo root.
- `href` relative (no leading `/`) → resolved relative to the source file's directory.
- `https://vitacorexllc.com/...` or `https://www.vitacorexllc.com/...` → stripped to path, resolved as relative-to-root.
- Directory targets (no `.html` / `.pdf` / `.xml` / `.txt` extension) → tried as `<dir>/index.html`.
- Query strings (`?foo=bar`) stripped before filesystem lookup.
- Hash fragment (`#anchor`) — after file is confirmed, the target file is scanned for `id="anchor"` or `name="anchor"` (case-insensitive).

### External HEAD

- Concurrency cap: 4
- Timeout: 10s per request
- Redirects: follow up to 5 hops
- User-Agent: `VitaCoreX-CTA-Verifier/1.0 (+https://vitacorexllc.com/)`
- Unique URLs are HEAD-checked once (same URL referenced from many pages → single network call).
- `HTTP 405` → automatic retry with `GET` (some CDNs reject `HEAD`).
- `HTTP 401 / 403 / 999` → flagged `external-http-opaque`. These are typically bot-blocking responses (LinkedIn returns `999`, many sites return `403` to non-browser UAs). Treat as "likely-invalid, verify manually in browser" during Step 17.3 triage.

### Flag-derived failures (inherited from Step 17.1 auditor)

- `dead-anchor` — `<a>` tag has no `href`, no `onclick`, and no `role` attribute. Visible text but zero behavior.
- `no-handler` — `<button>` or `[role=button]` with no inline `onclick` AND no `form` ancestor AND no `data-*` delegation attributes AND no `aria-controls` / `aria-expanded` wiring. Likely dead.
  - Buttons with `delegated:data-*` flag are NOT marked broken (wired via JS event delegation — verify in Step 17.5 Playwright spec).
  - Buttons with `aria-wired:*` flag are NOT marked broken (ARIA disclosure/controls pattern — verify in Step 17.5).
- `orphan-input` — `<input type=submit|button|image>` not contained in any `<form>` and no `onclick` fallback.

### Skipped (non-verifiable statically)

- Category `action-script` — JS handlers (onclick, javascript: hrefs, role=button with delegated data-*). Covered by Step 17.5 Playwright click spec.
- Targets `(handler)`, `(self)`, `(form-action)`, `(none)` — auditor sentinels for non-URL behavior.
- `data:` URIs — inline resources, not verifiable.

## Regeneration

```sh
node scripts/verify-cta-targets.js
```

Exit codes: `0` all PASS · `1` I/O or parse error · `2` broken rows remain (red build under Step 17.6 regression gate).
