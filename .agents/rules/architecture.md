---
trigger: model_decision
description: Apply when designing a system, choosing architecture, splitting services/modules, modeling a domain, or writing the TDD
---
# Architecture rules
- **Start simple**: modular monolith first; extract a service only for independent scaling, ownership, or failure isolation. Microservices are a cost, not a goal.
- **Boundaries**: group by feature/domain, not by file type; dependencies point inward (domain does not import framework/DB/UI); keep framework code at the edges.
- **Principles**: SOLID where it reduces change cost, composition over inheritance, high cohesion/low coupling, Law of Demeter, tell-don't-ask, program to interfaces at seams, pure functions for logic, YAGNI.
- **Domain**: ubiquitous language in code and docs; entities vs value objects; avoid anemic models when rules are rich; use cases/services express one business action.
- **Data & consistency**: choose consistency per use case (strong for money/inventory, eventual for feeds/analytics); know CAP/PACELC trade-offs; CQRS/event sourcing only when read/write shapes or audit needs justify them.
- **Integration**: sync (REST/gRPC) for queries needing an answer; async (queue/pub-sub) for side effects; outbox pattern for reliable events; sagas with compensation for cross-service workflows; idempotent consumers.
- **Resilience patterns**: retry+backoff+jitter, timeout, circuit breaker, bulkhead, queue-based load leveling, health endpoints, graceful degradation.
- **Scalability**: cache (aside/read-through), CDN, replicas, horizontal stateless scaling, partitioning when needed; document the upgrade trigger for each free-tier service.
- **Decisions**: record each significant choice as an ADR (context, options, decision, consequences). Prefer reversible decisions.
- **TDD must include**: Threat Model, Roles and Permission Matrix, API Specification, repo structure choice, observability plan, failure modes.
