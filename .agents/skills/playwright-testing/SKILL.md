---
name: playwright-testing
description: Use whenever writing, reviewing, or running end-to-end/browser tests with Playwright — new test files, verifying a feature actually works in a real browser, visual regression, accessibility automation, or debugging a flaky test. Trigger on "playwright," "e2e test," "browser test," "write a test for this flow," or when `software-engineering-os`'s verification loop calls for real-application validation and Playwright is the tool available.
---

# Playwright testing

A test that passes but doesn't verify real behavior is worse than no
test — it's false confidence. Every test here exists to answer
`software-engineering-os` §6/§19's question honestly: does this actually
work, verified, not assumed.

## The senior-engineer shift: from "write tests" to "decide what's worth testing, at which layer"

A junior instinct is to write an E2E test for everything. A senior
instinct is to ask, for every candidate test: what layer should verify
this, and does E2E actually earn its cost here? E2E tests are the most
expensive, slowest, and most brittle layer in the pyramid — real browser
startup, real network, real timing. Reserve them for what only they can
verify: full user journeys crossing multiple systems (frontend → API →
database → back), and the handful of critical paths where "does this
work end to end" is the actual question. Push everything else down:
business logic → unit tests. Component behavior → component tests. API
contracts → integration/contract tests. If a unit test could catch the
same bug in milliseconds instead of seconds, the unit test is correct
and the E2E test is waste.

## Risk-based coverage, not 100% coverage as a goal

