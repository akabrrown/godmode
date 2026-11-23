---
name: cloud-infrastructure-governance
description: Cloud cost optimization, infrastructure governance, policy-as-code, and automated resource compliance. Synthesizes Cloud Custodian and Ubicloud. Use when implementing cloud budget guards, pruning zombie resources (unattached EBS volumes, idle load balancers, orphaned snapshots), enforcing tagging policies, automating multi-cloud compliance (AWS, GCP, Azure, Cloudflare), and reducing cloud spend.
---

# Cloud Infrastructure Governance & Cost Optimization

A production framework for automating cloud security, compliance, cost controls, and resource hygiene using policy-as-code.

---

## 1. Zombie Resource Elimination & Cost Pruning

Orphaned and idle cloud resources waste thousands of dollars per month. Run automated policies to detect and clean:

| Resource Type | Detection Criteria | Remediation Action |
|---|---|---|
| **Unattached EBS/Persistent Disks** | Volume status `available` for >7 days | Snapshot volume, tag `marked-for-deletion`, delete after 14 days. |
| **Idle Load Balancers (ALB/NLB)** | Request count = 0 over rolling 7 days | Alert DevOps channel; deregister and terminate if unused. |
| **Orphaned Snapshots** | Snapshot older than 90 days with no parent AMI/Volume | Delete snapshot after archiving metadata. |
| **Idle Cloud NAT Gateways** | Zero bytes transferred for 5 days | Consolidate VPC egress or route through low-cost NAT instances. |
| **Over-Provisioned DB Instances** | CPU utilization < 5% and connection count < 10% for 14 days | Recommend downsizing instance tier or switching to serverless/Aurora DBLite. |

---

## 2. Policy-as-Code Declarative Rules (Cloud Custodian Standard)

Define policies in YAML to enforce continuous guardrails:

```yaml
policies:
  # 1. Enforce Mandatory Tagging
  - name: require-mandatory-tags
    resource: aws.ec2
    filters:
      - "tag:Environment": absent
      - "tag:Owner": absent
    actions:
      - type: tag
        key: ComplianceStatus
        value: NonCompliant
      - type: notify
        slack_template: "Un-tagged instance detected: {instance_id}"

  # 2. Prune Unattached Storage Volumes
  - name: delete-unattached-ebs-volumes
    resource: aws.ebs
    filters:
      - Attachments: []
      - "tag:KeepAlive": absent
      - type: value
        key: CreateTime
        value_type: age
        value: 7
        op: greater-than
    actions:
      - type: snapshot
      - type: delete

  # 3. Stop Development Instances Outside Working Hours
  - name: offhours-dev-stop
    resource: aws.ec2
    filters:
      - "tag:Environment": "development"
      - type: offhour
        tag: schedule
        offhour: 19 # 7 PM
    actions:
      - stop
```

---

## 3. Multi-Cloud Egress & Infrastructure Hygiene

- **Egress Cost Elimination:** Colocate object storage and compute in the same cloud region. Front public downloads with Cloudflare R2 / CDN (zero egress fees) rather than direct S3 downloads.
- **Strict Budget Alerts:** Set hard billing alert thresholds at 50%, 80%, and 100% of monthly budget with webhook triggers.
- **Least-Privilege IAM:** Run automated scans for wildcards (`*`) in IAM role policies. Eliminate permanent access keys in favor of short-lived IAM roles and OpenID Connect (OIDC).
