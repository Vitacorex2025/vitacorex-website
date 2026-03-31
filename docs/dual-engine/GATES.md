# DocketMint Dual Engine Gates

## Gate Rule

No gate may begin implementation until its prerequisite gate is accepted.

No gate is accepted until all mandatory smoke tests pass and the layer logs are updated.

## Gate A - Foundation

Purpose:

1. establish canonical schema
2. establish role and permissions model
3. establish shared auth, membership, entitlement, billing, and audit boundaries
4. establish stable post-login home and environment chooser behavior

Must be true before acceptance:

1. one shared canonical model exists
2. no duplicate Legal and Recovery entities exist
3. permissions and environment access rules are working
4. stable app home exists
5. App Router, Supabase, and the single deploy story are locked as the approved technical foundation

Mandatory smoke tests:

1. auth and session smoke
2. environment chooser routing smoke
3. permissions and role smoke
4. schema migration smoke

Recommended command baseline:

`cmd /c ".venv\Scripts\activate.bat && python -m pytest backend/tests/test_auth_isolation.py backend/tests/test_release_gate.py -q"`

## Gate B - Legal MVP

Purpose:

1. deliver minimally usable Legal Workflow
2. keep legal views attached to shared records and permissions

Must be true before acceptance:

1. legal matter views work on shared canonical records
2. legal actions respect permissions
3. legal home does not fork auth or billing

Mandatory smoke tests:

1. legal route loading smoke
2. legal record creation and retrieval smoke
3. permissions smoke for legal actions
4. regression smoke on shared auth and home

## Gate C - Recovery MVP

Purpose:

1. deliver minimally usable Recovery Pipeline
2. keep recovery views attached to shared records and permissions

Must be true before acceptance:

1. recovery workflow works on shared canonical records
2. recovery actions respect permissions
3. recovery home does not fork auth or billing

Mandatory smoke tests:

1. recovery route loading smoke
2. recovery record and workflow smoke
3. permissions smoke for recovery actions
4. regression smoke on shared auth and home

## Gate D - Cross-Linking

Purpose:

1. connect Legal and Recovery over the same records
2. preserve continuity for escalation and handoff
3. make cross-environment movement coherent

Must be true before acceptance:

1. shared record linking works between environments
2. escalation continuity is visible
3. no duplicated state is required to hand work across engines

Mandatory smoke tests:

1. cross-environment navigation smoke
2. shared-record visibility smoke
3. escalation handoff smoke
4. regression smoke for permissions and auth

## Gate E - Generation Module

Purpose:

1. introduce generation and automation modules
2. keep them as capabilities inside DocketMint

Must be true before acceptance:

1. generation works on shared records
2. generation respects permissions
3. generation does not create a separate product surface

Mandatory smoke tests:

1. generation route smoke
2. generation output smoke
3. permissions smoke for generation actions
4. regression smoke on cross-linking and shared records

Entry rule:

1. Gate D must already be accepted before Gate E work starts

## Gate F - Production Readiness

Purpose:

1. harden the platform for production
2. verify release discipline and rollback safety

Must be true before acceptance:

1. major routes open successfully
2. auth, permissions, and shared model regressions are covered
3. release docs and smoke tests are current
4. deployment path is singular and explicit

Mandatory smoke tests:

1. full gate regression smoke
2. deployment and startup smoke
3. diagnostics and monitoring smoke
4. release packaging smoke

## Acceptance Logging Rule

Every accepted gate must update:

1. `docs/dual-engine/CHANGELOG.md`
2. `docs/dual-engine/MIGRATION_NOTES.md`
3. `docs/dual-engine/SMOKE_TEST_RESULTS.md`
4. `docs/dual-engine/CHANGELOG_EXECUTION.md`
5. `docs/dual-engine/42_OPEN_RISKS_AND_DECISIONS_LOG.txt` when new risk appears
