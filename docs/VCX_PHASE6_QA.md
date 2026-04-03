# VCX Phase 6 QA — Chat-to-Intake-to-Matter Pipeline

> QA review 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Phase 6A (chat-to-matter handoff) + Phase 6B (prefill quality)

---

## 1. Shell Drift Check

### Frozen Files — ZERO DIFF

| File | Status |
|------|--------|
| `index.html` | UNTOUCHED |
| `assets/css/styles.css` | UNTOUCHED |
| `assets/css/ui-shell.css` | UNTOUCHED |
| `assets/js/ui-shell.js` | UNTOUCHED |
| `assets/js/premium-fixes.js` | UNTOUCHED |
| `assets/css/premium-fixes.css` | UNTOUCHED |

### Tracked Modified Files (from earlier phases, not Phase 6)

| File | Lines Changed | Phase | Risk |
|------|--------------|-------|------|
| `additional-services.html` | +22 | Phase 2-3 | Low |
| `app/contract-intelligence/index.html` | +15 | Phase 3-4 | Low |
| `app/sign-in/index.html` | +152 | Phase 3 | Low |
| `corporate-legal-file-control.html` | +20 | Phase 2-3 | Low |
| `revenue-recovery-workflow.html` | +20 | Phase 2-3 | Low |

### Tracked Modified Files (with Phase 6 contributions)

| File | Lines Changed | Phase | Risk |
|------|--------------|-------|------|
| `assets/js/site.js` | +51/-37 | Phase 2 (bindIntakeForm delegation) | Low -- bounded with START/END comments |
| `structured-case-intake.html` | +112 | Phase 2 (+6 lines), Phase 6B (+106 lines) | Low -- all additive |

### Untracked Phase 6 Files

| File | Phase | Type |
|------|-------|------|
| `vcx-api/app/models/chat.py` | 6A | IntakeHandoffRequest + IntakeHandoffResponse |
| `vcx-api/app/legal_chat/policy.py` | 6A | build_intake_summary(), TOPIC_TO_SERVICE |
| `vcx-api/app/routers/chat.py` | 6A+6B | convert-to-intake endpoint + enhance_handoff |
| `vcx-api/app/services/intake_handoff.py` | 6B | urgency, timeline, state, docs enhancement |
| `assets/js/vcx-legal-assistant.js` | 6A+6B | CTA + convert + context display |
| `assets/js/vcx-intake-api.js` | 6A | prefillFromChat() |
| `assets/css/vcx-legal-assistant.css` | 6A+6B | CTA + step styles |
| `docs/VCX_PHASE6_CHAT_TO_MATTER.md` | 6A | Architecture doc |
| `docs/VCX_PHASE6B_PREFILL_QUALITY.md` | 6B | Architecture doc |

**Verdict: NO SHELL DRIFT**

---

## 2. Global File Edit Audit

### site.js (AGENTS.md warns about modification)

The only change to `site.js` is the Phase 2 `bindIntakeForm()` modification
that delegates to `VCX_IntakeAPI.submit()` when loaded, falling back to
FormSubmit.co. This is:
- Bounded with `// VCX Phase 2: modified bindIntakeForm -- START/END` comments
- Minimal (+51/-37 lines, same function)
- Required for the API intake flow
- Not a Phase 6 change

**Verdict: Justified, documented, minimal.**

### No other AGENTS.md-warned global files were modified.

---

## 3. Chat-to-Intake Flow Verification

### Endpoint Chain

```
POST /api/legal-chat/message         (30/min)  -> ChatResponse
POST /api/legal-chat/escalate        (10/min)  -> EscalationResponse (lead)
POST /api/legal-chat/convert-to-intake (10/min) -> IntakeHandoffResponse
  => build_intake_summary() [6A]
  => enhance_handoff()      [6B]
  => redirect to /structured-case-intake.html?vcx_from=chat&...
POST /api/intakes                     (10/min)  -> IntakeResponse (matter)
```

### Data Flow

| Step | Input | Output | Verified |
|------|-------|--------|----------|
| Chat message | ChatRequest (session_id, message, topic, state) | ChatResponse (answer, mode, topic, status, escalation_links) | YES |
| Escalation | EscalationRequest (session_id, name, email, phone) | EscalationResponse (lead_id) | YES |
| Convert | IntakeHandoffRequest (session_id, name, email, phone, urgency) | IntakeHandoffResponse (prefill_url, summary, service_type, doc_hint) | YES |
| Prefill | URL params (vcx_from, vcx_name, vcx_email, etc.) | Form fields populated | YES |
| Review panel | URL params (vcx_case_type, vcx_timeline, vcx_docs_needed) | Context tags, doc list, next steps | YES |
| Submit | FormData (full_name, email, phone, state, service_type, urgency, message) | IntakeResponse (matter_id, magic_link, triage_score, checklist) | YES |

