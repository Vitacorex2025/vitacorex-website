# Codex Output: Master Audit (v2)

> Task: Full truth-based technical audit of vitacorex_RELEASE_v284
> Method: Every file in every subsystem read from disk. Zero trust in prior reports.
> Date: 2026-04-03
> Branch: codex/phase2-safe-realign
> Supersedes: _codex_master_audit.md v1 (contained stale claims)

## Deliverable

`docs/VCX_MASTER_AUDIT.md` (v2)

## PLATFORM NOTE

This repository contains NO native mobile app code. No Swift, Kotlin,
React Native, or Flutter. All "mobile" refers to responsive / PWA web
targeting iPhone Safari mobile web.

## Key Corrections to Prior Reports

| Prior claim | Actual truth |
|-------------|-------------|
| Backend BROKEN | Backend COMPLETE (33 endpoints, 17 tables, all real code) |
| Contract generator zero frontend UI | Frontend fully built (tab switching, type picker, questionnaire, DOCX download) |
| Mobile/iPhone is PARTIAL with issues | Mobile COMPLETE (safe-area, 44px targets, z-index 10099/10100, overscroll, iOS zoom prevention) |
| No mention of mojibake | CRITICAL: index.html RU/ES i18n completely corrupted on line 9 |
| No mention of session loss | Legal assistant page loses all chat on page refresh (no sessionStorage) |

## Classification Summary

| Subsystem | Status |
|-----------|--------|
| Shell / Visual Freeze | PARTIAL (site.js violated, 4 other frozen files clean) |
| i18n / Encoding | BROKEN (index.html mojibake on homepage) |
| Mobile Web / iPhone | COMPLETE |
| Chat Launcher Widget | COMPLETE (708 lines, message send, file upload, session persistence) |
| Legal Assistant Chat | COMPLETE (3 endpoints, escalation, convert-to-intake) |
| VCX Intake OS | PARTIAL (landing page static, form on separate page) |
| Contract Review Desk | COMPLETE (analyze + generate modes) |
| Recovery Pilot Studio | COMPLETE (5-step wizard, 4 API calls) |
| Packet Room / Portal | PARTIAL (no upload UI, no chronology, no export) |
| Contract Generator | COMPLETE (4 types, 24 clauses, DOCX output, 3-layer disclaimers) |
| Backend | COMPLETE (8 routers, 33 endpoints, 17 tables) |
| Security | FAILING (2 CRITICAL, 4 HIGH, 5 MEDIUM -- all pre-existing) |

## Security Findings

- CRITICAL: Hardcoded admin token `vcx-dev-admin-token-2026` in .env
- CRITICAL: Real email address committed in .env
- HIGH: No auth on 6 contract endpoints (unauthenticated disk writes)
- HIGH: No auth on 4 recovery pilot endpoints
- HIGH: No auth on chat file upload
- HIGH: Dev magic link leaks session token when SMTP not configured
- MEDIUM: Fallback "change-me" admin tokens if env var unset
- MEDIUM: Magic link tokens never expire
- MEDIUM: No HTTPS enforcement
- MEDIUM: f-string SQL pattern in review.py (low actual risk)
- MEDIUM: Packet export stub returns 501

## Top 5 Fixes (Priority Order)

1. Fix index.html line 9 mojibake (re-encode RU/ES i18n as proper UTF-8)
2. pip install -r requirements.txt on target server
3. Replace hardcoded admin token in .env with strong random value
4. Gate dev magic link behind VCX_DEV_MODE flag
5. Extract VCX_IntakeAPI hook from site.js into vcx-intake-api.js (restore frozen file)

## Production Verdict

**NOT READY FOR PRODUCTION. READY FOR STAGING after fixing items 1-4.**

Full 5-phase repair plan with day-by-day schedule in docs/VCX_MASTER_AUDIT.md section 21.
