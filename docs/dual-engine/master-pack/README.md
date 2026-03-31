# DocketMint Dual Engine Master Pack

This folder contains the governing execution order for the DocketMint dual-engine reset.

Read order:

1. `00_START_AND_READING_ORDER.md`
2. `01_HARD_PRODUCT_AND_ARCHITECTURE_DECISIONS.md`
3. `02_CODEX_LAYER_EXECUTION_RULES.md`
4. `03_MAIN_BUILD_SEQUENCE.md`
5. `04_TECH_FOUNDATION_NEXTJS_SUPABASE.md`
6. Continue through the remaining numbered layers in strict order.

Execution order:

`00 -> 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 09 -> 10 -> 11 -> 12 -> 13 -> 14 -> 15 -> 16 -> 17 -> 18 -> 19 -> 20 -> 21 -> 22 -> 23 -> 24 -> 25 -> 26 -> 27 -> 28 -> 29 -> 30 -> 31 -> 32 -> 33 -> 34 -> 35 -> 36 -> 37 -> 38 -> 39 -> 40 -> 41 -> 42 -> 43`

Hard rules:

1. One repo.
2. One deploy path.
3. One data model.
4. No parallel Python and Render production foundation.
5. No duplicated Legal and Recovery entities.
6. No generator module split into a separate product.
7. No silent continuation when a new risk appears.

Current status:

1. Layer 00 is implemented in this docs pass.
2. Layer 01 is implemented in this docs pass.
3. Layer 02 is implemented in this docs pass.
4. Layer 03 is implemented in this docs pass.
5. Layer 04 is implemented in this docs pass.
6. The branch intent is `feature/docketmint-dual-engine-reset`, but branch creation is blocked until this work is moved into a real Git checkout.
