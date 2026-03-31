# Layer 02 - Codex Layer Execution Rules

## Objective

Give Codex a working protocol so the system is built in disciplined layers rather than fragmented jumps.

## Why This Layer Exists

Even a good spec breaks if implementation passes are shallow, oversized, or skip acceptance gates.

## Depends On

Layers 00 and 01.

## Codex Directive

Work as a principal full-stack engineer and product architect.
Do not create disconnected concept code.
Do not create duplicated entities across Legal and Recovery.
End this pass with a working, coherent artifact.

## Tasks

1. Execute each layer as a separate build pass with narrow scope.
2. Read current files before editing and do not rewrite blindly.
3. Change schema and type layers first, then data access, then UI.
4. Update tests, seed, docs, and migration notes in every pass.
5. Do not create placeholder-only pages. Any new surface must be minimally usable.
6. Do not copy static HTML pages from `clean_release` one-to-one. Carry over domain logic, flows, and vocabulary only.
7. Do not create duplicated entities for speed.
8. End every pass with a changed-files list and smoke-test steps.

## Files Or Areas To Create Or Change

1. `docs/dual-engine/CODEX_RULES.md`
2. `.github/pull_request_template.md`
3. `docs/dual-engine/CHANGELOG_EXECUTION.md`

## Acceptance Criteria

1. Future Codex commands can be executed one layer at a time without logical gaps.
2. Every layer has dependencies, outputs, and explicit acceptance.
3. No magical actions are left unspecified across files, tables, or routes.

## Do Not Do

1. Do not attempt a giant rewrite in one pass.
2. Do not touch billing or analytics before the base model is complete.
3. Do not leave schema and UI in conflict.

## Delivery Format For Codex

1. Start by reading current files before editing.
2. Explain the minimal architectural move for the layer.
3. Implement the layer fully enough that the app remains coherent.
4. List changed files.
5. List migrations.
6. List follow-up risks.
7. Provide smoke-test steps.
