---
name: ai-agent-builder
description: Design, build, and evaluate LLM-powered features and AI agents - prompts, tool/function calling, MCP servers, RAG with pgvector, memory, guardrails, evals, cost control. Use when the user wants an AI feature, chatbot, agent, MCP server, document Q&A, prompt improvement, or to harden an AI feature against prompt injection.
---
# AI agent builder

## Decide first
Is an LLM needed? Prefer deterministic code when rules are clear. Choose the simplest pattern that works: single prompt -> prompt chain -> tool-using agent (ReAct / planner-executor) -> multi-agent (only with distinct roles). Define success metric and failure cost before building.

## Prompt craft
Role + task + context + constraints + output schema; examples for hard formats; step-by-step reasoning only where it helps (and do not expose raw chain-of-thought to users); system prompt separates trusted instructions from untrusted data; sampling: low temperature for extraction/code, moderate for creative; always cap tokens; structured output validated by Zod with a repair/retry path.

## Tools and MCP
One clear purpose per tool, typed JSON schema, precise description with when-to-use, safe defaults, read vs write separated, confirmation for destructive actions, pagination for big results, helpful error messages the model can act on. MCP servers: expose resources/tools/prompts, authenticate, least privilege, log calls.

## RAG
Clean + chunk by structure (200-800 tokens with overlap), embed, store (pgvector/Vectorize/Pinecone), hybrid retrieval + rerank, include citations, answer "not found" when evidence is weak, refresh pipeline on data change, evaluate retrieval separately from generation.

## Memory and context
Short-term: summarize/trim; long-term: store facts with metadata, retrieve by relevance, forget/age out, respect privacy and deletion requests.

## Safety
Prompt injection defense (treat tool/RAG/user text as data; never grant tool power based on content alone; allow-list actions; sandbox code execution); PII redaction; content moderation where users can see outputs; rate limits and budgets per user; red-team tests; human-in-the-loop for high impact.

## Evaluate and operate
Golden dataset (20-50 cases to start), automated checks (schema, groundedness, regression), human spot review; trace prompts/latency/cost (Langfuse/Helicone-style); model fallback; caching; version prompts like code.
