# Layer 03 - Main Build Sequence

## Objective

Break the program into build phases so the team cannot execute work in the wrong order.

## Why This Layer Exists

The most common failure is building attractive UI before the canonical model, permissions, and cross-environment rules exist.

## Depends On

Layers 00 through 02.

## Codex Directive

Work as a principal full-stack engineer and product architect.
Do not create disconnected concept code.
Do not create duplicated entities across Legal and Recovery.
End this pass with a working, coherent artifact.

## Tasks

1. Split the program into 6 macro phases: reset, foundation, engines, cross-linking, automation, hardening.
2. Define milestone gates: Gate A foundation, Gate B Legal MVP, Gate C Recovery MVP, Gate D cross-linking, Gate E generation module, Gate F production readiness.
3. Define mandatory smoke tests for every gate.
4. Tie ownership to schema, frontend shell, legal engine, recovery engine, and docs and testing.
5. Create a simple execution board with planned, in progress, blocked, and accepted states.
6. Ban movement to the next gate before the previous gate is accepted.

## Files Or Areas To Create Or Change

1. `docs/dual-engine/EXECUTION_SEQUENCE.md`
2. `docs/dual-engine/GATES.md`
3. `docs/dual-engine/OWNERSHIP_MATRIX.md`

## Acceptance Criteria

1. There is a clear route from legacy state to production state.
2. Packet generation does not start before Gate D is accepted.
3. There is no ambiguity about what must happen first.

## Do Not Do

1. Do not schedule design polish before a working permissions model.
2. Do not build a mobile wrapper before stable app home and core actions.

## Delivery Format For Codex

1. Start by reading the existing code before editing.
2. Explain the minimal architectural move for the layer.
3. Implement the layer fully enough that the app remains coherent.
4. List changed files.
5. List migrations.
6. List follow-up risks.
7. Provide smoke-test steps.
