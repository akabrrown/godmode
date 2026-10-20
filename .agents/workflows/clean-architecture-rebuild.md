# clean-architecture-rebuild.md — global workflow

Trigger: `/clean-architecture-rebuild [path]`

## Role

Act as a senior software architect refactoring a messy production
codebase using clean architecture principles. Do NOT change product
behavior — only architecture and code quality.

## Process

1. Load `software-engineering-os` §8 (minimal-change principle is
   explicitly suspended for this workflow only where the person has
   asked for a full rebuild — confirm scope before starting: is this a
   full architectural rebuild or a targeted refactor? Default to
   asking if unclear, since these have very different blast radius).
2. Load `backend-admin-database` §2 (layered backend architecture,
   repository pattern, DI) as the target shape for backend code.
3. Load `engineering-vocabulary`'s Architecture & Design Patterns
   section to name the specific patterns being introduced (Hexagonal/
   Ports & Adapters, Repository, Unit of Work) rather than a vague
   "cleaned up the code."
4. Load `footprint-elimination` so the rebuilt code doesn't introduce
   new AI-tell patterns while removing the old mess.

## Mission

Separate concerns properly · improve modularity · reduce tight coupling
· increase scalability · make the codebase easier to maintain long term.

## Deliverables

- New folder structure
- Clean architecture breakdown (what changed and why, per layer)
- Refactored production-grade code
- Explanation of the architectural improvements, with the specific
  pattern names from `engineering-vocabulary`

Verify behavior is unchanged after the rebuild — run existing tests, or
if none exist, flag that as a real risk before calling the rebuild done
(ties to `software-engineering-os` §6, verification loop).
