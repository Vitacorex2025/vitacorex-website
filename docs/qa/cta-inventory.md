---
title: CTA Inventory — VitaCoreX Site
generated: 2026-04-19
generator: scripts/audit-ctas.js (P17 Step 17.1)
governs: Phases/P17 Broken Buttons and CTA Audit.md
consumed_by: scripts/verify-cta-targets.js (Step 17.2)
idempotent: true
---

# CTA Inventory — VitaCoreX Site

> **This file is machine-generated.** Do not hand-edit — regenerate via `node scripts/audit-ctas.js`. Re-running on an unchanged repo produces byte-identical output.

## Summary

- **Total interactive elements**: 2804
- **Files audited**: 76
- **Unclassified rows (must be 0)**: 0

### By category

| Category | Count |
|----------|-------|
| primary-nav | 930 |
| footer | 862 |
| in-body | 317 |
| form-submit | 67 |
| external | 141 |
| mailto | 7 |
| tel | 63 |
| anchor | 56 |
| action-script | 361 |

### By audience

| Audience | Count |
|----------|-------|
| b2b | 1081 |
| b2c | 517 |
| shared | 1206 |

### By file (top 30 by CTA count)

| File | CTAs |
|------|------|
| `index.html` | 85 |
| `additional-services.html` | 63 |
| `privacy-policy.html` | 59 |
| `revenue-recovery-workflow.html` | 56 |
| `sample-deliverable.html` | 55 |
| `terms-of-use.html` | 55 |
| `app/private-lookup/index.html` | 54 |
| `structured-case-intake.html` | 54 |
| `florida-small-claims-help.html` | 53 |
| `solutions.html` | 53 |
| `contract-review-service.html` | 52 |
| `corporate-legal-file-control.html` | 52 |
| `immigration-packet-review.html` | 52 |
| `secure-coordination.html` | 52 |
| `app/vcx-recovery-pilot/index.html` | 51 |
| `auto-deal-review.html` | 51 |
| `pre-collection-pilot.html` | 51 |
| `app/legal-assistant/index.html` | 50 |
| `revenue-recovery-florida.html` | 49 |
| `security-and-compliance.html` | 49 |
| `small-claims-documentation.html` | 49 |
| `about.html` | 48 |
| `contact.html` | 48 |
| `app/vcx-contract-review/index.html` | 47 |
| `case-study-fleet-logistics.html` | 47 |
| `case-study-subscription-saas.html` | 47 |
| `partners.html` | 47 |
| `resources.html` | 47 |
| `i-130-petition.html` | 46 |
| `i-485-adjustment.html` | 46 |

## Full inventory

