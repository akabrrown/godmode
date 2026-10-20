# App Flow & Interaction Graph — GODMODE OS

**Engine:** Rule Zero Pipeline State Machine  
**Event Protocol:** JSON-RPC 2.0 / Server-Sent Events (SSE)

---

## 1. System Lifecycle & Startup Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Engineer / User
    participant CLI as Godmode CLI / Gateway
    participant MCP as MCP Skill Server
    participant Reg as Skill & Workflow Registry
    participant Hub as LibreChat Web Portal
    participant Work as Local Workspaces (PROjects/)

    User->>CLI: godmode start
    CLI->>Reg: Index 289 skills & 30 workflows
    Reg-->>CLI: Registry Index Ready (289 skills, 30 workflows)
    CLI->>MCP: Start MCP Daemon (stdio / SSE port 4004)
    CLI->>Work: Verify access to PROjects directory
    CLI->>Hub: Boot LibreChat with Godmode presets (port 3080)
    Hub-->>User: Ready on http://localhost:3080
```

---

## 2. Pipeline Execution State Machine (Rule Zero)

```mermaid
stateDiagram-v2
    [*] --> Idle: System Ready

    Idle --> Preflight: User submits task (/build, /media, /research, /market)
    
    state Preflight {
        [*] --> AuditTools: Check CLI, node, python, git
        AuditTools --> ValidatePath: Ensure safe directory
        ValidatePath --> [*]: Preflight Passed
    }

    Preflight --> Discovery: Read Director Skills & Rules
    
    state Discovery {
        [*] --> MapIntent: Determine required skills
        MapIntent --> SpecSuite: Check for 5 docs (PRD, TDD...)
        SpecSuite --> PlanPresentation: Show 2-3 options to user
        PlanPresentation --> [*]: User Approval
    }

    Discovery --> StageExecution: User Approved Plan
    
    state StageExecution {
        [*] --> RedTest: Write failing unit test
        RedTest --> GreenCode: Write minimal implementation
        GreenCode --> E2EVerify: Run Playwright / Headless test
        E2EVerify --> Refactor: Clean DRY/YAGNI code
        Refactor --> [*]: Stage Complete
    }

    StageExecution --> ReviewGate: All Stages Executed

    state ReviewGate {
        [*] --> SkepticGate: Check zero AI tells
        SkepticGate --> ProductionGate: Check auth, IDOR, secrets
        ProductionGate --> [*]: Verification Passed
    }

    ReviewGate --> GitCommit: Approved & Verified
    GitCommit --> Idle: PR Created / Changes Merged
```

---

## 3. Tool Intent & Outcome Telemetry Cycle

Every tool call follows the strict 3-beat telemetry protocol:

```
Step 1: Broadcast Intent (Streaming)
{
  "event": "tool_intent",
  "data": {
    "callId": "call_94812",
    "toolName": "workspace_edit",
    "intent": "Adding Stripe webhook verification middleware",
    "status": "RUNNING",
    "costTier": "LOW"
  }
}

Step 2: Execution (Isolated in worktree/sandbox)
... executes changes and runs tests ...

Step 3: Broadcast Outcome (Settled)
{
  "event": "tool_outcome",
  "data": {
    "callId": "call_94812",
    "outcome": "Added Stripe webhook verification middleware with signature tests passing",
    "status": "SUCCESS",
    "durationMs": 142
  }
}
```
