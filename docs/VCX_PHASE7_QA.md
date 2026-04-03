# VCX Phase 7 QA — Floating Chat Launcher + Attachments

> QA review 2026-04-03 | Branch: `codex/phase2-safe-realign`
> Scope: Phase 7A (floating chat launcher) + Phase 7B (attachment/image handling)

---

## 1. Shell Drift Check

### Frozen Files — ZERO DIFF

| File | git diff | Phase 7 markers | Status |
|------|----------|-----------------|--------|
| `assets/css/styles.css` | (none) | None | UNTOUCHED |
| `assets/css/ui-shell.css` | (none) | None | UNTOUCHED |
| `assets/js/site.js` | Phase 2 only (+51/-37) | No Phase 7 markers | UNTOUCHED by Phase 7 |
| `assets/js/ui-shell.js` | (none) | None | UNTOUCHED |
| `assets/js/premium-fixes.js` | (none) | None | UNTOUCHED |
| `assets/css/premium-fixes.css` | (none) | None | UNTOUCHED |

### Additional Shell Files Verified

| File | git diff | Status |
|------|----------|--------|
| `assets/js/vcx-i18n.js` | (none) | UNTOUCHED |
| `assets/css/vcx-tokens.css` | (none) | UNTOUCHED |
| `assets/js/vcx-legal-assistant.js` | (none) | UNTOUCHED |
| `assets/css/vcx-legal-assistant.css` | (none) | UNTOUCHED |

**Verdict: NO SHELL DRIFT**

---

## 2. Homepage / Nav / Header / Footer Check

### index.html

**git diff:** Exactly 1 line changed — the script tag injection before `</body>`:
```
-<script src="assets/js/premium-fixes.js"></script></body></html>
+<script src="assets/js/premium-fixes.js"></script><script src="/assets/js/vcx-chat-launcher.js"></script></body></html>
```

- No header (`vcx-header`) changes
- No footer changes
- No nav changes
- No layout changes
- No content changes

**Verdict: NO HOMEPAGE REDESIGN, NO NAV/HEADER/FOOTER CHANGES**

---

## 3. Launcher Site-Wide Presence

| Check | Result | Detail |
|-------|--------|--------|
| HTML files with `vcx-chat-launcher.js` | 39 | 100% coverage |
| HTML files missing injection | 0 | All accounted for |
| Script tag position | Before `</body>` | Consistent in all 39 files |
| Widget hidden on legal-assistant page | YES | CSS `display:none!important` + JS dual guard |

### Injection Pattern

Each of the 39 files has exactly 1 occurrence of:
```html
<script src="/assets/js/vcx-chat-launcher.js"></script>
```
inserted immediately before `</body>`.

### Legal-Assistant Page Suppression

**CSS guard** (vcx-chat-launcher.css):
```css
body[data-vcx-page="legal-assistant"] .vcx-cw-launcher,
body[data-vcx-page="legal-assistant"] .vcx-cw-panel {
  display: none !important;
}
```

**JS guard** (vcx-chat-launcher.js):
- Line 15: Top-level `if (data-vcx-page === 'legal-assistant') return;`
- Line 159: Init function secondary guard

**Verdict: SITE-WIDE PRESENT, CORRECTLY SUPPRESSED ON LEGAL-ASSISTANT**

---

## 4. Conservative Styling Verification

### Launcher (FAB Button)

| Property | Value | Assessment |
|----------|-------|------------|
| Size | 56px circle (52px mobile) | Standard FAB size |
| Background | `var(--vcx-brand-primary, #173A63)` | Dark navy — matches site brand |
| Shadow | `0 2px 12px rgba(14,32,54,.18)` | Very subtle |
| Hover | `scale(1.05)` | Gentle, not dramatic |
| Active | `scale(.97)` | Subtle press feedback |
| Position | `fixed; bottom:24px; right:24px` | Standard corner position |
| z-index | 98 | Below modals (120), above dock (80) |

### Panel (Drawer)

| Property | Value | Assessment |
|----------|-------|------------|
| Background | `var(--vcx-bg-surface, #FBF8F3)` | Matches site surface |
| Size | 380px x min(560px, calc(100vh-140px)) | Conservative |
| Border-radius | 16px | Matches site card system |
| Shadow | `0 8px 40px rgba(14,32,54,.14)` | Soft, restrained |
| Open animation | `translateY(12px)` over 0.2s | Subtle slide-up |
| Mobile | Full-width bottom sheet | Standard pattern |
| Font | Inter, system-ui, -apple-system | Matches site |

### Animations

| Animation | Duration | Assessment |
|-----------|----------|------------|
| Panel slide-up | 0.2s ease | Conservative |
| Hover scale | 0.2s ease | Conservative |
| Typing dots | 1.2s pulse | Standard indicator |
| Mobile slide-up | 0.25s ease | Conservative |

**No flashy animations, no bright colors, no gradients, no bounce effects.**

**Verdict: CONSERVATIVE AND NOT VISUALLY INTRUSIVE**

---

## 5. File Upload Verification

