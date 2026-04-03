# VCX Changelog

## [Phase 12 -- Final QA & Regression Pass] - 2026-04-03

### Scope
- Full 8-scope regression pass covering Phases 1-11 cumulative
- 100+ verification items across shell, desktop, mobile, chat, products, generator, encoding, backend

### Results
- **0 regressions detected** across all scopes
- Pre-existing issues documented (index.html mojibake, security findings, site.js frozen file violation)
- Product completeness: 4/5 COMPLETE, 1 PARTIAL (Packet Room -- by design)

### Documentation Created
- `docs/VCX_FINAL_QA.md` (v2) -- 88-item regression checklist
- `docs/VCX_MOBILE_QA.md` (v2) -- 25-item mobile test checklist
- `_codex_final_qa.md` (v2) -- codex output summary
- Updated `docs/VCX_CHANGELOG.md` (this entry)

### Verdict: READY FOR STAGING

---

## [Phase 11 -- Contract Generator Completion Pass] - 2026-04-03

### Contract Review Desk -- Analyzer (CRITICAL FIX)
- renderResults() now renders all 3 previously-ignored backend response fields:
  - **issue_buckets** -- severity-tiered grouping (Immediate / Review / Standard)
  - **missing_protections** -- per-contract gap detection with recommendations
  - **suggested_questions** -- context-specific questions for counsel, grouped by category
- Added 60s fetch timeout on analyze API call

### Contract Review Desk -- Generator Improvements
- Added client-side form validation (party names required, positive number checks)
- Number fields now send proper integers in JSON payload (not strings)
- Added CSS loading spinner on "Generate" button during API call
- Added 30s fetch timeout on generate API call
- "Generate Another" now fully resets to type picker (clears form + deselects cards)

### DOCX Output Quality (Word Compatibility)
- Added document core properties (title, author, comments) for Word metadata
- Added paragraph line spacing (1.15x) on Normal style for readability
- Added space-after (6pt) on all body paragraphs
- Added space-before (18pt) and space-after (8pt) on all section headings
- Added space-after (24pt) on contract title for visual separation
- Documents now open cleaner in Microsoft Word with proper spacing

### Backend Model Validation
- contract_type field now uses Literal["nda", "service", "employment", "contractor"]
  (rejects invalid types at Pydantic level before hitting router logic)

### CSS Additions
- Form validation highlight on required fields
- Loading spinner animation (.cr-gen-submit--loading)
- Mobile 44px touch targets for tabs, cards, and buttons (640px breakpoint)

### Files Modified
- `assets/js/vcx-contract-review.js` -- renderResults() 3 fields, validation, timeouts, loading state, reset
- `assets/css/vcx-contract-review.css` -- validation states, spinner, mobile targets
- `vcx-api/app/services/docx_generator.py` -- paragraph spacing, doc properties, heading spacing
- `vcx-api/app/models/contract_generator.py` -- Literal type for contract_type

### Documentation
- Updated docs/VCX_CONTRACT_GENERATOR.md (Phase 11 section)
- Updated docs/VCX_CONTRACT_GENERATOR_QA.md (Phase 11 checklist)
- Updated docs/VCX_CHANGELOG.md (this entry)

### Shell Impact: NONE
- Zero frozen files modified
- All changes in namespaced vcx-* files and vcx-api/ backend

---

## [Phase 10 -- Chat & Legal Assistant Stabilization] - 2026-04-03

### Legal Assistant Runtime
- Added sessionStorage persistence for chat state (session ID, topic, jurisdiction, mode) -- survives page refresh
- Added backend readiness indicator (green/red dot + "Online"/"Offline" label) with 30s auto-refresh
- Added typing indicator (animated dots) during API response wait
- Added file/image upload support (attach + camera buttons) matching floating widget capability
- Added client-side file validation (type, size, empty file checks) with visible error messages
- Added upload status bar with success/error states

### Files Modified
- `assets/js/vcx-legal-assistant.js` -- session persistence, backend check, typing indicator, file upload
- `assets/css/vcx-legal-assistant.css` -- backend status dot, attach buttons, upload status bar, typing animation
- `app/legal-assistant/index.html` -- backend status element, file input elements, attach/camera buttons

### Documentation
- Updated docs/VCX_CHAT_RUNTIME_FIXES.md
- Updated docs/VCX_MOBILE_CHAT_FIXES.md
- Updated docs/VCX_CHANGELOG.md (this entry)

### Shell Impact: NONE
- Zero frozen files modified
- All changes in namespaced vcx-* files and app/legal-assistant/

---

## [Final QA & Regression Pass] - 2026-04-03

### Verification
- 90 QA items checked across shell, mobile, chat, 5 products, generator, backend
- 0 regressions detected
- All frozen files confirmed untouched
- All 5 products confirmed intact (Intake, Contract Review, Recovery Pilot, Packet Room, Legal Assistant)
- All 8 backend routers confirmed mounted
- 17 database tables confirmed present
- 36 Python files confirmed syntactically clean

### Documentation
- Created docs/VCX_FINAL_QA.md (comprehensive QA report)
- Created docs/VCX_MOBILE_QA.md (42-item mobile verification)
- Updated docs/VCX_CHANGELOG.md (this entry)

### Production Readiness: READY FOR STAGING

---

## [Phase 9 -- Contract Generator Frontend] - 2026-04-03

### Contract Generator UI
- Added mode tab bar to Contract Review Desk page (Analyze / Generate)
- Added 4-type contract picker (NDA, Service, Employment, Contractor)
- Added dynamic questionnaire form with type-specific fields
- Wired form to POST /api/contracts/generate backend endpoint
- Wired download to GET /api/contracts/{id}/download endpoint
- Added download result panel with DOCX download button
- Added "Generate Another" flow for consecutive generation

### UX Details
- Conservative card-based type selector matching site design
- Dynamic two-column form grid (single column on mobile)
- iOS zoom prevention (16px font-size on mobile inputs)
- All interactive elements meet 44px touch target minimum
- Clear disclaimer messaging throughout (not legal advice)
- Existing analyzer mode fully preserved (tab switch)
- API_BASE auto-detection added to contract review JS

### Documentation
- Created docs/VCX_CONTRACT_GENERATOR.md (product doc)
- Created docs/VCX_CONTRACT_GENERATOR_QA.md (QA report)
- Updated docs/VCX_CHANGELOG.md (this file)

### Files Modified
| File | Changes |
|------|---------|
| app/vcx-contract-review/index.html | Mode tabs, generate section with type picker + form + result panel |
| assets/js/vcx-contract-review.js | API_BASE auto-detect, tab switching, type selection, form builder, generation + download |
| assets/css/vcx-contract-review.css | Tab styles, type cards, form fields, buttons, result/download panel, mobile responsive |

---

## [Phase 8 -- Chat & Mobile Stabilization] - 2026-04-03

### Chat Runtime Fixes
- vcx-legal-assistant.js: Added API_BASE auto-detection IIFE (port 8080 -> 8787 redirect)
- vcx-legal-assistant.js: Added TypeError-aware error diagnostics in sendMessage + escalation
- vcx-chat-launcher.js: Added vcx-cw-panel-open body class toggle on panel open/close

