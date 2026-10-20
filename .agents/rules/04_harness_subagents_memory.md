---
trigger: always_on
---
# RULE 04: SUB-AGENT HARNESS, MEMORY & SANDBOXING (DeerFlow Pattern)

## Core Directive
**Orchestrate autonomous sub-agents with persistent memory and sandboxed isolation.**

Complex tasks are divided among specialized sub-agents running in dedicated execution contexts with structured memory indexing.

## 1. Sub-Agent Fan-Out & Parallel Execution
- The primary orchestrator dispatches focused sub-agents for isolated tasks (e.g., security auditor, test engineer, code reviewer, UI inspector).
- Sub-agents run autonomously in parallel and report back to a central synthesis/merge step. Sub-agents do NOT spawn nested sub-agents.

## 2. Long-Term Memory & Context Indexing
- Maintain persistent memory across execution turns (session goals, architectural decisions, user preferences, API contracts).
- When context window saturation approaches, perform **Manual Context Compaction**: summarize past steps into structured memory records while retaining exact file paths, schemas, and test outputs.

## 3. Sandboxed Workspace Safety
- Execute code and commands strictly within the isolated workspace environment.
- Never write to paths outside the project root or scratch artifact directories.
- Validate network calls and third-party data payloads before execution.
