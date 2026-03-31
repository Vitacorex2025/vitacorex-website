# DocketMint Dual Engine Codex Rules

## Purpose

This file defines how Codex must execute future DocketMint dual-engine layers.

The goal is disciplined integration into one coherent SaaS, not a series of disconnected feature drops.

## Global Rules

1. Work in one repo and one deploy path.
2. Treat the DocketMint Dual Engine Master Spec as the product source of truth.
3. Treat the Next.js and Supabase `deadline_v10` line as the technical source of truth.
4. Use the current Python and Render `clean_release` tree only as a reference library for domain logic, flows, and vocabulary.
5. Do not create duplicated Legal and Recovery entities.
6. Do not create a second auth, billing, or audit model.
7. Do not let generator capabilities become a separate product surface.

## Required Pass Order

For feature-bearing layers, implement in this order unless the layer explicitly says otherwise:

1. schema and type layer
2. data access and service layer
3. API or route layer
4. UI and interaction layer
5. tests and seed updates
6. docs, migration notes, and smoke-test result

## Pass Discipline

1. Each layer is a narrow build pass.
2. Read current files before editing.
3. Make the smallest coherent change that satisfies the layer.
4. Do not perform giant rewrites unless a layer explicitly authorizes it.
5. Do not leave partially wired surfaces in the tree.

## Surface Rules

1. Any new page or route must be minimally usable.
2. Placeholder-only pages are not acceptable.
3. New UI must match the canonical data model and actual route behavior.
4. Post-login landing for dual-access users remains the environment chooser.

## Reference-Library Rules

1. Do not port static HTML files from `clean_release` one-to-one into the mainline foundation.
2. Port domain logic, workflow names, vocabulary, field mapping, and proven interaction patterns.
3. If a reference flow conflicts with the master spec, the master spec wins.

## Acceptance Gate For Every Layer

Every layer pass must end with all of the following:

1. a working coherent artifact
2. changed files listed
3. migrations listed, even if none
4. follow-up risks listed
5. smoke-test steps listed
6. changelog entry updated
7. migration notes updated
8. smoke-test result updated

## Risk Handling

1. If a pass exposes a new risk, record it in `42_OPEN_RISKS_AND_DECISIONS_LOG.txt` before continuing.
2. Do not continue silently through unresolved architecture ambiguity.
3. If a prerequisite repo state is missing, log the blocker and stop pretending the layer is fully unblocked.

## Explicitness Rule

Do not describe implementation vaguely.

Every substantial layer should specify:

1. files to change
2. routes to add or update
3. tables or records to add or update
4. tests to add or update
5. migration requirements

## Non-Goals Until Base Model Is Stable

Do not advance these areas ahead of the shared model and core workflow layers:

1. billing expansion
2. analytics expansion
3. growth experiments
4. decorative dashboard rewrites
5. secondary platform shells
