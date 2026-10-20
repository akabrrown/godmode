---
name: godmode-orchestrator
description: Master intent routing, stage pipeline selection, sub-agent persona dispatch, and parallel fan-out merge for GODMODE.
---

# GODMODE Orchestrator

## Overview
The `godmode-orchestrator` skill acts as the master dispatch engine for all user requests. It maps user intent to specialized skills, initiates Rule Zero pipelines, coordinates sub-agent fan-out, and synthesizes outputs into production-grade deliverables.

## Intent Routing Decision Tree

```
                       ┌──────────────────────────────────────┐
                       │          USER INPUT RECEIVED         │
                       └──────────────────┬───────────────────┘
                                          │
    ┌────────────────┬────────────────────┼────────────────────┬────────────────┐
    ▼                ▼                    ▼                    ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌───────────────┐ ┌──────────────┐ ┌──────────────┐
│  SOFTWARE    │ │   UI / UX    │ │  MARKETING /  │ │ DEEP RESEARCH│ │  CUSTOM PIPELINE│
│ ENGINEERING  │ │   DESIGN     │ │  GROWTH / CRO │ │ ACADEMIC/CODE│ │ MEDIA/MULTISTEP│
├──────────────┤ ├──────────────┤ ├───────────────┤ ├──────────────┤ ├──────────────┤
│godmode-      │ │godmode-ui-   │ │godmode-       │ │godmode-deep- │ │godmode-      │
│software-     │ │ux-anti-slop  │ │marketing-     │ │research      │ │pipeline-     │
│engineering   │ │              │ │growth         │ │              │ │production    │
└──────┬───────┘ └──────┬───────┘ └───────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                 │                │                │
       └────────────────┴─────────────────┼────────────────┴────────────────┘
                                          ▼
                         ┌──────────────────────────────────┐
                         │   PARALLEL FAN-OUT MERGE STEP    │
                         │ Security + TDD + Audit + Deploy  │
                         └──────────────────────────────────┘
```

## Step-by-Step Workflow

1. **Intent Classification:** Analyze the user request against all GODMODE skills (including `playwright-testing`) and workflows (`/godmode-build`, `/godmode-design`, `/godmode-market`, `/godmode-research`, `/e2e-test-strategy`).
2. **Pipeline Manifest Selection:** Check if an existing YAML pipeline manifest or workflow applies. If none exists, construct a stage-by-stage execution plan.
3. **Chunked Plan Presentation:** Present the proposed architecture and execution steps to the user in bite-sized, digestable sections. Obtain signoff before executing code.
4. **Sub-Agent Dispatch (Parallel Fan-Out):** For complex reviews or multi-disciplinary tasks, spawn parallel sub-agents (e.g. `security-auditor`, `test-engineer`, `ui-inspector`, `playwright-e2e-runner`).
5. **Synthesis & Merge:** Combine all sub-agent results, run pre-delivery verification checks, verify test suite status (unit/integration/E2E), and present the finished, production-ready deliverable.
