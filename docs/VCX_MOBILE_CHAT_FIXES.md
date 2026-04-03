# VCX Mobile / iPhone Chat Fixes

> Phase 8 Stabilization | 2026-04-03

## Summary

Comprehensive mobile stabilization for the floating chat widget and the
full-page legal assistant on iPhone and Android devices. Addresses
safe-area insets, WCAG touch targets, z-index layering, scroll
containment, and keyboard behavior.

---

## 1. Z-Index Layering (CRITICAL)

### Problem

The site header (`vcx-header`) sits at z-index 120 and the navigation
dock (`vcx-dock`) at z-index 110. The chat panel was at z-index 99 and
the FAB at 98 -- both rendered BEHIND the header and dock, making the
chat panel partially or fully obscured.

### Fix

| Element | Old z-index | New z-index |
|---------|-------------|-------------|
| `.vcx-cw-launcher` (FAB) | 98 | 10099 |
| `.vcx-cw-panel` | 99 | 10100 |

On mobile (`max-width: 640px`), the dock and floating-contact-dock are
hidden via `body.vcx-cw-panel-open` class (toggled by JS on
panel open/close) to eliminate visual overlap entirely.

---

## 2. Safe-Area Insets (CRITICAL on iPhone X+)

### Problem

The chat widget CSS had zero `env(safe-area-inset-bottom)` references.
On iPhone X and later (with home indicator bar), the input bar and FAB
were obscured behind the system UI.

### Fix

| Selector | Property | Value |
|----------|----------|-------|
| `.vcx-cw-launcher` (mobile) | `bottom` | `calc(16px + env(safe-area-inset-bottom, 0px))` |
| `.vcx-cw-panel` (mobile) | `height` | `calc(100dvh - 70px - env(safe-area-inset-bottom, 0px))` |
| `.vcx-cw-input-bar` (mobile) | `padding-bottom` | `calc(12px + env(safe-area-inset-bottom, 0px))` |
| `.vcx-cw-panel` (all) | `padding-bottom` | `env(safe-area-inset-bottom, 0px)` via `@supports` |
| `.assistant-chat-shell` (mobile) | `padding-bottom` | `calc(24px + env(safe-area-inset-bottom, 0px))` |

---

## 3. Touch Targets (WCAG 2.5.5 -- 44px minimum)

### Problem

Multiple interactive elements were below the 44px minimum:

| Element | Old size | Status |
|---------|----------|--------|
| Send button | 34x34px | FAIL |
| Attach button | ~28px | FAIL |
| Camera button | ~28px | FAIL |
| Close button | ~24px | FAIL |
| Suggestion chips | ~26px height | FAIL |

### Fix

| Element | New min-size | Method |
|---------|-------------|--------|
| `.vcx-cw-btn-send` | 44x44px | `min-width/min-height: 44px; width/height: 44px` |
| `.vcx-cw-btn-attach` | 44x44px | `min-width/min-height: 44px; padding: 8px` |
| `.vcx-cw-btn-camera` | 44x44px | `min-width/min-height: 44px; padding: 8px` |
| `.vcx-cw-header-close` | 44x44px | `min-width/min-height: 44px; padding: 8px` |
| `.vcx-cw-suggestion` | 44px height | `min-height: 44px; padding: 10px 14px` |
| `.topic-chip, .suggestion-chip` (mobile) | 44px height | `min-height: 44px; padding: 10px 16px` |
| `.la-escalation-link` (mobile) | 44px height | `min-height: 44px; padding: 12px 14px` |
| `.la-intake-cta-btn` (mobile) | 44px height | `min-height: 44px; padding: 12px 20px` |

All buttons also received `-webkit-tap-highlight-color: transparent`
for clean iOS tap feedback.

---

## 4. Scroll Containment

### Problem

On iOS, scrolling inside the chat messages area could propagate to the
page body, causing the entire page to rubber-band scroll behind the
chat panel. Long messages could also cause horizontal overflow.

