---
trigger: model_decision
description: Apply when building LLM features, AI agents, MCP servers, RAG pipelines, tool calling, or writing prompts
---
# AI agent and prompt rules
- **Prompts**: state role, task, context, constraints, output format; give 1-3 examples for tricky formats; delimit untrusted input; ask for structured output (JSON schema) and validate with Zod; temperature low for extraction/code, higher for ideation; iterate against a small eval set.
- **Agent loop**: perceive -> plan -> act (tool) -> observe -> reflect, with a hard step limit, explicit stop criteria, and a token/cost budget. Prefer a single agent with good tools; add multi-agent only when roles genuinely differ.
- **Tools / MCP**: narrow, well-named tools with typed inputs and clear descriptions; idempotent or confirmable for side effects; least privilege; human approval for destructive/financial actions.
- **Memory**: short-term = context window management (summarize, trim); long-term = vector store/DB with retrieval, aging and forgetting policy.
- **RAG**: chunk by meaning, embed, hybrid search (vector + keyword), rerank, cite sources, handle "no answer" honestly; pgvector is the default in this stack.
- **Safety**: treat all retrieved/tool/user text as untrusted (prompt injection); never let model output execute unvalidated; redact PII before sending to third parties; log prompts with care; add guardrails and red-team tests.
- **Reliability**: retries/timeouts, fallback model, streaming for UX, caching of deterministic calls, cost and latency metrics (Helicone/Langfuse-style tracing).
- **Evaluate**: golden test cases, regression runs on prompt/model changes, human review for high-stakes.
