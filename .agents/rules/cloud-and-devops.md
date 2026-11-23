# CLOUD, DEVOPS & ZERO-TRUST INFRASTRUCTURE DIRECTIVE

> **Universal Standard for Production Operations:** High-availability process management, zero-downtime deployments, cloud resource governance, and zero-trust container/eBPF mesh networking.

---

## 1. Zero-Downtime Process Management (PM2 & Container Lifecycle)

1. **Graceful Drain Handling:**
   - Applications MUST listen for `SIGINT` and `SIGTERM`.
   - On receiving termination signal:
     1. Stop accepting new incoming HTTP connections (`server.close()`).
     2. Allow active in-flight requests a grace period (default: `10000ms` / 10 seconds).
     3. Flush pending logger buffers and close database connection pools cleanly.
     4. Terminate process with exit code `0`.
2. **Cluster Mode Auto-Scaling:**
   - In production Node.js/container environments, bind worker count to CPU cores: `instances: "max"` or `instances: -1` (leaving 1 core for OS/I/O).
   - Configure memory threshold auto-restart (`max_memory_restart: "1G"`) to neutralize memory leaks before OOM-killer crashes the pod.
3. **Rolling Zero-Downtime Reload:**
   - Use rolling cluster reloads (`pm2 reload ecosystem.config.js`) so instances restart sequentially, ensuring at least N-1 workers are always live to serve incoming traffic.

---

## 2. Cloud Cost Governance & Automated Pruning (Cloud Custodian Standards)

1. **Zombie Resource Elimination:**
   - Unattached EBS volumes (`volume-age > 7 days` and status `available`): Snapshot and automatically purge.
   - Idle Load Balancers: Query CloudWatch metrics; if `RequestCount < 50` over 14 consecutive days, alert and mark for de-provisioning.
   - Detached Elastic IPs (EIPs): Release immediately to prevent unassociated IP hourly charges.
2. **Mandatory Tagging & Lifecycle Enforcement:**
   - Every cloud asset MUST possess tags: `Environment`, `Owner`, `Project`, and `CostCenter`.
   - Non-production development environments (staging/dev) MUST enforce scheduled auto-shutdown policies during off-hours (e.g., stop EC2/RDS at 19:00, start at 07:00 weekdays).

---

## 3. Zero-Trust Mesh & Kernel-Level Security (Nebula & Cilium eBPF)

1. **eBPF-Powered L7 Network Policies:**
   - Enforce least-privilege network egress/ingress policies at the kernel level using Cilium eBPF rather than slow IPtables connection tracking.
   - Restrict database pod ingress strictly to authenticated backend service identities (SPIFFE/mTLS).
2. **Overlay P2P Mesh Communication (Nebula Pattern):**
   - Inter-service communication across disparate cloud providers or hybrid bare-metal clusters must route through encrypted Nebula mesh tunnels with centralized lighthouse nodes.
   - Traffic encryption uses Diffie-Hellman Noise protocol with mutual certificate authentication.
3. **Full Packet Forensics & Anomaly Inspection (Arkime Standard):**
   - Ingress endpoints handling financial or sensitive PII must log L7 transaction metadata and mirror packets during security alert triggers for post-incident forensic replay.
