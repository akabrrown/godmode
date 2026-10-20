# Backend Schema & Data Models — GODMODE OS

**Databases:** Local SQLite (`godmode.db`) for state and telemetry; JSON Schema / Zod for boundary validation.

---

## 1. SQLite Relational Schema (Local State Engine)

```sql
-- 1. Pipelines Table (Tracks Rule Zero execution runs)
CREATE TABLE IF NOT EXISTS pipelines (
    id TEXT PRIMARY KEY,
    target_project_path TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    current_stage TEXT NOT NULL CHECK(current_stage IN ('PREFLIGHT', 'DISCOVERY', 'STAGE_EXEC', 'REVIEW_GATE', 'COMPLETED', 'FAILED')),
    status TEXT NOT NULL CHECK(status IN ('IDLE', 'RUNNING', 'WAITING_APPROVAL', 'FINISHED', 'ABORTED')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pipeline Stages & Checkpoints
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id TEXT PRIMARY KEY,
    pipeline_id TEXT NOT NULL,
    stage_name TEXT NOT NULL,
    stage_order INTEGER NOT NULL,
    director_skill TEXT,
    status TEXT NOT NULL CHECK(status IN ('PENDING', 'IN_PROGRESS', 'PASSED', 'FAILED')),
    logs TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(id) ON DELETE CASCADE
);

-- 3. Telemetry Log (Tool Intents and Outcomes)
CREATE TABLE IF NOT EXISTS tool_telemetry (
    id TEXT PRIMARY KEY,
    pipeline_id TEXT,
    tool_name TEXT NOT NULL,
    intent TEXT NOT NULL,
    outcome TEXT,
    status TEXT NOT NULL CHECK(status IN ('RUNNING', 'SUCCESS', 'FAILED', 'BLOCKED')),
    cost_tier TEXT CHECK(cost_tier IN ('LOW', 'MEDIUM', 'HIGH')),
    duration_ms INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pipeline_id) REFERENCES pipelines(id) ON DELETE SET NULL
);

-- 4. Long-Term Memory & Project Context
CREATE TABLE IF NOT EXISTS workspace_memory (
    id TEXT PRIMARY KEY,
    project_name TEXT NOT NULL,
    memory_key TEXT NOT NULL,
    memory_value TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_name, memory_key)
);
```

---

## 2. Zod Validation Schemas (Runtime Type Safety)

```typescript
import { z } from 'zod';

export const SafePathSchema = z.string().refine((path) => {
  // Reject null bytes, directory traversal patterns
  return !path.includes('\0') && !path.includes('..');
}, { message: "Invalid path: traversal sequences detected." });

export const ToolIntentSchema = z.object({
  callId: z.string().uuid(),
  toolName: z.string().min(1),
  intent: z.string().min(3).max(256),
  provider: z.string().optional(),
  model: z.string().optional(),
  costTier: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
});

export const ToolOutcomeSchema = z.object({
  callId: z.string().uuid(),
  outcome: z.string().min(3),
  status: z.enum(['SUCCESS', 'FAILED', 'BLOCKED']),
  durationMs: z.number().int().nonnegative(),
  artifactsCreated: z.array(z.string()).optional(),
  error: z.string().optional(),
});

export const PipelineInitSchema = z.object({
  targetProject: SafePathSchema,
  command: z.enum(['build', 'media', 'research', 'market', 'audit']),
  taskDescription: z.string().min(5),
  dryRun: z.boolean().default(false),
});
```

---

## 3. Project Configuration Schema (`godmode.config.json`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "version": { "type": "string" },
    "workspaceRoots": {
      "type": "array",
      "items": { "type": "string" }
    },
    "mcp": {
      "type": "object",
      "properties": {
        "port": { "type": "number", "default": 4004 },
        "transport": { "type": "string", "enum": ["stdio", "sse"], "default": "stdio" }
      }
    },
    "telemetry": {
      "type": "object",
      "properties": {
        "enabled": { "type": "boolean", "default": true },
        "logDir": { "type": "string", "default": "./.godmode/logs" }
      }
    }
  },
  "required": ["version"]
}
```
