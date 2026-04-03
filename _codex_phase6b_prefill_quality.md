# Phase 6B Report -- Prefill Quality and Handoff Clarity

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Improve chat-to-intake prefill accuracy and reduce user confusion
>        at the handoff boundary, without visual shell changes.

---

## Objective

Make the chat-to-intake prefill smarter and the handoff clearer, so that:
1. More form fields are correctly populated from conversation context
2. The user understands what was detected, what to review, and what happens next
3. No visual shell drift, no redesign, no new UI components

---

## Changes Made

### 1. Backend: intake_handoff.py (NEW SERVICE)

**File:** `vcx-api/app/services/intake_handoff.py`

Created a new service with five enhancement functions:

| Function | Purpose |
|----------|---------|
| `infer_urgency(text, current)` | Detects urgency from timeline keywords. "deadline tomorrow" -> "Same day / urgent"; "filing deadline" -> "48 hours". Respects existing non-default values. |
| `extract_timeline(text)` | Pulls the first deadline/hearing/expiration phrase (up to 120 chars). Returns None if nothing found. |
| `extract_state(text, current)` | Detects US state from free text (50 states + DC). Checks full names first, then abbreviations. Skips if session already has state. |
| `get_documents_for_handoff(topic, case_type)` | Retrieves the documents-needed list from Phase 5B structured blocks. Returns up to 6 items. |
| `enhance_handoff(session_id, resp)` | Main entry-point. Calls all above functions, rebuilds summary with sections, enriches doc_hint, rebuilds prefill URL with 4 new params. |

The `enhance_handoff()` function is called by the router after the Phase 6A
`build_intake_summary()`, enriching the response without modifying the model.

### 2. Backend: chat.py Router Update

**File:** `vcx-api/app/routers/chat.py`

- Added import: `from ..services.intake_handoff import enhance_handoff`
- The `POST /api/legal-chat/convert-to-intake` endpoint now calls `enhance_handoff(session_id, resp)` after `build_intake_summary()`
- Event logging now includes urgency in the detail string

### 3. Frontend: Chat CTA Enhancement

**File:** `assets/js/vcx-legal-assistant.js`

The `_showIntakeCTA()` function now builds a richer CTA:
- Shows detected topic and jurisdiction as context text ("Detected: Contract Review . Florida")
- 3-step preview before the button: "1. Review prefilled details  2. Upload any documents  3. Submit for advisor review"
- Updated call-to-action copy: "Ready to move forward? Convert this conversation..."

### 4. Frontend: Chat CTA Styles

**File:** `assets/css/vcx-legal-assistant.css`

Added scoped styles for the enhanced CTA:
- `.la-intake-cta-detected` -- context tag display
- `.la-intake-cta-steps` -- flex row for step indicators

### 5. Frontend: Intake Review Panel

**File:** `structured-case-intake.html`

Added inline `<script>` block (runs after vcx-intake-api.js) that:
- Checks for `vcx_from=chat` in URL params
- Reads Phase 6B params: `vcx_case_type`, `vcx_timeline`, `vcx_doc_hint`, `vcx_docs_needed`
- Builds a structured review panel with:
  - Detected context pills (topic, case type, state, urgency)
  - Timeline notice (amber color)
  - Documents-to-prepare checklist (from structured blocks)
  - "What happens next" 4-step numbered list
- Inserts the panel before the form
- Highlights prefilled fields with 3px green left border

### 6. Documentation

| File | Action |
|------|--------|
| `docs/VCX_PHASE6B_PREFILL_QUALITY.md` | Created -- full architecture doc |
| `docs/VCX_CHANGELOG.md` | Updated -- Phase 6B section at top |
| `_codex_phase6b_prefill_quality.md` | Created (this report) |

---

## New URL Parameters (Phase 6B)

| Param | Example | Source |
|-------|---------|--------|
| `vcx_case_type` | `Employment` | detect_case_type() from knowledge.py |
| `vcx_timeline` | `deadline next Friday for response` | extract_timeline() regex |
| `vcx_doc_hint` | `Upload the contract or agreement...` | Enhanced from structured blocks |
| `vcx_docs_needed` | `The full contract\|Any prior versions\|Correspondence` | Pipe-delimited from structured blocks |

---

## Prefill Quality: Before vs. After

| Field | Phase 6A | Phase 6B |
|-------|----------|----------|
| Urgency | Always "Standard" | Inferred: Standard / 48 hours / Same day |
| State | Only if user filled state input | Also extracted from "I live in Texas" |
| Service type | Mapped from topic | Unchanged (mapping is correct) |
| Summary | Flat truncated messages | Sectioned: Topic, Jurisdiction, Timeline, Key Facts |
| Doc hint | One-line keyword match | Full list from structured blocks |
| Case type | Not in URL | Passed as tag for display |
| Timeline | Not captured | Extracted and displayed |
| Review experience | Simple "Pre-filled" text | Rich panel with tags, docs, next steps |
| Field visibility | No visual indicator | Green left border on prefilled fields |

---

## User Confusion Reduction

| Confusion point | Before | After |
|----------------|--------|-------|
| "What was detected from my chat?" | No indication | Context pills: topic, case type, state, urgency |
| "What should I check before submit?" | "Review and edit before submitting" | "Review and edit the prefilled fields below" + highlighted fields |
| "What documents do I need?" | Single hint or nothing | Full checklist from structured blocks |
| "Is this urgent?" | Always Standard | Auto-detected from timeline language |
| "What happens after I submit?" | No guidance | 4-step guide: review, upload, submit, reviewer follow-up |
| "Which fields were auto-filled?" | No indication | Green left border on populated fields |

---

## Verification

- [x] 13/13 Python files compile clean (py_compile)
- [x] New service: intake_handoff.py compiles and imports correctly
- [x] Router calls enhance_handoff after build_intake_summary
- [x] CTA shows detected context and 3-step preview
- [x] Review panel renders context pills, timeline, documents, next steps
- [x] Prefilled fields highlighted with green border
- [x] No frozen files modified (index.html, styles.css, ui-shell.css, ui-shell.js, premium-fixes.js/css)
- [x] No schema changes
- [x] No intake pipeline changes (POST /api/intakes untouched)
- [x] No model changes (IntakeHandoffResponse unchanged)
- [x] No visual shell drift
- [x] Review panel only appears when vcx_from=chat (no impact on direct visitors)
- [x] Urgency inference respects existing non-default values
- [x] State extraction respects existing session state
- [x] Documents list from curated Phase 5B blocks (not generated)
- [x] All docs updated

---

## Risk Assessment

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | False-positive urgency detection | Low | Only triggers on specific phrases; user can edit on form |
| 2 | Wrong state extraction from ambiguous text | Low | Full state names checked first; user reviews on form |
| 3 | URL length with extra params | Low | Summary still capped at 500 chars; doc list max 6 items |
| 4 | Review panel obscures form on small screens | Low | Panel is above form, not overlaid; mobile-friendly inline styles |
| 5 | Conflicting prefill from 6A and 6B scripts | Low | 6B script runs after 6A; 6B panel replaces 6A notice visually |

---

## Done Checklist

- [x] Prefill is more accurate (urgency, state, timeline, documents)
- [x] User confusion is reduced (context tags, doc list, next steps, field highlighting)
- [x] No shell drift (frozen files untouched, no visual redesign)
- [x] Changes minimal and native to current shell
- [x] Docs updated (changelog, architecture doc, this report)
