---
name: product-requirements-quality
description: Write and quality-check PRDs and product docs - problem framing, personas, user stories, acceptance criteria, scope, metrics, prioritization, roadmap, risks, go-to-market. Use when creating or reviewing a PRD, feature spec, backlog, roadmap, success metrics, or when a request is vague and needs product framing before engineering.
---
# Product requirements quality

## PRD must contain
1. **Problem and evidence**: who hurts, how much, how we know (interviews, data, competitor gaps). 2. **Goals and non-goals** (explicit). 3. **Users/personas and jobs-to-be-done**. 4. **Value proposition** and differentiation. 5. **User stories** with testable **acceptance criteria** (Given/When/Then). 6. **Scope**: MVP vs later (MoSCoW or Now/Next/Later); guard against feature creep. 7. **Success metrics**: one north-star + leading indicators (activation, conversion, retention/churn, DAU/MAU, CAC where relevant), baseline and target. 8. **Constraints**: legal/compliance, payments (MoMo), connectivity, device, budget, timeline. 9. **Risks and assumptions** with validation plan; contingency. 10. **Rollout**: feature flags, dark launch, pilot, rollback, comms. 11. **Open questions** and decision owners.

## Prioritization
Score with RICE or Impact/Effort; make trade-offs visible; revisit continuously (continuous roadmapping). Roadmap = outcomes and themes, not just feature lists; communicate to stakeholders by audience.

## Discovery and validation
Talk to users, ethnographic observation, competitor and market analysis, prototype and test before building, A/B tests for uncertain bets, feedback loops after launch, cohort analysis for retention.

## Quality gate (reject the PRD if any is true)
Goals not measurable; stories without acceptance criteria; no non-goals; metrics without baseline; assumptions unlisted; scope that cannot ship in the stated timeline.

## Handoff
The PRD feeds the TDD, Design Brief, App Flow, and Backend Schema; every requirement gets an id (FR-001 / NFR-001) so later documents can reference it.
