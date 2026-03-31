# Layer 00 - Start And Reading Order

## Objective

This layer is the control file for the dual-engine reset. It sets the only correct execution order and blocks product drift into two parallel code lines.

## Why This Layer Exists

The current situation combines a strong technical base in Next.js and Supabase with strong product logic in the DocketMint clean release. The failure mode is trying to grow both lines as if they are already one product. This layer exists to turn that into one coherent SaaS.

## Depends On

Nothing. This is the entry point.

## Codex Directive

Work as a principal full-stack engineer and product architect.
Do not create disconnected concept code.
Do not create duplicated entities across Legal and Recovery.
End this pass with a working, coherent artifact.

## Tasks

1. Recognize the single product source of truth: DocketMint Dual Engine Master Spec.
2. Recognize the single technical source of truth: the branch based on `deadline_v10`, not the Python and Render shell.
3. Use `clean_release` only as a reference library for product logic, flow names, workflow ideas, and field mapping.
4. Do not run the refactor in two repositories at once. One repo. One deploy path. One data model.
5. Execute the pack strictly in order. Do not jump to packet generation before the shared model exists.
6. End every pass in a working state: build passes, tests pass, routes open, schema migrates.
7. After every layer, record a changelog entry, migration note, and smoke-test result.
8. If a layer opens a new risk, add it to `42_OPEN_RISKS_AND_DECISIONS_LOG.txt` before continuing.

## Files Or Areas To Create Or Change

1. Create branch `feature/docketmint-dual-engine-reset`.
2. Create directory `docs/dual-engine/`.
3. Copy this pack into `docs/dual-engine/master-pack/`.

## Acceptance Criteria

1. The team understands the product as one DocketMint, not Deadline CRM plus a separate generator.
2. The execution order is explicit and approved.
3. There is a hard rule that Python and Render cannot remain the main production path.

## Do Not Do

1. Do not describe this as two separate SaaS products.
2. Do not leave Deadline CRM as the external product brand.
3. Do not port the HTML shell into the next production foundation.

## Notes

Execution order:

`00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21 -> 22 -> 23 -> 24 -> 25 -> 26 -> 27 -> 28 -> 29 -> 30 -> 31 -> 32 -> 33 -> 34 -> 35 -> 36 -> 37 -> 38 -> 39 -> 40 -> 41 -> 42 -> 43`

## Delivery Format For Codex

1. Start by reading the existing code before editing.
2. Explain the minimal architectural move for the layer.
3. Implement the layer fully enough that the app remains coherent.
4. List changed files.
5. List migrations.
6. List follow-up risks.
7. Provide smoke-test steps.
