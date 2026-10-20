# Technical Design Document (TDD) — GODMODE OS

**System:** GODMODE OS Core Engine & Tool Gateway  
**Language/Framework:** TypeScript 5.x (Strict), Node.js v20+ LTS  
**Testing Harness:** Vitest (Red/Green TDD Runner), Playwright Headless  
**Module System:** ESM (`"type": "module"`)

---

## 1. System Architecture & Module Boundaries

```
                      ┌────────────────────────────────────────────────────────┐
                      │                 CLI & Entrypoint (bin)                 │
                      │               godmode [command] [options]              │
                      └───────────────────────────┬────────────────────────────┘
                                                  │
                 ┌────────────────────────────────┴──────────────────────────────┐
                 ▼                                                               ▼
  ┌─────────────────────────────┐                                 ┌─────────────────────────────┐
  │   MCP Server (stdio / SSE)  │                                 │   Pipeline Engine (Core)    │
  │  - Skill Registry (289)     │                                 │  - Stage Director           │
  │  - Workflow Registry (30)   │                                 │  - Manifest State Machine   │
  │  - Rule Enforcer (13)       │                                 │  - Checkpoint Validator     │
  └──────────────┬──────────────┘                                 └──────────────┬──────────────┘
                 │                                                               │
                 └───────────────────────────────┬───────────────────────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │   Workspace Bridge (FS/Git) │
                                  │  - Path Sanitize & Jail     │
                                  │  - Worktree Manager         │
                                  │  - Atomic File Patcher      │
                                  └──────────────┬──────────────┘
                                                 │
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │  Target Client Repositories │
                                  │  (Writers website, DASA...) │
                                  └─────────────────────────────┘
```

---

## 2. Core Interfaces & Contracts

### 2.1 Skill & Tool Registry Interface
```typescript
export interface SkillMetadata {
  name: string;
  description: string;
  category: 'engineering' | 'media' | 'research' | 'growth' | 'core';
  path: string;
  hasReferences: boolean;
  hasScripts: boolean;
  hasEvals: boolean;
}

export interface WorkflowMetadata {
  name: string;
  description: string;
  filePath: string;
  stages: string[];
}

export interface ExecutionIntent {
  intent: string;
  toolName: string;
  provider?: string;
  model?: string;
  costTier: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
}

export interface ExecutionOutcome {
  intent: string;
  outcome: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  durationMs: number;
  error?: string;
  artifactsCreated?: string[];
}
```

### 2.2 Pipeline Manifest Interface (Rule Zero Standard)
```typescript
export type PipelineStage = 'PREFLIGHT' | 'DISCOVERY' | 'STAGE_EXEC' | 'REVIEW_GATE';

export interface PipelineManifest {
  pipelineId: string;
  targetProject: string;
  workflowName: string;
  currentStage: PipelineStage;
  checkpointsPassed: string[];
  pendingApproval: boolean;
  state: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
```

---

## 3. Red/Green TDD Test Harness Specification

We enforce test-driven development using **Vitest**. All functional modules must have corresponding `.test.ts` files.

### Test Directory Layout
```
tests/
├── unit/
│   ├── skill-registry.test.ts      # Validates indexing of 289 skills & metadata
│   ├── workflow-registry.test.ts   # Validates parsing of 30 workflows
│   ├── workspace-bridge.test.ts    # Tests path normalization, IDOR, path-traversal prevention
│   └── telemetry.test.ts           # Tests intent streaming & outcome patching
├── integration/
│   ├── mcp-server.test.ts          # Tests stdio JSON-RPC handshake & tool execution
│   └── pipeline-runner.test.ts     # Tests multi-stage execution with mock stages
└── fixtures/
    ├── sample-skill/
    └── sample-project/
```

### Test Gate Requirements
1. **RED**: A failing test is committed asserting the exact desired contract.
2. **GREEN**: Minimal implementation is added to satisfy the test.
3. **REFACTOR**: Code cleaned under DRY/YAGNI principles. Zero regressions.

---

## 4. Security & Sandboxing Architecture

1. **Path Traversal Jail**:
   - Every file operation must run through `resolveSafePath(baseDir, relativePath)`.
   - If resolved path does not start with `baseDir`, throw `SecurityViolationError('Path traversal detected')`.
2. **Secret Scanning**:
   - Pre-commit scanner rejects any payload matching known API key patterns (`ghp_`, `sk-`, `eyJh...`, private keys).
3. **IDOR & Server Authorization**:
   - Any database mutation must check authenticated user against target record ID.