### Mobile / iPhone Fixes
- z-index: Raised chat FAB 98->10099, panel 99->10100 (above header 120 / dock 110)
- Safe-area: Added env(safe-area-inset-bottom) to FAB, panel height, input-bar, chat shell
- Touch targets: Send (34->44px), attach/camera (~28->44px), chips (->44px min-height)
- Scroll containment: overscroll-behavior: contain on panel + messages, body lock on mobile
- Background scroll: body.vcx-cw-panel-open overflow: hidden on mobile
- Dock suppression: vcx-dock hidden on mobile when panel open
- iOS input zoom: font-size 16px on legal assistant form inputs
- Legal assistant mobile: 640px breakpoint with touch targets, dynamic height, safe-area

### Documentation
- Created docs/VCX_CHAT_RUNTIME_FIXES.md
- Created docs/VCX_MOBILE_CHAT_FIXES.md
- Updated docs/VCX_CHANGELOG.md (this file)
- Created _codex_chat_and_mobile_fix.md (output report)

### Files Modified
| File | Changes |
|------|---------|
| assets/css/vcx-chat-launcher.css | z-index, safe-area, 44px targets, overscroll, dock suppression |
| assets/css/vcx-legal-assistant.css | Scroll containment, mobile breakpoint, safe-area |
| assets/js/vcx-legal-assistant.js | API_BASE auto-detect, error diagnostics |
| assets/js/vcx-chat-launcher.js | Body class toggle for panel state |

---

## [Phase 7 QA Review] - 2026-04-03

### Review Scope
- Shell drift check: PASS (all frozen files untouched, no Phase 7 markers)
- Homepage/nav/header/footer check: PASS (index.html: only 1-line script tag change)
- Site-wide launcher presence: PASS (39/39 HTML files, hidden on legal-assistant)
- Conservative styling: PASS (brand colors, subtle shadow, minimal animation)
- File upload: PASS (client + server validation, storage, acknowledgment)
- Image upload: PASS (thumbnail preview, category badge, honest fallback)
- Mobile camera capture: PASS (accept="image/*" capture="environment")
- Unsupported analysis: PASS (no fake analysis, asks user to describe)
- Routing: PASS (intake, contract review, phone fallback all verified)
- Python compile: 34/34 clean
- Internal links: 1449 checked, 0 broken

### Files Changed (QA)

| # | File | Action |
|---|------|--------|
| 1 | `docs/VCX_PHASE7_QA.md` | Created |
| 2 | `docs/VCX_CHANGELOG.md` | Updated |

---

## [Phase 7B -- Chat Attachment and Image Handling] - 2026-04-03

### Attachment Classification
- Files classified as "document" or "image" by extension/MIME type
- Human-readable type labels (e.g., "PDF document", "JPEG image")
- Category badge displayed on file pill in chat

### Image Upload Support
- Image thumbnail preview rendered inline in chat bubble
- Camera capture on mobile via `capture="environment"` attribute (wired in 7A, enhanced in 7B)
- Honest acknowledgment: "I cannot analyze images directly. Please describe what it shows."

### Document Upload Support
- Document icon with category badge in chat bubble
- Honest acknowledgment: "I cannot read document contents in chat. Consider Contract Review."
- Links to Contract Review service for detailed analysis

### Enhanced Validation
- Specific error messages: no extension, unsupported type, empty file, too large
- Client-side validation runs before upload for immediate feedback
- Server error details (400/413) shown to user

### Backend Changes
- New service: `chat_attachments.py` (classify, list, summarize, acknowledge)
- New endpoint: `GET /api/legal-chat/attachments/{session_id}` (list session files)
- Upload response enriched with `category`, `type_label`, `acknowledgment`
- Convert-to-intake now includes attachment summary in `doc_hint`

### Files Changed

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/services/chat_attachments.py` | Created (attachment service) |
| 2 | `vcx-api/app/models/chat.py` | Enhanced ChatUploadResponse; added ChatAttachment, ChatAttachmentsResponse |
| 3 | `vcx-api/app/routers/chat.py` | Enhanced upload; added attachments endpoint; wired into convert-to-intake |
| 4 | `assets/js/vcx-chat-launcher.js` | Image preview, category badges, enhanced validation |
| 5 | `assets/css/vcx-chat-launcher.css` | Image thumbnail and category badge styles |
| 6 | `docs/VCX_CHAT_ATTACHMENTS.md` | Created (architecture doc) |
| 7 | `docs/VCX_CHANGELOG.md` | Updated |

### Frozen Files — NOT MODIFIED
styles.css, ui-shell.css, site.js, ui-shell.js, premium-fixes.js, premium-fixes.css

---

## [Phase 7A -- Floating Chat Launcher] - 2026-04-03

### Site-Wide Chat Widget
- Circular FAB button (bottom-right, z-index 98) on all 39 site pages
- Conservative drawer panel (380px desktop, bottom-sheet mobile, z-index 99)
- Reuses existing legal-assistant backend: message, escalate, convert-to-intake
- Self-contained: `vcx-chat-launcher.js` (~290 lines) + `vcx-chat-launcher.css` (~350 lines)
- All CSS rules scoped under `.vcx-cw-*` namespace
- Widget hidden on `/app/legal-assistant/` (full chat already present)

### Chat Capabilities
- Text conversation with typing indicator
- File upload (25MB, same allowlist as intake: PDF, DOC, DOCX, TXT, images, etc.)
- Camera capture on mobile via `capture="environment"` attribute
- Escalation CTA with convert-to-intake flow (prefilled redirect)
- Session persistence in sessionStorage (survives same-tab navigation)

### New Backend Endpoint
- `POST /api/legal-chat/upload` (10/min) for chat-context file uploads
- Files stored in `uploads/chat/{session_id}/` with UUID prefix
- Same validation as intake uploads (upload_validator.py)

### Files Changed

| # | File | Action |
|---|------|--------|
| 1 | `assets/js/vcx-chat-launcher.js` | Created (widget JS) |
| 2 | `assets/css/vcx-chat-launcher.css` | Created (widget CSS) |
| 3 | 39 HTML files | +1 line each (script tag before `</body>`) |
| 4 | `vcx-api/app/routers/chat.py` | Added upload endpoint (+45 lines) |
| 5 | `vcx-api/app/models/chat.py` | Added ChatUploadResponse (+8 lines) |
| 6 | `docs/VCX_PHASE7_FLOATING_CHAT.md` | Created (architecture doc) |
| 7 | `docs/VCX_CHANGELOG.md` | Updated |

### Frozen Files — NOT MODIFIED
styles.css, ui-shell.css, site.js, ui-shell.js, premium-fixes.js, premium-fixes.css

---

## [Phase 6 QA Review] - 2026-04-03

### Review Scope
- Shell drift check: PASS (all frozen files untouched)
- Global file audit: site.js only (Phase 2, documented, minimal)
- Chat-to-intake flow: PASS (endpoint chain, data flow, fallback)
- Prefill coherence: PASS (6A populates, 6B enhances, notice deduped)
- Matter-status handoff: PASS (magic link, triage, checklist, email)
- Transcript privacy: PASS (HMAC auth, admin-only tokens, no raw transcript in URL)
- Python compile: 13/13 clean
- Internal links: 1449 checked, 0 broken

### Regression Fixed
- Duplicate prefill notice when arriving from chat (6A simple notice + 6B review panel both appeared). Fixed: 6B script now removes 6A notice after inserting richer panel.

### Files Changed (QA)

| # | File | Action |
|---|------|--------|
| 1 | `structured-case-intake.html` | Fixed duplicate notice (4 lines added to 6B script) |
| 2 | `docs/VCX_PHASE6_QA.md` | Created |
| 3 | `docs/VCX_CHANGELOG.md` | Updated |

---

## [Phase 6B -- Prefill Quality and Handoff Clarity] - 2026-04-03

### Smarter Field Inference
- Urgency inferred from timeline keywords: "deadline tomorrow" -> "Same day / urgent"; "filing deadline" -> "48 hours"
- State extracted from message text when session state is empty (all 50 US states + DC)
- Timeline phrases extracted and displayed: deadlines, hearing dates, expiration notices
- Full documents-needed list pulled from Phase 5B structured blocks (not just a single hint)
- Case type passed as separate URL param for frontend display
- Summary restructured with clear sections: Topic, Jurisdiction, Timeline, Key Facts

### Enhanced Chat-Side CTA
- "Continue to Structured Intake" button now shows detected topic + jurisdiction as context tags
- 3-step preview (Review -> Upload -> Submit) displayed before the button
- Clearer call-to-action copy

### Structured Review Panel on Intake Form
- Rich review panel replaces simple "Pre-filled" notice when arriving from chat
- Detected context shown as pill tags (topic, case type, state, urgency)
- Timeline notice displayed when a deadline was mentioned
- Full documents-to-prepare checklist from structured blocks
- "What happens next" 4-step guide (review, upload, submit, reviewer follow-up)
- Prefilled form fields highlighted with subtle green left border

### Files Changed (Phase 6B)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/services/intake_handoff.py` | Created (urgency, timeline, state, documents, enhance_handoff) |
| 2 | `vcx-api/app/routers/chat.py` | Enhanced (calls enhance_handoff after build_intake_summary) |
| 3 | `assets/js/vcx-legal-assistant.js` | Enhanced (CTA context tags, 3-step preview) |
| 4 | `assets/css/vcx-legal-assistant.css` | Added (detected-tag and step-indicator styles) |
| 5 | `structured-case-intake.html` | Added (inline script for review panel + field highlighting) |
| 6 | `docs/VCX_PHASE6B_PREFILL_QUALITY.md` | Created |
| 7 | `docs/VCX_CHANGELOG.md` | Updated |

