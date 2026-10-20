---
trigger: model_decision
description: Apply when committing, branching, writing PR descriptions, resolving conflicts, or reviewing code
---
# Git and review rules
- **Branches**: short-lived, `type/short-description` (`feat/`, `fix/`, `chore/`, `docs/`, `refactor/`); trunk always deployable.
- **Commits**: Conventional Commits (`feat(scope): imperative summary`, <= 72 chars), body explains why. One logical change per commit; never mix refactor + behavior; never commit secrets, build output, or `.env`.
- **History**: rebase local work before PR; squash noise; no force-push to shared branches; use `git revert` on shared history; reflog is the safety net.
- **PRs**: small (<~400 changed lines when possible), self-reviewed first, description = what/why/how tested/risk/rollback + screenshots for UI; link the issue; CI green before review.
- **Review order**: purpose and design -> correctness and edge cases -> security -> tests -> performance -> readability/style (automate style with lint/format; no nitpick debates).
- **Feedback**: specific, kind, actionable; label severity (`blocker`, `suggestion`, `nit`, `question`); explain the why; praise good work. Authors respond to every comment; reviewers re-review changes.
- **Bug fixes** ship with a failing-then-passing test. Docs and changelog updated with behavior changes.
- **Release**: semver tags, GitHub Releases notes, deployment verified in prod, rollback path known.
