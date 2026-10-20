---
description: Design and implement a new API endpoint end to end with validation, auth, tests, and docs
---
# /new-endpoint
1. Clarify resource, actor/roles, and operation (one line each). Load `api-design-review`.
2. Define contract: method + path, Zod request/response schemas, status codes, error codes, pagination/idempotency needs.
3. Authorize: authenticate, then authorize at object level; add/verify RLS or service guard.
4. Implement handler (thin) -> service -> repository. Parameterized queries, named columns, transaction if multi-write.
5. Add rate limit, payload limit, and structured logging with request id.
6. Tests: success, validation failure, unauthenticated, forbidden, not found, conflict/idempotency, one edge case.
7. Update OpenAPI/Schema docs and the API Specification section.
8. Run typecheck, lint, tests; report results and any assumptions.
