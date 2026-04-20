---
title: CTA Broken List — VitaCoreX Site
generated: 2026-04-20T17:45:47Z
generator: scripts/verify-cta-targets.js (P17 Step 17.2)
governs: Phases/P17 Broken Buttons and CTA Audit.md
input: docs/qa/cta-inventory.md
consumed_by: docs/qa/cta-triage.md (P17 Step 17.3 manual triage)
idempotent: "internal checks byte-stable; external HEAD results may vary with upstream availability"
---

# CTA Broken List — VitaCoreX Site

> **Machine-generated.** Each row = one CTA that failed automated validation. Do not hand-edit — regenerate via `node scripts/verify-cta-targets.js`. Manual triage in Step 17.3 (`docs/qa/cta-triage.md`) assigns a disposition (fix / remove / defer / invalid) per row.

## Summary

- **Inventory rows parsed**: 2956
- **Rows actively validated**: 2504
- **Rows skipped (action-script / no target / self-ref)**: 452
- **Strict-broken rows (gate-enforced; triage required)**: 10
- **External unique URLs HEAD-checked**: 5

_Opaque rows (HTTP 401/403/429/999 -- IP/UA-dependent) are logged to stdout only; their count intentionally does not appear here because it varies between local dev and CI runner IPs (Instagram 429, formsubmit.co 403, LinkedIn 999). Run with VCX_EMIT_OPAQUE=1 to dump to gitignored docs/qa/cta-opaque.md._

### Strict-broken by failure reason

| Reason | Count |
|--------|-------|
| no-handler | 10 |

## Strict-broken rows (gate-enforced)

> These rows fail the Step 17.6 CI regression gate. Each requires a triage disposition in `docs/qa/cta-triage.md` (fix / remove / defer / invalid-with-rationale) and an accompanying baseline re-commit when resolved.

| File | Line | Element | Label | Target | Category | Audience | Reason | Detail |
|------|------|---------|-------|--------|----------|----------|--------|--------|
| `app/private-lookup/index.html` | 359 | button | New Route | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/private-lookup/index.html` | 449 | button | (no label) | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/private-lookup/index.html` | 450 | button | (no label) | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/review/index.html` | 122 | button | Refresh | `(handler)` | form-submit | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/vcx-contract-review/index.html` | 132 | button | Analyze Contract | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `app/vcx-packet-room/index.html` | 99 | button | Access Portal | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `corporate-legal-file-control.html` | 247 | button | Estimate cost exposure | `(handler)` | action-script | b2b | no-handler | <button>/[role=button] with no handler wiring |
| `index.html` | 754 | button | Generate engagement recommendation | `(handler)` | action-script | shared | no-handler | <button>/[role=button] with no handler wiring |
| `index.html` | 1073 | button | AI Assistant | `(handler)` | form-submit | shared | no-handler | <button>/[role=button] with no handler wiring |
| `index.html` | 1091 | button | (no label) | `(handler)` | form-submit | shared | no-handler | <button>/[role=button] with no handler wiring |

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
- `HTTP 401 / 403 / 429 / 999` → flagged `external-http-opaque`. Examples: LinkedIn returns `999` to non-browser UAs, Instagram returns `429` to GitHub Actions runner IPs, formsubmit.co returns `403` to HEAD (accepts only POST with form data). These rows appear in the "Opaque (advisory)" section — they are NOT gate-enforced because response varies by IP/UA/time. Verify manually in a real browser if in doubt.

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
