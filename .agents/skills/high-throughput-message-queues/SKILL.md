---
name: high-throughput-message-queues
description: High-throughput distributed message queuing, concurrent partition stream processing, service discovery, and non-blocking event loops. Synthesizes LINE Decaton (concurrent Kafka processing with out-of-order execution and watermark-based in-order commits), Netflix Eureka (client-side service registration, peer replication, lease expiration, self-preservation mode), and Swoole / Linux epoll reactor-worker concurrency models.
tags: [kafka, message-queues, decaton, eureka, swoole, event-loop, concurrency, distributed-systems]
version: 1.0.0
---

# High-Throughput Message Queues & Event-Loop Concurrency

Production engineering patterns for distributed stream processing, concurrent partition consumption, peer service discovery, and non-blocking asynchronous event loops.

## Core Architectural Foundations

### 1. LINE Decaton: Concurrent Partition Processing
Traditional Kafka consumers bind single-threaded consumption to partition count (`max_concurrency = partition_count`). Decaton decouples consumption from processing:

```
[Kafka Broker] ──> [Partition Fetcher Thread]
                         │
                         ├──> [Key-Based Hash Router]
                         │         │
                         │         ├──> [Worker Thread 1 (Key A)] ──> [Processing Logic]
                         │         ├──> [Worker Thread 2 (Key B)] ──> [Processing Logic]
                         │         └──> [Worker Thread N (Key C)] ──> [Processing Logic]
                         │
                         └──> [Watermark Offset Commit Manager] ──> [Commit Offset to Kafka]
```

- **Per-Key Ordering Guarantee:** Messages with the same partition key are strictly processed sequentially on the same worker queue.
- **Out-of-Order Execution with In-Order Commit:** Work across different keys in the same partition runs concurrently. High watermarks track the earliest unacknowledged offset; commits to Kafka only advance up to the continuous sequence of completed offsets.
- **Backpressure & Task Rate Limiting:**
  - Dynamic queue capacity bounding: if worker task queue exceeds high watermark threshold (e.g., 10,000 pending tasks), pause consumer partition fetching via `consumer.pause(topicPartitions)`.
  - Resume consumer fetching via `consumer.resume(topicPartitions)` once queue drains below low watermark (e.g., 2,000 tasks).

### 2. Netflix Eureka: Client-Side Service Discovery & Self-Preservation
Eliminates central load-balancer bottlenecks through decentralized client-side routing:
- **Heartbeat & Lease Expiration:**
  - Client sends heartbeat renewal every `30 seconds`.
  - Lease duration is `90 seconds` (`leaseExpirationDurationInSeconds: 90`). If 3 consecutive heartbeats are missed, server purges instance from registry.
- **Self-Preservation Mode (Network Partition Resilience):**
  - If heartbeats received across all instances fall below renewal threshold (`renewalPercentThreshold: 0.85` or 85% of expected rate in a 15-minute window), Eureka server enters **Self-Preservation Mode**.
  - Evictions are paused immediately to prevent catastrophic cascade failure during transient network blips.
- **Peer-to-Peer Replication:** Eureka servers replicate registry delta mutations asynchronously to peer nodes with conflict resolution based on timestamp versioning.

### 3. Swoole & Epoll Reactor-Worker Architecture
High-throughput network server architecture separating connection polling from business execution:
- **Master Process (Reactor Threads):**
  - Employs Linux `epoll` (edge-triggered) or BSD `kqueue` for I/O multiplexing.
  - Listens for new TCP handshakes and reads socket payloads without executing application logic.
- **Worker Process Pool:**
  - Reactor threads dispatch raw socket buffers to worker processes via Unix Domain Sockets or shared memory pipes.
  - Workers run business handlers in coroutines or non-blocking async loops.
- **Zero-Copy File Transfer:** Utilizes `sendfile(out_fd, in_fd, offset, count)` or Linux `splice()` to stream static assets and message payloads directly between kernel file buffers and socket descriptors, bypassing user-space memory copies.

---

## Production Implementation Patterns

### 1. In-Order Watermark Offset Tracker (Decaton Pattern)

```typescript
export class WatermarkOffsetTracker {
  private pendingOffsets = new Set<number>();
  private completedOffsets = new Set<number>();
  private committedOffset: number;

  constructor(initialOffset: number) {
    this.committedOffset = initialOffset;
  }

  public recordReceived(offset: number): void {
    this.pendingOffsets.add(offset);
  }

  public recordCompleted(offset: number): number | null {
    this.pendingOffsets.delete(offset);
    this.completedOffsets.add(offset);

    let nextAdvance = this.committedOffset + 1;
    let advanced = false;

    // Advance high watermark sequentially
    while (this.completedOffsets.has(nextAdvance)) {
      this.completedOffsets.delete(nextAdvance);
      this.committedOffset = nextAdvance;
      nextAdvance++;
      advanced = true;
    }

    return advanced ? this.committedOffset : null;
  }

  public getUncommittedLag(): number {
    return this.pendingOffsets.size;
  }
}
```

### 2. Asynchronous Fork-Join Work-Stealing Pool
To prevent head-of-line blocking in CPU-bound batch tasks:
- Dedicate dedicated worker threads sized to `available_parallelism()`.
- Use double-ended queues (deques): worker threads push/pop from the head of their own deque (LIFO for cache locality), and idle threads steal tasks from the tail of busy workers' deques (FIFO).
- Always set thread execution timeouts (`withTimeout(duration)`) and isolate external network I/O from compute-bound task pools.

---

## Production Verification Checklist
- [ ] Partition processing scales linearly with worker threads, independent of topic partition count.
- [ ] Per-key message order is strictly preserved during worker concurrent execution.
- [ ] Offset commit manager never commits beyond the earliest uncompleted gap in message sequences.
- [ ] Backpressure mechanisms pause partition reads when queue depth reaches saturation.
- [ ] Heartbeat leasing implements self-preservation to survive cross-zone network partitions.
