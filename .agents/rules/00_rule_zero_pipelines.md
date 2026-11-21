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

---

## 5. Document Ingestion & Autonomous Skill Mapping Protocol

Whenever the user uploads, attaches, or points to specification documents (PRDs, client briefs, wireframes, database schemas, feature lists, or API specs):

### The Agent MUST:
1. **Read & Synthesize First:** Completely read and extract requirements, entities, user roles, external integrations, and constraints before proposing solutions.
2. **Autonomous Skill & Workflow Mapping:** Without requiring the user to manually tag skills, automatically query the internal registry and construct a tailored execution matrix:
   - **Data & Storage:** Map `godmode-database-orm-mastery`, `postgres-sql-review`, `backend-admin-database`.
   - **Frontend & UI/UX:** Map `ui-ux-pro-max`, `godmode-ui-ux-anti-slop`, `ui-styling`, `design-system`.
   - **Security & Authorization:** Map `godmode-auth-security-hardening`, `security-hardening`.
   - **Engineering & Testing:** Map `godmode-software-engineering`, `test-driven-development`, `playwright-testing`.
   - **Lifecycle Workflows:** Sequence `/design-plan` → `/godmode-build` → `/design-review` → `/release-check`.
3. **Produce the Phased Blueprint:**
   - **Scope & Entity Summary**
   - **Mapped Skills, Rules, and Workflows Table**
   - **Phased Implementation Roadmap** (Phase 1 Data, Phase 2 Design Tokens, Phase 3 Logic & TDD, Phase 4 Security & Review)
   - **Key Decisions / Technical Trade-offs**
4. **Mandatory Pre-Code Stop Condition:**
   - **DO NOT WRITE CODE OR SCAFFOLDING IN THE FIRST TURN.**
   - Output the complete blueprint and explicitly state: *"I have synthesized your document and mapped the required skills, workflows, and rules. Please review and confirm this plan before I begin implementation."*
