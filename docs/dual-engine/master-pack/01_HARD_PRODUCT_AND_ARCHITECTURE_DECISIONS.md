# Layer 01 - Hard Product And Architecture Decisions

## Objective

Lock the decisions without which the system will collapse back into a hybrid mess.

## Why This Layer Exists

The biggest danger is not lack of ideas. It is lack of irreversible decisions. This layer cuts ambiguity early.

## Depends On

Layer 00.

## Codex Directive

Work as a principal full-stack engineer and product architect.
Do not create disconnected concept code.
Do not create duplicated entities across Legal and Recovery.
End this pass with a working, coherent artifact.

## Tasks

1. Rename the product internally and externally as DocketMint.
2. Lock the public positioning: one platform, two operational engines.
3. Lock the two operating environments: Legal Workflow and Recovery Pipeline.
4. Ban the model of two databases, two identity systems, or two billing systems.
5. Ban a separate product called case generator. Generator remains a capability module.
6. Lock Legal and Recovery as different interfaces on top of shared canonical objects.
7. Lock the rule that post-login home does not dump users straight into calendar or generator views.
8. Lock the rule that the environment chooser is mandatory for dual-access users.

## Files Or Areas To Create Or Change

1. `docs/dual-engine/DECISIONS.md`
2. `docs/dual-engine/BRAND_RULES.md`
3. `docs/dual-engine/PRODUCT_LANGUAGE.md`

## Acceptance Criteria

1. Any engineer can answer "what is this product?" in one sentence without confusion.
2. Active documentation no longer treats Deadline CRM Calendar as the external product.
3. There is an unambiguous rule that generator capabilities cannot become a separate app surface.

## Do Not Do

1. Do not leave live copy with generic CRM wording and no vertical descriptor.
2. Do not build two dashboard junkyard surfaces.
3. Do not leave the base stack undecided.

## Delivery Format For Codex

1. Start by reading the existing code before editing.
2. Explain the minimal architectural move for the layer.
3. Implement the layer fully enough that the app remains coherent.
4. List changed files.
5. List migrations.
6. List follow-up risks.
7. Provide smoke-test steps.