### Files NOT modified
- Homepage, global CSS/JS, shell files (visual freeze preserved)
- models/chat.py, policy.py, intakes.py (unchanged)
- schema.sql (no schema changes)
- All acquisition pages, header/footer/nav preserved

### Verification
- 13/13 Python files compile clean
- No global CSS/JS modified
- No schema changes
- No visual shell drift

---

## [Phase 6A -- Chat-to-Matter Handoff] - 2026-04-03

### Chat-to-Intake Pipeline
- New endpoint: POST /api/legal-chat/convert-to-intake (10/min rate limit)
- Reads user messages from chat session, builds structured summary (user words only, max 500 chars)
- Maps chat topic to intake service_type (contracts/immigration -> Structured Case Intake & Packet Build; auto/florida/other -> Services for Individuals)
- Returns prefill URL for redirect to structured-case-intake form
- Document hint detection: suggests relevant uploads based on keywords mentioned in chat

### Frontend: Chat Side
- "Continue to Structured Intake" CTA appears after escalation form submission
- Calls convert-to-intake API, redirects to prefilled intake form
- Fallback: if API unreachable, redirects with client-side data only

### Frontend: Intake Side
- Intake form reads vcx_* URL params on page load (prefillFromChat)
- Populates: full_name, email, phone, state, service_type, urgency, message
- Shows notice: "Pre-filled from your chat session. Review and edit before submitting."
- User reviews and submits through existing POST /api/intakes pipeline (unchanged)

### Privacy Preserved
- Summary contains only user-authored messages (no assistant responses, no events)
- No full transcript in URL -- only structured summary (500 char max)
- User can edit all prefilled fields before submitting
- Session ID reference allows admin transcript retrieval via existing secured endpoint

### Models Added
- IntakeHandoffRequest (session_id, name, email, phone, urgency)
- IntakeHandoffResponse (session_id, name, email, phone, topic, service_type, state, urgency, summary, doc_hint, recommended_next_step, prefill_url)

### Files Changed (Phase 6A)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/models/chat.py` | Added IntakeHandoffRequest, IntakeHandoffResponse |
| 2 | `vcx-api/app/legal_chat/policy.py` | Added build_intake_summary(), TOPIC_TO_SERVICE, doc hint logic |
| 3 | `vcx-api/app/routers/chat.py` | Added POST /api/legal-chat/convert-to-intake endpoint |
| 4 | `assets/js/vcx-legal-assistant.js` | Added intake CTA + convert API call + fallback redirect |
| 5 | `assets/js/vcx-intake-api.js` | Added prefillFromChat() URL param prefill |
| 6 | `assets/css/vcx-legal-assistant.css` | Added scoped .la-intake-cta button styles |
| 7 | `docs/VCX_PHASE6_CHAT_TO_MATTER.md` | Created |
| 8 | `docs/VCX_CHANGELOG.md` | Updated |

### Files NOT modified
- Homepage, global CSS/JS, shell files (visual freeze preserved)
- structured-case-intake.html (HTML unchanged; JS reads params)
- vcx-api/app/schema.sql (no schema changes)
- vcx-api/app/routers/intakes.py (existing pipeline unchanged)
- All acquisition pages, header/footer/nav preserved

### Verification
- All Python files compile clean
- No global CSS/JS modified
- No schema changes
- No intake pipeline duplication

---

## [Phase 5B — Legal Quality Upgrade] - 2026-04-03

### Structured Legal Responses
- Every legal-mode answer now includes three sections: "WHAT MATTERS", "WHAT TO CHECK", "WHAT DOCUMENTS ARE NEEDED"
- Content is static, curated per topic and case type -- not generated
- Knowledge base results appear above structured sections when available
- Escalation section with context-aware "when to use" guidance

### Case-Type Detection
- Contracts: employment, service, NDA, lease, purchase (5 sub-types)
- Immigration: family, employment, adjustment, EAD, RFE (5 sub-types)
- Auto deals: new purchase, used purchase, lease, financing, trade-in (5 sub-types)
- Florida sources: traffic, toll, court, DMV, business (5 sub-types)
- Each sub-type has its own what-matters / what-to-check / documents-needed block

### Fact-Gathering Sequences
- Ordered questions per topic: jurisdiction -> case type -> stage -> timeline -> concern -> counterparty
- Each question includes a "Why:" explanation for the user
- Triggered when jurisdiction is missing (instead of a single "what state?" prompt)
- 5-6 questions per topic, covering all fact-gathering needs

