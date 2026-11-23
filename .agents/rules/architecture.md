---
trigger: model_decision
description: Apply when designing a system, choosing architecture, splitting services/modules, modeling a domain, or writing the TDD
---
# High-Scalability Architecture & System Design Standards

## 1. Core Principles & Capacity Planning
- **Start Simple:** Modular monolith first; extract a service only when independent scaling, organizational ownership, or catastrophic failure isolation demands it. Microservices are an operational cost, not a design goal.
- **Back-of-the-Envelope Math (Mandatory in TDD):**
  - Calculate Average & Peak QPS ($\text{Peak QPS} = \text{Avg QPS} \times 2\text{--}3$).
  - Storage estimation for 5-year growth including replication factors ($3\times$).
  - Memory & Cache Sizing: apply the 80/20 Pareto rule (cache 20% of hot daily read data).

## 2. Distributed Consistency & CAP/PACELC Trade-Offs
- **Consistency vs. Availability:** Strong consistency ($CP$) for financial balances, seat reservations, and inventory deduction; Eventual consistency ($AP$) for social feeds, activity streams, and caching.
- **Consistent Hashing:** Use consistent hash rings with 100–300 virtual nodes (tokens) per physical node to prevent hot-spot skew during dynamic node additions or failures.

## 3. High-Performance Caching Topologies
- **Cache-Aside (Lazy Loading):** Default for read-heavy workloads (90%+ reads). Invalidate explicitly on mutation.
- **Cache Protection Directives:**
  - *Stampede Prevention:* Distributed mutex locks (`SET NX`) on cache misses so only 1 thread refreshes DB.
  - *Avalanche Prevention:* Inject random jitter into TTLs (`TTL = base_ttl + rand(-60, 60)`).
  - *Penetration Prevention:* Bloom filter check before cache lookup OR cache `NULL` with short TTL (30s).

## 4. Integration, Resiliency & Asynchronous Pipelines
- **Idempotency Keys:** Every mutation API (`POST /payments`, `POST /orders`) MUST require an `Idempotency-Key` header with 24-hour deduplication stored in Redis.
- **Transactional Outbox:** Write business entity + outbox event to local DB in a single ACID transaction; relay asynchronously to message broker (Kafka/RabbitMQ/Decaton).
- **Circuit Breaker Pattern:** Guard remote and third-party APIs with a 3-state circuit breaker (Closed, Open, Half-Open). Fast-fail during cooldown without consuming network threads.
- **Exponential Backoff with Full Jitter:** Retries must always use randomized jitter ($\text{Sleep} = \text{rand}(0, \, \min(\text{cap}, \, \text{base} \times 2^{\text{attempt}}))$) to prevent thundering herds on recovering servers.
- **Bulkhead Isolation:** Isolate critical resource pools (checkout, auth) from high-volume non-critical tasks (PDF generation, logging).

## 5. Architectural Deliverables (TDD Spec Standard)
Every Technical Design Document (TDD) must explicitly include:
- Capacity Planning Calculations (QPS, Storage, Bandwidth, Memory).
- High-level Mermaid Architecture Diagram.
- Data Storage, Sharding Key, and Caching Topology.
- Threat Model & Roles/Permissions Matrix.
- API Specifications with Error Codes and Idempotency Guarantees.
- Failure Modes, Circuit Breakers, and Graceful Degradation Plans.