### Fallback Path

If the convert-to-intake API fails, the JS falls back to a direct redirect
with client-side data (session_id, escalation name/email/phone, topic, state).
The user can then manually fill missing fields.

**Verified: YES**

---

## 4. Prefill Behavior Verification

### Field Mapping (6A: vcx-intake-api.js)

| URL Param | Form Selector | Type | Verified |
|-----------|--------------|------|----------|
| vcx_name | [name="full_name"] | text input | YES |
| vcx_email | [name="email"] | email input | YES |
| vcx_phone | [name="phone"] | tel input | YES |
| vcx_state | [name="state"] | text input | YES |
| vcx_service | [name="service_type"] | select | YES |
| vcx_urgency | [name="urgency"] | select | YES |
| vcx_summary | [name="message"] | textarea | YES |

### Enhancement (6B: intake_handoff.py)

| Feature | Logic | Verified |
|---------|-------|----------|
| Urgency inference | _URGENT_RE -> "Same day / urgent"; _SOON_RE -> "48 hours" | YES |
| State extraction | Full name match -> abbr; standalone abbr -> match | YES |
| Timeline extraction | First deadline/hearing phrase, max 120 chars | YES |
| Documents list | get_structured_block(topic, case_type).documents_needed | YES |
| Summary sections | Topic, Jurisdiction, Timeline, Key Facts | YES |

### Review Panel (6B: structured-case-intake.html inline script)

| Component | Condition | Verified |
|-----------|-----------|----------|
| Context pills | topic, case_type, state, urgency != Standard | YES |
| Timeline notice | vcx_timeline present | YES |
| Documents checklist | vcx_docs_needed present (pipe-delimited) | YES |
| "What happens next" | Always shown when vcx_from=chat | YES |
| Field highlighting | Green left border on populated fields | YES |
| 6A notice removal | Removes duplicate simple notice from vcx-intake-api.js | YES (fixed in review) |

### Coherence Check

- 6A populates form fields (vcx-intake-api.js) -- runs first
- 6B adds review panel + field highlighting (inline script) -- runs second
- 6B removes 6A simple notice to avoid duplication -- fixed in this review
- Both scripts guard on `vcx_from=chat` -- no impact on direct visitors

**Verdict: COHERENT**

---

## 5. Matter-Status Handoff Verification

### Pipeline

```
POST /api/intakes
  -> upsert Contact (by email)
  -> create Organization (if company)
  -> create Matter (VCX-YYYYMMDD-NNNN)
  -> generate magic_token (48-byte random)
  -> compute triage_score (0-100)
  -> create status_events (intake_received -> triage)
  -> save attachment (if present)
  -> generate checklist (per service type)
  -> send emails (client + admin, fire-and-forget)
  -> return IntakeResponse { matter_id, magic_link, triage_score, checklist }
```

### Magic Link Format

`{BASE_URL}/app/matter-status/?matter={id}&token={token}`

### Security

- Token: 48-byte `secrets.token_urlsafe(48)` (384 bits entropy)
- Validation: `secrets.compare_digest()` (constant-time)
- Stored in: matters.magic_token column (not exposed elsewhere)

**Verdict: SECURE**

---

## 6. Transcript Privacy Verification

### Access Control

| Endpoint | Auth Method | Rate Limit |
|----------|------------|-----------|
| GET /api/legal-chat/transcript/{id} | X-Admin-Token header OR signed HMAC token | 30/min |
| POST /api/legal-chat/transcript-token/{id} | X-Admin-Token header (admin-only) | 10/min |

### HMAC Token Properties

- Algorithm: HMAC-SHA256
- Payload: `base64url(session_id:expires_unix)`
- Format: `{payload}.{hex_signature}`
- Expiry: configurable 1-1440 minutes (max 24h)
- Session binding: token session_id must match requested session_id
- Admin secret: VCX_ADMIN_TOKEN env var, constant-time comparison

### Prefill URL Privacy

| Data | In URL? | Reason |
|------|---------|--------|
| Full transcript | NO | Only structured summary |
| Assistant responses | NO | User-authored content only |
| Policy events | NO | System metadata |
| Session ID | YES | Reference for admin transcript retrieval |
| Summary | YES (max 500 chars) | User's own words, truncated |

**Verdict: PROTECTED**

---

## 7. Python Compile Check

| File | Status |
|------|--------|
| vcx-api/app/models/chat.py | OK |
| vcx-api/app/legal_chat/policy.py | OK |
| vcx-api/app/legal_chat/knowledge.py | OK |
| vcx-api/app/routers/chat.py | OK |
| vcx-api/app/routers/intakes.py | OK |
| vcx-api/app/db.py | OK |
| vcx-api/app/main.py | OK |
| vcx-api/app/rate_limit.py | OK |
| vcx-api/app/services/intake_handoff.py | OK |
| vcx-api/app/services/transcript_auth.py | OK |
| vcx-api/app/services/triage.py | OK |
| vcx-api/app/services/checklist.py | OK |
| vcx-api/app/services/magic_link.py | OK |

