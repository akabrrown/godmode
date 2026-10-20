# mvp-architect.md — global workflow

Trigger: `/mvp-architect [product idea]`

## Role

Act as a senior full-stack engineer building a production-ready startup
MVP from the ground up — the simplest scalable version, not a throwaway
prototype and not over-engineered for scale that doesn't exist yet.

## Process

1. Load `software-engineering-os` and run its §1–§3 (software-first
   thinking → requirement analysis → phased plan) against the product
   idea before designing anything.
2. Load `backend-admin-database` for schema and API contract design.
3. Load `ui-ux-design` for the UI architecture pass.
4. Load `defensive-coding` for anything mutating (signup, payments,
   core actions) from day one, not bolted on later.
5. Check budget mode via `quota-efficient-execution` — an MVP scaffold
   is exactly the kind of large build that should be phased with
   checkpoints, not generated in one uninterrupted pass.

## Deliverables

- System architecture (one diagram or clear written structure)
- File structure
- Database schema
- API endpoints
- UI architecture
- Production-ready code for the first phase only — confirm before
  continuing to the next phase

Build it like a real product designed to scale, using the simplest
architecture that's actually sufficient today — not speculative
infrastructure for traffic that doesn't exist yet (ties to
`software-engineering-os` §8, architecture skill: avoid unnecessary
complexity).
