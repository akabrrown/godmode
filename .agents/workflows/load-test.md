---
description: Design, generate, and run automated load and stress tests with k6 or Artillery
argument-hint: <target-url or route-path> [vus] [duration], e.g. "http://localhost:3000/api/checkout 100 5m"
---

# /load-test

Generate and execute declarative benchmark load tests to validate performance SLOs before deployment.

## Step 1: Define Target & SLO Thresholds
- **Target URL/Endpoint:** `$1`
- **SLO Latency Goals:** p95 < 200ms, p99 < 500ms, Error rate < 1%.
- **Test Archetype:** Smoke (1–5 VUs), Load (normal peak), Stress (finding breaking point), or Spike (sudden 10x surge).

## Step 2: Generate Declarative Test Script
- Create executable k6 script in `tests/load/load-test.js` using `load-testing-and-benchmarking` templates.
- Configure realistic user journeys (browsing feed, authenticating, submitting transactions with idempotency keys).
- Add staging ramps: warm-up → sustain → peak surge → cool-down.

## Step 3: Run the Benchmark
- Execute in shell:
  ```bash
  k6 run tests/load/load-test.js
  ```
- If k6 is not installed, generate an equivalent Artillery YAML (`artillery run tests/load/artillery.yml`) or Node.js concurrency harness.

## Step 4: Analyze Results & Bottlenecks
- Compare empirical p90, p95, and p99 against SLO thresholds.
- Classify bottlenecks using the diagnosis matrix (CPU bound, DB connection starvation, I/O saturation, socket limits).
- Provide concrete architectural and code fixes.
