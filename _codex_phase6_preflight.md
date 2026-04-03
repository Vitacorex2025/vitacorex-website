# Phase 6 Preflight — Chat-to-Intake-to-Matter Pipeline

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Read-only audit + implementation plan for connecting chat output
>        into prefilled intake -> matter creation -> status handoff.

---

## 1. Current Flow Audit

### Chat Flow (Product 5)

```
User message
  -> POST /api/legal-chat/message
  -> policy.answer_message()  [mode routing, knowledge retrieval]
  -> ChatResponse {session_id, answer, mode, topic, state, status, escalation_links}
  -> (optional) POST /api/legal-chat/escalate {name, email, phone, notes}
  -> leads table entry (no matter created, no email sent)
```

**What chat collects today:**
- session_id (UUID)
- topic (contracts | immigration_packets | auto_deal_review | florida_official_sources | null)
- state/jurisdiction (user-provided, optional)
- message history (all user + assistant + event messages in messages table)
- escalation lead (name, email, phone, notes) — but this goes to leads table only, NOT to matters

**Gap:** Escalation creates a lead but does NOT create a matter, contact, checklist, or magic link. No handoff into the VCX system.

### Intake Flow (Product 1)

```
User fills structured-case-intake.html form
  -> POST /api/intakes (FormData)
  -> upsert Contact (by email)
  -> create Organization (if company)
  -> create Matter (VCX-YYYYMMDD-NNNN, magic token, triage score)
  -> create status_events (intake_received -> triage)
  -> save attachment (if present)
  -> generate checklist (6 items per service type)
  -> fire-and-forget email (client + admin)
  -> IntakeResponse {matter_id, magic_link, triage_score, checklist}
```

**What intake needs:**
- full_name (required)
- email (required)
- phone (required)
- state (required)
- service_type (required — dropdown: 6 options)
- urgency (required — dropdown: 4 options)
- message (required — situation summary)
- client_type (required — company | individual)
- company, company_size, annual_revenue, accounts_receivable, agency_usage (optional, company-only)
- attachment (optional file)

### The Gap

| Data Point | Chat Has It? | Intake Needs It? | Source |
|-----------|-------------|-----------------|--------|
| name | Only on escalation | Yes (required) | User input |
| email | Only on escalation | Yes (required) | User input |
| phone | Only on escalation | Yes (optional) | User input |
| topic | Yes (detected) | Mapped to service_type | Policy engine |
| state | Yes (if provided) | Yes (required) | User input |
| summary | Yes (message history) | Yes (message field) | Auto-generated |
| urgency | No | Yes (required) | Needs UI or default |
| client_type | No | Yes (required) | Needs UI or default |
| attachment | No | Optional | Not from chat |

---

## 2. Minimum Files Needed

### Files to MODIFY (7)

| # | File | Change | Risk |
|---|------|--------|------|
| 1 | `vcx-api/app/routers/chat.py` | Add `POST /api/legal-chat/convert-to-intake` endpoint | Low — additive endpoint |
| 2 | `vcx-api/app/legal_chat/policy.py` | Add `build_intake_summary()` helper that composes a summary from session messages | Low — new function only |
| 3 | `vcx-api/app/models/chat.py` | Add `IntakeHandoff` response model | Low — new model only |
| 4 | `assets/js/vcx-legal-assistant.js` | Add "Convert to Intake" button in escalation section + prefill redirect logic | Low — additive JS |
| 5 | `assets/css/vcx-legal-assistant.css` | Style for convert-to-intake button (scoped) | Low — additive CSS |
| 6 | `assets/js/vcx-intake-api.js` | Read URL query params to prefill intake form fields on load | Low — additive JS |
| 7 | `docs/VCX_CHANGELOG.md` | Phase 6 section | Low |

### Files to CREATE (1)

| # | File | Purpose |
|---|------|---------|
| 1 | `docs/VCX_PHASE6_QA.md` | QA checklist for chat-to-intake pipeline |

### Files to LEAVE UNTOUCHED

