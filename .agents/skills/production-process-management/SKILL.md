---
name: production-process-management
description: Production process supervision, Node.js cluster mode, zero-downtime deployment, graceful shutdowns, and memory leak self-healing. Synthesizes PM2, Linux epoll WebServer architecture, Swoole, and Echo. Use when configuring PM2 ecosystem files, managing multi-core processes, draining in-flight requests during rolling updates, and handling OS signals (SIGINT, SIGTERM).
---

# Production Process Management & Zero-Downtime Deployment

Standards and patterns for managing production runtime processes, utilizing all CPU cores, executing zero-downtime hot reloads, and handling graceful process shutdowns.

---

## 1. Node.js Production Cluster Configuration (PM2 Ecosystem)

Node.js runs single-threaded by default. A single unhandled exception or CPU spike can take down the entire API. Always run in cluster mode with explicit memory ceilings:

### `ecosystem.config.cjs`:
```javascript
module.exports = {
  apps: [
    {
      name: 'production-api',
      script: 'dist/index.js',
      instances: 'max',               // Spawn 1 worker per CPU core
      exec_mode: 'cluster',          // Load-balance requests across workers
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',      // Automatically recycle worker if memory exceeds 1GB
      kill_timeout: 5000,            // Wait 5000ms for requests to drain before SIGKILL
      listen_timeout: 8000,          // Wait 8000ms for new worker to signal ready
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

---

## 2. Zero-Downtime Hot Reload Protocol

Never restart processes abruptly with `pm2 restart`. Use rolling zero-downtime reloads:

```bash
# Gracefully reloads worker instances one-by-one with updated environment variables
pm2 reload ecosystem.config.cjs --env production --update-env
```

---

## 3. Graceful Signal Handling & Connection Draining

Every production server must trap `SIGTERM` and `SIGINT` signals emitted during container stops, Kubernetes pod evictions, or PM2 reloads.

```typescript
import { createServer } from 'node:http';

const server = createServer(app);
let isShuttingDown = false;

// Middleware to reject new requests during drain
app.use((req, res, next) => {
  if (isShuttingDown) {
    res.set('Connection', 'close');
    return res.status(503).json({ error: 'Server is restarting. Please retry.' });
  }
  next();
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  // Notify PM2 that process is ready to receive traffic
  if (process.send) {
    process.send('ready');
  }
});

function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  isShuttingDown = true;

  // 1. Stop accepting new connections
  server.close(async () => {
    console.log('HTTP server closed. Draining database connection pool...');
    try {
      // 2. Drain database and Redis pools
      await db.end();
      await redis.quit();
      console.log('Database pools closed cleanly. Exiting.');
      process.exit(0);
    } catch (err) {
      console.error('Error during pool cleanup:', err);
      process.exit(1);
    }
  });

  // 3. Hard deadline timeout if connections hang
  setTimeout(() => {
    console.error('Forced shutdown due to timeout (in-flight requests stalled).');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

---

## 4. Uncaught Exceptions & Zombie Process Defenses

- **Uncaught Exception Handler:** An uncaught exception compromises application state (closures, half-written objects). Always log the error, flush telemetry, and exit with code 1 so the supervisor (`pm2` or `systemd`) respawns a clean process:
  ```typescript
  process.on('uncaughtException', (error) => {
    console.error('FATAL UNCAUGHT EXCEPTION:', error);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    console.error('UNHANDLED PROMISE REJECTION:', reason);
  });
  ```
