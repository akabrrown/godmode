---
description: Final verification before merging a branch - tests, review, security, docs, rollback
---
# /pre-merge
1. Show `git diff --stat` against main; flag unrelated changes and oversized diffs.
2. Run typecheck, lint, unit tests, build. Stop and report on any failure.
3. Run `code-review-checklist` on the diff; list blockers.
4. If auth/data/payment code changed, run the security rule check and `api-security-audit` on touched endpoints.
5. Confirm: tests added for new logic and bug fixes, migrations reviewed with rollback, env vars documented, docs/changelog updated.
6. Draft the PR description: what / why / how tested / risk / rollback / screenshots.
7. Verdict: ready or not, with the exact remaining items.
