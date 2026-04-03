# VCX Phase 6A -- Chat-to-Matter Handoff

> Phase 6A | 2026-04-03

## Overview

Phase 6A connects the legal assistant chat to the existing structured-case-intake
pipeline via a prefilled redirect. Users can move from a chat conversation into a
prefilled intake form, review the data, and submit. The existing POST /api/intakes
pipeline handles matter creation, checklists, magic links, and emails -- unchanged.

No visual shell changes. No schema changes. No intake logic duplication.

---

## Architecture

```
USER IN CHAT                           INTAKE FORM
-----------                            -----------
User asks legal questions
  |
Assistant responds (structured info,
  escalation links, fact-gathering)
  |
User fills escalation form OR
  clicks "Continue to Structured Intake"
  |
POST /api/legal-chat/convert-to-intake
  |  - reads user messages from session
  |  - builds structured summary (user words only)
  |  - maps topic -> service_type
  |  - builds prefill URL
  |
Returns IntakeHandoffResponse
  |  { prefill_url, summary, service_type, ... }
  |
Redirect to intake form  ------------>  Intake form loads with
                                         prefilled fields:
                                         - Name (from escalation)
                                         - Email (from escalation)
                                         - Phone (from escalation)
                                         - State (from chat)
                                         - Service type (mapped)
                                         - Message (auto-summary)
                                         |
                                        User reviews, edits, submits
                                         |
                                        Existing POST /api/intakes
                                         |
                                        Matter created (VCX-YYYYMMDD-NNNN)
                                        Magic link + email sent
```

---

## Endpoint

### POST /api/legal-chat/convert-to-intake

**Rate limit:** 10/minute

**Request body (IntakeHandoffRequest):**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| session_id | string | Yes | -- |
| name | string | No | null |
| email | string | No | null |
| phone | string | No | null |
| urgency | string | No | "Standard" |

**Response (IntakeHandoffResponse):**

| Field | Type | Description |
|-------|------|-------------|
| ok | bool | Always true |
| session_id | string | Chat session ID |
| name | string | User name (if provided) |
| email | string | User email (if provided) |
| phone | string | User phone (if provided) |
| topic | string | Detected chat topic |
| service_type | string | Mapped intake service type |
| state | string | User-provided jurisdiction |
| urgency | string | Urgency level |
| summary | string | Structured summary of user messages (max 500 chars) |
| doc_hint | string | Document upload suggestion (if relevant) |
| recommended_next_step | string | Next step guidance |
| prefill_url | string | Full redirect URL with query params |

**Error responses:**
- 404: Session not found
- 429: Rate limit exceeded

---

## Topic-to-Service Mapping

| Chat Topic | Intake service_type |
|-----------|-------------------|
| contracts | Structured Case Intake & Packet Build |
| immigration_packets | Structured Case Intake & Packet Build |
| auto_deal_review | Services for Individuals |
| florida_official_sources | Services for Individuals |
| (other / null) | Services for Individuals |

---

## Summary Generation

The `build_intake_summary()` function in policy.py:

1. Retrieves last 50 messages from the session
2. Filters to user messages only (no assistant, no events)
3. Detects case type from combined user text
4. Composes structured summary:
   - Topic + case type label
   - Jurisdiction (if provided)
   - Key facts: last 10 user messages (truncated to 100 chars each)
   - Conversation reference (session_id)
5. Truncates to 500 characters max

**Privacy rule:** Summary contains ONLY facts the user explicitly stated.
No assistant responses, no policy events, no system metadata.

---

## Document Hint Logic

| If user mentioned... | Doc hint |
|---------------------|----------|
| contract, agreement, NDA | "Upload the contract or agreement you mentioned" |
| deal sheet, buyer's order | "Upload the dealer worksheet or buyer's order" |
| forms, packet, I-485 | "Upload the forms or supporting documents you mentioned" |
| citation, invoice, notice | "Upload the citation, invoice, or notice you mentioned" |
| (nothing specific) | null (no hint shown) |

---

## Frontend: Chat Side (vcx-legal-assistant.js)

