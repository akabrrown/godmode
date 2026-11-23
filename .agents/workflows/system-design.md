---
description: Design a high-scalability, fault-tolerant distributed system architecture
argument-hint: <system-name or requirements>, e.g. "realtime chat 50k DAU" or "global payment gateway"
---

# /system-design

Architect a high-scale, resilient distributed system for: **$ARGUMENTS**

## Step 1: Requirements & Scope Formulation
- **Functional Requirements:** Core user actions, primary write/read operations.
- **Non-Functional Requirements:** High availability (99.99%), low latency (p99 < 200ms), eventual vs strong consistency.

## Step 2: Capacity Planning & Calculations
Apply back-of-the-envelope estimations from `system-design-architect`:
- Estimate DAU, Read QPS, Write QPS, Peak QPS.
- 5-year storage projection including replication factors.
- Network bandwidth (inbound / outbound).
- 80/20 Pareto memory cache requirements.

## Step 3: High-Level Architecture & Communication Protocols
- Draw Mermaid flowchart: Clients → CDN / Global DNS → L7 API Gateway → Services → Message Broker / Queue → Databases & Caches.
- Protocol selection: HTTP/2 vs HTTP/3, WebSockets vs SSE for realtime, gRPC for internal microservice RPC.

## Step 4: Storage, Sharding & Caching Topologies
- **Database Model:** Relational (PostgreSQL) vs Document (MongoDB) vs Key-Value vs Time-Series.
- **Partition Key Selection:** Determine shard key avoiding cross-shard joins and hot spots.
- **Replication & Lag Safety:** Define read/write split rules and replica pinning duration.
- **Cache Architecture:** Cache-Aside with TTL jitter to prevent stampedes and Bloom filters for penetration defense.

## Step 5: Resilience, Fault Tolerance & Failure Modes
- Circuit breaker policies on external integrations.
- Rate limiting algorithms (Sliding Window Counter with Redis Lua).
- Idempotency key requirement on mutations.
- Single Points of Failure (SPOF) audit and disaster recovery plan.
