# AGENTS.md

## Global Rules Block

Apply the following block at the top of every Codex run before the step-specific prompt.

This block is additive to the rest of this file. If two sections require different folders or reports, satisfy both rather than choosing one over the other.

```text
You are working inside the active VitaCoreX website repo.

NON-NEGOTIABLE RULES:
- Do not fake passing diagnostics.
- Do not claim visual QA unless screenshots or browser verification were actually produced.
- Do not break trackers, attribution capture, form endpoints, Calendly links, or existing analytics events.
- Do not remove compliance disclaimers such as “not a law firm” / “not a collection agency” unless a page-specific rewrite explicitly preserves the legal meaning elsewhere.
- Do not create parallel shells, parallel i18n systems, parallel calculator engines, or parallel CSS systems. Unify ownership.
- Preserve backward compatibility where feasible; if a breaking change is required, document it explicitly.
- English is the canonical copy source. Russian and Spanish are editorial translations, not literal machine mirrors.
- Every run must create its own immutable work folder and a full-project ZIP export.

MANDATORY STRUCTURE FOR THIS RUN:
- Create `codex_runs/<STEP_FOLDER>/`
- Create `codex_runs/<STEP_FOLDER>/reports/`
- Create `codex_runs/<STEP_FOLDER>/artifacts/`
- Create `codex_runs/<STEP_FOLDER>/screens/`
- Create `codex_runs/<STEP_FOLDER>/diffs/`
- Create `codex_runs/<STEP_FOLDER>/exports/`

MANDATORY AGENT MODEL:
- Use 8 focused parallel agents maximum unless the task explicitly asks for fewer.
- Each agent must own a non-overlapping surface.
- Merge only after each agent writes a short report.
- No uncontrolled parallel editing of the same file group.

MANDATORY FULL-REPO AUDIT IN EVERY STEP:
1. Scan all repo files touched directly or indirectly by the step.
2. Detect:
   - duplicate logic
   - dead code
   - untranslated visible strings
   - low contrast text
   - CLS/LCP risks
   - broken selectors / event bindings
   - missing aria / focus traps where relevant
   - form / calculator regression risks
   - metadata / hreflang / canonical / schema issues
   - tracker / analytics / hidden-field regressions
3. Remove only safe junk that is proven unreferenced.
4. Keep a touched-files manifest.

MANDATORY DIAGNOSTICS IN EVERY STEP:
- run repo-wide search for TODO/FIXME/HACK in touched surfaces
- run HTML validation on changed pages where feasible
- run CSS/JS syntax checks where feasible
- run browser smoke on changed pages if browser tooling exists
- run link and asset integrity checks
- run translation coverage check
- run calculator/form smoke check where relevant

MANDATORY CLOSEOUT IN EVERY STEP:
- write `reports/STEP_SUMMARY.md`
- write `reports/CHANGED_FILES.md`
- write `reports/REGRESSION_RISKS.md`
- write `reports/RAW_FINDINGS.md`
- write `reports/AGENT_REPORTS.md`
- create `exports/full_site_<STEP_FOLDER>.zip`
- print exact export path and checksum
- do not declare success unless the export exists
```

## Project Runbook

- Every task must run in a fresh folder: `codex_runs/step_XX_<slug>/`
- Before edits, copy the full current site into `codex_runs/step_XX_<slug>/site/`
- Always create: `audit/`, `reports/`, `screens/`, `exports/`, `diffs/`

## Required Artifacts After Every Step

- `reports/STEP_SUMMARY.md`
- `reports/LINE_AUDIT.md`
- `reports/RISKS.md`
- `reports/QA_REPORT.md`
- `exports/full_site_step_XX_<slug>.zip`

## Preservation Rules

- Never remove or break:
- `window.VCX_TRACKING_IDS`
- GA/gtag hooks
- Apollo tracker hooks
- Calendly links
- FormSubmit endpoints
- hidden attribution fields (`utm_*`, `gclid`, `fbclid`, `msclkid`, `li_fat_id`, referrer, landing page)
- phone `tel:` behavior

## Audit and Verification Rules

- Every run must do a line-by-line audit of all changed files.
- Every run must run a full broken-link and missing-asset check.
- Every run must preserve legal disclaimers unless improving clarity.
- Company-first B2B positioning is primary; individual services remain secondary.
- If production and archive diverge, record divergence before editing.

## Menu, Translation, and Analytics Rules

- If menu is touched, test: click, touch, Escape, outside click, resize reset, navigation-close.
- If translation is touched, ensure all visible strings are covered and language persists across navigation.
- If analytics are touched, preserve backward compatibility and document every change.

## Failure Handling

- If a step fails, explicitly list unresolved issues rather than marking the step complete.
