---
trigger: always_on
---
# RULE ZERO: PIPELINE-DRIVEN ARCHITECTURE (OpenMontage Pattern)

## Core Directive
**Every non-trivial task (software feature build, refactor, UI redesign, marketing plan, deep research, or media creation) MUST run through a structured pipeline.**

No agent may write code, modify files, call paid tools, or make production changes ad-hoc without declaring the active stage and reading the corresponding director instructions.

## Pipeline Lifecycle Standard

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────────┐     ┌─────────────────┐
│ 1. PREFLIGHT    │ ──> │ 2. DISCOVERY     │ ──> │ 3. STAGE EXEC     │ ──> │ 4. REVIEW GATE  │
│ Manifest Audit  │     │ Capabilities &   │     │ Director Skill +  │     │ Verification &  │
│ Tool Registry   │     │ User Plan Signoff│     │ Layer 3 Guidance  │     │ Quality Check   │
└─────────────────┘     └──────────────────┘     └───────────────────┘     └─────────────────┘
```

### Stage 1: Preflight & Capability Audit
- Inspect available tools, MCP servers, sub-agents, and workspace dependencies before execution.
- Validate environment variables, API key readiness, and file paths.

### Stage 2: Concept & Production Plan Signoff
- Present 2–3 concise implementation options or architectural choices to the user.
- Detail the cost, model choice, required steps, and anticipated outputs before starting.

### Stage 3: Stage Director Skill Execution
- For each stage in the pipeline:
  1. Read the dedicated Stage Director instruction.
  2. Read Layer 3 provider-specific prompting guidance before generating assets or calling tools.
  3. Execute stage actions using Red/Green TDD or incremental verification.

### Stage 4: Checkpoints & Human-In-The-Loop Approval
- Never advance past major milestones (e.g., database schema changes, payment logic edits, visual layout rewrites) without verifying empirical behavior and securing checkpoint approval.
