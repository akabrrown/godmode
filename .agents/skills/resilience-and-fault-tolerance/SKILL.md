---
name: resilience-and-fault-tolerance
description: Production resilience, fault tolerance, circuit breakers, rate limiting algorithms, and graceful degradation. Synthesizes Netflix Hystrix, LINE Decaton, ratelimiter4j, and AspNetCoreRateLimit. Use when building circuit breakers, bulkheads, rate limiters (Token Bucket, Leaky Bucket, Sliding Window Counter), retry with exponential backoff and full jitter, dead letter queues, and multi-tenant traffic shaping.
---

# Resilience, Fault Tolerance & Traffic Shaping

Architectural patterns and production algorithms to ensure systems stay online during catastrophic downstream failures, third-party outages, and sudden traffic surges.

---

## 1. Circuit Breaker Pattern (Netflix Hystrix State Machine)

Protect your application from cascading failures when third-party APIs (Stripe, Twilio, OpenAI, database) slow down or fail:

```
                  ┌──────────────────────┐
                  │        CLOSED        │ ◄────────────────────────┐
                  │ (Normal Operations)  │                          │
                  └──────────┬───────────┘                          │
                             │ Failure rate > 50%                   │
                             ▼                                      │ Successes
                  ┌──────────────────────┐                          │ exceed
                  │         OPEN         │                          │ threshold
                  │(Fast-Fail/Fallbacks) │                          │
                  └──────────┬───────────┘                          │
                             │ Cooldown timer expires               │
                             ▼                                      │
                  ┌──────────────────────┐                          │
                  │      HALF-OPEN       │ ─────────────────────────┘
                  │ (Test Canary Probe)  │
                  └──────────┬───────────┘
                             │ Any probe failure
                             └─────────────────────> (Back to OPEN)
```

### TypeScript / Node.js Production Implementation

```typescript
export interface CircuitBreakerOptions {
  failureThresholdPercentage: number; // e.g. 50%
  rollingWindowMs: number;            // e.g. 10000ms
  cooldownMs: number;                 // e.g. 5000ms
  halfOpenSuccessThreshold: number;   // e.g. 3 successful requests
}

export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount = 0;
  private totalCount = 0;
  private nextAttempt = 0;
  private consecutiveSuccesses = 0;

  constructor(private options: CircuitBreakerOptions) {}

  async execute<T>(action: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
    const now = Date.now();

    if (this.state === 'OPEN') {
      if (now > this.nextAttempt) {
        this.state = 'HALF_OPEN';
        this.consecutiveSuccesses = 0;
      } else {
        return fallback(); // Fast-fail without consuming network/threads
      }
    }

    try {
      const result = await action();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      return fallback();
    }
  }

  private onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.consecutiveSuccesses++;
      if (this.consecutiveSuccesses >= this.options.halfOpenSuccessThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.totalCount = 0;
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    this.totalCount++;

    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.options.cooldownMs;
    } else if (this.totalCount >= 10 && (this.failureCount / this.totalCount) * 100 >= this.options.failureThresholdPercentage) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.options.cooldownMs;
    }
  }
}
```

---

## 2. Rate Limiting Algorithms

| Algorithm | How it Works | Pros | Cons | Best For |
|---|---|---|---|---|
| **Token Bucket** | Tokens added at constant rate up to bucket capacity. Request consumes 1 token. | Handles bursts smoothly; memory efficient. | Tuning token refill rate. | General API gateways, Stripe-like public APIs. |
| **Leaky Bucket** | Requests enter queue, processed at strictly constant rate. Overflows dropped. | Perfect smooth output rate; zero spikes. | Bursts delayed or dropped immediately. | Ingestion pipelines, payment processors. |
| **Fixed Window Counter**| Counter resets every fixed interval (e.g. 1 minute). | Extremely easy to implement in Redis. | Border bursts: 2× limit at window boundary. | Basic protection, low-volume endpoints. |
| **Sliding Window Log** | Records exact timestamp of each request in sorted set. | 100% mathematically exact. | Memory heavy: stores timestamp per request. | Financial mutations, password resets. |
| **Sliding Window Counter** | Combines current window and previous window weighted by overlap percentage. | Memory efficient (2 counters), prevents boundary bursts. | Approximate math (99.9% accurate). | Enterprise production APIs. |

### Redis Lua Atomic Sliding Window Rate Limiter

```lua
-- KEYS[1]: rate_limit:user_id
-- ARGV[1]: current_timestamp (ms)
-- ARGV[2]: window_size_ms (e.g. 60000)
-- ARGV[3]: max_requests (e.g. 100)

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window

-- 1. Remove timestamps older than window
redis.call('ZREMRANGEBYSCORE', key, '-inf', clearBefore)

-- 2. Count current requests in window
local currentRequests = redis.call('ZCARD', key)

if currentRequests < limit then
    -- 3. Add current request
    redis.call('ZADD', key, now, now)
    redis.call('PEXPIRE', key, window)
    return 1 -- Allowed
else
    return 0 -- Rejected (HTTP 429)
end
```

---

## 3. Exponential Backoff with Full Jitter

Never retry failed requests on a fixed timer. Fixed timers synchronize retries from thousands of clients and crash recovering servers:

$$\text{Sleep} = \text{random}(0, \, \min(\text{MaxSleep}, \, \text{BaseSleep} \times 2^{\text{attempt}}))$$

```typescript
export async function retryWithFullJitter<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseMs = 100,
  maxMs = 2000
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > maxRetries) throw error;
      const cap = Math.min(maxMs, baseMs * Math.pow(2, attempt));
      const sleepMs = Math.floor(Math.random() * cap);
      await new Promise((resolve) => setTimeout(resolve, sleepMs));
    }
  }
}
```

---

## 4. Bulkhead Pattern (Resource Isolation)

- Divide worker pools and thread pools by criticality or tenant.
- A failure or spike in a non-critical feature (e.g. PDF generation, analytics logging) must NEVER consume thread pool capacity reserved for core revenue features (e.g. checkout, login).
