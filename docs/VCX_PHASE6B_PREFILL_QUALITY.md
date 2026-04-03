# VCX Phase 6B -- Prefill Quality and Handoff Clarity

> Phase 6B | 2026-04-03

## Overview

Phase 6B improves the accuracy and clarity of the chat-to-intake prefill
pipeline introduced in Phase 6A.  No visual shell changes, no new UI
components, no schema changes.

The improvements are purely about data quality and user guidance:
better field inference from conversation content, a structured review
panel on the intake form, and clearer next-step messaging.

---

## What Changed

### 1. Smarter Field Inference (Backend)

New service: `vcx-api/app/services/intake_handoff.py`

| Feature | Before (6A) | After (6B) |
|---------|-------------|------------|
| **Urgency** | Always "Standard" | Inferred from timeline keywords: "deadline tomorrow" -> "Same day / urgent"; "filing deadline next week" -> "48 hours" |
| **State** | Only from session state field | Also extracted from user message text: "I'm in Florida" -> FL |
| **Timeline** | Not captured | First deadline/hearing phrase extracted and shown |
| **Documents** | Single doc_hint string | Full documents-needed list from Phase 5B structured blocks |
| **Case type** | In summary text only | Passed as separate URL param for frontend display |
| **Summary** | Flat list of truncated messages | Sectioned: Topic, Jurisdiction, Timeline, Key Facts |

### 2. Enhanced Chat-Side CTA

The "Continue to Structured Intake" button now shows:
- Detected topic and jurisdiction as context tags
- 3-step preview: Review -> Upload -> Submit
- Clearer call-to-action language

### 3. Structured Review Panel on Intake Form

When the intake form loads with `vcx_from=chat`, a review panel appears
above the form showing:

- **Detected context tags** -- topic, case type, state, urgency (as pills)
- **Timeline notice** -- if a deadline was mentioned
- **Documents to prepare** -- full list from structured blocks
- **What happens next** -- 4-step guide (review, upload, submit, reviewer follow-up)
- **Highlighted prefilled fields** -- subtle green left border on populated inputs

This replaces the simple "Pre-filled from your chat session" text from 6A.

### 4. Prefilled Field Highlighting

Form fields populated from chat data receive a 3px green left border,
making it visually clear which fields were auto-filled and should be
reviewed before submission.

---

## Urgency Inference Rules

| User language pattern | Inferred urgency |
|----------------------|-----------------|
| today, tomorrow, asap, immediately, emergency, urgent, same day, right away | Same day / urgent |
| deadline, due date, expires, court date, hearing date, filing deadline, next week, this week, end of month, time sensitive | 48 hours |
| (none detected) | Standard (unchanged) |

If the user or system already set a non-default urgency, inference is skipped.

---

## State Extraction Rules

1. Check full state names first (most reliable): "I'm in florida" -> FL
2. Fallback: standalone two-letter abbreviations: "My lease is in TX" -> TX
3. If session already has a state, extraction is skipped

All 50 US states + DC are recognized by both full name and abbreviation.

---

## URL Parameters (Phase 6B additions)

| Param | Source | Purpose |
|-------|--------|---------|
| vcx_case_type | Phase 5B case detection | Displayed as context tag |
| vcx_timeline | Extracted from messages | Shown in timeline notice |
| vcx_doc_hint | Enhanced from structured blocks | Document guidance |
| vcx_docs_needed | Pipe-delimited list from blocks | Full documents checklist |

These are in addition to the Phase 6A params (vcx_from, vcx_session,
vcx_name, vcx_email, vcx_phone, vcx_topic, vcx_service, vcx_state,
vcx_urgency, vcx_summary, vcx_next_step).

---

## Files Changed (Phase 6B)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/services/intake_handoff.py` | Created -- urgency inference, timeline extraction, state detection, documents list, enhance_handoff() |
| 2 | `vcx-api/app/routers/chat.py` | Enhanced -- convert-to-intake endpoint now calls enhance_handoff() |
| 3 | `assets/js/vcx-legal-assistant.js` | Enhanced -- CTA shows detected context, 3-step preview |
| 4 | `assets/css/vcx-legal-assistant.css` | Added -- .la-intake-cta-detected, .la-intake-cta-steps styles |
| 5 | `structured-case-intake.html` | Added -- inline script for structured review panel + field highlighting |
| 6 | `docs/VCX_PHASE6B_PREFILL_QUALITY.md` | Created (this document) |
| 7 | `docs/VCX_CHANGELOG.md` | Updated |

## Files NOT Modified

- `index.html` (homepage -- visual freeze)
- `assets/css/styles.css` (global CSS -- visual freeze)
- `assets/css/ui-shell.css` (shell CSS -- visual freeze)
- `assets/js/ui-shell.js` (shell JS -- visual freeze)
- `assets/js/premium-fixes.js` (fixes JS -- visual freeze)
- `assets/css/premium-fixes.css` (fixes CSS -- visual freeze)
- `assets/js/site.js` (global JS -- not needed)
- `app/legal-assistant/index.html` (HTML structure unchanged)
- `vcx-api/app/schema.sql` (no schema changes)
- `vcx-api/app/models/chat.py` (model unchanged)
- `vcx-api/app/legal_chat/policy.py` (policy engine unchanged)
- `vcx-api/app/routers/intakes.py` (intake pipeline unchanged)
- All acquisition pages, header/footer/nav preserved

---

## Verification

- 13/13 Python files compile clean
- No global CSS/JS files modified
- No schema changes
- No visual shell drift
- No intake pipeline changes
- Prefill review panel only appears when vcx_from=chat (no impact on direct visitors)
- Urgency inference respects existing non-default values
- State extraction respects existing session state
- Documents list comes from curated Phase 5B structured blocks (not generated)
