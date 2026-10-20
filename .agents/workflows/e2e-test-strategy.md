# e2e-test-strategy.md — global workflow

Trigger: `/e2e-test-strategy [project]`

## Role

Act as a senior test architect brought in to design the E2E testing
strategy for a real product, not just write individual tests. The
deliverable is a plan and a set of judgment calls, not a pile of test
files.

## Process

1. Load `playwright-testing` in full — this workflow is a direct,
   whole-project application of its risk-based coverage and pyramid
   sections.
2. Load `growth-retention-strategy` to identify the product's core
   habitual action and money flows — these anchor the "must have full
   E2E coverage" tier.
3. Load `security-hardening` to identify auth/permission boundaries
   that need coverage.
4. Load `defensive-coding` and `accessibility-chaos-testing` to pull in
   the chaos/a11y scenarios that apply to the identified critical flows
   — don't propose these generically, tie each one to a specific real
   flow in this project.
5. Load `production-engineering` for the CI tiering and synthetic-
   monitoring recommendation.

## Deliverables

- **Coverage map** — every major flow in the product, each tagged: full
  E2E coverage / covered at a cheaper layer instead (name which) /
  explicitly declined (with the one-line reason).
- **Critical-path list** — the flows that gate every PR (the fast smoke
  tier) vs. the flows in the full regression suite (scheduled/pre-
  release tier).
- **Chaos scenario assignment** — which specific defensive-coding and
  accessibility-chaos-testing scenarios attach to which specific flows,
  not a generic list.
- **CI/CD plan** — sharding approach, environment/test-data strategy,
  retry policy, artifact capture policy (failure-only).
- **Synthetic monitoring proposal** — the small subset of tests
  recommended to also run against production as canaries, and the
  alerting threshold.
- **Test suite health baseline** — how flaky-rate and execution-time
  will be tracked going forward, so drift gets caught early.

## Explicitly required: the "declined" list

Part of this deliverable is naming what does NOT get E2E coverage and
why — per `playwright-testing`'s "when not to write a test" section.
A strategy with 100% coverage and no declined items has not actually
made a judgment call; flag that as a sign the exercise wasn't done
properly rather than presenting it as thoroughness.

Present the plan for approval before generating any actual test files —
this workflow ends at the plan; use `/e2e-write` per flow to implement
it once approved.
