# GODMODE Autonomous Build Workflow (`/godmode-build`)

> **Goal:** Take a software request from initial idea to fully implemented, verified, test-covered, and security-audited code.

---

## Stage 1: Specification & Design Signoff
- Tease out requirements and create a clear feature specification.
- Break implementation into bite-sized tasks (<10 minutes each).
- Present chunked implementation plan for user signoff.

## Stage 2: Red/Green TDD Implementation
- For each task in the plan:
  1. Write failing unit/integration test (`RED`).
  2. Execute test runner and verify failure reason.
  3. Write minimal code to pass test (`GREEN`).
  4. Refactor code for YAGNI and DRY.

## Stage 3: Verification & Security Audit
- Verify all 5 UI/data states (Loading, Empty, Error, Success, Offline).
- Validate server-side authorization (IDOR check).
- Run full test suite, linter, and type-checker.

## Stage 4: Production Gate & Delivery
- Confirm zero AI Tells (no generic variable names, no AI comments, no template visual clichés).
- Report verified status with execution logs.