Prioritize by business impact × likelihood of breaking × blast radius —
not by exhaustively walking every possible path. Concretely, for a
typical product: money flows (checkout, refunds, subscription changes),
auth (login, signup, permission boundaries), data integrity (anything
that could corrupt or leak another user's data), and the core habitual
action from `growth-retention-strategy`'s "one repeated action" concept
get full E2E coverage including edge cases. Low-traffic admin utilities,
purely cosmetic UI, and anything already covered by a cheaper test layer
get thinner coverage or none. Naming this trade-off explicitly — and
being willing to say "this doesn't need an E2E test, here's why" — is
itself the senior behavior; reflexively testing everything at the most
expensive layer is not rigor, it's cost with no judgment behind it.

## When NOT to write a Playwright test

Decline, explicitly, and say why, when: the behavior is already
verified by a cheaper unit/integration test with no unique cross-system
risk E2E would catch · the feature is short-lived enough that
maintaining the test will cost more than it ever prevents · it's purely
visual polish with low behavior risk (use `ui-ux-design`'s
`/design-fingerprint` or a targeted visual-regression snapshot instead,
not a full E2E flow) · the flow is already covered end-to-end by a
broader test and this would be redundant duplication of the same path.
A senior engineer's "no, and here's why" is a deliverable, not a gap.

## Test code is production code

Same bar as everything else in `footprint-elimination`: no copy-pasted
setup blocks (extract shared fixtures/helpers), no generic names
(`test1`, `checkThing`), no commented-out or skipped-and-forgotten
tests left in the suite, no dead page-object methods. Test code gets
reviewed with the same rigor as feature code — a sloppy test suite
erodes trust in the same way sloppy production code does, and is
usually a leading indicator of the second.

## Selector strategy — accessibility-first, not CSS-first

Prefer role/label/text-based locators over CSS selectors, XPath, or
brittle `nth-child` chains: `getByRole('button', { name: 'Save
changes' })`, `getByLabel('Email address')`, `getByText('No orders
yet')`. This is not just more resilient to markup changes — it's also a
free accessibility check, since a locator that can't find an element by
role or label usually means that element isn't properly labeled for a
screen reader either. Fall back to `data-testid` only when no accessible
selector exists, and treat that as a signal to fix the markup, not just
the test. Never select by raw CSS class names tied to styling — a
visual refactor shouldn't break the test suite.

## Waiting — never arbitrary sleeps

Playwright auto-waits; use web-first assertions
(`await expect(locator).toBeVisible()`, `.toHaveText()`,
`.toBeEnabled()`) instead of `page.waitForTimeout()`. An arbitrary sleep
either makes the test slower than necessary or, worse, flaky under load
— it's guessing at timing instead of waiting for the actual condition.
For network-dependent state, wait on the specific response
(`page.waitForResponse`) or the resulting UI state, not a fixed delay.

## Test isolation

Each test gets fresh, independent state — no shared mutable fixtures
between tests, no dependency on execution order. Seed test data via API
or direct database calls where possible (fast, reliable) and reserve
full UI-driven setup for the specific flow actually being tested.
Isolate test users/tenants so parallel test runs don't collide on the
same data (ties directly to `defensive-coding`'s race-condition
concerns — test suites hit the same concurrency bugs production traffic
does if isolation is sloppy).

## Structure — Page Object Model, sized to the project

For anything beyond a handful of tests, wrap page interactions in
page-object classes/functions so a UI change means updating one place,
not every test that touches that screen. Don't over-abstract a small
test suite into a heavy POM hierarchy it doesn't need yet —
`software-engineering-os` §8's "avoid unnecessary complexity" applies to
test code too.

## Translate other skills' chaos scenarios into real tests

This is the highest-value connection in this skill: the scenarios
already named elsewhere in this config should become actual Playwright
tests, not stay theoretical.

- From `defensive-coding` — actually simulate rapid double-clicks on a
  submit button and assert only one request/record results; use
  `page.route()` to abort a request mid-flight and assert the UI shows a
  real error state, not a silent hang; open two browser contexts and
  race them against the same resource (e.g. last-seat booking) to
  verify the server-side lock actually holds.
- From `accessibility-chaos-testing` — automate the keyboard-only walk
  (`page.keyboard.press('Tab')` through a flow, assert focus order and
  visible focus states); run `@axe-core/playwright` on every key screen
  in CI for the static WCAG sweep, and keep the deeper manual
  screen-reader pass as a human task that skill already covers.
- From `offline-sync-conflict-resolution` — use
  `context.setOffline(true)` mid-flow to verify the queued/syncing/
  synced/conflict/failed states actually render, not just that the
  offline case doesn't crash.
- From `i18n-l10n-footprints` — run key flows with a locale set to a
  long-string language (German/Finnish) and assert no layout overflow
  or truncation.

## Network mocking

Use `page.route()` to deterministically test states that are hard to
trigger for real: a slow/timing-out API (assert the loading state
renders and eventually the timeout error state, not an infinite
spinner), a 500 response (assert the generic, non-leaking error message
from `security-hardening`'s error-handling rule actually shows), a
malformed response shape (assert the client doesn't crash on unexpected
data). This is cheaper and more reliable than trying to reproduce these
conditions against a real backend.

## Visual regression (only where it earns its cost)

Screenshot comparison is valuable for a small set of visually critical,
rarely-changing screens (marketing pages, a design system's core
components) — not a blanket policy across every screen, since visual
diffs on frequently-changing UI create constant noise that trains people
to ignore failures. Mask genuinely dynamic content (timestamps, live
data, ads) before comparing. Tune the diff threshold deliberately rather
than accepting the default.

## Flakiness discipline

A flaky test is a bug in the test or a real race condition in the
product — never paper over one with a blind retry-until-green policy.
CI retries are acceptable as a safety net (once), but a test that needs
retries to pass consistently should be root-caused, not just tolerated
— apply `debugging-protocol`'s full trace-the-data-path process to a
flaky test the same as any other bug. Capture trace/video/screenshot
only on failure, not on every run, to keep artifact storage sane.

## Quota awareness

Each test spins up a real browser — this is genuinely expensive
compared to most other work in this config. Per
`quota-efficient-execution`: don't run the full suite reflexively after
every small change, parallelize where the CI runner supports it, and
scope a debugging session to the one failing test/flow rather than
re-running everything to "make sure." Save the full cross-browser/
device matrix for CI or a deliberate pre-ship pass, not every local
iteration.

## CI/CD integration at scale

Shard the suite across parallel workers so wall-clock time doesn't grow
linearly with test count. Split into two tiers: a fast smoke subset
(the handful of truly critical paths) that gates every PR/merge, and
the full regression suite that runs on a schedule or before release —
not every commit, if the full suite is slow enough to become friction
people start bypassing. Manage test-account/secrets separately per
environment (never real user data or production credentials in test
runs — ties to `security-hardening`'s environment-separation rule).
Fail the build on a real assertion failure; don't let a flaky-and-
retried-until-green test quietly become the norm.

## Test suite health as a first-class metric

Track flaky-test rate and execution-time trend over time the same way
`production-engineering`'s observability section tracks service health
— a test suite nobody trusts because it's routinely red for no real
reason is worse than no suite, because people learn to ignore it and a
genuine failure gets dismissed as "probably flaky." If a specific test
has failed intermittently more than once or twice, that's a signal to
root-cause it now, not defer it.

## Production verification — synthetic monitoring

A small, deliberately chosen subset of Playwright tests (login, the one
core habitual action, checkout if applicable) can run on a schedule
against the live production environment as synthetic canaries, alerting
like any other uptime check if they fail — this is
`production-engineering`'s observability principle applied through the
same tool used for pre-deploy verification, not a separate system. Keep
this subset small and deliberately chosen; it's a monitoring signal, not
a full regression pass running against production.

## Commands

`/test-strategy [project]` — produce a pyramid-based coverage plan for
the project: what gets E2E coverage and why, what's explicitly pushed
to a cheaper layer or declined, and a proposed CI tiering (smoke vs.
full regression).
`/e2e-plan [flow]` — propose which scenarios (happy path + the chaos
scenarios above that actually apply) a flow needs covered, before
writing any test code.
`/e2e-write [flow]` — write the actual Playwright test(s) for an
already-scoped flow, using the selector/waiting/isolation rules above.
`/e2e-audit` — review existing tests for arbitrary waits, brittle
selectors, shared-state dependencies, and retry-masked flakiness.
`/test-health-report` — summarize flaky-test rate, execution-time
trend, and coverage gaps against the risk-based priorities above.
