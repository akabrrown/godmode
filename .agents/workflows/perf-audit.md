---
description: Measure and improve performance of a page, API route, or query with before/after evidence
---
# /perf-audit
1. Pick the target (route, endpoint, or query). Load `frontend-performance-audit` or `backend-performance-audit` accordingly.
2. Baseline: collect metrics (Lighthouse mobile / p95 latency / `EXPLAIN ANALYZE`). Save numbers.
3. Identify the single biggest bottleneck with evidence.
4. Apply the smallest fix; re-measure. Repeat at most 3 cycles.
5. Add a regression guard (budget, test, or alert) if cheap.
6. Report `Metric | Before | After` and the next-best opportunities.
