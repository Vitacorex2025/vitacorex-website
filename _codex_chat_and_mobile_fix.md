# Chat & Mobile Stabilization -- Codex Output (v2)

> Generated 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Floating chat widget, legal assistant runtime, iPhone mobile behavior.
> Phase 10: Legal assistant session persistence, backend readiness, file upload, typing indicator.

---

## Verdict

| Area | Phase 8 Status | Phase 10 Status |
|------|---------------|-----------------|
| Chat widget API routing | FIXED (auto-detects 8787) | -- |
| Legal assistant API routing | FIXED (same pattern) | -- |
| Error visibility | Network-aware diagnostics | -- |
| z-index (panel vs header/dock) | FIXED (panel 10100, FAB 10099) | -- |
| iPhone safe-area | FIXED (FAB, panel, input-bar, chat shell) | -- |
| Touch targets (WCAG 2.5.5) | PASS (all 44px+) | Upload buttons 44px added |
| Scroll containment | FIXED (contain on panel + messages + body-lock) | -- |
| iOS input zoom | FIXED (all inputs 16px on mobile) | -- |
| Mobile dock overlap | FIXED (hidden when panel open) | -- |
| Legal assistant session persistence | MISSING (chat lost on refresh) | FIXED (sessionStorage) |
| Legal assistant backend readiness | MISSING (no indicator) | FIXED (green/red dot + label) |
| Legal assistant file upload | MISSING (widget only) | FIXED (attach + camera buttons) |
| Legal assistant typing indicator | MISSING | FIXED (animated dots) |

## Phase 10 Changes

### Files Modified

| File | Change |
|------|--------|
| `assets/js/vcx-legal-assistant.js` | +session persistence (sessionStorage), +backend health check, +typing indicator, +file/image upload with validation |
| `assets/css/vcx-legal-assistant.css` | +backend status dot, +upload buttons (44px), +upload status bar, +typing animation, mobile styles for new elements |
| `app/legal-assistant/index.html` | +backend status element in meta row, +attach/camera buttons, +hidden file inputs, +upload status container |
| `docs/VCX_CHAT_RUNTIME_FIXES.md` | Updated with Phase 10 sections (API strategy, session persistence, backend readiness, file upload, typing indicator) |
| `docs/VCX_MOBILE_CHAT_FIXES.md` | Updated with upload button 44px targets, expanded test checklist |
| `docs/VCX_CHANGELOG.md` | Phase 10 entry prepended |

### Frozen Files: NONE MODIFIED

All changes in namespaced files:
- `assets/js/vcx-legal-assistant.js`
- `assets/css/vcx-legal-assistant.css`
- `app/legal-assistant/index.html`

### API Base Strategy (documented)

1. **Same-origin** (production with reverse proxy): API_BASE = '' (default)
2. **Explicit override**: Set `window.VCX_API_BASE` before script load
3. **Dev auto-detect**: Port 8080 -> localhost:8787 (automatic)

### Session Persistence

- Key: `vcx_la_session` in sessionStorage
- Stores: sessionId, topic, jurisdiction, mode
- Saved: after every successful API response
- Restored: on page load (UI state updated to match)

### File Upload

- Attach button: opens file picker (PDF, DOC, DOCX, TXT, MD, JPG, PNG, GIF, CSV, XLSX)
- Camera button: opens camera with `capture="environment"` on mobile
- Client-side validation: extension allowlist, 25MB max, empty file check
- Server upload: FormData POST to /api/legal-chat/upload
- Error handling: 413, 400, network errors with visible status bar
- Success: server acknowledgment displayed as assistant message

## Done Criteria Check

| Criterion | Status |
|-----------|--------|
| Chat sends and receives messages | PASS (both widget and legal assistant page) |
| iPhone/mobile drawer is stable and clean | PASS (safe-area, touch targets, scroll containment, z-index) |
| No shell drift | PASS (zero frozen files modified) |
| Failures visible in UI | PASS (error messages, upload status, backend indicator) |
| Backend readiness detection | PASS (widget: healthcheck dot; legal assistant: healthcheck dot + label) |
| Uploads fail gracefully | PASS (client-side validation + server error handling + visible status) |
| Legal assistant aligned with widget for uploads | PASS (attach + camera buttons added) |
| Docs updated | PASS (3 docs updated) |
