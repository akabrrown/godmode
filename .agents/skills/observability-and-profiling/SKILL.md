---
name: observability-and-profiling
description: Enterprise observability, OpenTelemetry (OTel), distributed tracing, profiling, and server telemetry. Synthesizes Apache SkyWalking, Jaeger, Zipkin, DeepFlow, async-profiler, and Memray. Use when instrumenting distributed traces, inspecting flame graphs, diagnosing high CPU or memory leaks, configuring Server-Timing headers, and monitoring production metrics.
---

# Observability, Distributed Tracing & Profiling

Production standards for continuous runtime visibility, distributed tracing, and low-overhead profiling across microservices and full-stack applications.

---

## 1. The Three Pillars of Observability (OTel Standard)

```
                       ┌────────────────────────┐
                       │     OBSERVABILITY      │
                       └───────────┬────────────┘
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
  ┌───────────────┐         ┌───────────────┐         ┌───────────────┐
  │    TRACES     │         │    METRICS    │         │     LOGS      │
  │ Context flow  │         │ Aggregatable  │         │ Discrete event│
  │ across network│         │ numeric data  │         │ structured msg│
  │ boundaries    │         │ over time     │         │ with metadata │
  └───────────────┘         └───────────────┘         └───────────────┘
```

### Trace Context Propagation (W3C Standard):
Every inter-service HTTP request or message queue job MUST propagate the `traceparent` header:
```http
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
              │  └───────────────┬────────────────┘ └───────┬────────┘ └─┬─┘
           Version          Trace ID                    Parent ID     Flags
```

---

## 2. Server-Timing Header Architecture

Inject granular latency telemetry directly into HTTP response headers so browsers, DevTools, and APM tools can inspect backend breakdown with zero overhead:

```http
Server-Timing: db;dur=12.4;desc="PostgreSQL Query", redis;dur=1.2;desc="Cache Lookup", render;dur=8.6
```

### Express / Next.js Implementation:

```typescript
export function withServerTiming(req: Request, res: Response, next: NextFunction) {
  const timings: { name: string; dur: number; desc?: string }[] = [];

  res.locals.trackTiming = async <T>(name: string, desc: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      const dur = parseFloat((performance.now() - start).toFixed(2));
      timings.push({ name, dur, desc });
    }
  };

  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    if (timings.length > 0) {
      const headerVal = timings
        .map((t) => `${t.name};dur=${t.dur}${t.desc ? `;desc="${t.desc}"` : ''}`)
        .join(', ');
      res.setHeader('Server-Timing', headerVal);
    }
    return originalEnd.apply(res, args);
  };

  next();
}
```

---

## 3. Production CPU & Memory Profiling

When an endpoint experiences high latency or memory growth, never guess. Generate an empirical flame graph:

### Node.js Profiling (Zero Extra Dependencies):
```bash
# 1. Start server with V8 CPU profiler
node --prof dist/index.js

# 2. Run load test (e.g. k6)
k6 run tests/load/benchmark.js

# 3. Process the isolate v8.log file
node --prof-process isolate-*.log > v8-profile-processed.txt
```

### Python Profiling (`memray` for Memory, `py-spy` for CPU):
```bash
# Record memory allocations during execution
memray run -o mem_report.bin my_app.py

# Generate interactive HTML flame graph
memray flamegraph mem_report.bin -o mem_flamegraph.html
```

---

## 4. APM Dashboard Telemetry Checklist

Before signing off on production observability:
- [ ] Every request logs a structured JSON line containing: `timestamp`, `level`, `traceId`, `spanId`, `route`, `status`, `durationMs`.
- [ ] P95 and P99 latency alerts configured on all customer-facing routes.
- [ ] DB query duration tracked separately from business logic execution.
- [ ] Outgoing HTTP calls to external vendors (Stripe, Twilio, OpenAI) wrapped in tracing spans with timeout enforcement.
- [ ] Health probe endpoints (`/api/health/live` and `/api/health/ready`) configured with real shallow DB/cache connectivity checks.
