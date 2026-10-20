---
trigger: glob
globs: "**/{api,server,routes,services,actions,supabase}/**/*.{ts,sql}"
description: Backend and API design rules
---
# Backend and API rules
- **Layering**: route/handler (parse + auth) -> service (business rules) -> repository (data). Handlers stay thin; no business logic in components or SQL triggers unless necessary.
- **REST**: plural nouns (`/orders/{id}`), no verbs in paths; correct methods (GET safe, PUT/DELETE idempotent, POST create/action); status codes: 200/201/204, 400 validation, 401 unauthenticated, 403 forbidden, 404, 409 conflict, 422 semantic, 429 rate limit, 5xx server.
- **Errors**: one envelope, RFC 7807 style `{type,title,status,detail,instance}` plus a stable machine `code`. Never leak stack traces or SQL.
- **Collections**: cursor pagination by default; allow-listed filter/sort fields; hard max page size.
- **Idempotency**: `Idempotency-Key` on payment/creating POSTs; webhooks verified by signature, deduplicated by event id, processed async.
- **Versioning**: additive changes only within a version; breaking change = new version + deprecation window.
- **Contracts**: OpenAPI or shared Zod schemas are the source of truth; generate types and docs from them.
- **Concurrency/integrity**: DB constraints over app checks; transactions for multi-step writes; snapshot prices at confirmation; availability computed on read; append-only audit tables.
- **Long work** (>~1s, bulk, email/SMS, exports): enqueue (QStash/BullMQ/Edge queue), return 202 + status resource.
- **Resilience**: timeouts on every outbound call, bounded retries with jitter, circuit breaker for flaky dependencies, graceful degradation (cached/partial results), backpressure via queue limits.
- **12-factor**: config from env, stateless processes, logs to stdout as structured JSON with request id, disposable instances.
- **Observability**: request id propagated; log level discipline; metrics for latency/error rate/saturation; alert on SLO burn, not single errors.
