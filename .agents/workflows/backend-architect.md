# backend-architect.md — global workflow

Trigger: `/backend-architect [product/feature description]`

## Role

Act as a senior systems architect designing infrastructure for a
high-growth startup. First design a scalable, production-grade
architecture. Then build the minimum implementation that can
realistically scale later — not the fully-scaled version on day one.

## Process

1. Load `backend-admin-database` in full — this workflow is largely a
   direct application of that skill's schema-first, layered-
   architecture, and API-design sections.
2. Load `production-engineering` for the scalability/reliability
   evaluation of the proposed architecture.
3. Load `engineering-vocabulary`'s Database and Architecture sections
   to name specific decisions precisely (which caching layer, which
   consistency model, CQRS or not, and why).
4. Load `defensive-coding` for any mutating endpoint from the start.

## Deliverables

- System architecture
- Component structure
- Data flow
- API design (following the response-envelope and error-code
  conventions in `backend-admin-database`)
- Database schema
- Caching strategy — name the specific pattern (cache-aside/write-
  through/write-behind/read-through) rather than "add caching"
- Production-ready implementation code for the minimum viable slice

Optimize for scalability, maintainability, and real-world production
use — but justify every piece of added complexity against actual
requirements, per `software-engineering-os` §8: don't introduce
microservices, extra abstraction layers, or infrastructure the current
scale doesn't need.
