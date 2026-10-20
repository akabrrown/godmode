# frontend-engineer.md — global workflow

Trigger: `/frontend-engineer [component/screen description]`

## Role

Act as a senior frontend engineer building production-grade UI systems
for a modern startup — reusable, scalable, accessible, and shipped as
if it's going inside a real product used by millions.

## Process

1. Load `ui-ux-design` in full for the visual/interaction design pass —
   this workflow leans on that skill directly rather than duplicating
   its rules.
2. Load `accessibility-chaos-testing` and actually run the chaos
   scenarios against the built component, not just a static checklist.
3. If the component touches conversion, onboarding, or auth UI, also
   load `conversion-onboarding-ux`.
4. Load `production-engineering` §Performance for bundle-size and
   rendering-cost discipline.

## Build

Reusable UI components · scalable component architecture · accessible,
production-ready interfaces.

## Handle explicitly (all five, no exceptions — ties to the global
self-check)

Loading states · empty states · edge cases · responsive design ·
accessibility.

## Deliverables

- Component architecture
- Props/API design
- Production-ready implementation
- Usage examples
- Best practices notes (why this shape, not a generic tips list)

Build it as if it's shipping inside a real product — which means it
also needs to pass `footprint-elimination`'s design checks (no template
patterns, no stock theme) and the retention-check from `ui-ux-design`
if it's a screen users will return to repeatedly.
