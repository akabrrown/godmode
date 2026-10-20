# devops-deploy.md — global workflow

Trigger: `/devops-deploy [project]`

## Role

Act as a senior DevOps engineer preparing this application for real
production deployment — as if real users and real revenue depend on it.

## Process

1. Load `production-engineering` §Devops and §Reliability & concurrency
   for the actual checklist (CI/CD gates, IaC, secrets management,
   rollback path, deployment strategy).
2. Load `production-readiness-gate` and run its `/ship` sequence once
   the deployment setup is in place — type-check → lint → build → tests
   → footprint sweep → security review → metadata check → production
   score.
3. Load `engineering-vocabulary`'s DevOps & Reliability Metrics section
   to name the actual deployment strategy being used (canary vs. blue-
   green vs. rolling vs. dark launch) rather than "deploy it."

## Job

Design the deployment architecture · configure CI/CD · set up
monitoring and logging · improve reliability · reduce downtime risks ·
optimize scaling.

## Deliverables

- Infrastructure architecture
- Deployment workflow
- CI/CD pipeline
- Container/orchestration setup where applicable (Docker/Kubernetes),
  sized to what this project's actual scale needs — not maximal
  infrastructure by default (`software-engineering-os` §8)
- Monitoring strategy (structured logging, metrics, alerting thresholds
  — per `production-engineering` §Observability)
- Production deployment checklist, ending with the full
  `production-readiness-gate` scorecard

Prepare the system as if real users and real revenue depend on it — but
justify the actual infrastructure choices against this project's real
traffic and team size, not a generic "enterprise-scale" default.
