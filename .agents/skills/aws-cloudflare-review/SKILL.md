---
name: aws-cloudflare-review
description: Review or plan cloud infrastructure on AWS, Cloudflare (Workers, Pages, R2, D1, KV, Queues, Durable Objects), Vercel, plus DevOps - CI/CD, containers, IaC, secrets, monitoring, cost. Use when choosing hosting, writing the deployment spec, setting up pipelines, reviewing IAM/network/security groups, or controlling cloud cost.
---
# Cloud and DevOps review

## Pick the platform (free-tier-first, with upgrade triggers)
- Next.js app -> Vercel. Static/edge APIs, cheap egress -> Cloudflare Pages/Workers (+R2, KV, D1, Queues, Durable Objects for coordination, Workers AI/Vectorize for AI). Long-running APIs/workers -> Render/Railway/Fargate. Full AWS only when a requirement demands it. Emergency-critical systems: no cold-start infra.
- Document for every service: free-tier limit, what breaks first, upgrade trigger and cost.

## AWS essentials
Everyone gets an IAM identity, never the root account; MFA; roles for workloads (instance profiles/task roles), no long-lived keys in apps; permissions via groups/policies, least privilege; VPC with public/private subnets, NAT only where required, locked-down security groups; never expose SSH (use SSM); redundancy across AZs; no state on servers (S3/RDS/ElastiCache); ALB/NLB terminates TLS; ASG with sensible scaling policy (one trigger type per group); tag everything + naming convention; CloudTrail + billing alerts + budgets; S3 block public access, versioning, lifecycle rules, bucket names without dots; use official SDKs; know service quotas; reserved/savings plans only after usage is stable.

## Cloudflare essentials
Workers = V8 isolates (no Node assumptions; check compat); bindings for KV/R2/D1/Queues; Hono/itty-router for routing; Cache API + tiered caching; WAF/rate limiting/bot management; security headers; D1 migrations + Drizzle/Prisma adapters; Queues + dead-letter queues; Durable Objects for strong coordination/state; Tunnels for private origins; Wrangler config in repo; secrets via `wrangler secret`.

## CI/CD
Pipeline: install (cached) -> lint -> typecheck -> unit tests -> build -> e2e on preview -> deploy -> smoke test -> notify. Trunk-based, preview env per PR, protected main, required checks, secrets in CI vault, pinned action versions, artifacts versioned, one-click rollback, DB migrations as a separate gated step. Prefer GitOps (Argo/Flux) for Kubernetes.

## IaC, containers, secrets
Terraform/Pulumi/CDK for anything beyond a toy; remote state with locking; modules; plan in PR. Docker: multi-stage, non-root, pinned base digests, small images, healthcheck, `.dockerignore`. Secrets: Vault/Secrets Manager/Doppler/SOPS/Sealed Secrets; rotate; never in images or git.

## Observability & reliability
Metrics (Prometheus/CloudWatch), logs (structured, central), traces (OpenTelemetry), uptime checks + status page, alerting to a notification channel with runbook links; SLOs; backups with restore tests; DR plan; chaos-lite game days for critical systems.

## Output
Deployment/DevOps spec: topology diagram, environments, pipeline, secrets map, monitoring/alerts, cost table with triggers, rollback and DR.
