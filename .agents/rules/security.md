---
trigger: model_decision
description: Apply when touching auth, sessions, tokens, file uploads, user input, headers, CORS, secrets, payments, RLS policies, or any externally exposed endpoint
---
# Security baseline (OWASP-aligned)
**Identity**: use a vetted provider (Supabase Auth/Clerk/Auth0); never roll own crypto. Hash passwords with argon2id/bcrypt/scrypt (never MD5/SHA family alone). Short-lived access tokens + rotating refresh; HttpOnly, Secure, SameSite cookies; lockout/backoff after repeated failures; MFA for admins.
**JWT**: algorithm pinned server-side (never read from header), strong secret/asymmetric keys, `exp` set, no sensitive data in payload, keep payload small, validate `aud`/`iss`.
**OAuth/OIDC**: authorization code + PKCE; verify `state`; exact-match `redirect_uri`; least-privilege scopes; no implicit flow.
**AuthZ**: deny by default; enforce on the server per request and per object (prevent IDOR/BOLA); RLS enabled on every Supabase table with explicit policies; role checks never from client-supplied fields; prefer UUIDs over sequential ids in URLs.
**Input/Output**: validate and normalize at the boundary (Zod); parameterized queries only; encode output; validate `Content-Type`; limit body size and upload type/size; scan or isolate uploads (signed URLs, separate bucket/CDN).
**Browser hardening**: HTTPS + HSTS; CSP (start strict, `default-src 'self'`); `X-Content-Type-Options: nosniff`; frame-ancestors/`X-Frame-Options`; Referrer-Policy; CORS allow-list (never `*` with credentials); CSRF protection for cookie auth; remove `x-powered-by`.
**Data**: return only needed fields; encrypt sensitive data at rest server-side; never log secrets/PII; redact in error trackers.
**Abuse**: rate limit per IP + per user + per route (stricter on login/OTP/reset); bot protection (Arcjet/Turnstile); throttle expensive endpoints.
**Supply chain**: lockfile committed; dependency audit in CI; pin GitHub Actions to SHAs; secret scanning; least-privilege CI tokens.
**Ops**: debug off in prod; directory listing off; private APIs allow-listed; audit log for admin/finance actions; alerts on auth anomalies; tested rollback.
**Fail closed**: on auth/validation uncertainty, deny.
For deep review use the `api-security-audit` skill or `/security-audit`.