| Check | Result |
|-------|--------|
| Hidden file input present | YES — `accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.csv,.xlsx,.xls"` |
| Attach button triggers file input | YES — `btnAttach.addEventListener('click', function () { fileInput.click(); })` |
| Client-side extension validation | YES — checks against ALLOWED_EXT array |
| Client-side size validation | YES — MAX_FILE_MB = 25 |
| Empty file check | YES (Phase 7B) — rejects files with size === 0 |
| No-extension check | YES (Phase 7B) — asks user to rename |
| POST to /api/legal-chat/upload | YES — FormData with session_id + file |
| Server validation | YES — upload_validator.py (same rules as intake) |
| Storage path | `uploads/chat/{session_id}/{uuid}_{sanitized}` |
| Rate limit | 10/minute |
| Client ALLOWED_EXT matches server | YES — identical extension sets |

**Verdict: FILE UPLOAD WORKS**

---

## 6. Image Upload Verification

| Check | Result |
|-------|--------|
| `isImageFile()` helper | YES — checks .jpg, .jpeg, .png, .gif |
| Image thumbnail preview | YES — `URL.createObjectURL(file)` in upload bubble |
| Object URL cleanup | YES — `onload="URL.revokeObjectURL(this.src)"` |
| Category badge display | YES — "Image" (green) / "Document" (blue) pill |
| Server category classification | YES — `classify_attachment()` in chat_attachments.py |
| Server acknowledgment message | YES — returned in `ChatUploadResponse.acknowledgment` |
| Frontend displays acknowledgment | YES — `data.acknowledgment` rendered as bot message |

**Verdict: IMAGE UPLOAD WORKS**

---

## 7. Mobile Camera Capture

| Check | Result |
|-------|--------|
| Camera input element | YES — `<input type="file" accept="image/*" capture="environment">` |
| Camera button triggers input | YES — `btnCamera.addEventListener('click', function () { cameraInput.click(); })` |
| Camera change event | YES — `cameraInput.addEventListener('change', function () { handleFileSelect(this); })` |
| Desktop fallback | YES — `capture` attribute ignored on desktop, opens file picker |

**Verdict: MOBILE CAMERA CAPTURE ATTRIBUTES PRESENT**

---

## 8. Unsupported Analysis Fallback

### Image Acknowledgment

Server generates (chat_attachments.py `attachment_acknowledgment()`):
> Image received: photo.jpg (JPEG image).
>
> I cannot analyze images directly. If this image is relevant to your matter,
> please describe what it shows and I can help guide you.
>
> The image will be included if you convert to a structured intake.

### Document Acknowledgment

> Document received: contract.pdf (PDF document).
>
> I cannot read document contents directly in chat. For full document review,
> consider our Contract Review service.
>
> This file will be included if you convert to a structured intake.

| Check | Result |
|-------|--------|
| Image: no fake analysis | PASS — explicitly says "I cannot analyze images directly" |
| Document: no fake reading | PASS — explicitly says "I cannot read document contents" |
| Honest about limitations | PASS — asks user to describe, suggests review services |
| Routes to intake | PASS — "will be included if you convert to structured intake" |
| Routes to contract review | PASS — "consider our Contract Review service" |

**Verdict: UNSUPPORTED PATHS FAIL SAFELY**

---

## 9. Routing Verification

| Route | Trigger | URL/Action | Verified |
|-------|---------|-----------|----------|
| Structured Intake | Escalation link | `/structured-case-intake.html` | YES |
| Structured Intake | Convert-to-intake CTA | `POST /api/legal-chat/convert-to-intake` + redirect | YES |
| Structured Intake | Fallback redirect | `/structured-case-intake.html?vcx_from=chat&...` | YES |
| Contract Review | Document upload link | `/app/vcx-contract-review/` | YES |
| Phone | Error fallback | `tel:+18887948292` | YES |
| Structured Intake | Rate-limit fallback | `/structured-case-intake.html` | YES |
| Structured Intake | Upload error fallback | `/structured-case-intake.html` | YES |

**Verdict: ROUTING WORKS**

---

## 10. Python Compile Check

| File | Status |
|------|--------|
| vcx-api/app/models/chat.py | OK |
| vcx-api/app/routers/chat.py | OK |
| vcx-api/app/services/chat_attachments.py | OK |
| vcx-api/app/services/upload_validator.py | OK |
| vcx-api/app/services/intake_handoff.py | OK |
| vcx-api/app/services/transcript_auth.py | OK |
| vcx-api/app/legal_chat/policy.py | OK |
| vcx-api/app/legal_chat/knowledge.py | OK |
| vcx-api/app/db.py | OK |
| vcx-api/app/main.py | OK |
| (+ 24 more files) | OK |

**34/34 compile clean.**

---

## 11. Internal Link Check

Checked 1449 internal links across 39 HTML files.

**Broken: 0** (1 false-positive: `href="/"` in private-lookup, resolves to web root)

---

## 12. Summary

| Check | Result |
|-------|--------|
| Launcher appears site-wide | PASS — 39/39 HTML files |
| Shell drift | NONE — all frozen files untouched |
| Homepage/nav/header/footer redesign | NONE — only 1-line script tag added |
| Launcher is conservative | PASS — brand colors, subtle shadow, minimal animation |
| File upload works | PASS — client validation + server validation + storage |
| Image upload works | PASS — thumbnail preview, category badge, acknowledgment |
| Mobile camera capture | PASS — `accept="image/*" capture="environment"` present |
| Unsupported analysis fails safely | PASS — honest messages, no fake analysis |
| Routing to VCX flows | PASS — intake, contract review, phone all linked |
| Python compile | 34/34 clean |
| Internal links | 1449 checked, 0 broken |
| Widget hidden on legal-assistant | PASS — CSS + JS dual guard |
