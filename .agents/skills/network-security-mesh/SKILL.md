---
name: network-security-mesh
description: Zero-trust mesh networking, eBPF security policies, mutual TLS, and network traffic forensics. Synthesizes Slack's Nebula, Cilium, and Arkime. Use when establishing peer-to-peer overlay networks, defining microsegmentation policies, enforcing Layer 7 egress/ingress security, inspecting network packets, and eliminating perimeter-based VPN vulnerabilities.
---

# Zero-Trust Mesh Networking & eBPF Security

An enterprise security engineering skill for establishing zero-trust overlay networks, identity-based microsegmentation, and deep network traffic inspection.

---

## 1. Zero-Trust Mesh Architecture (Slack Nebula Pattern)

Perimeter-based security (corporate VPNs) fails because an attacker inside the perimeter gains unrestricted lateral access. Zero-trust overlays eliminate this risk:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SLACK NEBULA OVERLAY MESH                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                ┌───────────────────────┐                               │
│                │   LIGHTHOUSE SERVER   │ (Discovery Only               │
│                │  (Public Static IP)   │  No Traffic Passes Through)   │
│                └───────────┬───────────┘                               │
│                            │                                           │
│             P2P Handshake  │  P2P Handshake                            │
│                            ▼                                           │
│       ┌────────────────────────┐       ┌────────────────────────┐      │
│       │      NODE A (Prod)     │◄─────►│      NODE B (DB)       │      │
│       │ IP: 192.168.100.1      │  E2E  │ IP: 192.168.100.2      │      │
│       │ Groups: [web, prod]    │ Encryp│ Groups: [db, prod]     │      │
│       └────────────────────────┘       └────────────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Principles:
1. **Certificate-Defined Identity:** Every node possesses an encrypted certificate signed by an internal Certificate Authority (CA) encoding IP, subnet, and security groups.
2. **Direct Peer-to-Peer:** Traffic flows directly between nodes over encrypted UDP. The "Lighthouse" node only coordinates initial NAT traversal and IP discovery.
3. **Identity-Based Firewall:** Firewalls filter by group name (`groups: ["web"]` allowed to access port 5432 on `groups: ["db"]`), not by unstable physical IP addresses.

---

## 2. eBPF Network Security & Microsegmentation (Cilium Pattern)

Run security policies directly inside the Linux kernel using eBPF without injecting slow user-space sidecar proxies:

### Layer 7 API-Aware Network Policy (YAML):

```yaml
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: "secure-payment-gateway-egress"
spec:
  endpointSelector:
    matchLabels:
      app: checkout-service
  egress:
    # 1. Allow internal database access only on port 5432
    - toEndpoints:
        - matchLabels:
            app: order-database
      toPorts:
        - ports:
            - port: "5432"
              protocol: TCP

    # 2. Restrict external HTTP to specific Stripe API paths
    - toFQDNs:
        - matchName: "api.stripe.com"
      toPorts:
        - ports:
            - port: "443"
              protocol: TCP
          rules:
            http:
              - method: "POST"
                path: "/v1/charges"
              - method: "POST"
                path: "/v1/payment_intents"
```

---

## 3. Network Traffic Forensics & PCAP Analysis (Arkime Pattern)

When investigating potential breaches, data exfiltration, or abnormal latency:
- **Full Packet Capture (PCAP):** Record and index raw pcap data with searchable metadata (SPI: Session Profile Information).
- **DNS Exfiltration Detection:** Monitor high-entropy subdomains and irregular DNS TXT queries.
- **TLS Fingerprinting:** Track JA3/JA4 TLS client fingerprints to detect automated malware, headless scraping tools, and spoofed User-Agents.
