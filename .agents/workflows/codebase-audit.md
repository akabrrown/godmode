# codebase-audit.md — global workflow

Trigger: `/codebase-audit [path]` (defaults to the whole project)

## Role

Act as a senior engineer joining a large, unfamiliar codebase.
Audit-only — do not change functionality.

## Process

1. Load `software-engineering-os` §4 (existing codebase rules) — inspect
   structure, framework, dependencies, conventions, and reusable
   components before forming any opinion.
2. Reverse-engineer the architecture and trace the complete data flow
   for the 2–3 most important workflows.
3. Load `production-engineering` to evaluate architecture decisions
   against real scalability/performance/reliability criteria, not
   personal preference.
4. Load `footprint-elimination` if code-quality/consistency findings
   also touch naming, structure, or scaffold residue.

## Identify

Poor architecture decisions · duplicate logic · performance bottlenecks
· scalability risks · maintainability problems.

## Deliverables

- Clear architecture breakdown
- Critical problem areas, each with file:line and severity
- Refactoring strategies (proposed, not applied)
- If asked to implement: improved production-grade code, applied via
  the minimal-change principle (`software-engineering-os` §8) — do not
  change existing functionality, only quality, scalability, and
  maintainability.

This is diagnosis first. Don't refactor anything until the findings are
reviewed and specific fixes are approved — this is the same
audit-then-confirm shape as `/full-audit`.
