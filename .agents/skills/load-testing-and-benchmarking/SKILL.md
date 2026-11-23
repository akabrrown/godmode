---
name: load-testing-and-benchmarking
description: Performance, stress, and load testing automation using k6, Artillery, and Gatling. Use when designing load tests, executing benchmark tests, validating SLO/SLA latency thresholds (p95, p99), finding breaking points, diagnosing memory leaks, and tuning high-throughput endpoints.
---

# Load Testing & Performance Benchmarking

A rigorous, evidence-first skill for stress testing web applications, REST APIs, GraphQL endpoints, and WebSockets to uncover bottlenecks before production deployment.

---

## 1. Test Typologies & Execution Archetypes

| Test Type | Objective | Traffic Profile | Duration | When to Run |
|---|---|---|---|---|
| **Smoke Test** | Verify system functions under minimal load without errors | 1–5 VUs constant | 1–2 mins | Every PR & CI build |
| **Load Test** | Assess performance under expected normal + peak day load | Ramp to target VUs, hold plateau | 15–30 mins | Pre-release gate |
| **Stress Test** | Determine system breaking point and degradation behavior | Stepped ramp until error rate spikes | 30–60 mins | Capacity planning |
| **Spike Test** | Validate survival of sudden massive traffic surges (e.g. flash sales) | Instant jump (0 to 10×) then drop | 5–10 mins | Architecture audit |
| **Soak (Endurance) Test** | Identify memory leaks, thread starvation, connection pool exhaustion | Constant 70% load | 2–12 hours | Major release prep |
| **Breakpoint Test** | Continuously increase load until system fails | Linear ramp without ceiling | Until failure | Infrastructure sizing |

---

## 2. Standardized k6 Load Test Blueprint

Write executable declarative k6 test scripts in `tests/load/` using standard JavaScript:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp-up
    { duration: '3m', target: 50 },   // Steady state
    { duration: '1m', target: 150 },  // Peak surge
    { duration: '3m', target: 150 },  // Sustained peak
    { duration: '1m', target: 0 },    // Ramp-down
  ],
  thresholds: {
    // SLO: 95% of requests must complete under 200ms, 99% under 500ms
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    // SLO: Less than 1% error rate
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'k6-load-benchmark',
    },
  };

  // 1. Browse Catalog / Feed
  const feedRes = http.get(`${BASE_URL}/api/v1/feed`, params);
  check(feedRes, {
    'feed status is 200': (r) => r.status === 200,
    'feed response fast': (r) => r.timings.duration < 150,
  });

  sleep(1);

  // 2. Perform Transaction / Mutation
  const payload = JSON.stringify({ itemId: 'item_101', quantity: 1 });
  const checkoutRes = http.post(`${BASE_URL}/api/v1/checkout`, payload, params);
  check(checkoutRes, {
    'checkout status is 200 or 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(2);
}
```

---

## 3. Artillery YAML Blueprint (Alternative for Node.js Stacks)

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 50
      name: Warm up phase
    - duration: 180
      arrivalRate: 50
      name: Sustained high load
  plugins:
    expect: {}
  ensure:
    p95: 250
    p99: 600
    maxErrorRate: 1

scenarios:
  - name: "Authenticated User Journey"
    flow:
      - get:
          url: "/api/health"
          expect:
            - statusCode: 200
      - post:
          url: "/api/orders"
          json:
            productId: "prod_abc123"
            quantity: 2
          headers:
            Idempotency-Key: "{{ $uuid }}"
          expect:
            - statusCode: 200
```

---

## 4. Bottleneck Diagnosis Matrix

When SLO thresholds fail during benchmarks, identify the root cause systematically:

| Symptom | Root Cause | Diagnosis Command / Metric | Engineering Fix |
|---|---|---|---|
| Latency climbs linearly with VUs, 0% CPU idle | **CPU Bound** | `top -b -n 1`, flame graphs (`async-profiler`, `memray`) | Optimize hot algorithms, offload hashing, enable worker clusters |
| Latency spikes suddenly at N concurrent users; DB error "too many clients" | **DB Connection Starvation** | `pg_stat_activity`, pool active connections | Add connection pooler (`pgdog`, `PgBouncer`), decrease client pool size |
| Memory usage increases monotonically, never drops after test | **Memory Leak** | Node.js `--inspect` heap snapshot, `memray` | Remove global caches, clean event listeners, detach closures |
| Latency p99 spikes on writes only; disk I/O at 100% | **Disk I/O / WAL Saturation** | `iostat -xz 1`, `iotop` | Batch writes, move WAL to dedicated NVMe, use Write-Behind cache |
| High HTTP 502/504 errors under load; server alive | **Socket / File Descriptor Limit** | `ulimit -n`, `netstat -an \| grep TIME_WAIT` | Increase `nofile`, tune TCP reuse (`net.ipv4.tcp_tw_reuse = 1`) |