| File | Reason |
|------|--------|
| `index.html` | Homepage — visual freeze |
| `assets/css/styles.css` | Global CSS — visual freeze |
| `assets/css/ui-shell.css` | Shell CSS — visual freeze |
| `assets/js/ui-shell.js` | Shell JS — visual freeze |
| `assets/js/premium-fixes.js` | Fixes JS — visual freeze |
| `assets/css/premium-fixes.css` | Fixes CSS — visual freeze |
| `assets/css/vcx-tokens.css` through `vcx-utilities.css` | Design system — visual freeze |
| `app/legal-assistant/index.html` | HTML structure unchanged |
| `structured-case-intake.html` | HTML structure unchanged (JS reads params) |
| `assets/js/site.js` | No changes needed |
| `vcx-api/app/schema.sql` | No schema changes needed |
| `vcx-api/app/db.py` | No changes needed |
| `vcx-api/app/routers/intakes.py` | Existing endpoint unchanged |
| `vcx-api/app/main.py` | No changes needed |
| All acquisition pages | Preserved |
| All header/footer/nav | Preserved |

---

## 3. Safest Path Analysis

### Option A: Direct API matter creation from chat

```
Chat escalation -> POST /api/legal-chat/convert-to-intake -> creates matter directly
```

**Pros:** Single step, no redirect, immediate magic link
**Cons:** Duplicates intake logic, skips intake form validation, user does not see/confirm the summary, privacy risk (auto-submits without review)
**Risk: MEDIUM-HIGH** — logic duplication, user cannot edit before submit

### Option B: Prefilled redirect into structured-case-intake

```
Chat -> "Convert to Intake" button -> redirect to /structured-case-intake.html?prefill=...
                                       -> form loads with prefilled fields
                                       -> user reviews, edits, submits normally
                                       -> existing POST /api/intakes handles everything
```

**Pros:** Reuses existing intake flow, user reviews data, no backend duplication, form validation still works, attachment still possible
**Cons:** Extra step (redirect), user might not complete form
**Risk: LOW** — additive only, no logic duplication

### Option C: Both (API + prefilled redirect)

```
Chat -> "Quick Submit" -> direct API call (creates matter, returns magic link)
Chat -> "Review & Submit" -> prefilled redirect to intake form
```

**Pros:** Covers both fast and careful paths
**Cons:** Two code paths to maintain, direct API path has Option A risks
**Risk: MEDIUM** — more complexity

### RECOMMENDATION: Option B (prefilled redirect)

Reasons:
1. **Lowest risk** — no backend logic duplication
2. **User reviews data** — user sees and can edit the prefilled summary
3. **Existing validation** — intake form validation still enforces required fields
4. **Attachment support** — user can add files during the review step
5. **Privacy** — user explicitly controls what gets submitted
6. **Audit trail** — matter creation goes through the same pipeline as manual intake

Phase 6+ can add Option C (direct API) later if conversion data shows users drop off at the form.

---

## 4. Data Handoff Shape

### URL Query Parameter Encoding

The chat frontend will encode a handoff payload as URL query parameters when
redirecting to the intake form. This avoids any server-side state for the handoff.

```
/structured-case-intake.html
  ?vcx_from=chat
  &vcx_session={session_id}
  &vcx_name={name}
  &vcx_email={email}
  &vcx_phone={phone}
  &vcx_topic={topic}
  &vcx_service={mapped_service_type}
  &vcx_state={state}
  &vcx_urgency={urgency}
  &vcx_summary={url_encoded_summary}
  &vcx_next_step={recommended_next_step}
```

### Backend Handoff Model

```python
class IntakeHandoff(BaseModel):
    session_id: str
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    topic: str | None = None
    service_type: str | None = None      # Mapped from topic
    state: str | None = None
    urgency: str | None = None           # Default: "Standard"
    summary: str                         # Auto-generated from session messages
    recommended_next_step: str | None = None
    doc_hint: str | None = None          # "You mentioned a contract — upload it here"
```

### Topic-to-Service Mapping

| Chat Topic | Intake service_type |
|-----------|-------------------|
| contracts | Contract Review & Analysis |
| immigration_packets | Immigration Packet Build |
| auto_deal_review | Private Client Services |
| florida_official_sources | Private Client Services |
| (broad legal) | Private Client Services |
| (general chat) | Private Client Services |

