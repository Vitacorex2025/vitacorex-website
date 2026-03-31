# DocketMint Dual Engine

This directory is the working home for the DocketMint dual-engine reset.

The product source of truth is the DocketMint Dual Engine Master Spec.
The technical source of truth is the Next.js and Supabase line derived from the `deadline_v10` build, not the legacy Python and Render shell.
The legacy Python workspace remains a reference library for product logic, flow names, workflow ideas, and field mapping until the mainline repo is cut over into an actual Git branch.

Implementation rules:

1. One product: DocketMint.
2. One platform: shared canonical objects, shared identity, shared billing, shared audit trail.
3. Two operating environments: Legal Workflow and Recovery Pipeline.
4. One execution order: read and apply the master pack in order.
5. One deploy path: no parallel production foundation on the Python shell.
6. One completion bar for every layer: the app stays buildable, testable, and coherent.

Read these files first:

1. `DOCKETMINT_DUAL_ENGINE_MASTER_SPEC.md`
2. `master-pack/README.md`
3. `DECISIONS.md`
4. `BRAND_RULES.md`
5. `PRODUCT_LANGUAGE.md`
6. `CODEX_RULES.md`
7. `EXECUTION_SEQUENCE.md`
8. `GATES.md`
9. `OWNERSHIP_MATRIX.md`
10. `STACK_DECISION.md`
11. `ENVIRONMENT_STRATEGY.md`
12. `CHANGELOG_EXECUTION.md`
13. `42_OPEN_RISKS_AND_DECISIONS_LOG.txt`
