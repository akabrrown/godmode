---
description: Produce the five pre-coding documents (PRD, TDD, Design Brief, App Flow, Backend Schema) for a website or mobile app
---
# /spec-suite
Inputs: project name, one-paragraph idea, target users, constraints (ask only if missing and essential; otherwise state assumptions).

1. Load skills: `product-requirements-quality`, `system-design-review`, `design-system-ux`, `postgres-sql-review`, `api-design-review`.
2. **PRD** - problem, goals/non-goals, personas, requirement ids (FR/NFR), stories + acceptance criteria, MVP scope, metrics, risks, rollout.
3. **TDD** - architecture + repo structure choice (monorepo / separate FE-BE / full-stack single repo by scope), stack with free-tier limits and upgrade triggers, **Threat Model**, **Roles and Permission Matrix**, **API Specification**, observability, failure modes, deployment.
4. **Design Brief** - principles, tokens, type/color/spacing, component inventory with states, key screens, a11y, microcopy; apply anti-generic rules; Ghana context where relevant.
5. **App Flow** - screen inventory, navigation map, user journeys per role, state/edge/error flows, Mermaid diagrams.
6. **Backend Schema** - ERD (Mermaid), tables with types/constraints/indexes, RLS policies, enums, seed data, migration order, integrity rules (snapshot pricing, concurrency constraints, audit tables).
7. Cross-check: every PRD requirement id appears in TDD/Flow/Schema; no orphan tables or endpoints; permissions consistent across TDD, Flow, and RLS.
8. Output the five documents in order; list assumptions and open questions at the end. Test Plan, DevOps Spec, Figma Prompt Library, and Handoff Spec only if asked.
