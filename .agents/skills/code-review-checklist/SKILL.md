---
name: code-review-checklist
description: Perform a structured code review of a diff, PR, or file set - correctness, security, tests, performance, readability, docs - and write constructive feedback. Use when the user says review, PR, diff, "check my code", "is this ready to merge", or after generating a large change that needs verification.
---
# Code review checklist

## Before reading code
Understand the goal, requirements, and risk level (config tweak vs auth/payment change). Scale depth to risk. Run tests/lint/types or confirm CI green. Skim the design first: does the approach fit the architecture?

## Pass 1 - Design and scope
Right place for the change? Smallest solution? Unrelated edits mixed in? Breaking changes/migrations flagged? Impact on callers, data, and other services understood?
## Pass 2 - Correctness
Edge cases (null/empty/large/duplicate/concurrent), error handling, boundary conditions, off-by-one, time zones, money math, idempotency, race conditions, resource cleanup.
## Pass 3 - Security
Input validation, authN/authZ, injection, secrets, logging of sensitive data, new dependencies, CORS/headers (use `api-security-audit` for endpoints).
## Pass 4 - Tests
Behavior covered, not just lines; failing test for each bug fix; edge and error paths; tests fast, isolated, deterministic; no brittle mocks.
## Pass 5 - Performance
N+1, unbounded queries, missing pagination/indexes, heavy renders, big dependencies, blocking work.
## Pass 6 - Readability and maintainability
Meaningful names, small functions, low cyclomatic complexity, no dead code, comments explain why, consistent with team style (formatter handles style, not humans), docs/changelog/OpenAPI updated.

## Feedback style
Label each comment: `blocker` / `suggestion` / `nit` / `question` / `praise`. Say what and why, propose a fix or ask a question, never attack the author. Batch related notes. Mention what is good. Approve when only nits remain; request changes for blockers.

## Output
Verdict (Approve / Approve with nits / Request changes), summary in 3 lines, then findings grouped by severity with file:line references and suggested patches.