### Stronger Escalation
- Each topic has context-aware escalation paths with "when to use" notes
- Contracts: Contract Scanner, Structured Intake, Contract Review Desk, Client Portal
- Immigration: Structured Intake, Packet Room, Client Portal
- Auto deals: Structured Intake, Client Portal
- Florida sources: Structured Intake, Client Portal
- Broad legal topics now ask 4 qualifying questions before routing to intake

### Safety Preserved
- Disclaimer appended to every legal response (unchanged)
- No final legal conclusions -- language uses "flag for review", "areas to check"
- No attorney simulation -- no "you should" statements
- High-risk escalation still blocks criminal, emergencies, representation (unchanged)
- All responses include at least one VCX product link

### Files Changed (Phase 5B)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/legal_chat/knowledge.py` | Enhanced (case-type detection, structured blocks, fact-gathering, escalation paths) |
| 2 | `vcx-api/app/legal_chat/policy.py` | Enhanced (structured formatting, fact-gathering handler, context-aware escalation) |
| 3 | `docs/VCX_PHASE5_LEGAL_MODE.md` | Created |
| 4 | `docs/VCX_CHANGELOG.md` | Updated |

### Files NOT modified
- `vcx-api/app/routers/chat.py` (unchanged)
- `vcx-api/app/models/chat.py` (unchanged)
- `assets/js/vcx-legal-assistant.js` (unchanged)
- `assets/css/vcx-legal-assistant.css` (unchanged)
- `app/legal-assistant/index.html` (unchanged)
- All global CSS/JS (visual freeze preserved)
- schema.sql, knowledge base markdown files

### Verification
- 10/10 case-type detection tests
- 4/4 structured block completeness checks
- 4/4 fact-gathering sequence checks
- 8/8 policy engine integration tests
- All Python files compile clean

---

## [Phase 5A — Broader Assistant (Controlled)] - 2026-04-03

### Three-Mode Architecture
- **general_chat** — open conversation for any topic, with legal-drift detection
- **legal_information** — structured legal info: issue spotting, clarifying questions, checklists, jurisdiction prompting, NEVER final legal advice
- **vcx_routing** — directs users to specific VCX products and services
- **high_risk** — immediate escalation for criminal, emergencies, representation requests

### Routing Logic
- High-risk detection (highest priority): criminal, arrest, representation, emergencies
- VCX routing: mentions of VitaCoreX products, intake, portal, sign-in, services
- Legal information: core 4 topics (keyword score >= 2) + broad legal (2+ legal keywords from 70+ keyword set)
- General chat: default for everything else

### Legal Mode Enhancements (legal_information)
- Issue spotting templates per topic — identifies key areas to flag for review
- Clarifying questions asked before providing information (4 per topic)
- Preparation checklists appended to legal responses (5-6 items per topic)
- Broad legal topics (outside core 4) get orientation + Structured Intake routing
- State/jurisdiction gate preserved from Phase 4C
- Disclaimer appended to every legal response
- Knowledge retrieval from markdown files preserved

### General Chat Mode (general_chat)
- Greeting detection (12 greeting patterns)
- Open conversation with legal-drift nudge (detects single legal keywords)
- Suggestions always point to legal mode and VCX services
- No legal opinions in general chat mode

### VCX Routing Mode (vcx_routing)
- Keyword-based product matching (contracts, recovery, portal, intake, sign-in)
- 7 VCX service routes with labels, URLs, and descriptions
- Specific product matching when possible, full service menu as fallback

### High-Risk Escalation
- Narrowed from Phase 4C `detect_out_of_scope` (69 keywords) to `detect_high_risk`
- Only blocks truly dangerous requests: criminal, emergencies, representation
- General legal topics (bankruptcy, employment law, etc.) now routed to legal_information mode instead of blocking
- Advice-seeking regex patterns preserved (5 patterns)

### Frontend Changes (no UI redesign)
- Mode badge on assistant messages: Legal Info (blue), Service Guide (gold), Escalation (red)
- Mode-specific left-border tint on message bubbles
- Broader initial greeting lists all 3 capabilities
- 6 suggestion chips in greeting (was 4)
- `chatState.mode` tracked for session awareness

### Model Changes
- `ChatResponse.mode: str | None` — new field: general_chat | legal_information | vcx_routing | high_risk

### Files Changed (Phase 5A)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/legal_chat/knowledge.py` | Rewritten (3-mode detection, broad legal keywords, VCX routing keywords, service routes) |
| 2 | `vcx-api/app/legal_chat/policy.py` | Rewritten (mode handlers, issue spotting, checklists, general chat, broad legal) |
| 3 | `vcx-api/app/models/chat.py` | Modified (+mode field) |
| 4 | `assets/js/vcx-legal-assistant.js` | Modified (mode badges, broader greeting, mode tracking) |
| 5 | `assets/css/vcx-legal-assistant.css` | Modified (+mode badge styles, +mode border tints) |
| 6 | `docs/VCX_CHAT_POLICY.md` | Updated (Phase 5A architecture section) |
| 7 | `docs/VCX_CHANGELOG.md` | Updated |

### Files NOT modified
- `app/legal-assistant/index.html` (HTML unchanged — no UI redesign)
- `vcx-api/app/routers/chat.py` (unchanged — transcript security fix preserved)
- All global CSS/JS (visual freeze preserved)
- `index.html` (homepage unchanged)
- schema.sql (no schema changes)
- Knowledge base markdown files (unchanged)

### Verification
- 16/16 mode routing tests passed
- 6/6 policy engine integration tests passed
- 4 Python files compile clean

---

## [Phase 4 Fix — Transcript Security] - 2026-04-02

### Problem
- `GET /api/legal-chat/transcript/{session_id}` was publicly accessible with UUID only
- Flagged as Open Risk #4 in Phase 4 Review

### Fix
- Transcript endpoint now returns **403** without valid credentials
- Two auth methods accepted:
  1. `X-Admin-Token` header (same env var as `/api/review/*`)
  2. Signed HMAC token via `?token=…` query parameter (time-limited, session-scoped)
- Added `POST /api/legal-chat/transcript-token/{session_id}` — admin-only endpoint to generate time-limited tokens (1-1440 min, default 60)
- HMAC-SHA256 signature with constant-time comparison (`hmac.compare_digest`)
- Token payload: `base64url(session_id:expires_unix).hex_signature`

### Env Vars Added
- `VCX_TRANSCRIPT_SECRET` — HMAC signing key (falls back to `VCX_ADMIN_TOKEN`)
- `VCX_TRANSCRIPT_TOKEN_TTL` — default token lifetime in minutes (default `60`)

### Files Changed (Phase 4 Fix)

| # | File | Action |
|---|------|--------|
| 1 | `vcx-api/app/services/transcript_auth.py` | Created (HMAC token gen + verify) |
| 2 | `vcx-api/app/routers/chat.py` | Modified (auth gate + token endpoint) |
| 3 | `docs/VCX_CHAT_POLICY.md` | Created (transcript security doc) |
| 4 | `docs/VCX_CHANGELOG.md` | Updated |

### Files NOT modified
- All frontend files (no UI changes)
- schema.sql (no schema changes)
- All other routers, services, models
- Global CSS/JS (visual freeze preserved)

