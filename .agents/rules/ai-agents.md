---
trigger: model_decision
description: Apply when building LLM features, AI agents, MCP servers, RAG pipelines, tool calling, multi-model routing, or writing prompts
---
# AI Agent, Model Routing & LLM Gateway Rules

## 1. Prompt Engineering & Structured Outputs
- **Format:** Role, Task, Context, Hard Constraints, and Exact Output Schema. Delimit untrusted user inputs with triple backticks or XML tags (`<user_input>...</user_input>`).
- **Structured Outputs:** Always request JSON schema and validate with Zod or Pydantic. Never trust raw unparsed LLM strings in application business logic.
- **Temperature Settings:** `0.0` for code generation, data extraction, and tool calling; `0.7` for creative ideation.

## 2. Multi-Model Gateway & Routing (LiteLLM Architecture)
- **Unified Proxy Interface:** Decouple application code from specific provider SDKs (OpenAI, Anthropic, Gemini, DeepSeek, Ollama). Pass requests through an AI Gateway.
- **Fallback Cascades:** Always configure multi-tier model fallbacks to survive provider outages and HTTP 429 rate limits:
  - *Primary:* Claude 3.5 Sonnet / GPT-4o
  - *Tier 1 Fallback:* Gemini 1.5 Pro
  - *Emergency Fallback:* DeepSeek V3 / Mistral Large
- **Budgeting & Spend Ceilings:** Set per-user/tenant daily and monthly token spend caps. Enforce hard stops before cloud billing surges.

## 3. Tool Calling & Agent Loops
- **Loop Architecture:** `Perceive → Plan → Act (Tool) → Observe → Reflect`.
- **Safety Limits:** Always configure a hard maximum step limit (e.g. 10–25 steps), timeout ceilings (30s per tool call), and an explicit stop condition.
- **Idempotency & Destructive Actions:** Tools with destructive side effects (database deletes, financial charges, sending emails) require explicit human confirmation or signed tokens.

## 4. Semantic Caching & Cost Reduction
- **Embedding Cache:** Store embedding queries in Redis/Qdrant. For questions with semantic cosine similarity > 0.95, return cached responses to slash API cost by 60%+.
- **Chunking & RAG:** Chunk semantically (400–800 tokens with 10% overlap). Combine dense vector search with BM25 sparse keyword search (Hybrid Search), rerank top 10 results, and cite sources.

## 5. Security & Prompt Injection Defense
- **Untrusted Ingestion:** Treat all retrieved documents, search results, and user inputs as untrusted payloads.
- **Redaction:** Strip PII (Personally Identifiable Information) before forwarding prompts to cloud providers.
- **Evaluation Gate:** Maintain a golden eval test suite. Run regression benchmarks before deploying any prompt, tool, or model changes.