### Fix

| Selector | Properties Added |
|----------|-----------------|
| `.vcx-cw-messages` | `overflow-x: hidden; -webkit-overflow-scrolling: touch; overscroll-behavior: contain` |
| `.vcx-cw-panel` | `overscroll-behavior: contain` |
| `.vcx-cw-bubble` | `overflow-wrap: anywhere` |
| `.assistant-messages` | `overflow-x: hidden; -webkit-overflow-scrolling: touch; overscroll-behavior: contain` |
| `body.vcx-cw-panel-open` (mobile) | `overflow: hidden` (prevents body scroll) |

---

## 5. iOS Keyboard / Input Zoom Prevention

### Problem

iOS Safari zooms the viewport when focusing on an input field with
font-size below 16px.

### Fix

| Selector (mobile) | Property |
|--------------------|----------|
| `.vcx-cw-input` | `font-size: 16px` (already present from prior work) |
| `.assistant-form input, .assistant-form textarea` | `font-size: 16px` (added this session) |

---

## 6. Mobile Panel Height

### Change

Mobile panel now uses `100dvh` (dynamic viewport height) with
safe-area subtraction:

```css
height: calc(100dvh - 70px - env(safe-area-inset-bottom, 0px));
```

The `70px` accounts for the site header. Fallback for older browsers:
```css
height: calc(100vh - 70px);
```

Legal assistant messages area uses `calc(100dvh - 320px)` to adapt
to smaller screens.

---

## 7. Legal Assistant Upload Buttons (Phase 10)

### Addition

Added attach (paperclip) and camera buttons to the legal assistant
form actions area, with 44px minimum touch targets on mobile:

```css
.la-attach-btn {
  min-width: 44px;
  min-height: 44px;
  ...
}
```

Mobile breakpoint at 640px ensures the buttons enlarge to meet
WCAG 2.5.5 requirements.

---

## Files Modified

| File | Phase 8 Changes | Phase 10 Changes |
|------|----------------|-----------------|
| `assets/css/vcx-chat-launcher.css` | z-index 10099/10100, safe-area, 44px targets, overscroll, body.vcx-cw-panel-open | -- |
| `assets/css/vcx-legal-assistant.css` | Scroll containment, mobile breakpoint, iOS zoom, safe-area | Upload buttons 44px, typing animation, status bar |
| `assets/js/vcx-chat-launcher.js` | `body.vcx-cw-panel-open` class toggle | -- |
| `assets/js/vcx-legal-assistant.js` | -- | File upload handling with mobile camera support |
| `app/legal-assistant/index.html` | -- | Attach/camera buttons, file inputs, backend status element |

---

## Test Checklist

- [ ] Open chat widget on iPhone X+ -- FAB clears home indicator
- [ ] Open chat panel -- panel clears safe area, input bar fully visible
- [ ] Type a message -- no viewport zoom on input focus
- [ ] Scroll messages -- no body rubber-band bleed-through
- [ ] Long message with no spaces -- wraps correctly, no horizontal scroll
- [ ] Tap send button -- 44px target, no mis-tap
- [ ] Tap attach/camera -- 44px target, no mis-tap
- [ ] Tap suggestion chip -- 44px target
- [ ] Open panel on mobile -- dock and floating-contact-dock hidden
- [ ] Close panel on mobile -- dock reappears, body scrollable again
- [ ] Legal assistant page on mobile -- form inputs don't zoom, chips 44px
- [ ] Rotate device -- panel adapts, no layout break
- [ ] Legal assistant attach button -- 44px, opens file picker on tap
- [ ] Legal assistant camera button -- 44px, opens camera on mobile
- [ ] Upload a file on legal assistant page -- status bar shows, message appears
- [ ] Upload invalid file type -- visible error in status bar
- [ ] Upload oversized file -- visible error in status bar
- [ ] Backend status dot visible in assistant meta row on mobile
- [ ] Typing indicator appears and disappears correctly