### Verification
- 6 unit tests: valid round-trip, tampered signature, expired token, garbage input, empty input, None input — all pass
- Both Python files compile clean

---

## [Phase 4 — Regression & Visual-Freeze Review] - 2026-04-02

### Review Scope
- Full regression audit across Phase 4A, 4B, 4C
- No new features added — review only

### Results
- **Homepage:** ZERO DIFF — `index.html` completely unchanged
- **Global CSS:** ZERO DIFF — `styles.css`, `ui-shell.css`, `premium-fixes.css`
- **Design System CSS:** ZERO DIFF — `vcx-tokens.css` through `vcx-utilities.css`
- **Global JS:** ZERO DIFF — `ui-shell.js`, `premium-fixes.js`
- **Internal Links:** 483 checked across 16 HTML files — zero broken
- **Boundary Markers:** All tracked-file insertions wrapped in `<!-- VCX Phase N START/END -->`
- **Page-Scoped CSS:** All new CSS uses `body[data-vcx-page]` scoping — no global leakage
- **API Pattern:** `window.VCX_API_BASE || ''` present in all API-calling scripts
- **Documented Deviations:** sign-in rewrite recorded in `GUARDRAIL_DEVIATIONS.md`
- **Schema:** `schema.sql` unchanged across all Phase 4 sub-phases

### Open Risks (from review)
1. Transcript endpoint (`GET /api/legal-chat/transcript/{id}`) lacks auth — session UUIDs are unguessable but production should add auth
2. Legal assistant 69 out-of-scope keywords may produce edge-case false positives
3. Email service requires SMTP config — missing config = silent no-op (by design)

### Files Created
| # | File | Purpose |
|---|------|---------|
| 1 | `docs/VCX_PHASE4_REVIEW.md` | This review report |

### Files Modified
| # | File | Change |
|---|------|--------|
| 1 | `docs/VCX_CHANGELOG.md` | Added Phase 4 review section |

---

## [Phase 4C — Legal Assistant Hardening] - 2026-04-02

### Tighter Topic Routing
- Expanded `TOPIC_KEYWORDS` per topic with additional synonyms and variations (e.g., "signing", "breach", "green card", "visa", "buyer's order", "dmv")
- Added topic validation gate in policy.py — rejects topics not in `ALLOWED_TOPICS`
- Stronger "no topic detected" response with numbered list of exactly 4 supported areas
- New status types: `out_of_scope`, `no_topic` (previously only `escalate`, `need_more_info`, `answered`)

### Stronger Unsupported-Topic Handling
- Expanded `OUT_OF_SCOPE_KEYWORDS` from 14 to 55+ keywords covering: criminal/emergency, family/domestic, housing, financial, immigration emergencies, litigation, medical/PI, estate/tax, employment litigation, general legal advice seeking
- Added `_ADVICE_SEEKING_PATTERNS` — 6 regex patterns detecting phrases like "should I sue", "what are my legal rights", "represent me", "give me legal advice"
- Out-of-scope responses now explicitly list what the assistant cannot help with and provide actionable product routing links

### Better Escalation Linking
- Created `TOPIC_PRODUCT_ROUTES` mapping in knowledge.py — maps each topic to specific VCX product pages with labels, URLs, and descriptions
- Created `DEFAULT_PRODUCT_ROUTES` — fallback routes for out-of-scope/unmatched topics (Structured Intake, Private Consultation, Client Portal Sign-In)
- New `get_product_routes(topic)` function returns the appropriate product links per topic
- Every ChatResponse now includes `escalation_links[]` — clickable product routes rendered in the UI
- Topic-specific routing: contracts → Contract Scanner + Structured Intake, immigration → Structured Intake, auto deal → Structured Intake, Florida sources → Structured Intake
- Next-step text updated with specific product names and actions

### Transcript/Event Logging
- Added `_log_event()` in chat.py router — saves policy decisions to the messages table with role='event' and JSON content
- Events logged: `answered`, `out_of_scope`, `no_topic`, `invalid_topic`, `no_knowledge_match`, `need_state`, `escalation_submitted`
- Added `event_type` field to ChatResponse model for structured logging
- Added GET /api/legal-chat/transcript/{session_id} endpoint — returns full session transcript including user messages, assistant responses, and policy events (rate-limited 30/min)

### Frontend Improvements (vcx-legal-assistant.js + vcx-legal-assistant.css)
- Escalation links rendered as styled cards with label + description (`.la-escalation-link`)
- Boundary responses (out_of_scope, escalate, no_topic) get visual treatment (`.la-message-boundary` — red-tinted background)
- Improved initial greeting: explicitly lists 4 supported topics with numbered descriptions, includes Structured Intake link for out-of-scope matters
- Better error handling: 429 rate limit shows fallback link to Structured Intake, network error shows phone number + intake link
- All CSS scoped to `body[data-vcx-page="legal-assistant"]` existing page scope

### Model Updates
- `ChatResponse.escalation_links: list[EscalationLink]` — new field with `EscalationLink(label, url, description)` model
- `ChatResponse.event_type: str | None` — policy decision type for logging
- `ChatResponse.status` expanded: `out_of_scope | no_topic | need_more_info | answered | escalate`

### Files Changed (Phase 4C)

| # | File | Action |
|---|------|--------|
| 1 | vcx-api/app/legal_chat/knowledge.py | Enhanced (expanded keywords + product routes + advice patterns) |
| 2 | vcx-api/app/legal_chat/policy.py | Enhanced (tighter routing + escalation links + event types) |
| 3 | vcx-api/app/models/chat.py | Enhanced (EscalationLink model + event_type + escalation_links) |
| 4 | vcx-api/app/routers/chat.py | Enhanced (event logging + transcript endpoint) |
| 5 | assets/js/vcx-legal-assistant.js | Enhanced (escalation link rendering + boundary UX + improved greeting) |
| 6 | assets/css/vcx-legal-assistant.css | Enhanced (escalation link styles + boundary message styles) |
| 7 | docs/VCX_CHANGELOG.md | Updated |
| 8 | docs/VCX_PHASE4C_QA.md | Created |

