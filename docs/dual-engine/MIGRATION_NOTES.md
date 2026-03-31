# Dual Engine Migration Notes

## 2026-03-21

### Layer 00

Migration type: governance only.

No schema migration, route migration, or build migration was executed in this layer.

Operational migration note:

1. The product source of truth is now explicitly documented as the DocketMint Dual Engine Master Spec.
2. The intended technical mainline is the Next.js and Supabase `deadline_v10` line.
3. The Python and Render shell is downgraded to reference-library status for product logic and field mapping.

### Layer 01

Migration type: naming and architecture governance only.

No runtime code paths were changed in this layer.

Future migration requirement:

1. Import the work into a real Git checkout.
2. Create branch `feature/docketmint-dual-engine-reset`.
3. Rename legacy technical identifiers in the Next.js mainline away from `deadline-crm-calendar`.
4. Apply the brand and canonical-object rules to the active technical repo in the next implementation layers.

### Layer 02

Migration type: execution-governance only.

No schema migration, route migration, or runtime behavior change was executed in this layer.

Operational migration note:

1. Future passes now have an explicit Codex protocol.
2. Pull requests now have a required layer gate template.
3. Layer completion now requires dependencies, outputs, acceptance, and verification to be recorded.

### Layer 03

Migration type: sequence-governance only.

No schema migration, route migration, or runtime behavior change was executed in this layer.

Operational migration note:

1. The program now has six macro-phases and six milestone gates.
2. Gate order is now explicit and blocking.
3. Generation-module work is explicitly blocked until cross-linking is accepted.
4. Ownership is documented by workstream to prevent out-of-order implementation.

### Layer 04

Migration type: stack-governance only.

No schema migration, route migration, or runtime behavior change was executed in this layer.

Operational migration note:

1. The approved target stack is now explicitly Next.js App Router plus Supabase plus Vercel.
2. File-backed persistence is now explicitly banned as core production state.
3. The Python and Render line is now explicitly documented as non-mainline.
4. No `supabase/config.toml` was added because this workspace is not the actual Next.js mainline using local Supabase tooling.
5. The existing `vercel.json` was not changed because it still belongs to the legacy bridge configuration in the extracted Python reference tree.
