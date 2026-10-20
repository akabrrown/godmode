---
description: Pre-release and post-release checklist for deploying to production
---
# /release-check
1. Pre: CI green, migrations applied in staging, env/secrets present, feature flags set, backups fresh, rollback path tested, monitoring/alerts ready, status comms prepared.
2. Smoke tests on preview/staging: auth, core journey, payment (test mode), emails/SMS.
3. Deploy; watch error rate, latency, and key business metric for 30 minutes.
4. Post: verify in production, tag release + notes, close issues, note learnings. If regression: roll back first, debug after.