### Summary Generation (backend)

The `build_intake_summary()` function in policy.py will:
1. Retrieve last N user messages from the session (max 10)
2. Extract: detected topic, detected case type, stated jurisdiction, key facts
3. Compose a structured summary:

```
Topic: Contracts (Employment Agreement)
Jurisdiction: Florida
Key facts gathered:
  - Non-compete clause review
  - Pre-signing stage
  - Employer drafted the contract

Conversation reference: [session_id]
(Full transcript available to admin via /api/legal-chat/transcript)
```

**Privacy rule:** The summary contains ONLY facts the user explicitly stated. It does NOT include the assistant's responses, disclaimers, or policy engine internals.

### Document Hint Logic

| If user mentioned... | Doc hint |
|---------------------|----------|
| "contract", "agreement", "NDA" | "Upload the contract or agreement you mentioned" |
| "deal sheet", "buyer's order" | "Upload the dealer worksheet or buyer's order" |
| "forms", "packet", "I-485" | "Upload the forms or supporting documents you mentioned" |
| "citation", "invoice", "notice" | "Upload the citation, invoice, or notice you mentioned" |
| (nothing specific) | null (no hint) |

---

## 5. Privacy Preservation

### What is NOT transmitted in the redirect URL

| Data | Transmitted? | Reason |
|------|-------------|--------|
| Full transcript | NO | Privacy — only structured summary sent |
| Assistant responses | NO | Internal — user did not author them |
| Policy engine events | NO | Internal — system metadata |
| Event log entries | NO | Internal — system metadata |
| Other users' data | NO | Isolation — only this session |

### What IS transmitted

| Data | Source | User control |
|------|--------|-------------|
| Name | User typed it in escalation form | User can edit on intake form |
| Email | User typed it in escalation form | User can edit on intake form |
| Phone | User typed it in escalation form | User can edit on intake form |
| Topic | System detected, but user confirms | User can change on intake form |
| State | User typed it | User can edit on intake form |
| Summary | Auto-generated from user's own messages | User can edit on intake form |

### URL length safeguard

- Summary truncated to 500 characters max in URL encoding
- If summary exceeds limit, a reference link is shown instead:
  "Full session details available to your reviewer (ref: {session_id})"
- Session ID in URL allows admin to retrieve full transcript via admin API

### Admin transcript access

- Admin uses `POST /api/legal-chat/transcript-token/{session_id}` (Phase 4 Fix)
- Token is HMAC-signed, time-limited (60 min default)
- Admin can view full conversation context after intake is submitted

---

## 6. Implementation Plan

### Step 1: Backend — Handoff Model + Summary Builder (chat.py, policy.py, models/chat.py)

**models/chat.py:**
- Add `IntakeHandoff(BaseModel)` with fields: session_id, name, email, phone, topic, service_type, state, urgency, summary, recommended_next_step, doc_hint

**policy.py:**
- Add `build_intake_summary(session_id, topic, case_type, state)` function
- Queries messages table for user messages in session
- Extracts key facts, composes structured summary
- Returns `IntakeHandoff` populated with all available data

**chat.py:**
- Add `POST /api/legal-chat/convert-to-intake` endpoint
- Input: session_id + escalation data (name, email, phone)
- Calls `build_intake_summary()` to generate handoff
- Returns `IntakeHandoff` as JSON
- Rate limit: 10/minute
- Auth: none (public, but session_id must exist)

### Step 2: Frontend — Convert Button + Redirect (vcx-legal-assistant.js)

- After escalation form submission succeeds, show a second CTA:
  "Continue to Structured Intake (recommended)"
- On click: POST to `/api/legal-chat/convert-to-intake` with session data
- On success: redirect to intake form with query params populated
- On API failure: fallback to plain redirect with whatever data is available client-side

### Step 3: Frontend — Intake Form Prefill (vcx-intake-api.js)

- On page load, check `window.location.search` for `vcx_from=chat`
- If present, parse all `vcx_*` params and populate form fields:
  - `#fullName` <- vcx_name
  - `#email` <- vcx_email
  - `#phone` <- vcx_phone
  - `#state` <- vcx_state
  - `#serviceType` <- vcx_service (select dropdown)
  - `#urgency` <- vcx_urgency (select dropdown)
  - `#message` <- vcx_summary (textarea)
