# Phase 6 QA Review Report

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Full review of Phase 6A (chat-to-matter handoff) and
>        Phase 6B (prefill quality + handoff clarity)

---

## Verification Results

| Check | Result | Detail |
|-------|--------|--------|
| Shell drift | PASS | All 6 frozen files untouched (index.html, styles.css, ui-shell.css, ui-shell.js, premium-fixes.js, premium-fixes.css) |
| Global file edits | PASS | site.js only (Phase 2 change, bounded with START/END comments, not Phase 6) |
| Chat -> intake flow | PASS | Endpoint chain verified: message -> escalate -> convert-to-intake -> prefill -> intakes |
| Prefill coherence | PASS | 6A populates fields, 6B adds review panel + highlighting, notice deduplicated |
| Matter-status handoff | PASS | magic_link (48-byte token), triage_score, checklist, email all present in IntakeResponse |
| Transcript privacy | PASS | HMAC-signed tokens, admin-only generation, constant-time comparison, no raw transcript in URL |
| Python compile | PASS | 13/13 files compile clean |
| Internal links | PASS | 1449 links across 39 HTML files, 0 broken |

---

## Regression Found and Fixed

### Duplicate Prefill Notice

**Problem:** When a user arrives at the intake form from chat (`vcx_from=chat`),
both Phase 6A (`vcx-intake-api.js`) and Phase 6B (inline script in
`structured-case-intake.html`) created a prefill notice. The 6A notice appeared
inside the form as a simple "Pre-filled from your chat session" div; the 6B
review panel appeared above the form with context tags, documents, and next steps.
Both were visible simultaneously.

**Fix:** Added 4 lines to the 6B inline script to detect and remove the 6A
simple notice after inserting the richer 6B panel. The 6A notice is identified
by being the first child DIV of the form containing "Pre-filled" text.

**Impact:** Low. The 6A field population still runs correctly; only the
redundant simple notice is removed.

---

## Changed File Summary

### Files changed in this review (3)

| # | File | Change |
|---|------|--------|
| 1 | `structured-case-intake.html` | Fixed duplicate notice regression (4 lines) |
| 2 | `docs/VCX_PHASE6_QA.md` | Created (full QA checklist) |
| 3 | `docs/VCX_CHANGELOG.md` | Updated (Phase 6 QA section) |

### All Phase 6 files (complete inventory)

| # | File | Phase | Lines | Purpose |
|---|------|-------|-------|---------|
| 1 | `vcx-api/app/models/chat.py` | 6A | 80 | IntakeHandoffRequest + IntakeHandoffResponse |
| 2 | `vcx-api/app/legal_chat/policy.py` | 6A | 627 | build_intake_summary(), TOPIC_TO_SERVICE |
| 3 | `vcx-api/app/routers/chat.py` | 6A+6B | 238 | convert-to-intake endpoint, enhance_handoff call |
| 4 | `vcx-api/app/services/intake_handoff.py` | 6B | 298 | urgency, timeline, state, docs enhancement |
| 5 | `assets/js/vcx-legal-assistant.js` | 6A+6B | 362 | CTA, convert API, context display |
| 6 | `assets/js/vcx-intake-api.js` | 6A | 219 | prefillFromChat() field population |
| 7 | `assets/css/vcx-legal-assistant.css` | 6A+6B | 322 | CTA + step styles |
| 8 | `structured-case-intake.html` | 6B+QA | 405 | 6B review panel, duplicate notice fix |
| 9 | `docs/VCX_PHASE6_CHAT_TO_MATTER.md` | 6A | 241 | Architecture doc |
| 10 | `docs/VCX_PHASE6B_PREFILL_QUALITY.md` | 6B | 137 | Architecture doc |
| 11 | `docs/VCX_PHASE6_QA.md` | QA | 263 | QA checklist |
| 12 | `docs/VCX_CHANGELOG.md` | All | 755 | Changelog |

---

## Open Risks

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | URL length may approach browser limit with long summary + docs | Low | Summary capped at 500 chars; docs max 6 items; session_id fallback |
| 2 | False-positive urgency detection on casual deadline mentions | Low | User reviews and can edit urgency on form |
| 3 | State abbreviation extraction may false-match common words (e.g., "IN") | Low | Full state names checked first; user reviews |
| 4 | site.js has a Phase 2 modification (warned by AGENTS.md) | Low | Documented, bounded, required for API intake |
| 5 | 6A simple notice depends on being first child of form (fragile selector) | Low | 6B dedup uses text content check as secondary guard |

---

## Rollback Notes

### Phase 6B only:
1. Delete `vcx-api/app/services/intake_handoff.py`
2. In `chat.py`: remove `enhance_handoff` import and `resp = enhance_handoff(...)` call
3. In `structured-case-intake.html`: remove `<!-- Phase 6B -->` script block
4. In `vcx-legal-assistant.js`: revert `_showIntakeCTA()` to simple CTA
5. In `vcx-legal-assistant.css`: remove `.la-intake-cta-detected`, `.la-intake-cta-steps`
6. Remove `docs/VCX_PHASE6B_PREFILL_QUALITY.md`

### Full Phase 6 (6A + 6B):
All of the above, plus:
7. Remove IntakeHandoffRequest/Response from `models/chat.py`
8. Remove `build_intake_summary()` and related from `policy.py`
9. Remove `convert-to-intake` endpoint from `chat.py` router
10. Remove `_showIntakeCTA()`, `_convertToIntake()` from `vcx-legal-assistant.js`
11. Remove `prefillFromChat()` from `vcx-intake-api.js`
12. Remove `.la-intake-cta*` CSS rules
13. Remove Phase 6 docs

No schema changes, no data migrations. Rollback is purely file-level.

---

## Recommended Commit Message

```
Phase 6 QA: verify chat-to-intake pipeline, fix duplicate notice

Phase 6A+6B review:
- Shell drift: PASS (all frozen files untouched)
- Chat-to-intake flow: PASS (endpoint chain, prefill, fallback)
- Transcript privacy: PASS (HMAC auth, no raw transcript in URL)
- 13/13 Python files compile clean, 1449 links / 0 broken

Fixed: duplicate prefill notice when arriving from chat
(6A simple notice + 6B review panel both visible). 6B script
now removes 6A notice after inserting richer panel.

Created docs/VCX_PHASE6_QA.md with full checklist.
```