### Files NOT modified
- index.html (homepage)
- app/legal-assistant/index.html (HTML structure unchanged)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system CSS (vcx-tokens through vcx-utilities)
- site.js, vcx-i18n.js, shell-i18n.js
- structured-case-intake.html
- All Phase 4A/4B files
- schema.sql (no schema changes)
- vcx-api/knowledge/*.md (knowledge base content unchanged)
- _references/ directory

---

## [Phase 4B — Contract Intelligence Server Wiring] - 2026-04-02

### Server-Side Text Extraction
- Added `pdfplumber>=0.11.0` and `python-docx>=1.1.0` to requirements.txt
- Enhanced `vcx-api/app/services/contract_analyzer.py`:
  - `_extract_pdf()`: pdfplumber-based text extraction with page-level concatenation
  - `_extract_docx()`: python-docx paragraph extraction
  - Safe fallback: ImportError or extraction failure returns None (graceful degradation)
  - `extract_text_from_bytes()` now routes .pdf → pdfplumber, .docx → python-docx, .txt/.md → UTF-8 decode

### Enhanced Contract Analysis (Phase 4B additions to contract_analyzer.py)
- `detect_missing_protections(clauses, contract_type)`: identifies commonly expected clauses not found, per-contract-type expected clause maps (Employment, Service, NDA, Lease, Purchase, Other)
- `generate_suggested_questions(clauses, missing_protections)`: context-specific questions for counsel based on found clauses and missing protections
- `generate_issue_buckets(clauses, missing_protections)`: groups findings into priority buckets — Immediate Attention (high_risk + high-severity missing), Review Recommended (caution + medium-severity missing), Standard Provisions (neutral)

### Enhanced API Response (contracts.py + contract.py models)
- POST /api/contracts/analyze now accepts optional form fields: contract_type, concerns, negotiated, deadline (questionnaire context)
- Response model extended with: extraction_method, word_count, missing_protections[], suggested_questions[], issue_buckets[], questionnaire{}, disclaimer
- New Pydantic models: MissingProtection, SuggestedQuestion, IssueBucketItem, IssueBucket, QuestionnaireContext

### Frontend API Bridge
- Created `assets/js/vcx-contract-intelligence.js`: external script that overrides window.vcxScanContract to use POST /api/contracts/analyze
  - Sends file + questionnaire via FormData
  - Renders enriched server results: issue buckets, missing protections, suggested questions for counsel, extraction quality notice, escalation CTAs
  - Falls back to original client-side analysis on API failure (TypeError/network error)
  - Overrides window.vcxHandleFile to update file notices (PDF/DOCX now show success notices)
  - Bridges server response to client-side analysis format for stronger clause suggestions compatibility
  - Error differentiation: 429 (rate limited), 413 (file too large), 400 (validation), server errors

### Contract Intelligence Page (additive modifications)
- `app/contract-intelligence/index.html`:
  - Added `window._vcxSetAnalysis` bridge setter in IIFE (2 lines, boundary-marked)
  - Added `<script src="/assets/js/vcx-contract-intelligence.js">` before vcx-i18n.js (boundary-marked)
  - Updated upload hint i18n text in EN/RU/ES to reflect server-side PDF/DOCX support
  - Updated inline upload hint paragraph
- No visual design changes. Existing CSS classes reused for server results rendering.

### Escalation Path
- Server results include dual CTAs: "Schedule contract review call" (Calendly) + "Submit to Structured Intake" (with ?service=contract-review parameter)
- Review reference ID shown in results for advisor follow-up
- Advisor review form summary now includes risk score, review ID, missing protections count

### Documentation
- Updated `docs/VCX_CHANGELOG.md`: Phase 4B section
- Updated `docs/VCX_ROADMAP_30_60_90.md`: checked off completed items
- Created `docs/VCX_PHASE4B_QA.md`: full QA checklist and rollback notes

### Files Changed (Phase 4B)

| # | File | Action |
|---|------|--------|
| 1 | vcx-api/requirements.txt | Modified (+pdfplumber, +python-docx) |
| 2 | vcx-api/app/services/contract_analyzer.py | Enhanced (PDF/DOCX extraction + missing protections + questions + buckets) |
| 3 | vcx-api/app/models/contract.py | Enhanced (6 new Pydantic models + extended response) |
| 4 | vcx-api/app/routers/contracts.py | Enhanced (questionnaire form fields + enriched response) |
| 5 | assets/js/vcx-contract-intelligence.js | Created (API bridge with fallback) |
| 6 | app/contract-intelligence/index.html | Modified (3 additive insertions + i18n text updates) |
| 7 | docs/VCX_CHANGELOG.md | Updated |
| 8 | docs/VCX_ROADMAP_30_60_90.md | Updated |
| 9 | docs/VCX_PHASE4B_QA.md | Created |

### Files NOT modified
- index.html (homepage)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system CSS (vcx-tokens, vcx-base, vcx-layout, vcx-components, vcx-utilities)
- site.js, vcx-i18n.js, shell-i18n.js
- structured-case-intake.html
- All Phase 4A files (upload_validator, email_service, rate_limit, sign-in)
- schema.sql (no schema changes needed)
- _references/ directory
- All other app pages

---

## [Phase 4A — Visual-Freeze Hardening] - 2026-04-02

### Upload Validation
- Created `vcx-api/app/services/upload_validator.py`: extension allowlist (.pdf, .doc, .docx, .txt, .md, .jpg, .jpeg, .png, .gif, .csv, .xlsx, .xls), blocked extensions (.exe, .bat, .cmd, .sh, .ps1, .js, .html, .php, .py, etc.), 25MB size limit (VCX_MAX_UPLOAD_MB env var), filename sanitization (path separators, control chars, truncation)
- Wired to: intakes.py (attachment), uploads.py (all files), contracts.py (upload + analyze)

### Rate Limiting
- Added `slowapi>=0.1.9` dependency
- Created `vcx-api/app/rate_limit.py`: shared limiter configuration with VCX_RATE_LIMIT_ENABLED env var
- Rate limits per endpoint: intakes 10/min, uploads 20/min, contracts 10/min, recovery 10/min, chat 30/min, portal magic-link 5/min, portal request-access 5/min, portal lookup-email 5/min, review queue 30/min, review update 20/min, escalate 10/min
- 429 Too Many Requests response on limit exceeded

### Email Notifications
- Created `vcx-api/app/services/email_service.py`: SMTP-based, fire-and-forget (background thread)
- 4 email functions: send_client_intake_confirmation(), send_admin_intake_notification(), send_status_change_notification(), send_portal_access_link()
- Env vars: VCX_SMTP_HOST, VCX_SMTP_PORT, VCX_SMTP_USER, VCX_SMTP_PASS, VCX_ADMIN_EMAIL, VCX_FROM_EMAIL
- Missing SMTP config = warning log, no failure (graceful degradation)
- Wired to: intakes.py (client + admin email on submission), review.py (client email on status change), portal.py (access link email)

### CORS Tightening
- Improved main.py CORS parsing: whitespace stripping after comma split
- Added optional env vars: VCX_CORS_ALLOW_CREDENTIALS, VCX_CORS_ALLOW_METHODS, VCX_CORS_ALLOW_HEADERS

### Sign-In → Portal Auth Flow
- Rewrote `app/sign-in/index.html` from redirect stub to functional sign-in form with v284 canonical shell (header, footer, nav, i18n, clocks)
- Created `assets/js/vcx-sign-in.js`: form handler POSTs to /api/portal/request-access, shows success/error/dev-link
- Created `assets/css/vcx-sign-in.css`: minimal styles scoped to body[data-vcx-page="vcx-sign-in"]
- Added POST /api/portal/request-access endpoint: creates portal session, sends magic link email (or returns link in dev mode)
- Added sessionStorage persistence to vcx-packet-room.js: saves/restores auth token across page refresh
- Added sessionStorage persistence to vcx-matter-status.js: saves/restores matter token across page refresh

### Error Handling Improvements
- vcx-intake-api.js: differentiates 422 (validation), 429 (rate limited), 413 (file too large), 400 (bad request), 500 (server error), network error
- vcx-packet-room.js: differentiates expired session (401), invalid token (404), rate limited (429), network error; auto-clears session on 401
- vcx-matter-status.js: improved expired-link message with "Request new access link" button, portal link, session cleanup
- vcx-review-queue.js: added 15s fetch timeout (AbortController), retry on timeout, rate limit messaging, session expired detection

### Security Fixes
- review.py: admin token comparison changed from `!=` to `secrets.compare_digest()` (prevents timing attacks)
- portal.py: timezone handling fixed — uses `datetime.now(timezone.utc)` consistently, handles naive datetimes as UTC

### Documentation
- Created `vcx-api/.env.example`: all env vars with defaults and descriptions
- Created `docs/VCX_PHASE4A_QA.md`: full QA checklist, rollback notes, done definition
- Updated `docs/VCX_CHANGELOG.md`: Phase 4A section
- Updated `docs/VCX_ROADMAP_30_60_90.md`: checked off completed items
- Updated `docs/GUARDRAIL_DEVIATIONS.md`: sign-in page rewrite

### Files Changed (Phase 4A)

| # | File | Action |
|---|------|--------|
| 1 | vcx-api/app/services/upload_validator.py | Created |
| 2 | vcx-api/app/services/email_service.py | Created |
| 3 | vcx-api/app/rate_limit.py | Created |
| 4 | vcx-api/app/main.py | Modified (rate limiting + CORS) |
| 5 | vcx-api/requirements.txt | Modified (+slowapi) |
| 6 | vcx-api/.env.example | Rewritten (comprehensive) |
| 7 | vcx-api/app/routers/intakes.py | Modified (validation + email + rate limit) |
| 8 | vcx-api/app/routers/uploads.py | Modified (validation + rate limit) |
| 9 | vcx-api/app/routers/review.py | Modified (email + rate limit + secrets) |
| 10 | vcx-api/app/routers/contracts.py | Modified (validation + rate limit) |
| 11 | vcx-api/app/routers/recovery.py | Modified (rate limit) |
| 12 | vcx-api/app/routers/chat.py | Modified (rate limit) |
| 13 | vcx-api/app/routers/portal.py | Modified (rate limit + request-access + timezone) |
| 14 | assets/js/vcx-intake-api.js | Modified (error handling) |
| 15 | assets/js/vcx-packet-room.js | Modified (session persistence + errors) |
| 16 | assets/js/vcx-matter-status.js | Modified (session persistence + errors) |
| 17 | assets/js/vcx-review-queue.js | Modified (timeout + errors) |
| 18 | assets/js/vcx-sign-in.js | Created |
| 19 | assets/css/vcx-sign-in.css | Created |
| 20 | app/sign-in/index.html | Rewritten (stub → functional) |
| 21 | docs/VCX_CHANGELOG.md | Updated |
| 22 | docs/VCX_ROADMAP_30_60_90.md | Updated |
| 23 | docs/GUARDRAIL_DEVIATIONS.md | Updated |
| 24 | docs/VCX_PHASE4A_QA.md | Created |

### Files NOT modified
- index.html (homepage)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system CSS (vcx-tokens, vcx-base, vcx-layout, vcx-components, vcx-utilities)
- site.js (no changes needed for Phase 4A)
- structured-case-intake.html
- Existing app pages (legal-assistant, matter-status, review, vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room HTML)
- schema.sql (no schema changes needed)
- All Phase 1/2/3 backend services (contract_analyzer, recovery_engine, triage, checklist, magic_link)
- _references/ directory

---

## [Phase 3 — Product Build Step] - 2026-04-02

### Product 2: Contract Review Desk — fully functional
- Created `vcx-api/app/services/contract_analyzer.py`: pattern-based clause detection engine with 16 clause patterns (termination, indemnification, liability, auto-renewal, non-compete, non-solicitation, confidentiality, governing law, assignment, payment terms, force majeure, IP ownership, warranty, arbitration)
- Functions: `extract_text_from_bytes()`, `detect_clauses()`, `compute_risk_score()`, `generate_risk_summary()`
- Risk weighting: high_risk=25, caution=10, neutral=2, safe=0 (0-100 scale)
- Upgraded `vcx-api/app/routers/contracts.py`: all 3 endpoints now DB-wired
  - POST /api/contracts/upload: saves file, inserts into contract_reviews
  - POST /api/contracts/analyze: text extraction + clause detection + risk scoring + DB persistence
  - GET /api/contracts/{review_id}/report: full report with clauses, risk score, summary, disclaimer
- Upgraded `assets/js/vcx-contract-review.js`: DOM IDs aligned with HTML, risk score bar, clause cards with type/excerpt/risk/note/confidence, full report loading
- Updated `app/vcx-contract-review/index.html`: added .txt/.md to accepted file types with format note

### Product 3: Recovery Pilot Studio — fully functional
- Created `vcx-api/app/services/recovery_engine.py`: deterministic financial models
  - `compute_baseline()`: AR ratio, aging severity, net recovery, annual leakage
  - `compute_projections()`: 3 scenarios (conservative +10%, moderate +20%, aggressive +35%)
  - `generate_pilot_outline()`: 3-phase engagement plan with deliverables
  - `assemble_brief_data()`: full executive brief assembly
- Upgraded `vcx-api/app/routers/recovery.py`: all 4 endpoints now DB-wired
  - POST /api/recovery/pilot: creates pilot with initial baseline
  - PATCH /api/recovery/pilot/{id}: updates data, auto-computes analysis at step 4+
  - GET /api/recovery/pilot/{id}: returns full state with analysis data
  - POST /api/recovery/pilot/{id}/brief: generates complete executive brief
- Upgraded `app/vcx-recovery-pilot/index.html`: added wizard panels for steps 2-5 (Revenue Baseline, AR & Collections, Analysis display, Executive Brief display)
- Upgraded `assets/js/vcx-recovery-pilot.js`: full 5-step wizard with API integration, creates pilot at step 1, PATCHes at each step, renders analysis KPI grid + 3-scenario projections + executive brief with engagement phases

### Product 4: Packet Room / Client Portal — fully functional
- Upgraded `vcx-api/app/routers/portal.py`: all endpoints now DB-wired
  - GET/POST /api/portal/magic-link/{token}: verifies token against matters table, creates 24h portal session
  - POST /api/portal/lookup-email: email-based matter lookup (privacy-safe)
  - GET /api/portal/matters: lists all matters for authenticated contact
  - GET /api/portal/matters/{id}: matter overview
  - GET /api/portal/matters/{id}/packet: full packet with timeline, documents, checklist, comments, deliverables
  - POST /api/portal/matters/{id}/comments: client comment posting
  - GET /api/portal/matters/{id}/export: stub (Phase 4)
- Upgraded `assets/js/vcx-packet-room.js`: DOM IDs aligned with HTML, auth flow with token/email support, URL token auto-login, matter list rendering, full packet display (timeline, documents, checklist, comments with inline posting, deliverables)

### Files changed (Phase 3)
| # | File | Action |
|---|------|--------|
| 1 | vcx-api/app/services/contract_analyzer.py | Created |
| 2 | vcx-api/app/services/recovery_engine.py | Created |
| 3 | vcx-api/app/routers/contracts.py | Rewritten |
| 4 | vcx-api/app/routers/recovery.py | Rewritten |
| 5 | vcx-api/app/routers/portal.py | Rewritten |
| 6 | assets/js/vcx-contract-review.js | Rewritten |
| 7 | assets/js/vcx-recovery-pilot.js | Rewritten |
| 8 | assets/js/vcx-packet-room.js | Rewritten |
| 9 | app/vcx-recovery-pilot/index.html | Updated (steps 2-5) |
| 10 | app/vcx-contract-review/index.html | Updated (file types) |
| 11 | docs/VCX_CHANGELOG.md | Updated |
| 12 | docs/VCX_ROADMAP_30_60_90.md | Updated |

### Files NOT modified
- index.html (homepage)
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css)
- Design system CSS (vcx-tokens, vcx-base, vcx-layout, vcx-components, vcx-utilities)
- structured-case-intake.html
- site.js
- Existing app pages (legal-assistant, matter-status, review, vcx-intake)
- schema.sql (no schema changes needed)
- All Phase 1/Phase 2 files remain untouched

---

## [Phase 2 — Safe Realignment] - 2026-04-02

### Migration to v284 clean baseline
- All Phase 1 product files migrated from vcx-work build workspace into clean v284 repo
- Branch: codex/phase2-safe-realign (from commit 25e958c)

### Shell Template Reconciliation
- All 7 app pages rebuilt with v284 canonical shell (vcx-header, full i18n en/ru/es, metric bar, lang switcher, dual clock chips, mobile nav, vcx-footer with 3-column footer-grid-extended)
- Root-relative asset paths enforced on all app page links (header nav, footer nav, images, scripts)
- Pages: legal-assistant, matter-status, review, vcx-intake, vcx-contract-review, vcx-recovery-pilot, vcx-packet-room

### Modified — structured-case-intake.html (3 additive edits)
- Inserted `<div id="intakeResult">` after `</form>` (hidden by default, populated by API response)
- Added Legal Assistant link as 4th chip in existing self-service card
- Added `<script src="/assets/js/vcx-intake-api.js">` after existing scripts

### Modified — assets/js/site.js (guardrail deviation, documented)
- bindIntakeForm() (lines 364-401): delegates to VCX_IntakeAPI.submit() when loaded, else FormSubmit.co fallback
- Boundary markers added: `// VCX Phase 2: modified bindIntakeForm -- START/END`
- See docs/GUARDRAIL_DEVIATIONS.md for full justification

### Added — Integration cards on 3 service pages
- additional-services.html: 3 product cards (Contract Review Desk, Legal Assistant, Packet Room)
- revenue-recovery-workflow.html: 2 product cards (Recovery Pilot Studio, Intake OS)
- corporate-legal-file-control.html: 2 product cards (Contract Review Desk, Packet Room)
- All cards use existing .card.reveal pattern with VCX design token border colors
- Boundary markers: `<!-- VCX Phase 2: product integration cards -- START/END -->`

### Added — New files
- .gitignore: vcx-api exclusions (data/, uploads/, .env, __pycache__, *.db)
- docs/GUARDRAIL_DEVIATIONS.md: formal deviation log
- _codex_phase2_preflight.md: preflight audit document

### Files NOT modified
- index.html (homepage)
- Top navigation structure
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css, premium-fixes.js)
- Design system (vcx-tokens.css, vcx-base.css, vcx-layout.css, vcx-components.css, vcx-utilities.css)
- Existing app pages (contract-intelligence, dealer-contract-check, immigration-forms, private-lookup, sign-in)
- _references/ directory

---

## [Phase 1] - 2026-04-02

### Added — VCX Intake OS (Product 1)
- FastAPI backend at vcx-api/ with 9-table SQLite schema
- POST /api/intakes — full intake pipeline (org → contact → matter → triage → checklist → magic link)
- POST /api/uploads/{matter_id} — document upload with Bearer token auth
- GET /api/matters/{matter_id} — client status page data
- PATCH /api/matters/{matter_id}/checklist/{cid} — interactive checklist toggle
- GET /api/review/queue — admin triage queue with filter/pagination
- PATCH /api/review/matters/{matter_id} — admin status update with audit trail
- Client status page at /app/matter-status/
- Admin review queue at /app/review/
- Intake API client (assets/js/vcx-intake-api.js)

### Added — Legal Assistant (Product 5)
- POST /api/legal-chat/message — knowledge-backed chat with 4 topics
- POST /api/legal-chat/escalate — lead capture
- Legal assistant frontend at /app/legal-assistant/
- Knowledge base: contracts, immigration, auto deal review, FL official sources

### Added — Product Scaffolds (Products 2-4)
- Contract Review Desk: app/vcx-contract-review/, vcx-api/app/routers/contracts.py
- Recovery Pilot Studio: app/vcx-recovery-pilot/, vcx-api/app/routers/recovery.py
- Packet Room / Client Portal: app/vcx-packet-room/, vcx-api/app/routers/portal.py
- VCX Intake landing page: app/vcx-intake/
- All new tables in schema.sql for Products 2-4

### Added — Documentation
- docs/VCX_IMPLEMENTATION_PLAN.md
- docs/VCX_API_MAP.md
- docs/VCX_DATA_MODEL.md
- docs/VCX_ROADMAP_30_60_90.md
- docs/VCX_CHANGELOG.md
- AGENTS.md (guardrails)
- _codex_phase0.md (architecture audit)

### Modified (Minimal)
- assets/js/site.js: bindIntakeForm() now delegates to VCX_IntakeAPI.submit() with FormSubmit.co fallback
- structured-case-intake.html: Added intakeResult div, legal-assistant link, vcx-intake-api.js script
- .gitignore: Added vcx-api exclusions

## [Phase 1 — Pass 2] - 2026-04-02

### Added — Integration Cards (safe entry points on existing pages)
- additional-services.html: Inserted 3 product cards (Contract Review Desk, Legal Assistant, Packet Room) between the advisory card and fit-grid section. Uses existing .card.reveal pattern with colored top borders. No nav or header/footer changes.
- revenue-recovery-workflow.html: Inserted 2 product cards (Recovery Pilot Studio, Intake OS) before the industry-grid section. Same card pattern, additive insertion.
- corporate-legal-file-control.html: Inserted 2 product cards (Contract Review Desk, Packet Room) before the industry-grid section. Same card pattern, additive insertion.

### Files Changed in Pass 2
| File | Change Type | Description |
|------|------------|-------------|
| additional-services.html | Additive insert | 3 product cards between advisory CTA and fit-grid |
| revenue-recovery-workflow.html | Additive insert | 2 product cards before industry-grid |
| corporate-legal-file-control.html | Additive insert | 2 product cards before industry-grid |
| docs/VCX_CHANGELOG.md | Updated | Added Pass 2 entries |

### Not Modified (confirmed)
- index.html (homepage)
- Top navigation structure
- Header/footer shell (ui-shell.css, ui-shell.js)
- Global styles (styles.css, premium-fixes.css)
- Existing app pages (contract-intelligence, dealer-contract-check, immigration-forms, private-lookup)
