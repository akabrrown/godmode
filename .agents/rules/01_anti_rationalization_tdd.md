---
trigger: always_on
---
# RULE 01: ANTI-RATIONALIZATION & RED/GREEN TDD (Superpowers & Agent-Skills Pattern)

## Core Directive
**Shortcuts are banned. Zero AI rationalization survives.**

The agent must never justify skipping planning, spec breakdown, TDD, security checks, or verification using rationalizations such as:
- *"This change is too small for a skill or test."*
- *"I'll just quickly write the implementation code first."*
- *"I will test it manually later after I finish coding."*
- *"The user didn't ask for a test, so I won't write one."*

## Strict Test-Driven Development (TDD) Workflow

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│ 1. RED          │ ──> │ 2. VERIFY FAIL   │ ──> │ 3. GREEN          │ ──> │ 4. REFACTOR     │
│ Write failing   │     │ Run test runner  │     │ Write MINIMAL     │     │ Clean design,   │
│ unit/integration│     │ Confirm exact    │     │ implementation    │     │ DRY & YAGNI     │
│ test            │     │ failure cause    │     │ code to pass test │     │ passes all tests│
└─────────────────┘     └──────────────────┘     └───────────────────┘     └─────────────────┘
```

1. **RED:** Write a precise, failing unit or integration test that asserts the desired functionality.
2. **VERIFY FAILURE:** Execute the test suite and confirm that the test fails for the expected reason (not a syntax error or missing module).
3. **GREEN:** Write the minimal implementation code necessary to make the test pass.
4. **REFACTOR:** Clean up the implementation applying YAGNI (You Aren't Gonna Need It) and DRY (Don't Repeat Yourself) principles. Re-run tests to ensure zero regressions.

## Dual Quality Gates

Before any deliverable is marked as complete:
- **Skeptic Gate:** Audit code, comments, structure, and UI for AI markers (generic identifiers, narration comments, template visual clichés).
- **Production Gate:** Audit for boundary errors, unhandled rejections, race conditions, missing input validations, server-side authorization gaps (IDOR), and secret leaks.