### "Continue to Structured Intake" button

After the escalation form submits successfully:
1. Escalation data (name, email, phone) stored in chatState
2. A CTA block appears below the escalation result
3. On click: POST to /api/legal-chat/convert-to-intake
4. On success: redirect to prefill_url from response
5. On API failure: fallback redirect with client-side data

### Fallback behavior

If the convert-to-intake API is unreachable, the button falls back to a
direct redirect with whatever data is available client-side (session_id,
escalation name/email/phone, topic, state). The intake form still loads
and the user can fill in missing fields manually.

---

## Frontend: Intake Side (vcx-intake-api.js)

### Prefill logic

On page load, `prefillFromChat()` checks for `vcx_from=chat` in query params.
If present, it reads all `vcx_*` params and populates matching form fields:

| URL Param | Form Field (by name attr) |
|-----------|--------------------------|
| vcx_name | full_name |
| vcx_email | email |
| vcx_phone | phone |
| vcx_state | state |
| vcx_service | service_type (select) |
| vcx_urgency | urgency (select) |
| vcx_summary | message (textarea) |

A notice is shown above the form: "Pre-filled from your chat session.
Review and edit before submitting."

The user can modify any field before submitting through the existing
POST /api/intakes pipeline.

---

## Privacy

| Data | Transmitted in URL? | Reason |
|------|-------------------|--------|
| Full transcript | NO | Only structured summary |
| Assistant responses | NO | User did not author them |
| Policy engine events | NO | System metadata |
| Other sessions | NO | Session isolation |
| Name/email/phone | Only if user provided | User-entered, editable on form |

---

## Files Changed (Phase 6A)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/models/chat.py` | Added IntakeHandoffRequest, IntakeHandoffResponse |
| 2 | `vcx-api/app/legal_chat/policy.py` | Added build_intake_summary(), TOPIC_TO_SERVICE, doc hint logic |
| 3 | `vcx-api/app/routers/chat.py` | Added POST /api/legal-chat/convert-to-intake endpoint |
| 4 | `assets/js/vcx-legal-assistant.js` | Added "Continue to Structured Intake" CTA + convert API call |
| 5 | `assets/js/vcx-intake-api.js` | Added prefillFromChat() for URL param prefill on load |
| 6 | `assets/css/vcx-legal-assistant.css` | Added .la-intake-cta button styles (scoped) |
| 7 | `docs/VCX_PHASE6_CHAT_TO_MATTER.md` | Created (this document) |
| 8 | `docs/VCX_CHANGELOG.md` | Updated |

## Files NOT Modified

- `index.html` (homepage -- visual freeze)
- `assets/css/styles.css` (global CSS -- visual freeze)
- `assets/css/ui-shell.css` (shell CSS -- visual freeze)
- `assets/js/ui-shell.js` (shell JS -- visual freeze)
- `assets/js/premium-fixes.js` (fixes JS -- visual freeze)
- `assets/css/premium-fixes.css` (fixes CSS -- visual freeze)
- `app/legal-assistant/index.html` (HTML structure unchanged)
- `structured-case-intake.html` (HTML structure unchanged; JS reads params)
- `vcx-api/app/schema.sql` (no schema changes)
- `vcx-api/app/db.py` (no changes)
- `vcx-api/app/routers/intakes.py` (existing pipeline unchanged)
- `vcx-api/app/main.py` (no changes)
- All acquisition pages
- All header/footer/nav

---

## Verification

- All Python files compile clean (py_compile)
- models/chat.py: IntakeHandoffRequest + IntakeHandoffResponse validated
- policy.py: build_intake_summary(), TOPIC_TO_SERVICE, _detect_doc_hint() added
- chat.py: POST /api/legal-chat/convert-to-intake endpoint with 10/min rate limit
- vcx-legal-assistant.js: CTA button + convert API + fallback redirect
- vcx-intake-api.js: prefillFromChat() reads vcx_* params, populates form fields
- vcx-legal-assistant.css: Scoped button styles under body[data-vcx-page]
- No global CSS/JS files modified
- No schema changes
- No intake pipeline changes