**13/13 compile clean.**

---

## 8. Internal Link Check

Checked 1449 internal links across 39 HTML files.

**Broken: 0**

---

## 9. Issues Found and Fixed

### Issue 1: Duplicate prefill notice (FIXED)

**Problem:** Both `vcx-intake-api.js` (6A) and the 6B inline script created
a prefill notice when `vcx_from=chat`. The 6A notice appeared inside the form,
the 6B review panel appeared above the form -- two notices for the same thing.

**Fix:** Added 4 lines to the 6B inline script to detect and remove the 6A
simple notice after inserting the richer 6B panel. The 6A notice is identified
by being the first child DIV of the form containing "Pre-filled" text.

**Risk:** Low. The 6A field population still runs (it handles actual field values).
Only the simple notice is removed.

---

## 10. Open Risks

| # | Risk | Severity | Notes |
|---|------|----------|-------|
| 1 | URL length may exceed ~2000 chars on some browsers when summary + docs list is long | Low | Summary capped at 500 chars; docs list max 6 items; session_id fallback for full context |
| 2 | Urgency inference could trigger on casual mentions ("I have a deadline on the novel I'm writing") | Low | User reviews and can edit urgency on form before submitting |
| 3 | State extraction from abbreviations could false-match (e.g., "IN" the sentence) | Low | Full state names checked first; user reviews on form |
| 4 | convert-to-intake rate limit (10/min) shared with escalate and transcript-token | Low | Each endpoint has its own decorator; shared IP-based limiting is intentional |
| 5 | site.js change (Phase 2) modifies a global file warned by AGENTS.md | Low | Documented, bounded with comments, not a Phase 6 change |

---

## 11. Rollback Notes

### To roll back Phase 6B only:
1. Delete `vcx-api/app/services/intake_handoff.py`
2. In `vcx-api/app/routers/chat.py`: remove `enhance_handoff` import and the `resp = enhance_handoff(...)` call
3. In `structured-case-intake.html`: remove the `<!-- Phase 6B -->` script block
4. In `assets/js/vcx-legal-assistant.js`: revert `_showIntakeCTA()` to 6A version (simple CTA text)
5. In `assets/css/vcx-legal-assistant.css`: remove `.la-intake-cta-detected` and `.la-intake-cta-steps` rules
6. Remove `docs/VCX_PHASE6B_PREFILL_QUALITY.md`
7. Update changelog

### To roll back all Phase 6 (6A + 6B):
1. Everything from 6B rollback above, plus:
2. In `vcx-api/app/models/chat.py`: remove IntakeHandoffRequest and IntakeHandoffResponse classes
3. In `vcx-api/app/legal_chat/policy.py`: remove everything after `_next_step_for_topic()` (TOPIC_TO_SERVICE, _DOC_HINT_RULES, _detect_doc_hint, build_intake_summary)
4. In `vcx-api/app/routers/chat.py`: remove the `convert-to-intake` endpoint, revert imports to pre-6A state
5. In `assets/js/vcx-legal-assistant.js`: remove `_showIntakeCTA()`, `_convertToIntake()`, and `chatState.escalation` tracking
6. In `assets/js/vcx-intake-api.js`: remove `prefillFromChat()` and its call
7. In `assets/css/vcx-legal-assistant.css`: remove all `.la-intake-cta*` rules
8. In `structured-case-intake.html`: remove intakeResult panel, 6B script (only if Phase 2 additions were included as part of Phase 6 work)
9. Remove `docs/VCX_PHASE6_CHAT_TO_MATTER.md`, `docs/VCX_PHASE6B_PREFILL_QUALITY.md`
10. Remove changelog sections for Phase 6A and 6B

No schema changes, no data migrations needed for rollback.

---

## 12. Summary

| Check | Result |
|-------|--------|
| Shell drift | NONE -- all frozen files untouched |
| Global file edits | site.js only (Phase 2, documented, minimal) |
| Chat -> intake flow | WORKING -- endpoint chain verified, fallback tested |
| Prefill behavior | COHERENT -- 6A populates, 6B enhances, notice deduped |
| Matter-status handoff | WORKING -- magic link, triage, checklist, email all present |
| Transcript privacy | PROTECTED -- HMAC auth, admin-only token generation, no raw transcript in URL |
| Python compile | 13/13 clean |
| Internal links | 1449 checked, 0 broken |
| Issues found | 1 (duplicate notice -- fixed) |
| Open risks | 5 (all Low severity) |
