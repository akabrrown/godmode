---
trigger: always_on
---
# RULE 03: TOOL INTENT LABELS & TELEMETRY (LibreChat Pattern)

## Core Directive
**Tool execution must be transparent, descriptive, and trackable.**

Every tool call executed by an agent or sub-agent must clearly signal *why* it is being executed and present cost/provider telemetry prior to resource consumption.

## 1. Tool Intent Protocol
- When invoking tools, the first argument or summary MUST state a clear, human-readable natural language present-progressive action (e.g., `"intent": "Searching codebase for OAuth callback handlers"`).
- Upon completion, the status transitions to an past-tense outcome statement (e.g., `"outcome": "Located OAuth callback handler in src/auth/oauth.ts"`).

## 2. Provider, Model & Cost Declarations
Before initiating paid, external, or high-resource operations (e.g., third-party API queries, browser sub-agent runs, model image generation, sandbox cloud deployments), state:
- **Tool Name:** The exact underlying tool being called.
- **Provider & Model:** The cloud provider or model family handling the execution.
- **Target Action:** The specific goal of the call.
- **Resource/Cost Level:** Estimated usage tier (Low, Medium, High).

## 3. Background Task & Async Handling
- Long-running commands must be spawned as background tasks (`run_command` async or `schedule`).
- Do NOT poll background tasks in loops. Allow reactive event notifications to signal task completion while performing parallel work or yielding execution cleanly.