- Show a notice: "Pre-filled from your chat session. Review and edit before submitting."
- User can modify any field before submitting normally

### Step 4: Docs + QA

- `docs/VCX_CHANGELOG.md` — Phase 6 section
- `docs/VCX_PHASE6_QA.md` — QA checklist

---

## 7. Recommended UX Flow

```
USER IN CHAT                           INTAKE FORM
────────────                           ───────────
User asks legal question
  |
Assistant responds with
structured info + escalation links
  |
User clicks "Submit to Structured Intake"
or fills escalation form (name/email/phone)
  |
"Convert to Intake" button appears
  |
User clicks "Convert to Intake"         ──────────>  Intake form loads with
  |                                                   prefilled fields:
  |                                                   - Name (from escalation)
  |                                                   - Email (from escalation)
  |                                                   - Phone (from escalation)
  |                                                   - State (from chat)
  |                                                   - Service type (mapped from topic)
  |                                                   - Message (auto-summary)
  |
  |                                                   User reviews, edits, and submits
  |                                                     |
  |                                                   Existing POST /api/intakes fires
  |                                                     |
  |                                                   Matter created (VCX-YYYYMMDD-NNNN)
  |                                                   Magic link generated
  |                                                   Email sent to user + admin
  |                                                     |
  |                                     <──────────  User sees matter ID + magic link
  |                                                     |
  |                                                   User clicks magic link
  |                                                     |
  |                                                   Matter Status page loads
  |                                                   (checklist, timeline, docs)
```

### Alternative path (no escalation form)

If the user has NOT filled in the escalation form (no name/email), the
"Convert to Intake" redirect will only prefill:
- state (from chat)
- service_type (mapped from topic)
- message (auto-summary of chat messages)

The user fills in name/email/phone on the intake form itself.

---

## 8. Risk List

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | URL length exceeds browser limit (~2000 chars) | Low | Summary truncated to 500 chars; session_id reference for full context |
| 2 | User does not complete intake form after redirect | Low | By design — user chooses; chat escalation lead still exists as fallback |
| 3 | Summary contains sensitive info in URL | Low | Summary is user's own words only; HTTPS encrypts URL in transit; no server logs of query params recommended |
| 4 | Topic-to-service mapping may be incorrect | Low | User can change service_type on intake form before submitting |
| 5 | Stale session (user returns to chat after submitting intake) | Low | Chat session continues independently; no state coupling |
| 6 | Race condition: user submits both escalation AND intake | Low | Both are idempotent — lead + matter created, admin sees both |
| 7 | Bot abuse of convert endpoint | Low | Rate limited 10/min; session must exist |

---

## 9. Done Definition

- [ ] `POST /api/legal-chat/convert-to-intake` returns valid IntakeHandoff JSON
- [ ] Summary generated from session messages (user messages only, max 500 chars)
- [ ] Topic-to-service mapping covers all 4 core topics + fallback
- [ ] "Convert to Intake" button appears in chat after escalation or as persistent CTA
- [ ] Clicking the button redirects to `/structured-case-intake.html?vcx_from=chat&...`
- [ ] Intake form reads `vcx_*` query params and prefills matching fields
- [ ] Prefill notice shown to user: "Pre-filled from your chat session"
- [ ] User can edit all prefilled fields before submitting
- [ ] Existing `POST /api/intakes` handles submission normally (no changes to intake logic)
- [ ] Matter created with standard pipeline (contact, matter, checklist, magic link, email)
- [ ] Admin can access full chat transcript via existing transcript endpoint
- [ ] No homepage changes
- [ ] No top-nav changes
- [ ] No header/footer changes
- [ ] No visual redesign
- [ ] No shell drift (global CSS/JS unchanged)
- [ ] No autonomous legal conclusions
- [ ] Acquisition pages preserved
- [ ] Legal assistant page styling preserved
- [ ] All Python files compile clean
- [ ] docs/VCX_CHANGELOG.md updated
- [ ] docs/VCX_PHASE6_QA.md created
