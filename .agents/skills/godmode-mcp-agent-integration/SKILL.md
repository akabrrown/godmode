---
name: godmode-mcp-agent-integration
description: Model Context Protocol (MCP) server creation, tool schema design, agent context window optimization, and custom agent tool wiring.
---

# GODMODE MCP & Agent Tool Integration

## Overview
Engineers Model Context Protocol (MCP) servers, custom agent tools, and structured context windows for Antigravity, Claude Code, Codex, and AI agent harnesses.

## Core Directives

1. **MCP Tool Schema Design:** Define strict JSON Schema parameters for all tools. Include explicit field descriptions, required arrays, and type constraints.
2. **Tool Intent & Error Recovery:** Standardize tool execution responses. Return informative, actionable error payloads to enable LLM self-correction upon failure.
3. **Context Window Optimization:** Design MCP tools to return concise, structured summaries instead of massive JSON blobs to protect context limits.
4. **Security & Permission Scoping:** Validate tool input parameters server-side. Restrict filesystem and execution tools to authorized workspace boundaries.