| File | Line | Element | Label | Target | Category | Audience | Flags |
|------|------|---------|-------|--------|----------|----------|-------|
| `404.html` | 142 | a | Go to Homepage | `/` | in-body | shared | — |
| `404.html` | 143 | a | Contact Us | `/contact.html` | in-body | shared | — |
| `404.html` | 144 | a | Our Solutions | `/solutions.html` | in-body | shared | — |
| `404.html` | 150 | a | Revenue Recovery | `/revenue-recovery-workflow.html` | in-body | shared | — |
| `404.html` | 154 | a | Legal File Control | `/corporate-legal-file-control.html` | in-body | shared | — |
| `404.html` | 158 | a | Immigration Services | `/immigration-documents.html` | in-body | shared | — |
| `404.html` | 162 | a | Company Formation | `/additional-services.html` | in-body | shared | — |
| `404.html` | 166 | a | Auto Deal Review | `/auto-purchase.html` | in-body | shared | — |
| `404.html` | 170 | a | Contract Scanner | `/contracts.html` | in-body | shared | — |
| `404.html` | 174 | a | Industries Served | `/industries.html` | in-body | shared | — |
| `404.html` | 178 | a | About VitaCoreX | `/about.html` | in-body | shared | — |
| `about.html` | 63 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `about.html` | 85 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `about.html` | 85 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `about.html` | 85 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `about.html` | 88 | a | Home | `index.html` | primary-nav | shared | — |
| `about.html` | 88 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `about.html` | 88 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `about.html` | 88 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `about.html` | 88 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `about.html` | 88 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `about.html` | 88 | a | Careers | `careers.html` | primary-nav | shared | — |
| `about.html` | 88 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `about.html` | 101 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `about.html` | 101 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `about.html` | 101 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `about.html` | 103 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `about.html` | 113 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `about.html` | 118 | a | Home | `index.html` | primary-nav | shared | — |
| `about.html` | 118 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `about.html` | 118 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `about.html` | 118 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `about.html` | 118 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `about.html` | 118 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `about.html` | 118 | a | Careers | `careers.html` | primary-nav | shared | — |
| `about.html` | 118 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `about.html` | 213 | a | View Steven Miller on LinkedIn | `https://www.linkedin.com/in/steven-miller-ab17783a5/` | external | shared | new-tab |
| `about.html` | 217 | a | Email founder directly | `mailto:stevenmiller@vitacorexllc.com` | mailto | shared | — |
| `about.html` | 220 | a | Request consultation | `contact.html` | in-body | shared | — |
| `about.html` | 252 | a | stevenmiller@vitacorexllc.com | `mailto:stevenmiller@vitacorexllc.com?subject=Vendor%20Onboarding%20Packet%20Request` | mailto | shared | — |
| `about.html` | 253 | a | LinkedIn | `https://www.linkedin.com/in/steven-miller-ab17783a5/` | external | shared | new-tab |
| `about.html` | 285 | a | Open structured intake | `structured-case-intake.html` | in-body | shared | — |
| `about.html` | 286 | a | Review industry fit | `industries.html` | in-body | shared | — |
| `about.html` | 297 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `about.html` | 303 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `about.html` | 304 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `about.html` | 310 | a | Home | `index.html` | footer | shared | — |
| `about.html` | 311 | a | Solutions | `solutions.html` | footer | shared | — |
| `about.html` | 312 | a | Industries | `industries.html` | footer | shared | — |
| `about.html` | 313 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `about.html` | 314 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `about.html` | 315 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `about.html` | 316 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `about.html` | 322 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `about.html` | 323 | a | Private consultation | `contact.html` | footer | shared | — |
| `about.html` | 324 | a | Careers | `careers.html` | footer | shared | — |
| `about.html` | 325 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `about.html` | 326 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `about.html` | 327 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `additional-services.html` | 35 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `additional-services.html` | 57 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `additional-services.html` | 57 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `additional-services.html` | 57 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `additional-services.html` | 60 | a | Home | `index.html` | primary-nav | b2c | — |
| `additional-services.html` | 60 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `additional-services.html` | 60 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `additional-services.html` | 60 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `additional-services.html` | 60 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `additional-services.html` | 60 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `additional-services.html` | 60 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `additional-services.html` | 60 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `additional-services.html` | 73 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `additional-services.html` | 73 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `additional-services.html` | 73 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `additional-services.html` | 75 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `additional-services.html` | 85 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `additional-services.html` | 90 | a | Home | `index.html` | primary-nav | b2c | — |
| `additional-services.html` | 90 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `additional-services.html` | 90 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `additional-services.html` | 90 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `additional-services.html` | 90 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `additional-services.html` | 90 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `additional-services.html` | 90 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `additional-services.html` | 90 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `additional-services.html` | 118 | a | See full ladder | `contract-review-service.html#pricing` | in-body | b2c | — |
| `additional-services.html` | 118 | a | Request review | `structured-case-intake.html?service=contracts` | in-body | b2c | — |
| `additional-services.html` | 118 | a | Try free scanner | `/app/contract-intelligence/` | in-body | b2c | — |
| `additional-services.html` | 135 | a | See full ladder | `immigration-packet-review.html#pricing` | in-body | b2c | — |
| `additional-services.html` | 135 | a | Request preparation | `structured-case-intake.html?service=immigration` | in-body | b2c | — |
| `additional-services.html` | 135 | a | Try free helper | `/app/immigration-forms/` | in-body | b2c | — |
| `additional-services.html` | 152 | a | See full ladder | `auto-deal-review.html#pricing` | in-body | b2c | — |
| `additional-services.html` | 152 | a | Request review | `structured-case-intake.html?service=auto` | in-body | b2c | — |
| `additional-services.html` | 152 | a | Try free calculator | `/app/dealer-contract-check/` | in-body | b2c | — |
| `additional-services.html` | 171 | a | See formation details | `llc-formation-florida.html#pricing` | in-body | b2c | — |
| `additional-services.html` | 171 | a | Request formation packet | `structured-case-intake.html?service=llc-formation` | in-body | b2c | — |
| `additional-services.html` | 187 | a | Request business plan | `structured-case-intake.html?service=business-plan` | in-body | b2c | — |
| `additional-services.html` | 203 | a | Request turnkey plan | `structured-case-intake.html?service=turnkey` | in-body | b2c | — |
| `additional-services.html` | 222 | a | Request location review | `structured-case-intake.html?service=location-analysis` | in-body | b2c | — |
| `additional-services.html` | 233 | a | Start Portal Locator | `/app/private-lookup/` | in-body | b2c | — |
| `additional-services.html` | 239 | a | Open structured intake | `structured-case-intake.html` | in-body | b2c | — |
| `additional-services.html` | 257 | a | Open review desk | `/app/vcx-contract-review/` | in-body | b2c | — |
| `additional-services.html` | 263 | a | Open assistant | `/app/legal-assistant/` | in-body | b2c | — |
| `additional-services.html` | 269 | a | Open packet room | `/app/vcx-packet-room/` | in-body | b2c | — |
| `additional-services.html` | 275 | a | Open calendar | `/app/deadline-calendar/` | in-body | b2c | — |
| `additional-services.html` | 301 | a | Review privacy policy | `privacy-policy.html` | in-body | b2c | — |
| `additional-services.html` | 302 | a | Start private intake | `structured-case-intake.html?service=private` | in-body | b2c | — |
| `additional-services.html` | 319 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `additional-services.html` | 320 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `additional-services.html` | 326 | a | Home | `index.html` | footer | b2c | — |
| `additional-services.html` | 327 | a | Solutions | `solutions.html` | footer | b2c | — |
| `additional-services.html` | 328 | a | Industries | `industries.html` | footer | b2c | — |
| `additional-services.html` | 329 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `additional-services.html` | 330 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `additional-services.html` | 331 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `additional-services.html` | 332 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `additional-services.html` | 338 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `additional-services.html` | 339 | a | Deadline Calendar | `/app/deadline-calendar/` | footer | b2c | — |
| `additional-services.html` | 340 | a | Private consultation | `contact.html` | footer | b2c | — |
| `additional-services.html` | 341 | a | Careers | `careers.html` | footer | b2c | — |
| `additional-services.html` | 342 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `additional-services.html` | 343 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `additional-services.html` | 344 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `app.html` | 42 | a | Open secure sign-in | `/app/sign-in/` | in-body | shared | — |
| `app.html` | 43 | a | Return to public review | `/contact.html` | in-body | shared | — |
| `app/contract-intelligence/index.html` | 205 | a | VitaCoreX LLC Private revenue recovery and legal-file advis… | `/index.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 225 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 226 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 227 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 228 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 229 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 230 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 231 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 232 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 235 | button | EN | `(handler)` | form-submit | shared | delegated:data-lang=en |
| `app/contract-intelligence/index.html` | 236 | button | RU | `(handler)` | form-submit | shared | delegated:data-lang=ru |
| `app/contract-intelligence/index.html` | 237 | button | ES | `(handler)` | form-submit | shared | delegated:data-lang=es |
| `app/contract-intelligence/index.html` | 243 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 247 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/contract-intelligence/index.html` | 253 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 254 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 255 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 256 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 257 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 258 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 259 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 260 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/contract-intelligence/index.html` | 263 | button | EN | `(handler)` | form-submit | shared | delegated:data-lang=en |
| `app/contract-intelligence/index.html` | 264 | button | RU | `(handler)` | form-submit | shared | delegated:data-lang=ru |
| `app/contract-intelligence/index.html` | 265 | button | ES | `(handler)` | form-submit | shared | delegated:data-lang=es |
| `app/contract-intelligence/index.html` | 277 | a | &larr; Private Client Services | `/additional-services.html` | in-body | shared | — |
| `app/contract-intelligence/index.html` | 347 | button | Analyze contract | `vcxScanContract()` | action-script | shared | — |
| `app/contract-intelligence/index.html` | 363 | form | form:vcxAdvisorForm | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | shared | POST |
| `app/contract-intelligence/index.html` | 378 | button | Submit for Advisor Review | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | shared | form-method:POST |
| `app/contract-intelligence/index.html` | 381 | a | stevenmiller@vitacorexllc.com | `mailto:stevenmiller@vitacorexllc.com` | mailto | shared | — |
| `app/contract-intelligence/index.html` | 408 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/contract-intelligence/index.html` | 409 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/deadline-calendar/index.html` | 39 | a | VitaCoreX LLCRevenue recovery and documentation infrastruct… | `/index.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 49 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/deadline-calendar/index.html` | 49 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/deadline-calendar/index.html` | 49 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/deadline-calendar/index.html` | 51 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 51 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 51 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 51 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 51 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 51 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 51 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 51 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 57 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/deadline-calendar/index.html` | 57 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/deadline-calendar/index.html` | 57 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/deadline-calendar/index.html` | 60 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 62 | button | ☰Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/deadline-calendar/index.html` | 64 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 64 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 64 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 64 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 64 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 64 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 64 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 64 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/deadline-calendar/index.html` | 83 | button | Start Calendar | `dcalRegister()` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 93 | a | &larr; Back | `javascript:void(0)` | action-script | shared | — |
| `app/deadline-calendar/index.html` | 107 | button | Install | `dcalInstallPWA()` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 112 | button | Dashboard | `dcalSwitchView('home')` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 113 | button | Calendar | `dcalSwitchView('month')` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 123 | button | &larr; | `dcalPrevFortnight()` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 125 | button | Today | `dcalGoToday()` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 126 | button | &rarr; | `dcalNextFortnight()` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 141 | button | &larr; | `dcalPrevMonth()` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 143 | button | &rarr; | `dcalNextMonth()` | form-submit | shared | — |
| `app/deadline-calendar/index.html` | 169 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/deadline-calendar/index.html` | 170 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/deadline-calendar/widget.html` | 113 | a | Open Command Center | `/app/deadline-calendar/` | in-body | shared | — |
| `app/dealer-contract-check/index.html` | 127 | a | VitaCoreX LLCPrivate revenue recovery and legal-file adviso… | `/index.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 138 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 139 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 140 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 141 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 142 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 143 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 144 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 145 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 147 | button | EN | `(handler)` | form-submit | shared | delegated:data-lang=en |
| `app/dealer-contract-check/index.html` | 147 | button | RU | `(handler)` | form-submit | shared | delegated:data-lang=ru |
| `app/dealer-contract-check/index.html` | 147 | button | ES | `(handler)` | form-submit | shared | delegated:data-lang=es |
| `app/dealer-contract-check/index.html` | 152 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 153 | button | ☰Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/dealer-contract-check/index.html` | 156 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 157 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 158 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 159 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 160 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 161 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 162 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 163 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/dealer-contract-check/index.html` | 165 | button | EN | `(handler)` | form-submit | shared | delegated:data-lang=en |
| `app/dealer-contract-check/index.html` | 165 | button | RU | `(handler)` | form-submit | shared | delegated:data-lang=ru |
| `app/dealer-contract-check/index.html` | 165 | button | ES | `(handler)` | form-submit | shared | delegated:data-lang=es |
| `app/dealer-contract-check/index.html` | 173 | a | &larr; Private Client Services | `/additional-services.html` | in-body | shared | — |
| `app/dealer-contract-check/index.html` | 246 | button | Check Deal Numbers | `vcxRunDealCheck()` | action-script | shared | — |
| `app/dealer-contract-check/index.html` | 276 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/dealer-contract-check/index.html` | 277 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/immigration-forms/index.html` | 194 | a | VitaCoreX LLCPrivate revenue recovery and legal-file adviso… | `/index.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 205 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 206 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 207 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 208 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 209 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 210 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 211 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 212 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 214 | button | EN | `(handler)` | form-submit | shared | delegated:data-lang=en |
| `app/immigration-forms/index.html` | 214 | button | RU | `(handler)` | form-submit | shared | delegated:data-lang=ru |
| `app/immigration-forms/index.html` | 214 | button | ES | `(handler)` | form-submit | shared | delegated:data-lang=es |
| `app/immigration-forms/index.html` | 219 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 220 | button | ☰Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/immigration-forms/index.html` | 223 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 224 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 225 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 226 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 227 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 228 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 229 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 230 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/immigration-forms/index.html` | 232 | button | EN | `(handler)` | form-submit | shared | delegated:data-lang=en |
| `app/immigration-forms/index.html` | 232 | button | RU | `(handler)` | form-submit | shared | delegated:data-lang=ru |
| `app/immigration-forms/index.html` | 232 | button | ES | `(handler)` | form-submit | shared | delegated:data-lang=es |
| `app/immigration-forms/index.html` | 240 | a | &larr; Private Client Services | `/additional-services.html` | in-body | shared | — |
| `app/immigration-forms/index.html` | 265 | button | 📷 Take photo | `document.getElementById('vcxFormFile').click()` | action-script | shared | — |
| `app/immigration-forms/index.html` | 266 | button | 📋 Choose file | `document.getElementById('vcxFormFile').click()` | action-script | shared | — |
| `app/immigration-forms/index.html` | 275 | button | Analyze packet | `vcxAnalyzeForm()` | action-script | shared | — |
| `app/immigration-forms/index.html` | 288 | form | form:vcxPacketForm | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | shared | POST |
| `app/immigration-forms/index.html` | 303 | button | Submit for Packet Review | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | shared | form-method:POST |
| `app/immigration-forms/index.html` | 306 | a | stevenmiller@vitacorexllc.com | `mailto:stevenmiller@vitacorexllc.com` | mailto | shared | — |
| `app/immigration-forms/index.html` | 326 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/immigration-forms/index.html` | 327 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/legal-assistant/index.html` | 26 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 48 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/legal-assistant/index.html` | 48 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/legal-assistant/index.html` | 48 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/legal-assistant/index.html` | 51 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 51 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 51 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 51 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 51 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 51 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 51 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 51 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 64 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/legal-assistant/index.html` | 64 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/legal-assistant/index.html` | 64 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/legal-assistant/index.html` | 66 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 76 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/legal-assistant/index.html` | 81 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 81 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 81 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 81 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 81 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 81 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 81 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 81 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/legal-assistant/index.html` | 88 | a | &larr; Back | `/additional-services.html` | in-body | shared | — |
| `app/legal-assistant/index.html` | 94 | form | form:chatForm | `(self)` | form-submit | shared | self-post, GET |
| `app/legal-assistant/index.html` | 98 | button | Attach file | `(handler)` | action-script | shared | form-method:GET |
| `app/legal-assistant/index.html` | 101 | button | Send | `(self)` | form-submit | shared | form-method:GET |
| `app/legal-assistant/index.html` | 109 | a | Open Structured Intake | `/structured-case-intake.html` | in-body | shared | — |
| `app/legal-assistant/index.html` | 119 | button | Contracts | `(handler)` | form-submit | shared | delegated:data-topic=contracts |
| `app/legal-assistant/index.html` | 120 | button | Immigration packets | `(handler)` | form-submit | shared | delegated:data-topic=immigration_packets |
| `app/legal-assistant/index.html` | 121 | button | Auto deal review | `(handler)` | form-submit | shared | delegated:data-topic=auto_deal_review |
| `app/legal-assistant/index.html` | 122 | button | Florida sources | `(handler)` | form-submit | shared | delegated:data-topic=florida_official_sources |
| `app/legal-assistant/index.html` | 124 | form | form:escalationForm | `(self)` | form-submit | shared | self-post, GET |
| `app/legal-assistant/index.html` | 142 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/legal-assistant/index.html` | 143 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/legal-assistant/index.html` | 149 | a | Home | `/index.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 150 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 151 | a | Industries | `/industries.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 152 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 153 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 154 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 155 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 161 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 162 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 163 | a | Careers | `/careers.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 164 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 165 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/legal-assistant/index.html` | 166 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/matter-status/index.html` | 25 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 47 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/matter-status/index.html` | 47 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/matter-status/index.html` | 47 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/matter-status/index.html` | 50 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 50 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 50 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 50 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 50 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 50 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 50 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 50 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 63 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/matter-status/index.html` | 63 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/matter-status/index.html` | 63 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/matter-status/index.html` | 65 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 75 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/matter-status/index.html` | 80 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 80 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 80 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 80 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 80 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 80 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 80 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 80 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/matter-status/index.html` | 87 | a | &larr; Back to Intake | `/structured-case-intake.html` | in-body | shared | — |
| `app/matter-status/index.html` | 106 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/matter-status/index.html` | 107 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/matter-status/index.html` | 113 | a | Home | `/index.html` | footer | shared | — |
| `app/matter-status/index.html` | 114 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/matter-status/index.html` | 115 | a | Industries | `/industries.html` | footer | shared | — |
| `app/matter-status/index.html` | 116 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/matter-status/index.html` | 117 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/matter-status/index.html` | 118 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/matter-status/index.html` | 119 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/matter-status/index.html` | 125 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/matter-status/index.html` | 126 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/matter-status/index.html` | 127 | a | Careers | `/careers.html` | footer | shared | — |
| `app/matter-status/index.html` | 128 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/matter-status/index.html` | 129 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/matter-status/index.html` | 130 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/private-lookup/index.html` | 72 | a | Skip to content | `#main` | anchor | shared | — |
| `app/private-lookup/index.html` | 79 | a | VitaCoreX LLC Private revenue recovery and legal-file advis… | `/index.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 99 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 100 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 101 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 102 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 103 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 104 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 105 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 106 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 113 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 117 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/private-lookup/index.html` | 123 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 124 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 125 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 126 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 127 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 128 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 129 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 130 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 143 | a | &larr; Private Client Services | `/additional-services.html` | in-body | shared | — |
| `app/private-lookup/index.html` | 145 | a | Home | `/` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 146 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/private-lookup/index.html` | 178 | button | Start Portal Locator | `(handler)` | action-script | shared | delegated:data-tx=gate_btn |
| `app/private-lookup/index.html` | 196 | a | &larr; Back to overview | `/app/private-lookup/index.html` | in-body | shared | — |
| `app/private-lookup/index.html` | 208 | button | Toll Portals | `(handler)` | form-submit | shared | delegated:data-tab=tolls,data-tx=tab_tolls |
| `app/private-lookup/index.html` | 211 | button | Traffic / Fines | `(handler)` | form-submit | shared | delegated:data-tab=traffic,data-tx=tab_traffic |
| `app/private-lookup/index.html` | 214 | button | Court Cases | `(handler)` | form-submit | shared | delegated:data-tab=courts,data-tx=tab_courts |
| `app/private-lookup/index.html` | 221 | form | form:vcx-form-tolls | `(self)` | form-submit | shared | self-post, GET |
| `app/private-lookup/index.html` | 248 | button | Show Official Toll Portals Routing… | `(self)` | form-submit | shared | form-method:GET |
| `app/private-lookup/index.html` | 257 | form | form:vcx-form-traffic | `(self)` | form-submit | shared | self-post, GET |
| `app/private-lookup/index.html` | 303 | button | Find County Clerk Portal Routing… | `(self)` | form-submit | shared | form-method:GET |
| `app/private-lookup/index.html` | 312 | form | form:vcx-form-courts | `(self)` | form-submit | shared | self-post, GET |
| `app/private-lookup/index.html` | 348 | button | Show Court Record Portals Routing… | `(self)` | form-submit | shared | form-method:GET |
| `app/private-lookup/index.html` | 359 | button | New Route | `(handler)` | action-script | shared | no-handler |
| `app/private-lookup/index.html` | 400 | a | Call private line | `tel:+18887948292` | tel | shared | — |
| `app/private-lookup/index.html` | 401 | a | Book consultation | `https://calendly.com/vitacorex2025/30min` | external | shared | new-tab |
| `app/private-lookup/index.html` | 404 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/private-lookup/index.html` | 405 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/private-lookup/index.html` | 411 | a | Revenue recovery infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/private-lookup/index.html` | 412 | a | Corporate legal file control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/private-lookup/index.html` | 413 | a | Structured intake and packet design | `/structured-case-intake.html` | footer | shared | — |
| `app/private-lookup/index.html` | 419 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/private-lookup/index.html` | 420 | a | Industries | `/industries.html` | footer | shared | — |
| `app/private-lookup/index.html` | 421 | a | Proof | `/resources.html` | footer | shared | — |
| `app/private-lookup/index.html` | 422 | a | Request confidential review | `/contact.html` | footer | shared | — |
| `app/private-lookup/index.html` | 423 | a | About | `/about.html` | footer | shared | — |
| `app/private-lookup/index.html` | 429 | a | Private Client Services | `/additional-services.html` | footer | shared | — |
| `app/private-lookup/index.html` | 430 | a | Careers | `/careers.html` | footer | shared | — |
| `app/private-lookup/index.html` | 431 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/private-lookup/index.html` | 432 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/private-lookup/index.html` | 433 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/private-lookup/index.html` | 449 | button | (no label) | `(handler)` | action-script | shared | no-handler |
| `app/private-lookup/index.html` | 450 | button | (no label) | `(handler)` | action-script | shared | no-handler |
| `app/review/index.html` | 23 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/review/index.html` | 45 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/review/index.html` | 45 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/review/index.html` | 45 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/review/index.html` | 48 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/review/index.html` | 48 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/review/index.html` | 48 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/review/index.html` | 48 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/review/index.html` | 48 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/review/index.html` | 48 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/review/index.html` | 48 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/review/index.html` | 48 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/review/index.html` | 61 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/review/index.html` | 61 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/review/index.html` | 61 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/review/index.html` | 63 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/review/index.html` | 73 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/review/index.html` | 78 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/review/index.html` | 78 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/review/index.html` | 78 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/review/index.html` | 78 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/review/index.html` | 78 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/review/index.html` | 78 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/review/index.html` | 78 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/review/index.html` | 78 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/review/index.html` | 86 | a | &larr; Home | `/index.html` | in-body | shared | — |
| `app/review/index.html` | 92 | form | form:rqAuthForm | `(self)` | form-submit | shared | self-post, GET |
| `app/review/index.html` | 97 | button | Authenticate | `(self)` | form-submit | shared | form-method:GET |
| `app/review/index.html` | 119 | button | Refresh | `(handler)` | form-submit | shared | no-handler |
| `app/review/index.html` | 144 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/review/index.html` | 145 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/review/index.html` | 151 | a | Home | `/index.html` | footer | shared | — |
| `app/review/index.html` | 152 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/review/index.html` | 153 | a | Industries | `/industries.html` | footer | shared | — |
| `app/review/index.html` | 154 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/review/index.html` | 155 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/review/index.html` | 156 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/review/index.html` | 157 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/review/index.html` | 163 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/review/index.html` | 164 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/review/index.html` | 165 | a | Careers | `/careers.html` | footer | shared | — |
| `app/review/index.html` | 166 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/review/index.html` | 167 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/review/index.html` | 168 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/sign-in/index.html` | 23 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 45 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/sign-in/index.html` | 45 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/sign-in/index.html` | 45 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/sign-in/index.html` | 48 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 48 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 48 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 48 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 48 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 48 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 48 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 48 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 61 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/sign-in/index.html` | 61 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/sign-in/index.html` | 61 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/sign-in/index.html` | 63 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 73 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/sign-in/index.html` | 78 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 78 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 78 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 78 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 78 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 78 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 78 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 78 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/sign-in/index.html` | 86 | a | &larr; Home | `/index.html` | in-body | shared | — |
| `app/sign-in/index.html` | 92 | form | form:vcxSignInForm | `(self)` | form-submit | shared | self-post, GET |
| `app/sign-in/index.html` | 95 | button | Send Access Link | `(self)` | form-submit | shared | form-method:GET |
| `app/sign-in/index.html` | 103 | a | Open Packet Room | `/app/vcx-packet-room/` | in-body | shared | — |
| `app/sign-in/index.html` | 105 | a | Start Structured Intake | `/structured-case-intake.html` | in-body | shared | — |
| `app/sign-in/index.html` | 125 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/sign-in/index.html` | 126 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/sign-in/index.html` | 132 | a | Home | `/index.html` | footer | shared | — |
| `app/sign-in/index.html` | 133 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/sign-in/index.html` | 134 | a | Industries | `/industries.html` | footer | shared | — |
| `app/sign-in/index.html` | 135 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/sign-in/index.html` | 136 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/sign-in/index.html` | 137 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/sign-in/index.html` | 138 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/sign-in/index.html` | 144 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/sign-in/index.html` | 145 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/sign-in/index.html` | 146 | a | Careers | `/careers.html` | footer | shared | — |
| `app/sign-in/index.html` | 147 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/sign-in/index.html` | 148 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/sign-in/index.html` | 149 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 26 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 48 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-contract-review/index.html` | 48 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-contract-review/index.html` | 48 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-contract-review/index.html` | 51 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 51 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 51 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 51 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 51 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 51 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 51 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 51 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 64 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-contract-review/index.html` | 64 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-contract-review/index.html` | 64 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-contract-review/index.html` | 66 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 76 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/vcx-contract-review/index.html` | 81 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 81 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 81 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 81 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 81 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 81 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 81 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 81 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-contract-review/index.html` | 89 | a | &larr; Private Client Services | `/additional-services.html` | in-body | shared | — |
| `app/vcx-contract-review/index.html` | 119 | button | Analyze Existing Contract | `(handler)` | action-script | shared | delegated:data-mode=analyze |
| `app/vcx-contract-review/index.html` | 120 | button | Generate New Contract | `(handler)` | action-script | shared | delegated:data-mode=generate |
| `app/vcx-contract-review/index.html` | 129 | button | Analyze Contract | `(handler)` | action-script | shared | no-handler |
| `app/vcx-contract-review/index.html` | 165 | form | form:vcxGenForm | `(self)` | form-submit | shared | self-post, GET |
| `app/vcx-contract-review/index.html` | 168 | button | Generate Contract | `(self)` | form-submit | shared | form-method:GET |
| `app/vcx-contract-review/index.html` | 169 | button | Change Type | `(handler)` | action-script | shared | form-method:GET |
| `app/vcx-contract-review/index.html` | 194 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/vcx-contract-review/index.html` | 195 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/vcx-contract-review/index.html` | 201 | a | Home | `/index.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 202 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 203 | a | Industries | `/industries.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 204 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 205 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 206 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 207 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 213 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 214 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 215 | a | Careers | `/careers.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 216 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 217 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/vcx-contract-review/index.html` | 218 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 26 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 48 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-intake/index.html` | 48 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-intake/index.html` | 48 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-intake/index.html` | 51 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 51 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 51 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 51 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 51 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 51 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 51 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 51 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 64 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-intake/index.html` | 64 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-intake/index.html` | 64 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-intake/index.html` | 66 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 76 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/vcx-intake/index.html` | 81 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 81 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 81 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 81 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 81 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 81 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 81 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 81 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-intake/index.html` | 88 | a | &larr; Back to Intake | `/structured-case-intake.html` | in-body | shared | — |
| `app/vcx-intake/index.html` | 100 | a | Begin Intake &rarr; | `/structured-case-intake.html` | in-body | shared | — |
| `app/vcx-intake/index.html` | 132 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/vcx-intake/index.html` | 133 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/vcx-intake/index.html` | 139 | a | Home | `/index.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 140 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 141 | a | Industries | `/industries.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 142 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 143 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 144 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 145 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 151 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 152 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 153 | a | Careers | `/careers.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 154 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 155 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/vcx-intake/index.html` | 156 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 25 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 47 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-packet-room/index.html` | 47 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-packet-room/index.html` | 47 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-packet-room/index.html` | 50 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 50 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 50 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 50 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 50 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 50 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 50 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 50 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 63 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-packet-room/index.html` | 63 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-packet-room/index.html` | 63 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-packet-room/index.html` | 65 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 75 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/vcx-packet-room/index.html` | 80 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 80 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 80 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 80 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 80 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 80 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 80 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 80 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-packet-room/index.html` | 88 | a | &larr; Home | `/index.html` | in-body | shared | — |
| `app/vcx-packet-room/index.html` | 96 | button | Access Portal | `(handler)` | action-script | shared | no-handler |
| `app/vcx-packet-room/index.html` | 151 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/vcx-packet-room/index.html` | 152 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/vcx-packet-room/index.html` | 158 | a | Home | `/index.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 159 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 160 | a | Industries | `/industries.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 161 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 162 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 163 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 164 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 170 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 171 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 172 | a | Careers | `/careers.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 173 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 174 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/vcx-packet-room/index.html` | 175 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 26 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 48 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-recovery-pilot/index.html` | 48 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-recovery-pilot/index.html` | 48 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 51 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 64 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `app/vcx-recovery-pilot/index.html` | 64 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `app/vcx-recovery-pilot/index.html` | 64 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `app/vcx-recovery-pilot/index.html` | 66 | a | VitaCoreX | `/index.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 76 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Home | `/index.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Private Client Services | `/additional-services.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Careers | `/careers.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 81 | a | Private Consultation | `/contact.html` | primary-nav | shared | — |
| `app/vcx-recovery-pilot/index.html` | 106 | form | form:vcxPilotStep1 | `(self)` | form-submit | shared | self-post, GET |
| `app/vcx-recovery-pilot/index.html` | 123 | button | Next: Revenue Baseline &rarr; | `(handler)` | action-script | shared | form-method:GET |
| `app/vcx-recovery-pilot/index.html` | 129 | form | form:vcxPilotStep2 | `(self)` | form-submit | shared | self-post, GET |
| `app/vcx-recovery-pilot/index.html` | 146 | button | &larr; Back | `(handler)` | action-script | shared | form-method:GET |
| `app/vcx-recovery-pilot/index.html` | 147 | button | Next: AR & Collections &rarr; | `(handler)` | action-script | shared | form-method:GET |
| `app/vcx-recovery-pilot/index.html` | 154 | form | form:vcxPilotStep3 | `(self)` | form-submit | shared | self-post, GET |
| `app/vcx-recovery-pilot/index.html` | 171 | button | &larr; Back | `(handler)` | action-script | shared | form-method:GET |
| `app/vcx-recovery-pilot/index.html` | 172 | button | Generate Analysis &rarr; | `(handler)` | action-script | shared | form-method:GET |
| `app/vcx-recovery-pilot/index.html` | 183 | button | &larr; Back | `(handler)` | action-script | shared | delegated:data-prev=3 |
| `app/vcx-recovery-pilot/index.html` | 184 | button | View Executive Brief &rarr; | `(handler)` | action-script | shared | delegated:data-next=5 |
| `app/vcx-recovery-pilot/index.html` | 194 | button | &larr; Back to Analysis | `(handler)` | action-script | shared | delegated:data-prev=4 |
| `app/vcx-recovery-pilot/index.html` | 220 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `app/vcx-recovery-pilot/index.html` | 221 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `app/vcx-recovery-pilot/index.html` | 227 | a | Home | `/index.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 228 | a | Solutions | `/solutions.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 229 | a | Industries | `/industries.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 230 | a | About VitaCoreX | `/about.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 231 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 232 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 233 | a | Executive Briefs & Proof | `/resources.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 239 | a | Structured Case Intake | `/structured-case-intake.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 240 | a | Private consultation | `/contact.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 241 | a | Careers | `/careers.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 242 | a | Privacy Policy | `/privacy-policy.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 243 | a | Terms of Use | `/terms-of-use.html` | footer | shared | — |
| `app/vcx-recovery-pilot/index.html` | 244 | a | Cookie Policy | `/cookie-policy.html` | footer | shared | — |
| `auto-deal-review.html` | 111 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 133 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `auto-deal-review.html` | 133 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `auto-deal-review.html` | 133 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `auto-deal-review.html` | 136 | a | Home | `index.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 136 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 136 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 136 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 136 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 136 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 136 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 136 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 149 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `auto-deal-review.html` | 149 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `auto-deal-review.html` | 149 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `auto-deal-review.html` | 151 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 161 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `auto-deal-review.html` | 166 | a | Home | `index.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 166 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 166 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 166 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 166 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 166 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 166 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 166 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `auto-deal-review.html` | 185 | a | Send me the contract | `structured-case-intake.html?tier=auto` | in-body | b2c | — |
| `auto-deal-review.html` | 186 | a | See review pricing | `#pricing` | anchor | b2c | — |
| `auto-deal-review.html` | 240 | a | Order quick review | `structured-case-intake.html?tier=auto-basic` | in-body | b2c | — |
| `auto-deal-review.html` | 256 | a | Order full breakdown | `structured-case-intake.html?tier=auto-full` | in-body | b2c | — |
| `auto-deal-review.html` | 374 | a | Start my review | `structured-case-intake.html?tier=auto` | in-body | b2c | — |
| `auto-deal-review.html` | 375 | a | Talk to us first | `contact.html` | in-body | b2c | — |
| `auto-deal-review.html` | 389 | a | See the sample | `samples/auto-deal-cost-breakdown.html` | in-body | b2c | — |
| `auto-deal-review.html` | 389 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2c | — |
| `auto-deal-review.html` | 397 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `auto-deal-review.html` | 403 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `auto-deal-review.html` | 404 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `auto-deal-review.html` | 410 | a | Home | `index.html` | footer | b2c | — |
| `auto-deal-review.html` | 411 | a | Solutions | `solutions.html` | footer | b2c | — |
| `auto-deal-review.html` | 412 | a | Industries | `industries.html` | footer | b2c | — |
| `auto-deal-review.html` | 413 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `auto-deal-review.html` | 414 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `auto-deal-review.html` | 415 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2c | — |
| `auto-deal-review.html` | 416 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2c | — |
| `auto-deal-review.html` | 417 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `auto-deal-review.html` | 418 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `auto-deal-review.html` | 424 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `auto-deal-review.html` | 425 | a | Private consultation | `contact.html` | footer | b2c | — |
| `auto-deal-review.html` | 426 | a | Careers | `careers.html` | footer | b2c | — |
| `auto-deal-review.html` | 427 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `auto-deal-review.html` | 428 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `auto-deal-review.html` | 429 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `auto-purchase.html` | 35 | a | additional-services.html | `additional-services.html` | in-body | shared | — |
| `auto-purchase.html` | 43 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `auto-purchase.html` | 49 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `auto-purchase.html` | 50 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `auto-purchase.html` | 56 | a | Home | `index.html` | footer | shared | — |
| `auto-purchase.html` | 57 | a | Solutions | `solutions.html` | footer | shared | — |
| `auto-purchase.html` | 58 | a | Industries | `industries.html` | footer | shared | — |
| `auto-purchase.html` | 59 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `auto-purchase.html` | 60 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `auto-purchase.html` | 61 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `auto-purchase.html` | 62 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `auto-purchase.html` | 68 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `auto-purchase.html` | 69 | a | Private consultation | `contact.html` | footer | shared | — |
| `auto-purchase.html` | 70 | a | Careers | `careers.html` | footer | shared | — |
| `auto-purchase.html` | 71 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `auto-purchase.html` | 72 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `auto-purchase.html` | 73 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `business-plans.html` | 30 | a | additional-services.html | `additional-services.html` | in-body | b2c | — |
| `business-plans.html` | 38 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `business-plans.html` | 44 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `business-plans.html` | 45 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `business-plans.html` | 51 | a | Home | `index.html` | footer | b2c | — |
| `business-plans.html` | 52 | a | Solutions | `solutions.html` | footer | b2c | — |
| `business-plans.html` | 53 | a | Industries | `industries.html` | footer | b2c | — |
| `business-plans.html` | 54 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `business-plans.html` | 55 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `business-plans.html` | 56 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `business-plans.html` | 57 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `business-plans.html` | 63 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `business-plans.html` | 64 | a | Private consultation | `contact.html` | footer | b2c | — |
| `business-plans.html` | 65 | a | Careers | `careers.html` | footer | b2c | — |
| `business-plans.html` | 66 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `business-plans.html` | 67 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `business-plans.html` | 68 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `careers.html` | 25 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `careers.html` | 47 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `careers.html` | 47 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `careers.html` | 47 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `careers.html` | 50 | a | Home | `index.html` | primary-nav | shared | — |
| `careers.html` | 50 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `careers.html` | 50 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `careers.html` | 50 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `careers.html` | 50 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `careers.html` | 50 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `careers.html` | 50 | a | Careers | `careers.html` | primary-nav | shared | — |
| `careers.html` | 50 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `careers.html` | 63 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `careers.html` | 63 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `careers.html` | 63 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `careers.html` | 65 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `careers.html` | 75 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `careers.html` | 80 | a | Home | `index.html` | primary-nav | shared | — |
| `careers.html` | 80 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `careers.html` | 80 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `careers.html` | 80 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `careers.html` | 80 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `careers.html` | 80 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `careers.html` | 80 | a | Careers | `careers.html` | primary-nav | shared | — |
| `careers.html` | 80 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `careers.html` | 84 | button | Submit application | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | shared | form-method:POST |
| `careers.html` | 84 | form | form:careersForm | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | shared | POST |
| `careers.html` | 108 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `careers.html` | 114 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `careers.html` | 115 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `careers.html` | 121 | a | Home | `index.html` | footer | shared | — |
| `careers.html` | 122 | a | Solutions | `solutions.html` | footer | shared | — |
| `careers.html` | 123 | a | Industries | `industries.html` | footer | shared | — |
| `careers.html` | 124 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `careers.html` | 125 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `careers.html` | 126 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `careers.html` | 127 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `careers.html` | 133 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `careers.html` | 134 | a | Private consultation | `contact.html` | footer | shared | — |
| `careers.html` | 135 | a | Careers | `careers.html` | footer | shared | — |
| `careers.html` | 136 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `careers.html` | 137 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `careers.html` | 138 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `case-study-fleet-logistics.html` | 94 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 116 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `case-study-fleet-logistics.html` | 116 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `case-study-fleet-logistics.html` | 116 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `case-study-fleet-logistics.html` | 119 | a | Home | `index.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 119 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 119 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 119 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 119 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 119 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 119 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 119 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 132 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `case-study-fleet-logistics.html` | 132 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `case-study-fleet-logistics.html` | 132 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `case-study-fleet-logistics.html` | 134 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 144 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `case-study-fleet-logistics.html` | 149 | a | Home | `index.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 149 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 149 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 149 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 149 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 149 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 149 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 149 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `case-study-fleet-logistics.html` | 317 | a | Apply for the Pilot | `pre-collection-pilot.html` | in-body | b2b | — |
| `case-study-fleet-logistics.html` | 318 | a | See pricing | `pricing-and-engagement-tiers.html` | in-body | b2b | — |
| `case-study-fleet-logistics.html` | 330 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `case-study-fleet-logistics.html` | 336 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `case-study-fleet-logistics.html` | 337 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `case-study-fleet-logistics.html` | 343 | a | Home | `index.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 344 | a | Solutions | `solutions.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 345 | a | Industries | `industries.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 346 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 347 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 348 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 349 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 350 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 351 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 352 | a | Case Study: Healthcare Network | `case-study-healthcare-network.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 353 | a | Case Study: Fleet Logistics | `case-study-fleet-logistics.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 359 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 360 | a | Private consultation | `contact.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 361 | a | Careers | `careers.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 362 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 363 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `case-study-fleet-logistics.html` | 364 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 332 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 354 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `case-study-healthcare-network.html` | 354 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `case-study-healthcare-network.html` | 354 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `case-study-healthcare-network.html` | 357 | a | Home | `index.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 357 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 357 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 357 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 357 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 357 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 357 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 357 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 370 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `case-study-healthcare-network.html` | 370 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `case-study-healthcare-network.html` | 370 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `case-study-healthcare-network.html` | 372 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 382 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `case-study-healthcare-network.html` | 387 | a | Home | `index.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 387 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 387 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 387 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 387 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 387 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 387 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 387 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `case-study-healthcare-network.html` | 566 | a | Open structured intake | `structured-case-intake.html?source=case-healthcare` | in-body | b2b | — |
| `case-study-healthcare-network.html` | 567 | a | Review evidence standards | `index.html` | in-body | b2b | — |
| `case-study-healthcare-network.html` | 585 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `case-study-healthcare-network.html` | 586 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `case-study-healthcare-network.html` | 592 | a | Home | `index.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 593 | a | Solutions | `solutions.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 594 | a | Industries | `industries.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 595 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 596 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 597 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 598 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 599 | a | Case Study: Healthcare Network | `case-study-healthcare-network.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 605 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 606 | a | Deadline Calendar | `/app/deadline-calendar/` | footer | b2b | — |
| `case-study-healthcare-network.html` | 607 | a | Private consultation | `contact.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 608 | a | Careers | `careers.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 609 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 610 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `case-study-healthcare-network.html` | 611 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 94 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 116 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `case-study-subscription-saas.html` | 116 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `case-study-subscription-saas.html` | 116 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `case-study-subscription-saas.html` | 119 | a | Home | `index.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 119 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 119 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 119 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 119 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 119 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 119 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 119 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 132 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `case-study-subscription-saas.html` | 132 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `case-study-subscription-saas.html` | 132 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `case-study-subscription-saas.html` | 134 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 144 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `case-study-subscription-saas.html` | 149 | a | Home | `index.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 149 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 149 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 149 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 149 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 149 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 149 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 149 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `case-study-subscription-saas.html` | 317 | a | Apply for the Pilot | `pre-collection-pilot.html` | in-body | b2b | — |
| `case-study-subscription-saas.html` | 318 | a | See pricing | `pricing-and-engagement-tiers.html` | in-body | b2b | — |
| `case-study-subscription-saas.html` | 330 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `case-study-subscription-saas.html` | 336 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `case-study-subscription-saas.html` | 337 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `case-study-subscription-saas.html` | 343 | a | Home | `index.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 344 | a | Solutions | `solutions.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 345 | a | Industries | `industries.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 346 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 347 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 348 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 349 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 350 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 351 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 352 | a | Case Study: Healthcare Network | `case-study-healthcare-network.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 353 | a | Case Study: SaaS Recovery | `case-study-subscription-saas.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 359 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 360 | a | Private consultation | `contact.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 361 | a | Careers | `careers.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 362 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 363 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `case-study-subscription-saas.html` | 364 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `contact.html` | 35 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `contact.html` | 57 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `contact.html` | 57 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `contact.html` | 57 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `contact.html` | 60 | a | Home | `index.html` | primary-nav | shared | — |
| `contact.html` | 60 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `contact.html` | 60 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `contact.html` | 60 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `contact.html` | 60 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `contact.html` | 60 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `contact.html` | 60 | a | Careers | `careers.html` | primary-nav | shared | — |
| `contact.html` | 60 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `contact.html` | 73 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `contact.html` | 73 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `contact.html` | 73 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `contact.html` | 75 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `contact.html` | 85 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `contact.html` | 90 | a | Home | `index.html` | primary-nav | shared | — |
| `contact.html` | 90 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `contact.html` | 90 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `contact.html` | 90 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `contact.html` | 90 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `contact.html` | 90 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `contact.html` | 90 | a | Careers | `careers.html` | primary-nav | shared | — |
| `contact.html` | 90 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `contact.html` | 110 | a | Open structured intake | `structured-case-intake.html` | in-body | shared | — |
| `contact.html` | 120 | a | Book consultation | `https://calendly.com/vitacorex2025/30min` | external | shared | new-tab |
| `contact.html` | 136 | a | Call private line | `tel:+18887948292` | tel | shared | — |
| `contact.html` | 137 | a | Book consultation | `https://calendly.com/vitacorex2025/30min` | external | shared | new-tab |
| `contact.html` | 159 | a | About VitaCoreX | `about.html` | in-body | shared | — |
| `contact.html` | 160 | a | Privacy Policy | `privacy-policy.html` | in-body | shared | — |
| `contact.html` | 161 | a | Terms of Use | `terms-of-use.html` | in-body | shared | — |
| `contact.html` | 174 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `contact.html` | 180 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `contact.html` | 181 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `contact.html` | 187 | a | Home | `index.html` | footer | shared | — |
| `contact.html` | 188 | a | Solutions | `solutions.html` | footer | shared | — |
| `contact.html` | 189 | a | Industries | `industries.html` | footer | shared | — |
| `contact.html` | 190 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `contact.html` | 191 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `contact.html` | 192 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `contact.html` | 193 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `contact.html` | 199 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `contact.html` | 200 | a | Private consultation | `contact.html` | footer | shared | — |
| `contact.html` | 201 | a | Careers | `careers.html` | footer | shared | — |
| `contact.html` | 202 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `contact.html` | 203 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `contact.html` | 204 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `contract-review-service.html` | 103 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 125 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `contract-review-service.html` | 125 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `contract-review-service.html` | 125 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `contract-review-service.html` | 128 | a | Home | `index.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 128 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 128 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 128 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 128 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 128 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 128 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 128 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 141 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `contract-review-service.html` | 141 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `contract-review-service.html` | 141 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `contract-review-service.html` | 143 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 153 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `contract-review-service.html` | 158 | a | Home | `index.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 158 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 158 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 158 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 158 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 158 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 158 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 158 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `contract-review-service.html` | 177 | a | Start my contract packet | `structured-case-intake.html?tier=contract` | in-body | b2c | — |
| `contract-review-service.html` | 178 | a | See packet pricing | `#pricing` | anchor | b2c | — |
| `contract-review-service.html` | 232 | a | Order packet | `structured-case-intake.html?tier=contract-basic` | in-body | b2c | — |
| `contract-review-service.html` | 248 | a | Order comprehensive | `structured-case-intake.html?tier=contract-comprehensive` | in-body | b2c | — |
| `contract-review-service.html` | 264 | a | Request custom scope | `structured-case-intake.html?tier=contract-advisory` | in-body | b2c | — |
| `contract-review-service.html` | 372 | a | Start my packet | `structured-case-intake.html?tier=contract` | in-body | b2c | — |
| `contract-review-service.html` | 373 | a | Talk to us first | `contact.html` | in-body | b2c | — |
| `contract-review-service.html` | 387 | a | See the sample | `samples/contract-risk-memo.html` | in-body | b2c | — |
| `contract-review-service.html` | 387 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2c | — |
| `contract-review-service.html` | 395 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `contract-review-service.html` | 401 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `contract-review-service.html` | 402 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `contract-review-service.html` | 408 | a | Home | `index.html` | footer | b2c | — |
| `contract-review-service.html` | 409 | a | Solutions | `solutions.html` | footer | b2c | — |
| `contract-review-service.html` | 410 | a | Industries | `industries.html` | footer | b2c | — |
| `contract-review-service.html` | 411 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `contract-review-service.html` | 412 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `contract-review-service.html` | 413 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2c | — |
| `contract-review-service.html` | 414 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2c | — |
| `contract-review-service.html` | 415 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `contract-review-service.html` | 416 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `contract-review-service.html` | 422 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `contract-review-service.html` | 423 | a | Private consultation | `contact.html` | footer | b2c | — |
| `contract-review-service.html` | 424 | a | Careers | `careers.html` | footer | b2c | — |
| `contract-review-service.html` | 425 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `contract-review-service.html` | 426 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `contract-review-service.html` | 427 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `contracts.html` | 35 | a | additional-services.html | `additional-services.html` | in-body | shared | — |
| `contracts.html` | 43 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `contracts.html` | 49 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `contracts.html` | 50 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `contracts.html` | 56 | a | Home | `index.html` | footer | shared | — |
| `contracts.html` | 57 | a | Solutions | `solutions.html` | footer | shared | — |
| `contracts.html` | 58 | a | Industries | `industries.html` | footer | shared | — |
| `contracts.html` | 59 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `contracts.html` | 60 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `contracts.html` | 61 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `contracts.html` | 62 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `contracts.html` | 68 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `contracts.html` | 69 | a | Private consultation | `contact.html` | footer | shared | — |
| `contracts.html` | 70 | a | Careers | `careers.html` | footer | shared | — |
| `contracts.html` | 71 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `contracts.html` | 72 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `contracts.html` | 73 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `cookie-policy.html` | 56 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `cookie-policy.html` | 78 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `cookie-policy.html` | 78 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `cookie-policy.html` | 78 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `cookie-policy.html` | 81 | a | Home | `index.html` | primary-nav | shared | — |
| `cookie-policy.html` | 81 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `cookie-policy.html` | 81 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `cookie-policy.html` | 81 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `cookie-policy.html` | 81 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `cookie-policy.html` | 81 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `cookie-policy.html` | 81 | a | Careers | `careers.html` | primary-nav | shared | — |
| `cookie-policy.html` | 81 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `cookie-policy.html` | 94 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `cookie-policy.html` | 94 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `cookie-policy.html` | 94 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `cookie-policy.html` | 96 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `cookie-policy.html` | 106 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `cookie-policy.html` | 111 | a | Home | `index.html` | primary-nav | shared | — |
| `cookie-policy.html` | 111 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `cookie-policy.html` | 111 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `cookie-policy.html` | 111 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `cookie-policy.html` | 111 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `cookie-policy.html` | 111 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `cookie-policy.html` | 111 | a | Careers | `careers.html` | primary-nav | shared | — |
| `cookie-policy.html` | 111 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `cookie-policy.html` | 161 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `cookie-policy.html` | 167 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `cookie-policy.html` | 168 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `cookie-policy.html` | 174 | a | Home | `index.html` | footer | shared | — |
| `cookie-policy.html` | 175 | a | Solutions | `solutions.html` | footer | shared | — |
| `cookie-policy.html` | 176 | a | Industries | `industries.html` | footer | shared | — |
| `cookie-policy.html` | 177 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `cookie-policy.html` | 178 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `cookie-policy.html` | 179 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `cookie-policy.html` | 180 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `cookie-policy.html` | 186 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `cookie-policy.html` | 187 | a | Private consultation | `contact.html` | footer | shared | — |
| `cookie-policy.html` | 188 | a | Careers | `careers.html` | footer | shared | — |
| `cookie-policy.html` | 189 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `cookie-policy.html` | 190 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `cookie-policy.html` | 191 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `corporate-legal-file-control.html` | 26 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 48 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `corporate-legal-file-control.html` | 48 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `corporate-legal-file-control.html` | 48 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `corporate-legal-file-control.html` | 51 | a | Home | `index.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 51 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 51 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 51 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 51 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 51 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 51 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 51 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 64 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `corporate-legal-file-control.html` | 64 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `corporate-legal-file-control.html` | 64 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `corporate-legal-file-control.html` | 66 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 76 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `corporate-legal-file-control.html` | 81 | a | Home | `index.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 81 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 81 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 81 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 81 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 81 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 81 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 81 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `corporate-legal-file-control.html` | 85 | a | Request a confidential review | `structured-case-intake.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 85 | a | View executive briefs | `resources.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 85 | a | See published floor &rarr; | `#pricing` | anchor | b2b | — |
| `corporate-legal-file-control.html` | 104 | a | Request scoped review | `structured-case-intake.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 116 | a | Request retainer scope | `contact.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 243 | button | Estimate cost exposure | `(handler)` | action-script | b2b | no-handler |
| `corporate-legal-file-control.html` | 275 | a | Open review desk | `/app/vcx-contract-review/` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 281 | a | Open packet room | `/app/vcx-packet-room/` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 295 | a | Healthcare & dentalPatient-balance and packet-discipline en… | `industry-healthcare-dental.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 296 | a | SubscriptionRecurring billing and churn-sensitive recovery… | `industry-subscription-recurring.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 297 | a | Fleet & logisticsDispersed operations with contract-heavy r… | `industry-fleet-logistics.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 298 | a | Contract servicesMulti-party documentation and escalation-c… | `industry-contract-services.html` | in-body | b2b | — |
| `corporate-legal-file-control.html` | 315 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `corporate-legal-file-control.html` | 316 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `corporate-legal-file-control.html` | 322 | a | Home | `index.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 323 | a | Solutions | `solutions.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 324 | a | Industries | `industries.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 325 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 326 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 327 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 328 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 334 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 335 | a | Private consultation | `contact.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 336 | a | Careers | `careers.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 337 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 338 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `corporate-legal-file-control.html` | 339 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `corporate-paralegal.html` | 30 | a | corporate-legal-file-control.html | `corporate-legal-file-control.html` | in-body | shared | — |
| `corporate-paralegal.html` | 38 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `corporate-paralegal.html` | 44 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `corporate-paralegal.html` | 45 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `corporate-paralegal.html` | 51 | a | Home | `index.html` | footer | shared | — |
| `corporate-paralegal.html` | 52 | a | Solutions | `solutions.html` | footer | shared | — |
| `corporate-paralegal.html` | 53 | a | Industries | `industries.html` | footer | shared | — |
| `corporate-paralegal.html` | 54 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `corporate-paralegal.html` | 55 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `corporate-paralegal.html` | 56 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `corporate-paralegal.html` | 57 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `corporate-paralegal.html` | 63 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `corporate-paralegal.html` | 64 | a | Private consultation | `contact.html` | footer | shared | — |
| `corporate-paralegal.html` | 65 | a | Careers | `careers.html` | footer | shared | — |
| `corporate-paralegal.html` | 66 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `corporate-paralegal.html` | 67 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `corporate-paralegal.html` | 68 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `diagnostic-review.html` | 67 | a | Home | `index.html` | primary-nav | b2c | — |
| `diagnostic-review.html` | 68 | a | Solutions | `solutions.html` | primary-nav | b2c | — |
| `diagnostic-review.html` | 82 | a | Request diagnostic review | `structured-case-intake.html?service=diagnostic` | in-body | b2c | — |
| `diagnostic-review.html` | 83 | a | See pricing and credit policy | `#pricing` | anchor | b2c | — |
| `diagnostic-review.html` | 144 | a | Request diagnostic review | `structured-case-intake.html?service=diagnostic` | in-body | b2c | — |
| `diagnostic-review.html` | 203 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `diagnostic-review.html` | 205 | a | Request diagnostic review | `structured-case-intake.html?service=diagnostic` | in-body | b2c | — |
| `diagnostic-review.html` | 206 | a | Book 30-min intro call | `https://calendly.com/vitacorex2025/30min` | external | b2c | new-tab |
| `diagnostic-review.html` | 218 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `diagnostic-review.html` | 226 | a | Home | `index.html` | footer | b2c | — |
| `diagnostic-review.html` | 227 | a | Solutions | `solutions.html` | footer | b2c | — |
| `diagnostic-review.html` | 228 | a | Industries | `industries.html` | footer | b2c | — |
| `diagnostic-review.html` | 229 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `diagnostic-review.html` | 230 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `diagnostic-review.html` | 231 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `diagnostic-review.html` | 232 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `diagnostic-review.html` | 238 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `diagnostic-review.html` | 239 | a | Private consultation | `contact.html` | footer | b2c | — |
| `diagnostic-review.html` | 240 | a | Careers | `careers.html` | footer | b2c | — |
| `diagnostic-review.html` | 241 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `diagnostic-review.html` | 242 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `diagnostic-review.html` | 243 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `faq.html` | 133 | a | vitacorex-vs-traditional-agency.html | `vitacorex-vs-traditional-agency.html` | in-body | shared | — |
| `faq.html` | 147 | a | revenue-recovery-workflow.html | `revenue-recovery-workflow.html#roi-calculator` | in-body | shared | — |
| `faq.html` | 161 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | in-body | shared | — |
| `faq.html` | 168 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | in-body | shared | — |
| `faq.html` | 179 | a | contact.html?subject=vendor-onboarding | `contact.html?subject=vendor-onboarding` | in-body | shared | — |
| `faq.html` | 179 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `faq.html` | 193 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `faq.html` | 207 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `faq.html` | 228 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `faq.html` | 242 | a | Sample Deliverable | `sample-deliverable.html` | in-body | shared | — |
| `faq.html` | 249 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `faq.html` | 404 | a | Contact Us — (888) 794-8292 | `/contact.html` | in-body | shared | — |
| `florida-small-claims-help.html` | 112 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 134 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `florida-small-claims-help.html` | 134 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `florida-small-claims-help.html` | 134 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `florida-small-claims-help.html` | 137 | a | Home | `index.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 137 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 137 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 137 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 137 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 137 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 137 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 137 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 150 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `florida-small-claims-help.html` | 150 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `florida-small-claims-help.html` | 150 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `florida-small-claims-help.html` | 152 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 162 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `florida-small-claims-help.html` | 167 | a | Home | `index.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 167 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 167 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 167 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 167 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 167 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 167 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 167 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `florida-small-claims-help.html` | 183 | a | Interested in rollout to your state? &rarr; | `contact.html?intent=state-rollout-interest` | in-body | b2c | — |
| `florida-small-claims-help.html` | 193 | a | Start my packet | `structured-case-intake.html?tier=small-claims` | in-body | b2c | — |
| `florida-small-claims-help.html` | 194 | a | See packet tiers | `#tiers` | anchor | b2c | — |
| `florida-small-claims-help.html` | 248 | a | Tier 1 details | `small-claims-documentation.html` | in-body | b2c | — |
| `florida-small-claims-help.html` | 264 | a | Tier 2 details | `small-claims-documentation.html` | in-body | b2c | — |
| `florida-small-claims-help.html` | 279 | a | Tier 3 details | `small-claims-documentation.html` | in-body | b2c | — |
| `florida-small-claims-help.html` | 415 | a | Start my packet | `structured-case-intake.html?tier=small-claims` | in-body | b2c | — |
| `florida-small-claims-help.html` | 416 | a | Full tier details | `small-claims-documentation.html` | in-body | b2c | — |
| `florida-small-claims-help.html` | 430 | a | See the sample | `samples/small-claims-chronology.html` | in-body | b2c | — |
| `florida-small-claims-help.html` | 430 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2c | — |
| `florida-small-claims-help.html` | 438 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `florida-small-claims-help.html` | 444 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `florida-small-claims-help.html` | 445 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `florida-small-claims-help.html` | 451 | a | Home | `index.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 452 | a | Solutions | `solutions.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 453 | a | Industries | `industries.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 454 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 455 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 456 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 457 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 458 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 459 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 465 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 466 | a | Private consultation | `contact.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 467 | a | Careers | `careers.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 468 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 469 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `florida-small-claims-help.html` | 470 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `i-130-petition.html` | 64 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 86 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `i-130-petition.html` | 86 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `i-130-petition.html` | 86 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `i-130-petition.html` | 90 | a | Home | `index.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 90 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 90 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 90 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 90 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 90 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 90 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 90 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 103 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `i-130-petition.html` | 103 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `i-130-petition.html` | 103 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `i-130-petition.html` | 106 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 116 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `i-130-petition.html` | 121 | a | Home | `index.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 121 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 121 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 121 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 121 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 121 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 121 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 121 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `i-130-petition.html` | 143 | a | Call (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `i-130-petition.html` | 144 | a | Schedule Consultation | `contact.html` | in-body | b2c | — |
| `i-130-petition.html` | 302 | a | Call (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `i-130-petition.html` | 303 | a | Email Us | `mailto:stevenmiller@vitacorexllc.com` | mailto | b2c | — |
| `i-130-petition.html` | 304 | a | Book on Calendly | `https://calendly.com/vitacorex2025/30min` | external | b2c | new-tab |
| `i-130-petition.html` | 317 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `i-130-petition.html` | 323 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `i-130-petition.html` | 324 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `i-130-petition.html` | 330 | a | Home | `index.html` | footer | b2c | — |
| `i-130-petition.html` | 331 | a | Solutions | `solutions.html` | footer | b2c | — |
| `i-130-petition.html` | 332 | a | Industries | `industries.html` | footer | b2c | — |
| `i-130-petition.html` | 333 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `i-130-petition.html` | 334 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `i-130-petition.html` | 335 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `i-130-petition.html` | 336 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `i-130-petition.html` | 342 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `i-130-petition.html` | 343 | a | Private consultation | `contact.html` | footer | b2c | — |
| `i-130-petition.html` | 344 | a | Careers | `careers.html` | footer | b2c | — |
| `i-130-petition.html` | 345 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `i-130-petition.html` | 346 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `i-130-petition.html` | 347 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `i-485-adjustment.html` | 64 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 86 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `i-485-adjustment.html` | 86 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `i-485-adjustment.html` | 86 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `i-485-adjustment.html` | 90 | a | Home | `index.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 90 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 90 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 90 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 90 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 90 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 90 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 90 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 103 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `i-485-adjustment.html` | 103 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `i-485-adjustment.html` | 103 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `i-485-adjustment.html` | 106 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 116 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `i-485-adjustment.html` | 121 | a | Home | `index.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 121 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 121 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 121 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 121 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 121 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 121 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 121 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `i-485-adjustment.html` | 143 | a | Call (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `i-485-adjustment.html` | 144 | a | Schedule Consultation | `contact.html` | in-body | b2c | — |
| `i-485-adjustment.html` | 285 | a | Call (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `i-485-adjustment.html` | 286 | a | Email Us | `mailto:stevenmiller@vitacorexllc.com` | mailto | b2c | — |
| `i-485-adjustment.html` | 287 | a | Book on Calendly | `https://calendly.com/vitacorex2025/30min` | external | b2c | new-tab |
| `i-485-adjustment.html` | 300 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `i-485-adjustment.html` | 306 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `i-485-adjustment.html` | 307 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `i-485-adjustment.html` | 313 | a | Home | `index.html` | footer | b2c | — |
| `i-485-adjustment.html` | 314 | a | Solutions | `solutions.html` | footer | b2c | — |
| `i-485-adjustment.html` | 315 | a | Industries | `industries.html` | footer | b2c | — |
| `i-485-adjustment.html` | 316 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `i-485-adjustment.html` | 317 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `i-485-adjustment.html` | 318 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `i-485-adjustment.html` | 319 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `i-485-adjustment.html` | 325 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `i-485-adjustment.html` | 326 | a | Private consultation | `contact.html` | footer | b2c | — |
| `i-485-adjustment.html` | 327 | a | Careers | `careers.html` | footer | b2c | — |
| `i-485-adjustment.html` | 328 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `i-485-adjustment.html` | 329 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `i-485-adjustment.html` | 330 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `immigration-documents.html` | 35 | a | additional-services.html | `additional-services.html` | in-body | shared | — |
| `immigration-documents.html` | 43 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `immigration-documents.html` | 49 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `immigration-documents.html` | 50 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `immigration-documents.html` | 56 | a | Home | `index.html` | footer | shared | — |
| `immigration-documents.html` | 57 | a | Solutions | `solutions.html` | footer | shared | — |
| `immigration-documents.html` | 58 | a | Industries | `industries.html` | footer | shared | — |
| `immigration-documents.html` | 59 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `immigration-documents.html` | 60 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `immigration-documents.html` | 61 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `immigration-documents.html` | 62 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `immigration-documents.html` | 68 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `immigration-documents.html` | 69 | a | Private consultation | `contact.html` | footer | shared | — |
| `immigration-documents.html` | 70 | a | Careers | `careers.html` | footer | shared | — |
| `immigration-documents.html` | 71 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `immigration-documents.html` | 72 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `immigration-documents.html` | 73 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `immigration-packet-review.html` | 111 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 133 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `immigration-packet-review.html` | 133 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `immigration-packet-review.html` | 133 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `immigration-packet-review.html` | 136 | a | Home | `index.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 136 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 136 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 136 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 136 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 136 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 136 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 136 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 149 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `immigration-packet-review.html` | 149 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `immigration-packet-review.html` | 149 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `immigration-packet-review.html` | 151 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 161 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `immigration-packet-review.html` | 166 | a | Home | `index.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 166 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 166 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 166 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 166 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 166 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 166 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 166 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `immigration-packet-review.html` | 185 | a | Start my packet review | `structured-case-intake.html?tier=immigration` | in-body | b2c | — |
| `immigration-packet-review.html` | 186 | a | See packet pricing | `#pricing` | anchor | b2c | — |
| `immigration-packet-review.html` | 249 | a | Order packet | `structured-case-intake.html?tier=immigration-basic` | in-body | b2c | — |
| `immigration-packet-review.html` | 265 | a | Order comprehensive | `structured-case-intake.html?tier=immigration-comprehensive` | in-body | b2c | — |
| `immigration-packet-review.html` | 281 | a | Request custom scope | `structured-case-intake.html?tier=immigration-complex` | in-body | b2c | — |
| `immigration-packet-review.html` | 381 | a | Start my packet | `structured-case-intake.html?tier=immigration` | in-body | b2c | — |
| `immigration-packet-review.html` | 382 | a | Talk to us first | `contact.html` | in-body | b2c | — |
| `immigration-packet-review.html` | 396 | a | See the sample | `samples/immigration-evidence-index.html` | in-body | b2c | — |
| `immigration-packet-review.html` | 396 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2c | — |
| `immigration-packet-review.html` | 404 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `immigration-packet-review.html` | 410 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `immigration-packet-review.html` | 411 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `immigration-packet-review.html` | 417 | a | Home | `index.html` | footer | b2c | — |
| `immigration-packet-review.html` | 418 | a | Solutions | `solutions.html` | footer | b2c | — |
| `immigration-packet-review.html` | 419 | a | Industries | `industries.html` | footer | b2c | — |
| `immigration-packet-review.html` | 420 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `immigration-packet-review.html` | 421 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `immigration-packet-review.html` | 422 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2c | — |
| `immigration-packet-review.html` | 423 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2c | — |
| `immigration-packet-review.html` | 424 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `immigration-packet-review.html` | 425 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `immigration-packet-review.html` | 431 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `immigration-packet-review.html` | 432 | a | Private consultation | `contact.html` | footer | b2c | — |
| `immigration-packet-review.html` | 433 | a | Careers | `careers.html` | footer | b2c | — |
| `immigration-packet-review.html` | 434 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `immigration-packet-review.html` | 435 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `immigration-packet-review.html` | 436 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 59 | a | Home | `index.html` | primary-nav | b2c | — |
| `immigration-services-tampa.html` | 60 | a | Additional Services | `additional-services.html` | primary-nav | b2c | — |
| `immigration-services-tampa.html` | 147 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `immigration-services-tampa.html` | 148 | a | Book a Consultation | `https://calendly.com/vitacorex2025/30min` | external | b2c | new-tab |
| `immigration-services-tampa.html` | 159 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `immigration-services-tampa.html` | 164 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `immigration-services-tampa.html` | 165 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `immigration-services-tampa.html` | 166 | a | GitHub | `https://github.com/sergzach` | external | b2c | new-tab |
| `immigration-services-tampa.html` | 172 | a | Home | `index.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 173 | a | Solutions | `solutions.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 174 | a | Industries | `industries.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 175 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 176 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 177 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 178 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 184 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 185 | a | Private consultation | `contact.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 186 | a | Careers | `careers.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 187 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 188 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `immigration-services-tampa.html` | 189 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `index.html` | 41 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `index.html` | 63 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `index.html` | 63 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `index.html` | 63 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `index.html` | 66 | a | Home | `index.html` | primary-nav | shared | — |
| `index.html` | 66 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `index.html` | 66 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `index.html` | 66 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `index.html` | 66 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `index.html` | 66 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `index.html` | 66 | a | Careers | `careers.html` | primary-nav | shared | — |
| `index.html` | 66 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `index.html` | 79 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `index.html` | 79 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `index.html` | 79 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `index.html` | 81 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `index.html` | 91 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `index.html` | 96 | a | Home | `index.html` | primary-nav | shared | — |
| `index.html` | 96 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `index.html` | 96 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `index.html` | 96 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `index.html` | 96 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `index.html` | 96 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `index.html` | 96 | a | Careers | `careers.html` | primary-nav | shared | — |
| `index.html` | 96 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `index.html` | 123 | a | Request confidential review | `structured-case-intake.html` | in-body | shared | — |
| `index.html` | 124 | a | Executive briefs &rarr; | `resources.html` | in-body | shared | — |
| `index.html` | 142 | a | For Companies CFO &middot; Finance &middot; Legal Ops Reven… | `structured-case-intake.html` | in-body | shared | — |
| `index.html` | 168 | a | Private Clients Individuals &middot; Families Company forma… | `additional-services.html` | in-body | shared | — |
| `index.html` | 198 | a | Start with a confidential review &rarr; | `contact.html` | in-body | shared | — |
| `index.html` | 253 | a | For qualified operators Net Recovery Program Pilot — free 9… | `pre-collection-pilot.html` | in-body | shared | — |
| `index.html` | 259 | a | For companies Small Claims & General Jurisdiction — from $1… | `small-claims-documentation.html` | in-body | shared | — |
| `index.html` | 443 | a | Request company review | `structured-case-intake.html` | in-body | shared | — |
| `index.html` | 459 | a | View private-client services | `additional-services.html` | in-body | shared | — |
| `index.html` | 559 | a | View workflow | `revenue-recovery-workflow.html` | in-body | shared | — |
| `index.html` | 572 | a | View deliverables | `corporate-legal-file-control.html` | in-body | shared | — |
| `index.html` | 585 | a | Request a confidential review | `structured-case-intake.html` | in-body | shared | — |
| `index.html` | 598 | a | Healthcare & dental Documentation control and pre-agency wo… | `industry-healthcare-dental.html` | in-body | shared | — |
| `index.html` | 603 | a | Subscription & recurring payments Retention-sensitive recov… | `industry-subscription-recurring.html` | in-body | shared | — |
| `index.html` | 608 | a | Fleet & logistics Recovery workflows and file discipline fo… | `industry-fleet-logistics.html` | in-body | shared | — |
| `index.html` | 613 | a | Contract-heavy services Cash-control and counsel-ready pack… | `industry-contract-services.html` | in-body | shared | — |
| `index.html` | 620 | a | Review industry pages | `industries.html` | in-body | shared | — |
| `index.html` | 621 | a | Request confidential review | `structured-case-intake.html` | in-body | shared | — |
| `index.html` | 673 | a | Open structured intake | `structured-case-intake.html` | in-body | shared | — |
| `index.html` | 674 | a | Review executive materials | `resources.html` | in-body | shared | — |
| `index.html` | 738 | a | Read the full case → | `case-study-healthcare-network.html` | in-body | shared | — |
| `index.html` | 792 | a | Run your own ROI estimate → | `revenue-recovery-workflow.html#roi-calculator` | in-body | shared | — |
| `index.html` | 860 | button | Generate engagement recommendation | `(handler)` | action-script | shared | no-handler |
| `index.html` | 876 | a | Review legal file control | `corporate-legal-file-control.html` | in-body | shared | — |
| `index.html` | 877 | a | Schedule strategy consultation | `https://calendly.com/vitacorex2025/30min` | external | shared | new-tab |
| `index.html` | 1012 | a | Open PDF | `assets/pdf/lead-magnet-healthcare.pdf` | in-body | shared | new-tab |
| `index.html` | 1018 | a | Open PDF | `assets/pdf/healthcare-cfo-brief.pdf` | in-body | shared | new-tab |
| `index.html` | 1024 | a | Open PDF | `assets/pdf/dental-institutional-deck.pdf` | in-body | shared | new-tab |
| `index.html` | 1030 | a | Open PDF | `assets/pdf/precollection-executive-review.pdf` | in-body | shared | new-tab |
| `index.html` | 1070 | a | Request private consultation | `contact.html` | in-body | shared | — |
| `index.html` | 1071 | a | Review curated services | `additional-services.html` | in-body | shared | — |
| `index.html` | 1091 | a | Request private consultation | `contact.html` | in-body | shared | — |
| `index.html` | 1092 | a | Open structured intake | `structured-case-intake.html` | in-body | shared | — |
| `index.html` | 1106 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `index.html` | 1112 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `index.html` | 1113 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `index.html` | 1119 | a | Home | `index.html` | footer | shared | — |
| `index.html` | 1120 | a | Solutions | `solutions.html` | footer | shared | — |
| `index.html` | 1121 | a | Industries | `industries.html` | footer | shared | — |
| `index.html` | 1122 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `index.html` | 1123 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `index.html` | 1124 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | shared | — |
| `index.html` | 1125 | a | Small Claims Packets | `small-claims-documentation.html` | footer | shared | — |
| `index.html` | 1126 | a | Contract Review | `contract-review-service.html` | footer | shared | — |
| `index.html` | 1127 | a | Immigration Packet Review | `immigration-packet-review.html` | footer | shared | — |
| `index.html` | 1128 | a | Auto Deal Review | `auto-deal-review.html` | footer | shared | — |
| `index.html` | 1129 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `index.html` | 1130 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `index.html` | 1131 | a | Partners | `partners.html` | footer | shared | — |
| `index.html` | 1132 | a | Case Study: Fleet Logistics | `case-study-fleet-logistics.html` | footer | shared | — |
| `index.html` | 1133 | a | Case Study: SaaS Recovery | `case-study-subscription-saas.html` | footer | shared | — |
| `index.html` | 1139 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `index.html` | 1140 | a | Deadline Calendar | `/app/deadline-calendar/` | footer | shared | — |
| `index.html` | 1141 | a | Private consultation | `contact.html` | footer | shared | — |
| `index.html` | 1142 | a | Careers | `careers.html` | footer | shared | — |
| `index.html` | 1143 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `index.html` | 1144 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `index.html` | 1145 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `index.html` | 1179 | button | AI Assistant | `(handler)` | form-submit | shared | no-handler |
| `index.html` | 1197 | button | (no label) | `(handler)` | form-submit | shared | no-handler |
| `industries.html` | 62 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `industries.html` | 84 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industries.html` | 84 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industries.html` | 84 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industries.html` | 87 | a | Home | `index.html` | primary-nav | b2b | — |
| `industries.html` | 87 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industries.html` | 87 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industries.html` | 87 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industries.html` | 87 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industries.html` | 87 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industries.html` | 87 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industries.html` | 87 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industries.html` | 100 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industries.html` | 100 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industries.html` | 100 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industries.html` | 102 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `industries.html` | 112 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `industries.html` | 117 | a | Home | `index.html` | primary-nav | b2b | — |
| `industries.html` | 117 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industries.html` | 117 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industries.html` | 117 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industries.html` | 117 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industries.html` | 117 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industries.html` | 117 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industries.html` | 117 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industries.html` | 144 | a | Healthcare & dental Patient-balance environments with docum… | `industry-healthcare-dental.html` | in-body | b2b | — |
| `industries.html` | 149 | a | Subscription & recurring payments Recurring billing operato… | `industry-subscription-recurring.html` | in-body | b2b | — |
| `industries.html` | 154 | a | Fleet & logistics Contract-heavy portfolios with dispersed… | `industry-fleet-logistics.html` | in-body | b2b | — |
| `industries.html` | 159 | a | Contract-heavy services Commercial service businesses with… | `industry-contract-services.html` | in-body | b2b | — |
| `industries.html` | 188 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `industries.html` | 194 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `industries.html` | 195 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `industries.html` | 201 | a | Home | `index.html` | footer | b2b | — |
| `industries.html` | 202 | a | Solutions | `solutions.html` | footer | b2b | — |
| `industries.html` | 203 | a | Industries | `industries.html` | footer | b2b | — |
| `industries.html` | 204 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `industries.html` | 205 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `industries.html` | 206 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `industries.html` | 207 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `industries.html` | 213 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `industries.html` | 214 | a | Private consultation | `contact.html` | footer | b2b | — |
| `industries.html` | 215 | a | Careers | `careers.html` | footer | b2b | — |
| `industries.html` | 216 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `industries.html` | 217 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `industries.html` | 218 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `industry-contract-services.html` | 58 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 80 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-contract-services.html` | 80 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-contract-services.html` | 80 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-contract-services.html` | 83 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 83 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 83 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 83 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 83 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 83 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 83 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 83 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 96 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-contract-services.html` | 96 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-contract-services.html` | 96 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-contract-services.html` | 98 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 108 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `industry-contract-services.html` | 113 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 113 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 113 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 113 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 113 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 113 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 113 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 113 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-contract-services.html` | 163 | a | redacted sample deliverable | `sample-deliverable.html` | in-body | b2b | — |
| `industry-contract-services.html` | 182 | a | Start a structured intake | `structured-case-intake.html?source=industry-contract` | in-body | b2b | — |
| `industry-contract-services.html` | 183 | a | See the sample deliverable | `sample-deliverable.html` | in-body | b2b | — |
| `industry-contract-services.html` | 194 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `industry-contract-services.html` | 200 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `industry-contract-services.html` | 201 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `industry-contract-services.html` | 207 | a | Home | `index.html` | footer | b2b | — |
| `industry-contract-services.html` | 208 | a | Solutions | `solutions.html` | footer | b2b | — |
| `industry-contract-services.html` | 209 | a | Industries | `industries.html` | footer | b2b | — |
| `industry-contract-services.html` | 210 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `industry-contract-services.html` | 211 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `industry-contract-services.html` | 212 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `industry-contract-services.html` | 213 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `industry-contract-services.html` | 219 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `industry-contract-services.html` | 220 | a | Private consultation | `contact.html` | footer | b2b | — |
| `industry-contract-services.html` | 221 | a | Careers | `careers.html` | footer | b2b | — |
| `industry-contract-services.html` | 222 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `industry-contract-services.html` | 223 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `industry-contract-services.html` | 224 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 58 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 80 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-fleet-logistics.html` | 80 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-fleet-logistics.html` | 80 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-fleet-logistics.html` | 83 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 83 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 83 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 83 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 83 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 83 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 83 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 83 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 96 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-fleet-logistics.html` | 96 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-fleet-logistics.html` | 96 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-fleet-logistics.html` | 98 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 108 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `industry-fleet-logistics.html` | 113 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 113 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 113 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 113 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 113 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 113 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 113 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 113 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-fleet-logistics.html` | 163 | a | redacted sample deliverable | `sample-deliverable.html` | in-body | b2b | — |
| `industry-fleet-logistics.html` | 182 | a | Request confidential review | `structured-case-intake.html?source=industry-fleet` | in-body | b2b | — |
| `industry-fleet-logistics.html` | 183 | a | See the sample deliverable | `sample-deliverable.html` | in-body | b2b | — |
| `industry-fleet-logistics.html` | 194 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `industry-fleet-logistics.html` | 200 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `industry-fleet-logistics.html` | 201 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `industry-fleet-logistics.html` | 207 | a | Home | `index.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 208 | a | Solutions | `solutions.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 209 | a | Industries | `industries.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 210 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 211 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 212 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 213 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 219 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 220 | a | Private consultation | `contact.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 221 | a | Careers | `careers.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 222 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 223 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `industry-fleet-logistics.html` | 224 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 58 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 80 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-healthcare-dental.html` | 80 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-healthcare-dental.html` | 80 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-healthcare-dental.html` | 83 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 83 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 83 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 83 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 83 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 83 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 83 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 83 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 96 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-healthcare-dental.html` | 96 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-healthcare-dental.html` | 96 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-healthcare-dental.html` | 98 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 108 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `industry-healthcare-dental.html` | 113 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 113 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 113 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 113 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 113 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 113 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 113 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 113 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-healthcare-dental.html` | 160 | a | redacted sample deliverable | `sample-deliverable.html` | in-body | b2b | — |
| `industry-healthcare-dental.html` | 171 | a | multi-site case study | `case-study-healthcare-network.html` | in-body | b2b | — |
| `industry-healthcare-dental.html` | 179 | a | Request confidential review | `structured-case-intake.html?source=industry-healthcare` | in-body | b2b | — |
| `industry-healthcare-dental.html` | 180 | a | Read the 12-clinic case study | `case-study-healthcare-network.html` | in-body | b2b | — |
| `industry-healthcare-dental.html` | 191 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `industry-healthcare-dental.html` | 197 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `industry-healthcare-dental.html` | 198 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `industry-healthcare-dental.html` | 204 | a | Home | `index.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 205 | a | Solutions | `solutions.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 206 | a | Industries | `industries.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 207 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 208 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 209 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 210 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 216 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 217 | a | Private consultation | `contact.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 218 | a | Careers | `careers.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 219 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 220 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `industry-healthcare-dental.html` | 221 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 58 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 80 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-subscription-recurring.html` | 80 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-subscription-recurring.html` | 80 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-subscription-recurring.html` | 83 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 83 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 83 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 83 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 83 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 83 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 83 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 83 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 96 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `industry-subscription-recurring.html` | 96 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `industry-subscription-recurring.html` | 96 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `industry-subscription-recurring.html` | 98 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 108 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `industry-subscription-recurring.html` | 113 | a | Home | `index.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 113 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 113 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 113 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 113 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 113 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 113 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 113 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `industry-subscription-recurring.html` | 163 | a | redacted sample deliverable | `sample-deliverable.html` | in-body | b2b | — |
| `industry-subscription-recurring.html` | 182 | a | Request confidential review | `structured-case-intake.html?source=industry-subscription` | in-body | b2b | — |
| `industry-subscription-recurring.html` | 183 | a | See the sample deliverable | `sample-deliverable.html` | in-body | b2b | — |
| `industry-subscription-recurring.html` | 194 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `industry-subscription-recurring.html` | 200 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `industry-subscription-recurring.html` | 201 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `industry-subscription-recurring.html` | 207 | a | Home | `index.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 208 | a | Solutions | `solutions.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 209 | a | Industries | `industries.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 210 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 211 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 212 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 213 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 219 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 220 | a | Private consultation | `contact.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 221 | a | Careers | `careers.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 222 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 223 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `industry-subscription-recurring.html` | 224 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `llc-formation-florida.html` | 63 | a | Home | `index.html` | primary-nav | b2c | — |
| `llc-formation-florida.html` | 64 | a | Additional Services | `additional-services.html` | primary-nav | b2c | — |
| `llc-formation-florida.html` | 73 | a | Interested in rollout to your state? &rarr; | `contact.html?intent=state-rollout-interest` | in-body | b2c | — |
| `llc-formation-florida.html` | 184 | a | Order formation packet | `structured-case-intake.html?service=llc-formation` | in-body | b2c | — |
| `llc-formation-florida.html` | 200 | a | Request turnkey plan | `structured-case-intake.html?service=turnkey` | in-body | b2c | — |
| `llc-formation-florida.html` | 211 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `llc-formation-florida.html` | 212 | a | Book a Consultation | `https://calendly.com/vitacorex2025/30min` | external | b2c | new-tab |
| `llc-formation-florida.html` | 223 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `llc-formation-florida.html` | 228 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `llc-formation-florida.html` | 229 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `llc-formation-florida.html` | 230 | a | GitHub | `https://github.com/sergzach` | external | b2c | new-tab |
| `llc-formation-florida.html` | 236 | a | Home | `index.html` | footer | b2c | — |
| `llc-formation-florida.html` | 237 | a | Solutions | `solutions.html` | footer | b2c | — |
| `llc-formation-florida.html` | 238 | a | Industries | `industries.html` | footer | b2c | — |
| `llc-formation-florida.html` | 239 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `llc-formation-florida.html` | 240 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `llc-formation-florida.html` | 241 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `llc-formation-florida.html` | 242 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `llc-formation-florida.html` | 248 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `llc-formation-florida.html` | 249 | a | Private consultation | `contact.html` | footer | b2c | — |
| `llc-formation-florida.html` | 250 | a | Careers | `careers.html` | footer | b2c | — |
| `llc-formation-florida.html` | 251 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `llc-formation-florida.html` | 252 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `llc-formation-florida.html` | 253 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `n-400-naturalization.html` | 64 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 86 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `n-400-naturalization.html` | 86 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `n-400-naturalization.html` | 86 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `n-400-naturalization.html` | 90 | a | Home | `index.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 90 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 90 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 90 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 90 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 90 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 90 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 90 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 103 | button | EN | `(handler)` | action-script | b2c | delegated:data-lang=en |
| `n-400-naturalization.html` | 103 | button | RU | `(handler)` | action-script | b2c | delegated:data-lang=ru |
| `n-400-naturalization.html` | 103 | button | ES | `(handler)` | action-script | b2c | delegated:data-lang=es |
| `n-400-naturalization.html` | 106 | a | VitaCoreX | `index.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 116 | button | ☰ Menu | `(handler)` | action-script | b2c | aria-wired:controls |
| `n-400-naturalization.html` | 121 | a | Home | `index.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 121 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 121 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 121 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 121 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 121 | a | Private Client Services | `additional-services.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 121 | a | Careers | `careers.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 121 | a | Private Consultation | `contact.html` | primary-nav | b2c | — |
| `n-400-naturalization.html` | 143 | a | Call (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `n-400-naturalization.html` | 144 | a | Schedule Consultation | `contact.html` | in-body | b2c | — |
| `n-400-naturalization.html` | 300 | a | Call (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `n-400-naturalization.html` | 301 | a | Email Us | `mailto:stevenmiller@vitacorexllc.com` | mailto | b2c | — |
| `n-400-naturalization.html` | 302 | a | Book on Calendly | `https://calendly.com/vitacorex2025/30min` | external | b2c | new-tab |
| `n-400-naturalization.html` | 315 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2c | — |
| `n-400-naturalization.html` | 321 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2c | new-tab |
| `n-400-naturalization.html` | 322 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2c | new-tab |
| `n-400-naturalization.html` | 328 | a | Home | `index.html` | footer | b2c | — |
| `n-400-naturalization.html` | 329 | a | Solutions | `solutions.html` | footer | b2c | — |
| `n-400-naturalization.html` | 330 | a | Industries | `industries.html` | footer | b2c | — |
| `n-400-naturalization.html` | 331 | a | About VitaCoreX | `about.html` | footer | b2c | — |
| `n-400-naturalization.html` | 332 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2c | — |
| `n-400-naturalization.html` | 333 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2c | — |
| `n-400-naturalization.html` | 334 | a | Executive Briefs & Proof | `resources.html` | footer | b2c | — |
| `n-400-naturalization.html` | 340 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2c | — |
| `n-400-naturalization.html` | 341 | a | Private consultation | `contact.html` | footer | b2c | — |
| `n-400-naturalization.html` | 342 | a | Careers | `careers.html` | footer | b2c | — |
| `n-400-naturalization.html` | 343 | a | Privacy Policy | `privacy-policy.html` | footer | b2c | — |
| `n-400-naturalization.html` | 344 | a | Terms of Use | `terms-of-use.html` | footer | b2c | — |
| `n-400-naturalization.html` | 345 | a | Cookie Policy | `cookie-policy.html` | footer | b2c | — |
| `net-recovery.html` | 35 | a | revenue-recovery-workflow.html | `revenue-recovery-workflow.html` | in-body | shared | — |
| `net-recovery.html` | 43 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `net-recovery.html` | 49 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `net-recovery.html` | 50 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `net-recovery.html` | 56 | a | Home | `index.html` | footer | shared | — |
| `net-recovery.html` | 57 | a | Solutions | `solutions.html` | footer | shared | — |
| `net-recovery.html` | 58 | a | Industries | `industries.html` | footer | shared | — |
| `net-recovery.html` | 59 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `net-recovery.html` | 60 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `net-recovery.html` | 61 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `net-recovery.html` | 62 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `net-recovery.html` | 68 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `net-recovery.html` | 69 | a | Private consultation | `contact.html` | footer | shared | — |
| `net-recovery.html` | 70 | a | Careers | `careers.html` | footer | shared | — |
| `net-recovery.html` | 71 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `net-recovery.html` | 72 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `net-recovery.html` | 73 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `partners.html` | 86 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `partners.html` | 108 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `partners.html` | 108 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `partners.html` | 108 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `partners.html` | 111 | a | Home | `index.html` | primary-nav | b2b | — |
| `partners.html` | 111 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `partners.html` | 111 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `partners.html` | 111 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `partners.html` | 111 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `partners.html` | 111 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `partners.html` | 111 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `partners.html` | 111 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `partners.html` | 124 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `partners.html` | 124 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `partners.html` | 124 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `partners.html` | 126 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `partners.html` | 136 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `partners.html` | 141 | a | Home | `index.html` | primary-nav | b2b | — |
| `partners.html` | 141 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `partners.html` | 141 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `partners.html` | 141 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `partners.html` | 141 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `partners.html` | 141 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `partners.html` | 141 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `partners.html` | 141 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `partners.html` | 160 | a | Start a partner conversation | `contact.html` | in-body | b2b | — |
| `partners.html` | 161 | a | Review how we work | `pricing-and-engagement-tiers.html` | in-body | b2b | — |
| `partners.html` | 285 | a | Start a partner conversation | `contact.html` | in-body | b2b | — |
| `partners.html` | 286 | a | Review how we work | `pricing-and-engagement-tiers.html` | in-body | b2b | — |
| `partners.html` | 298 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `partners.html` | 304 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `partners.html` | 305 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `partners.html` | 311 | a | Home | `index.html` | footer | b2b | — |
| `partners.html` | 312 | a | Solutions | `solutions.html` | footer | b2b | — |
| `partners.html` | 313 | a | Industries | `industries.html` | footer | b2b | — |
| `partners.html` | 314 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `partners.html` | 315 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `partners.html` | 316 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2b | — |
| `partners.html` | 317 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2b | — |
| `partners.html` | 318 | a | Partners | `partners.html` | footer | b2b | — |
| `partners.html` | 319 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `partners.html` | 325 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `partners.html` | 326 | a | Private consultation | `contact.html` | footer | b2b | — |
| `partners.html` | 327 | a | Careers | `careers.html` | footer | b2b | — |
| `partners.html` | 328 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `partners.html` | 329 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `partners.html` | 330 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 147 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 169 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `pre-collection-pilot.html` | 169 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `pre-collection-pilot.html` | 169 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `pre-collection-pilot.html` | 172 | a | Home | `index.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 172 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 172 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 172 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 172 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 172 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 172 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 172 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 185 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `pre-collection-pilot.html` | 185 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `pre-collection-pilot.html` | 185 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `pre-collection-pilot.html` | 187 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 197 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `pre-collection-pilot.html` | 202 | a | Home | `index.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 202 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 202 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 202 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 202 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 202 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 202 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 202 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `pre-collection-pilot.html` | 221 | a | Apply for the pilot | `structured-case-intake.html` | in-body | b2b | — |
| `pre-collection-pilot.html` | 222 | a | See qualification criteria | `#qualify` | anchor | b2b | — |
| `pre-collection-pilot.html` | 433 | a | See Controlled Operations tier &rarr; | `solutions.html#engagement-tiers` | in-body | b2b | — |
| `pre-collection-pilot.html` | 444 | a | See Diagnostic Review details &rarr; | `diagnostic-review.html` | in-body | b2b | — |
| `pre-collection-pilot.html` | 456 | a | Apply for the pilot | `structured-case-intake.html` | in-body | b2b | — |
| `pre-collection-pilot.html` | 457 | a | Request a private consultation instead | `contact.html` | in-body | b2b | — |
| `pre-collection-pilot.html` | 466 | a | See the sample | `samples/diagnostic-report.html` | in-body | b2b | — |
| `pre-collection-pilot.html` | 466 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2b | — |
| `pre-collection-pilot.html` | 474 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `pre-collection-pilot.html` | 480 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `pre-collection-pilot.html` | 481 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `pre-collection-pilot.html` | 487 | a | Home | `index.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 488 | a | Solutions | `solutions.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 489 | a | Industries | `industries.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 490 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 491 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 492 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 493 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 494 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 495 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 501 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 502 | a | Private consultation | `contact.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 503 | a | Careers | `careers.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 504 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 505 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `pre-collection-pilot.html` | 506 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 168 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 190 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `pricing-and-engagement-tiers.html` | 190 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `pricing-and-engagement-tiers.html` | 190 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `pricing-and-engagement-tiers.html` | 194 | a | Home | `index.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 194 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 194 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 194 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 194 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 194 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 194 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 194 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `pricing-and-engagement-tiers.html` | 246 | a | See details &rarr; | `contract-review-service.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 255 | a | See details &rarr; | `immigration-packet-review.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 264 | a | See details &rarr; | `auto-deal-review.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 273 | a | See details &rarr; | `small-claims-documentation.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 282 | a | See details &rarr; | `llc-formation-florida.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 291 | a | See details &rarr; | `diagnostic-review.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 300 | a | See details &rarr; | `pre-collection-pilot.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 309 | a | See details &rarr; | `corporate-legal-file-control.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 318 | a | See details &rarr; | `#b-tiers` | anchor | b2b | — |
| `pricing-and-engagement-tiers.html` | 327 | a | See details &rarr; | `small-claims-documentation.html#compare` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 366 | a | See Pilot details &rarr; | `pre-collection-pilot.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 388 | a | Review file control &rarr; | `corporate-legal-file-control.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 419 | a | Request retainer scope &rarr; | `contact.html` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 455 | a | See packet details &rarr; | `small-claims-documentation.html#compare` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 477 | a | See packet details &rarr; | `small-claims-documentation.html#compare` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 498 | a | Book managed file &rarr; | `small-claims-documentation.html#compare` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 511 | a | Add hearing support &rarr; | `small-claims-documentation.html#compare` | in-body | b2b | — |
| `pricing-and-engagement-tiers.html` | 565 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `pricing-and-engagement-tiers.html` | 573 | a | Home | `index.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 574 | a | Solutions | `solutions.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 575 | a | Industries | `industries.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 576 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 577 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 578 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 579 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 585 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 586 | a | Security & Compliance | `security-and-compliance.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 587 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 588 | a | Sample Deliverable | `sample-deliverable.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 589 | a | Procurement FAQ | `faq.html#procurement-faq` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 590 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 596 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 597 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `pricing-and-engagement-tiers.html` | 598 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `privacy-policy.html` | 56 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `privacy-policy.html` | 78 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `privacy-policy.html` | 78 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `privacy-policy.html` | 78 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `privacy-policy.html` | 81 | a | Home | `index.html` | primary-nav | shared | — |
| `privacy-policy.html` | 81 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `privacy-policy.html` | 81 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `privacy-policy.html` | 81 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `privacy-policy.html` | 81 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `privacy-policy.html` | 81 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `privacy-policy.html` | 81 | a | Careers | `careers.html` | primary-nav | shared | — |
| `privacy-policy.html` | 81 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `privacy-policy.html` | 94 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `privacy-policy.html` | 94 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `privacy-policy.html` | 94 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `privacy-policy.html` | 96 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `privacy-policy.html` | 106 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `privacy-policy.html` | 111 | a | Home | `index.html` | primary-nav | shared | — |
| `privacy-policy.html` | 111 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `privacy-policy.html` | 111 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `privacy-policy.html` | 111 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `privacy-policy.html` | 111 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `privacy-policy.html` | 111 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `privacy-policy.html` | 111 | a | Careers | `careers.html` | primary-nav | shared | — |
| `privacy-policy.html` | 111 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `privacy-policy.html` | 120 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | in-body | shared | — |
| `privacy-policy.html` | 120 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `privacy-policy.html` | 137 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | in-body | shared | — |
| `privacy-policy.html` | 163 | a | Structured Case Intake | `structured-case-intake.html` | in-body | shared | — |
| `privacy-policy.html` | 168 | a | Cookie Policy | `cookie-policy.html` | in-body | shared | — |
| `privacy-policy.html` | 173 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | in-body | shared | — |
| `privacy-policy.html` | 184 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `privacy-policy.html` | 189 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `privacy-policy.html` | 189 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | in-body | shared | — |
| `privacy-policy.html` | 202 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `privacy-policy.html` | 202 | a | contact form | `contact.html` | in-body | shared | — |
| `privacy-policy.html` | 222 | a | contact form | `contact.html` | in-body | shared | — |
| `privacy-policy.html` | 222 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `privacy-policy.html` | 233 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `privacy-policy.html` | 239 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `privacy-policy.html` | 240 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `privacy-policy.html` | 246 | a | Home | `index.html` | footer | shared | — |
| `privacy-policy.html` | 247 | a | Solutions | `solutions.html` | footer | shared | — |
| `privacy-policy.html` | 248 | a | Industries | `industries.html` | footer | shared | — |
| `privacy-policy.html` | 249 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `privacy-policy.html` | 250 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `privacy-policy.html` | 251 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `privacy-policy.html` | 252 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `privacy-policy.html` | 258 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | footer | shared | — |
| `privacy-policy.html` | 259 | a | Security & Compliance | `security-and-compliance.html` | footer | shared | — |
| `privacy-policy.html` | 260 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | footer | shared | — |
| `privacy-policy.html` | 261 | a | Sample Deliverable | `sample-deliverable.html` | footer | shared | — |
| `privacy-policy.html` | 262 | a | Procurement FAQ | `faq.html#procurement-faq` | footer | shared | — |
| `privacy-policy.html` | 268 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `privacy-policy.html` | 269 | a | Private consultation | `contact.html` | footer | shared | — |
| `privacy-policy.html` | 270 | a | Careers | `careers.html` | footer | shared | — |
| `privacy-policy.html` | 271 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `privacy-policy.html` | 272 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `privacy-policy.html` | 273 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `resources.html` | 25 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `resources.html` | 47 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `resources.html` | 47 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `resources.html` | 47 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `resources.html` | 50 | a | Home | `index.html` | primary-nav | shared | — |
| `resources.html` | 50 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `resources.html` | 50 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `resources.html` | 50 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `resources.html` | 50 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `resources.html` | 50 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `resources.html` | 50 | a | Careers | `careers.html` | primary-nav | shared | — |
| `resources.html` | 50 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `resources.html` | 63 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `resources.html` | 63 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `resources.html` | 63 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `resources.html` | 65 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `resources.html` | 75 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `resources.html` | 80 | a | Home | `index.html` | primary-nav | shared | — |
| `resources.html` | 80 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `resources.html` | 80 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `resources.html` | 80 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `resources.html` | 80 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `resources.html` | 80 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `resources.html` | 80 | a | Careers | `careers.html` | primary-nav | shared | — |
| `resources.html` | 80 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `resources.html` | 84 | a | Open PDF | `assets/pdf/lead-magnet-healthcare.pdf` | in-body | shared | new-tab |
| `resources.html` | 84 | a | Open PDF | `assets/pdf/healthcare-cfo-brief.pdf` | in-body | shared | new-tab |
| `resources.html` | 84 | a | Open PDF | `assets/pdf/dental-institutional-deck.pdf` | in-body | shared | new-tab |
| `resources.html` | 84 | a | Open PDF | `assets/pdf/precollection-executive-review.pdf` | in-body | shared | new-tab |
| `resources.html` | 121 | a | Review industry pages | `industries.html` | in-body | shared | — |
| `resources.html` | 122 | a | Open structured intake | `structured-case-intake.html` | in-body | shared | — |
| `resources.html` | 133 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `resources.html` | 139 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `resources.html` | 140 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `resources.html` | 146 | a | Home | `index.html` | footer | shared | — |
| `resources.html` | 147 | a | Solutions | `solutions.html` | footer | shared | — |
| `resources.html` | 148 | a | Industries | `industries.html` | footer | shared | — |
| `resources.html` | 149 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `resources.html` | 150 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `resources.html` | 151 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `resources.html` | 152 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `resources.html` | 158 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `resources.html` | 159 | a | Private consultation | `contact.html` | footer | shared | — |
| `resources.html` | 160 | a | Careers | `careers.html` | footer | shared | — |
| `resources.html` | 161 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `resources.html` | 162 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `resources.html` | 163 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `revenue-recovery-florida.html` | 110 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 132 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `revenue-recovery-florida.html` | 132 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `revenue-recovery-florida.html` | 132 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `revenue-recovery-florida.html` | 135 | a | Home | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 135 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 135 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 135 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 135 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 135 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 135 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 135 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 148 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `revenue-recovery-florida.html` | 148 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `revenue-recovery-florida.html` | 148 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `revenue-recovery-florida.html` | 150 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 160 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `revenue-recovery-florida.html` | 165 | a | Home | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 165 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 165 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 165 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 165 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 165 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 165 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 165 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `revenue-recovery-florida.html` | 184 | a | Apply for the Pilot | `pre-collection-pilot.html` | in-body | b2b | — |
| `revenue-recovery-florida.html` | 185 | a | See retainer programmes | `#retainers` | anchor | b2b | — |
| `revenue-recovery-florida.html` | 242 | a | See full Pilot terms &rarr; | `pre-collection-pilot.html` | in-body | b2b | — |
| `revenue-recovery-florida.html` | 270 | a | See full pricing & engagement tiers &rarr; | `pricing-and-engagement-tiers.html` | in-body | b2b | — |
| `revenue-recovery-florida.html` | 370 | a | Apply for the Pilot | `pre-collection-pilot.html` | in-body | b2b | — |
| `revenue-recovery-florida.html` | 371 | a | Request a private consultation | `contact.html` | in-body | b2b | — |
| `revenue-recovery-florida.html` | 392 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-florida.html` | 398 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `revenue-recovery-florida.html` | 399 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `revenue-recovery-florida.html` | 405 | a | Home | `index.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 406 | a | Solutions | `solutions.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 407 | a | Industries | `industries.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 408 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 409 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 410 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 411 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 412 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 413 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 419 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 420 | a | Private consultation | `contact.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 421 | a | Careers | `careers.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 422 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 423 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `revenue-recovery-florida.html` | 424 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 59 | a | Home | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-miami.html` | 60 | a | Solutions | `solutions.html` | primary-nav | b2b | — |
| `revenue-recovery-miami.html` | 116 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-miami.html` | 117 | a | Book a Consultation | `https://calendly.com/vitacorex2025/30min` | external | b2b | new-tab |
| `revenue-recovery-miami.html` | 128 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-miami.html` | 133 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `revenue-recovery-miami.html` | 134 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `revenue-recovery-miami.html` | 135 | a | GitHub | `https://github.com/sergzach` | external | b2b | new-tab |
| `revenue-recovery-miami.html` | 141 | a | Home | `index.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 142 | a | Solutions | `solutions.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 143 | a | Industries | `industries.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 144 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 145 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 146 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 147 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 153 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 154 | a | Private consultation | `contact.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 155 | a | Careers | `careers.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 156 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 157 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `revenue-recovery-miami.html` | 158 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 59 | a | Home | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-orlando.html` | 60 | a | Solutions | `solutions.html` | primary-nav | b2b | — |
| `revenue-recovery-orlando.html` | 116 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-orlando.html` | 117 | a | Book a Consultation | `https://calendly.com/vitacorex2025/30min` | external | b2b | new-tab |
| `revenue-recovery-orlando.html` | 128 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-orlando.html` | 133 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `revenue-recovery-orlando.html` | 134 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `revenue-recovery-orlando.html` | 135 | a | GitHub | `https://github.com/sergzach` | external | b2b | new-tab |
| `revenue-recovery-orlando.html` | 141 | a | Home | `index.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 142 | a | Solutions | `solutions.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 143 | a | Industries | `industries.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 144 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 145 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 146 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 147 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 153 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 154 | a | Private consultation | `contact.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 155 | a | Careers | `careers.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 156 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 157 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `revenue-recovery-orlando.html` | 158 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 59 | a | Home | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-tampa.html` | 60 | a | Solutions | `solutions.html` | primary-nav | b2b | — |
| `revenue-recovery-tampa.html` | 116 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-tampa.html` | 117 | a | Book a Consultation | `https://calendly.com/vitacorex2025/30min` | external | b2b | new-tab |
| `revenue-recovery-tampa.html` | 128 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-tampa.html` | 133 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `revenue-recovery-tampa.html` | 134 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `revenue-recovery-tampa.html` | 135 | a | GitHub | `https://github.com/sergzach` | external | b2b | new-tab |
| `revenue-recovery-tampa.html` | 141 | a | Home | `index.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 142 | a | Solutions | `solutions.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 143 | a | Industries | `industries.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 144 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 145 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 146 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 147 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 153 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 154 | a | Private consultation | `contact.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 155 | a | Careers | `careers.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 156 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 157 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `revenue-recovery-tampa.html` | 158 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 27 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 49 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `revenue-recovery-workflow.html` | 49 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `revenue-recovery-workflow.html` | 49 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `revenue-recovery-workflow.html` | 52 | a | Home | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 52 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 52 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 52 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 52 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 52 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 52 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 52 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 65 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `revenue-recovery-workflow.html` | 65 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `revenue-recovery-workflow.html` | 65 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `revenue-recovery-workflow.html` | 67 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 77 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `revenue-recovery-workflow.html` | 82 | a | Home | `index.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 82 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 82 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 82 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 82 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 82 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 82 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 82 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `revenue-recovery-workflow.html` | 86 | a | See pilot measurement plan | `#measurement-plan` | anchor | b2b | — |
| `revenue-recovery-workflow.html` | 86 | a | Request a confidential review | `structured-case-intake.html` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 146 | a | Start pilot | `/app/vcx-recovery-pilot/` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 152 | a | Open intake | `/app/vcx-intake/` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 166 | form | form:vcxRoiCalc | `(self)` | form-submit | b2b | self-post, GET |
| `revenue-recovery-workflow.html` | 196 | button | Calculate my estimate | `(self)` | form-submit | b2b | form-method:GET |
| `revenue-recovery-workflow.html` | 197 | button | Use sample: $500K, 90-day, healthcare | `(handler)` | action-script | b2b | form-method:GET |
| `revenue-recovery-workflow.html` | 227 | a | Healthcare & dentalPatient-balance and packet-discipline en… | `industry-healthcare-dental.html` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 228 | a | SubscriptionRecurring billing and churn-sensitive recovery… | `industry-subscription-recurring.html` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 229 | a | Fleet & logisticsDispersed operations with contract-heavy r… | `industry-fleet-logistics.html` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 230 | a | Contract servicesMulti-party documentation and escalation-c… | `industry-contract-services.html` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 234 | a | Request access | `samples/request-gated-sample.html?s=ar-leakage-map` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 234 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 234 | a | Request access | `samples/request-gated-sample.html?s=counsel-ready-packet` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 234 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2b | — |
| `revenue-recovery-workflow.html` | 242 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `revenue-recovery-workflow.html` | 248 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `revenue-recovery-workflow.html` | 249 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `revenue-recovery-workflow.html` | 255 | a | Home | `index.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 256 | a | Solutions | `solutions.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 257 | a | Industries | `industries.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 258 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 259 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 260 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 261 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 267 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 268 | a | Private consultation | `contact.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 269 | a | Careers | `careers.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 270 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 271 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `revenue-recovery-workflow.html` | 272 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `sample-deliverable.html` | 234 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 256 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `sample-deliverable.html` | 256 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `sample-deliverable.html` | 256 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `sample-deliverable.html` | 259 | a | Home | `index.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 259 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 259 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 259 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 259 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 259 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 259 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 259 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 272 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `sample-deliverable.html` | 272 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `sample-deliverable.html` | 272 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `sample-deliverable.html` | 274 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 284 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `sample-deliverable.html` | 289 | a | Home | `index.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 289 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 289 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 289 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 289 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 289 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 289 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 289 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `sample-deliverable.html` | 332 | a | B2B · Gated AR Leakage Map Where revenue bleeds across site… | `/samples/request-gated-sample.html?s=ar-leakage-map` | in-body | b2b | — |
| `sample-deliverable.html` | 338 | a | B2B · Gated Counsel-Ready Packet What a file looks like whe… | `/samples/request-gated-sample.html?s=counsel-ready-packet` | in-body | b2b | — |
| `sample-deliverable.html` | 344 | a | B2B · Open 30-Day Diagnostic Report The diagnostic VitaCore… | `/samples/diagnostic-report.html` | in-body | b2b | — |
| `sample-deliverable.html` | 350 | a | Private Client · Open Contract Risk Flag Memo How we flag c… | `/samples/contract-risk-memo.html` | in-body | b2b | — |
| `sample-deliverable.html` | 356 | a | Private Client · Open Immigration Evidence Index The eviden… | `/samples/immigration-evidence-index.html` | in-body | b2b | — |
| `sample-deliverable.html` | 362 | a | Private Client · Open Auto Deal Cost Breakdown Line-by-line… | `/samples/auto-deal-cost-breakdown.html` | in-body | b2b | — |
| `sample-deliverable.html` | 368 | a | Shared · Open Small Claims Chronology Court-ready timeline… | `/samples/small-claims-chronology.html` | in-body | b2b | — |
| `sample-deliverable.html` | 413 | a | Request NDA review | `contact.html?subject=unredacted-deliverable` | in-body | b2b | — |
| `sample-deliverable.html` | 414 | a | Review security & compliance | `security-and-compliance.html` | in-body | b2b | — |
| `sample-deliverable.html` | 432 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `sample-deliverable.html` | 433 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `sample-deliverable.html` | 439 | a | Home | `index.html` | footer | b2b | — |
| `sample-deliverable.html` | 440 | a | Solutions | `solutions.html` | footer | b2b | — |
| `sample-deliverable.html` | 441 | a | Industries | `industries.html` | footer | b2b | — |
| `sample-deliverable.html` | 442 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `sample-deliverable.html` | 443 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `sample-deliverable.html` | 444 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `sample-deliverable.html` | 445 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `sample-deliverable.html` | 446 | a | Case Study: Healthcare Network | `case-study-healthcare-network.html` | footer | b2b | — |
| `sample-deliverable.html` | 447 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | footer | b2b | — |
| `sample-deliverable.html` | 448 | a | Sample Deliverables | `sample-deliverable.html` | footer | b2b | — |
| `sample-deliverable.html` | 449 | a | Security & Compliance | `security-and-compliance.html` | footer | b2b | — |
| `sample-deliverable.html` | 450 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | footer | b2b | — |
| `sample-deliverable.html` | 456 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `sample-deliverable.html` | 457 | a | Deadline Calendar | `/app/deadline-calendar/` | footer | b2b | — |
| `sample-deliverable.html` | 458 | a | Private consultation | `contact.html` | footer | b2b | — |
| `sample-deliverable.html` | 459 | a | Careers | `careers.html` | footer | b2b | — |
| `sample-deliverable.html` | 460 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `sample-deliverable.html` | 461 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `sample-deliverable.html` | 462 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `samples/ar-leakage-map.html` | 79 | a | Executive summary | `#sec-1` | anchor | b2b | — |
| `samples/ar-leakage-map.html` | 80 | a | Methodology | `#sec-2` | anchor | b2b | — |
| `samples/ar-leakage-map.html` | 81 | a | Findings across seven domains | `#sec-3` | anchor | b2b | — |
| `samples/ar-leakage-map.html` | 82 | a | Leakage band — low vs. recoverable | `#sec-4` | anchor | b2b | — |
| `samples/ar-leakage-map.html` | 83 | a | 90-day remediation roadmap | `#sec-5` | anchor | b2b | — |
| `samples/ar-leakage-map.html` | 84 | a | Out of scope | `#sec-6` | anchor | b2b | — |
| `samples/ar-leakage-map.html` | 168 | a | Request the un-redacted version | `/sample-deliverable.html` | in-body | b2b | — |
| `samples/ar-leakage-map.html` | 169 | a | Review security & procurement | `/security-and-compliance.html` | in-body | b2b | — |
| `samples/auto-deal-cost-breakdown.html` | 78 | a | Top-line read | `#sec-1` | anchor | b2c | — |
| `samples/auto-deal-cost-breakdown.html` | 79 | a | Six-domain rubric | `#sec-2` | anchor | b2c | — |
| `samples/auto-deal-cost-breakdown.html` | 80 | a | Line-by-line flags | `#sec-3` | anchor | b2c | — |
| `samples/auto-deal-cost-breakdown.html` | 81 | a | Negotiable band | `#sec-4` | anchor | b2c | — |
| `samples/auto-deal-cost-breakdown.html` | 82 | a | Suggested script | `#sec-5` | anchor | b2c | — |
| `samples/auto-deal-cost-breakdown.html` | 83 | a | Out of scope | `#sec-6` | anchor | b2c | — |
| `samples/auto-deal-cost-breakdown.html` | 167 | a | Order an auto deal review | `/sample-deliverable.html` | in-body | b2c | — |
| `samples/auto-deal-cost-breakdown.html` | 168 | a | See tiers + rush | `/security-and-compliance.html` | in-body | b2c | — |
| `samples/contract-risk-memo.html` | 78 | a | Top-line read | `#sec-1` | anchor | b2c | — |
| `samples/contract-risk-memo.html` | 79 | a | Ten-point rubric | `#sec-2` | anchor | b2c | — |
| `samples/contract-risk-memo.html` | 80 | a | Flagged items | `#sec-3` | anchor | b2c | — |
| `samples/contract-risk-memo.html` | 81 | a | Risk band | `#sec-4` | anchor | b2c | — |
| `samples/contract-risk-memo.html` | 82 | a | Suggested sequence | `#sec-5` | anchor | b2c | — |
| `samples/contract-risk-memo.html` | 83 | a | Out of scope | `#sec-6` | anchor | b2c | — |
| `samples/contract-risk-memo.html` | 169 | a | Order a contract review | `/sample-deliverable.html` | in-body | b2c | — |
| `samples/contract-risk-memo.html` | 170 | a | See tiers + pricing | `/security-and-compliance.html` | in-body | b2c | — |
| `samples/counsel-ready-packet.html` | 79 | a | Readiness at a glance | `#sec-1` | anchor | b2b | — |
| `samples/counsel-ready-packet.html` | 80 | a | Rubric — 12 items | `#sec-2` | anchor | b2b | — |
| `samples/counsel-ready-packet.html` | 81 | a | Item-by-item findings | `#sec-3` | anchor | b2b | — |
| `samples/counsel-ready-packet.html` | 82 | a | Gate threshold | `#sec-4` | anchor | b2b | — |
| `samples/counsel-ready-packet.html` | 83 | a | Remediation sequence | `#sec-5` | anchor | b2b | — |
| `samples/counsel-ready-packet.html` | 84 | a | Out of scope | `#sec-6` | anchor | b2b | — |
| `samples/counsel-ready-packet.html` | 174 | a | Request the un-redacted rubric | `/sample-deliverable.html` | in-body | b2b | — |
| `samples/counsel-ready-packet.html` | 175 | a | Security & procurement | `/security-and-compliance.html` | in-body | b2b | — |
| `samples/diagnostic-report.html` | 78 | a | Executive summary | `#sec-1` | anchor | b2b | — |
| `samples/diagnostic-report.html` | 79 | a | Methodology | `#sec-2` | anchor | b2b | — |
| `samples/diagnostic-report.html` | 80 | a | Findings by domain | `#sec-3` | anchor | b2b | — |
| `samples/diagnostic-report.html` | 81 | a | Recovery opportunity band | `#sec-4` | anchor | b2b | — |
| `samples/diagnostic-report.html` | 82 | a | 90-day prioritized roadmap | `#sec-5` | anchor | b2b | — |
| `samples/diagnostic-report.html` | 83 | a | Out of scope | `#sec-6` | anchor | b2b | — |
| `samples/diagnostic-report.html` | 167 | a | Request the un-redacted version | `/sample-deliverable.html` | in-body | b2b | — |
| `samples/diagnostic-report.html` | 168 | a | Review security & compliance | `/security-and-compliance.html` | in-body | b2b | — |
| `samples/immigration-evidence-index.html` | 78 | a | What an index does | `#sec-1` | anchor | b2c | — |
| `samples/immigration-evidence-index.html` | 79 | a | Required-evidence schedule | `#sec-2` | anchor | b2c | — |
| `samples/immigration-evidence-index.html` | 80 | a | Exhibit list + page map | `#sec-3` | anchor | b2c | — |
| `samples/immigration-evidence-index.html` | 81 | a | Categorization coverage | `#sec-4` | anchor | b2c | — |
| `samples/immigration-evidence-index.html` | 82 | a | Handoff readiness | `#sec-5` | anchor | b2c | — |
| `samples/immigration-evidence-index.html` | 83 | a | Out of scope | `#sec-6` | anchor | b2c | — |
| `samples/immigration-evidence-index.html` | 171 | a | Order a packet review | `/sample-deliverable.html` | in-body | b2c | — |
| `samples/immigration-evidence-index.html` | 172 | a | See tiers + pricing | `/security-and-compliance.html` | in-body | b2c | — |
| `samples/request-gated-sample.html` | 66 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `/index.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 88 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `samples/request-gated-sample.html` | 88 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `samples/request-gated-sample.html` | 88 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `samples/request-gated-sample.html` | 91 | a | Home | `/index.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 91 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 91 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 91 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 91 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 91 | a | Private Client Services | `/additional-services.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 91 | a | Careers | `/careers.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 91 | a | Private Consultation | `/contact.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 104 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `samples/request-gated-sample.html` | 104 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `samples/request-gated-sample.html` | 104 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `samples/request-gated-sample.html` | 106 | a | VitaCoreX | `/index.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 116 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `samples/request-gated-sample.html` | 121 | a | Home | `/index.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 121 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 121 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 121 | a | Structured Case Intake | `/structured-case-intake.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 121 | a | Executive Briefs & Proof | `/resources.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 121 | a | Private Client Services | `/additional-services.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 121 | a | Careers | `/careers.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 121 | a | Private Consultation | `/contact.html` | primary-nav | b2b | — |
| `samples/request-gated-sample.html` | 142 | form | form:(unnamed) | `(self)` | form-submit | b2b | self-post, GET |
| `samples/request-gated-sample.html` | 194 | button | Request access | `(self)` | form-submit | b2b | form-method:GET |
| `samples/request-gated-sample.html` | 195 | a | Back to the sample library | `/sample-deliverable.html` | in-body | b2b | — |
| `samples/request-gated-sample.html` | 205 | a | Open the sample | `#` | anchor | b2b | — |
| `samples/request-gated-sample.html` | 206 | a | Send the request by email | `#` | anchor | b2b | — |
| `samples/request-gated-sample.html` | 220 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `samples/request-gated-sample.html` | 228 | a | Home | `/index.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 229 | a | Solutions | `/solutions.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 230 | a | Industries | `/industries.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 231 | a | About VitaCoreX | `/about.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 232 | a | Revenue Recovery Infrastructure | `/revenue-recovery-workflow.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 233 | a | Corporate Legal File Control | `/corporate-legal-file-control.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 234 | a | Executive Briefs & Proof | `/resources.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 240 | a | Sample Deliverables | `/sample-deliverable.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 241 | a | Structured Case Intake | `/structured-case-intake.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 242 | a | Private consultation | `/contact.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 243 | a | Privacy Policy | `/privacy-policy.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 244 | a | Terms of Use | `/terms-of-use.html` | footer | b2b | — |
| `samples/request-gated-sample.html` | 245 | a | Cookie Policy | `/cookie-policy.html` | footer | b2b | — |
| `samples/small-claims-chronology.html` | 78 | a | Case summary | `#sec-1` | anchor | shared | — |
| `samples/small-claims-chronology.html` | 79 | a | Documentation rubric | `#sec-2` | anchor | shared | — |
| `samples/small-claims-chronology.html` | 80 | a | Day-by-day chronology | `#sec-3` | anchor | shared | — |
| `samples/small-claims-chronology.html` | 81 | a | Evidence index | `#sec-4` | anchor | shared | — |
| `samples/small-claims-chronology.html` | 82 | a | Suggested filings + timing | `#sec-5` | anchor | shared | — |
| `samples/small-claims-chronology.html` | 83 | a | Out of scope | `#sec-6` | anchor | shared | — |
| `samples/small-claims-chronology.html` | 169 | a | See Florida Small Claims Help | `/sample-deliverable.html` | in-body | shared | — |
| `samples/small-claims-chronology.html` | 170 | a | B2B Small Claims & Civil Packet Desk | `/security-and-compliance.html` | in-body | shared | — |
| `secure-coordination.html` | 563 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `secure-coordination.html` | 585 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `secure-coordination.html` | 585 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `secure-coordination.html` | 585 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `secure-coordination.html` | 588 | a | Home | `index.html` | primary-nav | shared | — |
| `secure-coordination.html` | 588 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `secure-coordination.html` | 588 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `secure-coordination.html` | 588 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `secure-coordination.html` | 588 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `secure-coordination.html` | 588 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `secure-coordination.html` | 588 | a | Careers | `careers.html` | primary-nav | shared | — |
| `secure-coordination.html` | 588 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `secure-coordination.html` | 601 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `secure-coordination.html` | 601 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `secure-coordination.html` | 601 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `secure-coordination.html` | 603 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `secure-coordination.html` | 613 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `secure-coordination.html` | 618 | a | Home | `index.html` | primary-nav | shared | — |
| `secure-coordination.html` | 618 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `secure-coordination.html` | 618 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `secure-coordination.html` | 618 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `secure-coordination.html` | 618 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `secure-coordination.html` | 618 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `secure-coordination.html` | 618 | a | Careers | `careers.html` | primary-nav | shared | — |
| `secure-coordination.html` | 618 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `secure-coordination.html` | 660 | a | Open posture page &rarr; | `security-and-compliance.html` | in-body | shared | — |
| `secure-coordination.html` | 666 | a | Open sub-processor list &rarr; | `sub-processors-and-dpa.html` | in-body | shared | — |
| `secure-coordination.html` | 895 | a | Open structured intake | `structured-case-intake.html` | in-body | shared | — |
| `secure-coordination.html` | 896 | a | Request vendor onboarding pack | `contact.html?subject=vendor-onboarding` | in-body | shared | — |
| `secure-coordination.html` | 897 | a | Read Security & Compliance posture | `security-and-compliance.html` | in-body | shared | — |
| `secure-coordination.html` | 914 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `secure-coordination.html` | 915 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `secure-coordination.html` | 921 | a | Home | `index.html` | footer | shared | — |
| `secure-coordination.html` | 922 | a | Solutions | `solutions.html` | footer | shared | — |
| `secure-coordination.html` | 923 | a | Industries | `industries.html` | footer | shared | — |
| `secure-coordination.html` | 924 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `secure-coordination.html` | 925 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `secure-coordination.html` | 926 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `secure-coordination.html` | 927 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `secure-coordination.html` | 928 | a | Case Study: Healthcare Network | `case-study-healthcare-network.html` | footer | shared | — |
| `secure-coordination.html` | 929 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | footer | shared | — |
| `secure-coordination.html` | 930 | a | Sample Deliverable | `sample-deliverable.html` | footer | shared | — |
| `secure-coordination.html` | 931 | a | Security & Compliance | `security-and-compliance.html` | footer | shared | — |
| `secure-coordination.html` | 932 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | footer | shared | — |
| `secure-coordination.html` | 933 | a | Secure Coordination Protocol | `secure-coordination.html` | footer | shared | — |
| `secure-coordination.html` | 939 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `secure-coordination.html` | 940 | a | Deadline Calendar | `/app/deadline-calendar/` | footer | shared | — |
| `secure-coordination.html` | 941 | a | Private consultation | `contact.html` | footer | shared | — |
| `secure-coordination.html` | 942 | a | Careers | `careers.html` | footer | shared | — |
| `secure-coordination.html` | 943 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `secure-coordination.html` | 944 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `secure-coordination.html` | 945 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `security-and-compliance.html` | 361 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 383 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `security-and-compliance.html` | 383 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `security-and-compliance.html` | 383 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `security-and-compliance.html` | 386 | a | Home | `index.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 386 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 386 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 386 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 386 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 386 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 386 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 386 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 399 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `security-and-compliance.html` | 399 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `security-and-compliance.html` | 399 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `security-and-compliance.html` | 401 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 411 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `security-and-compliance.html` | 416 | a | Home | `index.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 416 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 416 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 416 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 416 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 416 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 416 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 416 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `security-and-compliance.html` | 615 | a | Request vendor onboarding pack | `contact.html?subject=vendor-onboarding` | in-body | b2b | — |
| `security-and-compliance.html` | 616 | a | Open structured intake | `structured-case-intake.html` | in-body | b2b | — |
| `security-and-compliance.html` | 634 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `security-and-compliance.html` | 635 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `security-and-compliance.html` | 641 | a | Home | `index.html` | footer | b2b | — |
| `security-and-compliance.html` | 642 | a | Solutions | `solutions.html` | footer | b2b | — |
| `security-and-compliance.html` | 643 | a | Industries | `industries.html` | footer | b2b | — |
| `security-and-compliance.html` | 644 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `security-and-compliance.html` | 645 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `security-and-compliance.html` | 646 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `security-and-compliance.html` | 647 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `security-and-compliance.html` | 648 | a | Case Study: Healthcare Network | `case-study-healthcare-network.html` | footer | b2b | — |
| `security-and-compliance.html` | 649 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | footer | b2b | — |
| `security-and-compliance.html` | 650 | a | Sample Deliverable | `sample-deliverable.html` | footer | b2b | — |
| `security-and-compliance.html` | 651 | a | Security & Compliance | `security-and-compliance.html` | footer | b2b | — |
| `security-and-compliance.html` | 652 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | footer | b2b | — |
| `security-and-compliance.html` | 653 | a | Secure Coordination Protocol | `secure-coordination.html` | footer | b2b | — |
| `security-and-compliance.html` | 659 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `security-and-compliance.html` | 660 | a | Deadline Calendar | `/app/deadline-calendar/` | footer | b2b | — |
| `security-and-compliance.html` | 661 | a | Private consultation | `contact.html` | footer | b2b | — |
| `security-and-compliance.html` | 662 | a | Careers | `careers.html` | footer | b2b | — |
| `security-and-compliance.html` | 663 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `security-and-compliance.html` | 664 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `security-and-compliance.html` | 665 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `small-claims-documentation.html` | 198 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 220 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `small-claims-documentation.html` | 220 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `small-claims-documentation.html` | 220 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `small-claims-documentation.html` | 223 | a | Home | `index.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 223 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 223 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 223 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 223 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 223 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 223 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 223 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 236 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `small-claims-documentation.html` | 236 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `small-claims-documentation.html` | 236 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `small-claims-documentation.html` | 238 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 248 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `small-claims-documentation.html` | 253 | a | Home | `index.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 253 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 253 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 253 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 253 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 253 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 253 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 253 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `small-claims-documentation.html` | 272 | a | Start my packet | `structured-case-intake.html` | in-body | b2b | — |
| `small-claims-documentation.html` | 273 | a | Compare packages | `#compare` | anchor | b2b | — |
| `small-claims-documentation.html` | 480 | a | Start my packet | `structured-case-intake.html` | in-body | b2b | — |
| `small-claims-documentation.html` | 481 | a | Talk to us first | `contact.html` | in-body | b2b | — |
| `small-claims-documentation.html` | 496 | a | See the sample | `samples/small-claims-chronology.html` | in-body | b2b | — |
| `small-claims-documentation.html` | 496 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2b | — |
| `small-claims-documentation.html` | 504 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `small-claims-documentation.html` | 510 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `small-claims-documentation.html` | 511 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `small-claims-documentation.html` | 517 | a | Home | `index.html` | footer | b2b | — |
| `small-claims-documentation.html` | 518 | a | Solutions | `solutions.html` | footer | b2b | — |
| `small-claims-documentation.html` | 519 | a | Industries | `industries.html` | footer | b2b | — |
| `small-claims-documentation.html` | 520 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `small-claims-documentation.html` | 521 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `small-claims-documentation.html` | 522 | a | Net Recovery Program | `pre-collection-pilot.html` | footer | b2b | — |
| `small-claims-documentation.html` | 523 | a | Small Claims Packets | `small-claims-documentation.html` | footer | b2b | — |
| `small-claims-documentation.html` | 524 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `small-claims-documentation.html` | 525 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `small-claims-documentation.html` | 531 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `small-claims-documentation.html` | 532 | a | Private consultation | `contact.html` | footer | b2b | — |
| `small-claims-documentation.html` | 533 | a | Careers | `careers.html` | footer | b2b | — |
| `small-claims-documentation.html` | 534 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `small-claims-documentation.html` | 535 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `small-claims-documentation.html` | 536 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `solutions.html` | 64 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `solutions.html` | 86 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `solutions.html` | 86 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `solutions.html` | 86 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `solutions.html` | 89 | a | Home | `index.html` | primary-nav | b2b | — |
| `solutions.html` | 89 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `solutions.html` | 89 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `solutions.html` | 89 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `solutions.html` | 89 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `solutions.html` | 89 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `solutions.html` | 89 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `solutions.html` | 89 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `solutions.html` | 102 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `solutions.html` | 102 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `solutions.html` | 102 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `solutions.html` | 104 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `solutions.html` | 114 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `solutions.html` | 119 | a | Home | `index.html` | primary-nav | b2b | — |
| `solutions.html` | 119 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `solutions.html` | 119 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `solutions.html` | 119 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `solutions.html` | 119 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `solutions.html` | 119 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `solutions.html` | 119 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `solutions.html` | 119 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `solutions.html` | 141 | a | 1 Revenue Recovery Infrastructure Pre-agency workflow desig… | `revenue-recovery-workflow.html` | in-body | b2b | — |
| `solutions.html` | 151 | a | 2 Corporate Legal File Control Chronology cleanup, packet s… | `corporate-legal-file-control.html` | in-body | b2b | — |
| `solutions.html` | 161 | a | 3 Structured Intake & Packet Build Best for routing, first-… | `structured-case-intake.html` | in-body | b2b | — |
| `solutions.html` | 196 | a | Request confidential review | `structured-case-intake.html` | in-body | b2b | — |
| `solutions.html` | 197 | a | Review industries | `industries.html` | in-body | b2b | — |
| `solutions.html` | 198 | a | VitaCoreX vs collection agency | `vitacorex-vs-traditional-agency.html` | in-body | b2b | — |
| `solutions.html` | 209 | a | See free pilot terms &rarr; | `pre-collection-pilot.html` | in-body | b2b | — |
| `solutions.html` | 222 | a | See diagnostic details &rarr; | `diagnostic-review.html` | in-body | b2b | — |
| `solutions.html` | 249 | a | Request indicative quote | `contact.html` | in-body | b2b | — |
| `solutions.html` | 250 | a | Book 30-min intro | `https://calendly.com/vitacorex2025/30min` | external | b2b | new-tab |
| `solutions.html` | 254 | a | See the sample | `samples/diagnostic-report.html` | in-body | b2b | — |
| `solutions.html` | 254 | a | Browse the full sample library | `sample-deliverable.html` | in-body | b2b | — |
| `solutions.html` | 262 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `solutions.html` | 268 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `solutions.html` | 269 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `solutions.html` | 275 | a | Home | `index.html` | footer | b2b | — |
| `solutions.html` | 276 | a | Solutions | `solutions.html` | footer | b2b | — |
| `solutions.html` | 277 | a | Industries | `industries.html` | footer | b2b | — |
| `solutions.html` | 278 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `solutions.html` | 279 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `solutions.html` | 280 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `solutions.html` | 281 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `solutions.html` | 287 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `solutions.html` | 288 | a | Private consultation | `contact.html` | footer | b2b | — |
| `solutions.html` | 289 | a | Careers | `careers.html` | footer | b2b | — |
| `solutions.html` | 290 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `solutions.html` | 291 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `solutions.html` | 292 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `structured-case-intake.html` | 26 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 48 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `structured-case-intake.html` | 48 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `structured-case-intake.html` | 48 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `structured-case-intake.html` | 51 | a | Home | `index.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 51 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 51 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 51 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 51 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 51 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 51 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 51 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 64 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `structured-case-intake.html` | 64 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `structured-case-intake.html` | 64 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `structured-case-intake.html` | 66 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 76 | button | ☰ Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `structured-case-intake.html` | 81 | a | Home | `index.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 81 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 81 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 81 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 81 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 81 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 81 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 81 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `structured-case-intake.html` | 87 | form | form:intakeForm | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | b2b | POST |
| `structured-case-intake.html` | 97 | button | Company / Portfolio | `(handler)` | action-script | b2b | form-method:POST |
| `structured-case-intake.html` | 98 | button | Private Client | `(handler)` | action-script | b2b | form-method:POST |
| `structured-case-intake.html` | 186 | button | Request structured intake | `https://formsubmit.co/stevenmiller@vitacorexllc.com` | form-submit | b2b | form-method:POST |
| `structured-case-intake.html` | 202 | a | Contract review &rarr; | `/app/contract-intelligence/?service=contracts` | in-body | b2b | — |
| `structured-case-intake.html` | 203 | a | Immigration help &rarr; | `/app/immigration-forms/?service=immigration` | in-body | b2b | — |
| `structured-case-intake.html` | 204 | a | Auto deal check &rarr; | `/app/dealer-contract-check/?service=auto` | in-body | b2b | — |
| `structured-case-intake.html` | 205 | a | Legal assistant &rarr; | `/app/legal-assistant/` | in-body | b2b | — |
| `structured-case-intake.html` | 206 | a | Deadline calendar &rarr; | `/app/deadline-calendar/` | in-body | b2b | — |
| `structured-case-intake.html` | 241 | a | Privacy Policy | `privacy-policy.html` | in-body | b2b | — |
| `structured-case-intake.html` | 242 | a | Terms of Use | `terms-of-use.html` | in-body | b2b | — |
| `structured-case-intake.html` | 243 | a | Cookie Policy | `cookie-policy.html` | in-body | b2b | — |
| `structured-case-intake.html` | 252 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `structured-case-intake.html` | 258 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | b2b | new-tab |
| `structured-case-intake.html` | 259 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | b2b | new-tab |
| `structured-case-intake.html` | 265 | a | Home | `index.html` | footer | b2b | — |
| `structured-case-intake.html` | 266 | a | Solutions | `solutions.html` | footer | b2b | — |
| `structured-case-intake.html` | 267 | a | Industries | `industries.html` | footer | b2b | — |
| `structured-case-intake.html` | 268 | a | About VitaCoreX | `about.html` | footer | b2b | — |
| `structured-case-intake.html` | 269 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `structured-case-intake.html` | 270 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `structured-case-intake.html` | 271 | a | Executive Briefs & Proof | `resources.html` | footer | b2b | — |
| `structured-case-intake.html` | 277 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `structured-case-intake.html` | 278 | a | Deadline Calendar | `/app/deadline-calendar/` | footer | b2b | — |
| `structured-case-intake.html` | 279 | a | Private consultation | `contact.html` | footer | b2b | — |
| `structured-case-intake.html` | 280 | a | Careers | `careers.html` | footer | b2b | — |
| `structured-case-intake.html` | 281 | a | Privacy Policy | `privacy-policy.html` | footer | b2b | — |
| `structured-case-intake.html` | 282 | a | Terms of Use | `terms-of-use.html` | footer | b2b | — |
| `structured-case-intake.html` | 283 | a | Cookie Policy | `cookie-policy.html` | footer | b2b | — |
| `sub-processors-and-dpa.html` | 64 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 86 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `sub-processors-and-dpa.html` | 86 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `sub-processors-and-dpa.html` | 86 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `sub-processors-and-dpa.html` | 90 | a | Home | `index.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 90 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 90 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 90 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 90 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 90 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 90 | a | Careers | `careers.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 90 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `sub-processors-and-dpa.html` | 204 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `sub-processors-and-dpa.html` | 219 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `sub-processors-and-dpa.html` | 234 | a | Security & Compliance, Section 5 | `security-and-compliance.html` | in-body | shared | — |
| `sub-processors-and-dpa.html` | 289 | a | Request the artifact pack | `structured-case-intake.html?source=sub-processors` | in-body | shared | — |
| `sub-processors-and-dpa.html` | 290 | a | Read the full security posture | `security-and-compliance.html` | in-body | shared | — |
| `sub-processors-and-dpa.html` | 302 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `sub-processors-and-dpa.html` | 310 | a | Home | `index.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 311 | a | Solutions | `solutions.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 312 | a | Industries | `industries.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 313 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 314 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 315 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 316 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 322 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 323 | a | Security & Compliance | `security-and-compliance.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 324 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 325 | a | Secure Coordination Protocol | `secure-coordination.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 326 | a | Sample Deliverable | `sample-deliverable.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 327 | a | Procurement FAQ | `faq.html#procurement-faq` | footer | shared | — |
| `sub-processors-and-dpa.html` | 328 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 329 | a | Private Consultation | `contact.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 335 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 336 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `sub-processors-and-dpa.html` | 337 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `terms-of-use.html` | 56 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `terms-of-use.html` | 78 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `terms-of-use.html` | 78 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `terms-of-use.html` | 78 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `terms-of-use.html` | 81 | a | Home | `index.html` | primary-nav | shared | — |
| `terms-of-use.html` | 81 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `terms-of-use.html` | 81 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `terms-of-use.html` | 81 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `terms-of-use.html` | 81 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `terms-of-use.html` | 81 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `terms-of-use.html` | 81 | a | Careers | `careers.html` | primary-nav | shared | — |
| `terms-of-use.html` | 81 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `terms-of-use.html` | 94 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `terms-of-use.html` | 94 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `terms-of-use.html` | 94 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `terms-of-use.html` | 96 | a | VitaCoreX | `index.html` | primary-nav | shared | — |
| `terms-of-use.html` | 106 | button | ☰ Menu | `(handler)` | action-script | shared | aria-wired:controls |
| `terms-of-use.html` | 111 | a | Home | `index.html` | primary-nav | shared | — |
| `terms-of-use.html` | 111 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | shared | — |
| `terms-of-use.html` | 111 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | shared | — |
| `terms-of-use.html` | 111 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | shared | — |
| `terms-of-use.html` | 111 | a | Executive Briefs & Proof | `resources.html` | primary-nav | shared | — |
| `terms-of-use.html` | 111 | a | Private Client Services | `additional-services.html` | primary-nav | shared | — |
| `terms-of-use.html` | 111 | a | Careers | `careers.html` | primary-nav | shared | — |
| `terms-of-use.html` | 111 | a | Private Consultation | `contact.html` | primary-nav | shared | — |
| `terms-of-use.html` | 120 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | in-body | shared | — |
| `terms-of-use.html` | 149 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | in-body | shared | — |
| `terms-of-use.html` | 154 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | in-body | shared | — |
| `terms-of-use.html` | 154 | a | Security & Compliance | `security-and-compliance.html` | in-body | shared | — |
| `terms-of-use.html` | 154 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | in-body | shared | — |
| `terms-of-use.html` | 177 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | in-body | shared | — |
| `terms-of-use.html` | 179 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | in-body | shared | — |
| `terms-of-use.html` | 220 | a | contact form | `contact.html` | in-body | shared | — |
| `terms-of-use.html` | 220 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `terms-of-use.html` | 231 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `terms-of-use.html` | 237 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `terms-of-use.html` | 238 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `terms-of-use.html` | 244 | a | Home | `index.html` | footer | shared | — |
| `terms-of-use.html` | 245 | a | Solutions | `solutions.html` | footer | shared | — |
| `terms-of-use.html` | 246 | a | Industries | `industries.html` | footer | shared | — |
| `terms-of-use.html` | 247 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `terms-of-use.html` | 248 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `terms-of-use.html` | 249 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `terms-of-use.html` | 250 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `terms-of-use.html` | 256 | a | Pricing & Engagement Tiers | `pricing-and-engagement-tiers.html` | footer | shared | — |
| `terms-of-use.html` | 257 | a | Security & Compliance | `security-and-compliance.html` | footer | shared | — |
| `terms-of-use.html` | 258 | a | Sub-processors & DPA | `sub-processors-and-dpa.html` | footer | shared | — |
| `terms-of-use.html` | 259 | a | Sample Deliverable | `sample-deliverable.html` | footer | shared | — |
| `terms-of-use.html` | 260 | a | Procurement FAQ | `faq.html#procurement-faq` | footer | shared | — |
| `terms-of-use.html` | 266 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `terms-of-use.html` | 267 | a | Private consultation | `contact.html` | footer | shared | — |
| `terms-of-use.html` | 268 | a | Careers | `careers.html` | footer | shared | — |
| `terms-of-use.html` | 269 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `terms-of-use.html` | 270 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `terms-of-use.html` | 271 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `thank-you.html` | 44 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | shared | — |
| `thank-you.html` | 51 | button | EN | `(handler)` | action-script | shared | delegated:data-lang=en |
| `thank-you.html` | 51 | button | RU | `(handler)` | action-script | shared | delegated:data-lang=ru |
| `thank-you.html` | 51 | button | ES | `(handler)` | action-script | shared | delegated:data-lang=es |
| `thank-you.html` | 75 | a | Back to home | `index.html` | in-body | shared | — |
| `thank-you.html` | 76 | a | Open structured intake | `structured-case-intake.html` | in-body | shared | — |
| `thank-you.html` | 79 | a | About VitaCoreX | `about.html` | in-body | shared | — |
| `thank-you.html` | 80 | a | Executive briefs | `resources.html` | in-body | shared | — |
| `thank-you.html` | 81 | a | Privacy Policy | `privacy-policy.html` | in-body | shared | — |
| `thank-you.html` | 94 | a | (888) 794-8292 | `tel:+18887948292` | tel | shared | — |
| `thank-you.html` | 100 | a | Instagram | `https://www.instagram.com/vitacorex_llc/` | external | shared | new-tab |
| `thank-you.html` | 101 | a | Facebook | `https://www.facebook.com/profile.php?id=61554844507884` | external | shared | new-tab |
| `thank-you.html` | 107 | a | Home | `index.html` | footer | shared | — |
| `thank-you.html` | 108 | a | Solutions | `solutions.html` | footer | shared | — |
| `thank-you.html` | 109 | a | Industries | `industries.html` | footer | shared | — |
| `thank-you.html` | 110 | a | About VitaCoreX | `about.html` | footer | shared | — |
| `thank-you.html` | 111 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | shared | — |
| `thank-you.html` | 112 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | shared | — |
| `thank-you.html` | 113 | a | Executive Briefs & Proof | `resources.html` | footer | shared | — |
| `thank-you.html` | 119 | a | Structured Case Intake | `structured-case-intake.html` | footer | shared | — |
| `thank-you.html` | 120 | a | Private consultation | `contact.html` | footer | shared | — |
| `thank-you.html` | 121 | a | Careers | `careers.html` | footer | shared | — |
| `thank-you.html` | 122 | a | Privacy Policy | `privacy-policy.html` | footer | shared | — |
| `thank-you.html` | 123 | a | Terms of Use | `terms-of-use.html` | footer | shared | — |
| `thank-you.html` | 124 | a | Cookie Policy | `cookie-policy.html` | footer | shared | — |
| `vitacorex-vs-traditional-agency.html` | 81 | a | VitaCoreX LLC Revenue recovery and documentation infrastruc… | `index.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 89 | button | EN | `(handler)` | action-script | b2b | delegated:data-lang=en |
| `vitacorex-vs-traditional-agency.html` | 89 | button | RU | `(handler)` | action-script | b2b | delegated:data-lang=ru |
| `vitacorex-vs-traditional-agency.html` | 89 | button | ES | `(handler)` | action-script | b2b | delegated:data-lang=es |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Home | `index.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Structured Case Intake | `structured-case-intake.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Executive Briefs & Proof | `resources.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Private Client Services | `additional-services.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Careers | `careers.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 93 | a | Private Consultation | `contact.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 98 | a | VitaCoreX | `index.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 99 | button | ☰Menu | `(handler)` | action-script | b2b | aria-wired:controls |
| `vitacorex-vs-traditional-agency.html` | 101 | a | Home | `index.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 101 | a | Solutions | `solutions.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 101 | a | Industries | `industries.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 101 | a | Briefs | `resources.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 101 | a | Contact | `contact.html` | primary-nav | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 206 | a | Request confidential review | `contact.html` | in-body | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 207 | a | See engagement tiers | `solutions.html#engagement-tiers` | in-body | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 239 | a | (888) 794-8292 | `tel:+18887948292` | tel | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 246 | a | Solutions overview | `solutions.html` | footer | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 247 | a | Revenue Recovery Infrastructure | `revenue-recovery-workflow.html` | footer | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 248 | a | Corporate Legal File Control | `corporate-legal-file-control.html` | footer | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 249 | a | Structured Case Intake | `structured-case-intake.html` | footer | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 250 | a | Industries | `industries.html` | footer | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 251 | a | Executive briefs | `resources.html` | footer | b2b | — |
| `vitacorex-vs-traditional-agency.html` | 252 | a | Private consultation | `contact.html` | footer | b2b | — |

## Methodology

- **Walked**: every `*.html` file under repo root except verification stubs (`google*.html`, `yandex_*.html`) and tool dirs (`node_modules/`, `.git/`, `.tmp/`, `scripts/`, `docs/`, `assets/`, `vcx-api/`).
- **Stripped**: HTML comments, `<script>`, `<style>` — with line-count preservation (non-newlines replaced with spaces) so reported line numbers match the source file.
- **Captured elements**: `<a>`, `<button>`, `<input type=submit|button|image>`, `<form>`, `[role="button"]` on non-a/non-button carriers.
- **Category classifier** (mutually exclusive):
  - `primary-nav` — inside `<nav>` or `<header>` region
  - `footer` — inside `<footer>` region
  - `in-body` — anywhere else, internal navigation link
  - `form-submit` — `<button type=submit>`, `<input type=submit|image>`, or `<form>` itself
  - `external` — `href` starts with `http(s)://` and host is not `vitacorexllc.com`
  - `mailto` / `tel` / `anchor` — href scheme-specific
  - `action-script` — has `onclick`, `javascript:` href, or `role="button"` without a valid target
  - `unknown` — classifier gap (regression signal — exit code 2)
- **Audience**: read from `<body data-audience="...">` (set by P02 Step 2.4). Pages without the attribute classified as `none`.
- **Label extraction priority**: visible innerText → `aria-label` → first `<img alt>` → `title` → `(no label)`.
- **Flags**:
  - `new-tab` — `target="_blank"` set
  - `missing-noopener` — new-tab link without `rel="noopener"` (security/performance)
  - `dead-anchor` — `<a>` with no `href`, `onclick`, or `role` (visible text but no behavior)
  - `no-handler` — button with no `onclick`, no `form`, no `data-*`, no `role` — likely dead
  - `delegated:data-foo,data-bar` — button w/o inline handler but HAS data-* attributes → wired via JS event delegation (e.g. language switcher, accordion toggle). Verify in Step 17.5 Playwright spec; NOT automatically broken.
  - `orphan-input` — `<input type=submit|image>` outside any `<form>`
  - `self-post` — `<form>` with no `action` (submits to self)
  - `form-method:GET|POST` — form method context

## Regeneration

```sh
node scripts/audit-ctas.js
```

Exit codes: `0` OK · `1` I/O or parse error · `2` unclassified rows remain (see `unknown` category above).
