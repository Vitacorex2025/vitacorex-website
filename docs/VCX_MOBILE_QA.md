# VCX Mobile / iPhone QA Report (v2)

> Generated 2026-04-03 | Final regression pass
> Scope: Floating chat widget, legal assistant, contract generator on mobile
> Covers: Phases 8-11 cumulative mobile verification

---

## Chat Widget (vcx-chat-launcher)

### Z-Index Layering

| Element | Z-Index | Status |
|---------|---------|--------|
| vcx-header | 120 | PASS (below chat) |
| vcx-dock | 110 | PASS (below chat) |
| Chat FAB | 10099 | PASS |
| Chat panel | 10100 | PASS (above FAB) |

### Safe-Area

| Element | Property | Value | Status |
|---------|----------|-------|--------|
| FAB | bottom | calc(16px + env(safe-area-inset-bottom, 0px)) | PASS |
| Panel | height | calc(100dvh - 70px - env(safe-area-inset-bottom, 0px)) | PASS |
| Input bar | padding-bottom | calc(12px + env(safe-area-inset-bottom, 0px)) | PASS |

### Touch Targets (WCAG 2.5.5: 44px minimum)

| Element | Min Size | Status |
|---------|----------|--------|
| Close button | 44x44px | PASS |
| Attach button | 44x44px | PASS |
| Camera button | 44x44px | PASS |
| Send button | 44x44px | PASS |
| Suggestion chips | 44px height | PASS |

### Scroll Behavior

| Check | Status | Evidence |
|-------|--------|----------|
| Panel overscroll-behavior: contain | PASS | Line 78 |
| Messages overscroll-behavior: contain | PASS | Line 169 |
| Body scroll lock when panel open | PASS | .vcx-cw-panel-open { overflow: hidden } |
| Dock hidden when panel open | PASS | CSS rule verified |

### iOS Specifics

| Check | Status | Evidence |
|-------|--------|----------|
| Input font-size >= 16px (zoom prevention) | PASS | Line 626 |
| -webkit-tap-highlight-color: transparent | PASS | Applied to interactive elements |
| Panel uses 100dvh (dynamic viewport) | PASS | Line 611 |

---

## Legal Assistant Page (app/legal-assistant/)

### Phase 10 Additions

| Feature | Status | Evidence |
|---------|--------|----------|
| Backend status dot (green/red) | PASS | HTML line 105, CSS lines 317-340 |
| Attach button (44px) | PASS | HTML line 121, CSS lines 344-360 |
| Camera button (44px) | PASS | HTML line 122, capture="environment" |
| Hidden file inputs | PASS | HTML lines 125-126 |
| Upload status container | PASS | HTML line 127 |
| Session persistence (sessionStorage) | PASS | JS lines 32-51 |
| Typing indicator (animated dots) | PASS | JS lines 161-173, CSS @keyframes |
| Backend health check (30s interval) | PASS | JS lines 402-419 |
| File validation (ext, size, empty) | PASS | JS lines 422-473 |

### Mobile Breakpoint (640px)

| Check | Status |
|-------|--------|
| All touch targets >= 44px | PASS |
| Single-column layout | PASS |
| safe-area padding on shell | PASS |
| Upload buttons accessible | PASS |

---

## Contract Review Desk (app/vcx-contract-review/)

### Phase 11 Additions — Mobile

| Feature | Status | Evidence |
|---------|--------|----------|
| Mode tabs 44px on mobile | PASS | CSS @media 640px rule |
| Type cards 44px on mobile | PASS | CSS @media 640px rule |
| Generate/back buttons 44px | PASS | CSS @media 640px rule |
| Download button 44px | PASS | CSS @media 640px rule |
| Form grid collapses to 1-col | PASS | @media 640px .cr-gen-fields |
| Input font-size 16px (iOS zoom) | PASS | @media 640px rule, line 300 |
| Loading spinner visible | PASS | .cr-gen-submit--loading CSS |

---

## Mobile Test Checklist

| # | Test | Status |
|---|------|--------|
| 1 | Page loads without horizontal scroll | PASS |
| 2 | Chat FAB visible in bottom-right | PASS |
| 3 | Tapping FAB opens chat panel | PASS |
| 4 | Panel covers full viewport (minus safe-area) | PASS |
| 5 | Scrolling messages does not scroll page | PASS |
| 6 | Typing in input does not trigger iOS zoom | PASS |
| 7 | Close button dismisses panel | PASS |
| 8 | Re-opening panel restores session | PASS |
| 9 | Attach button opens file picker | PASS |
| 10 | Camera button opens camera (mobile) | PASS |
| 11 | Invalid file type shows error | PASS |
| 12 | Oversized file (>25MB) shows error | PASS |
| 13 | Legal assistant page loads cleanly | PASS |
| 14 | Legal assistant backend dot visible | PASS |
| 15 | Legal assistant attach/camera buttons usable | PASS |
| 16 | Legal assistant session survives refresh | PASS |
| 17 | Contract Review mode tabs tappable | PASS |
| 18 | Contract type cards tappable | PASS |
| 19 | Generator form single-column on mobile | PASS |
| 20 | Generate button loading spinner shows | PASS |
| 21 | Download button tappable (44px) | PASS |
| 22 | "Generate Another" resets to picker | PASS |
| 23 | Analyzer upload zone usable on mobile | PASS |
| 24 | Recovery Pilot wizard navigates on mobile | PASS |
| 25 | Packet Room auth gate usable on mobile | PASS |

---

## Verdict

All mobile/iPhone checks pass. No regressions from Phase 10 or Phase 11.
Safe-area, touch targets, scroll containment, and iOS zoom prevention all verified.
