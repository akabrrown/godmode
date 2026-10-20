---
name: godmode-pipeline-production
description: OpenMontage-style stage-director pipeline engine for complex multi-step media, video, audio, and asset production.
---

# GODMODE Pipeline Production Engine

## Overview
Executes complex production pipelines (video creation, audio generation, multi-stage refactoring, documentation publishing) using OpenMontage's instruction-driven pipeline architecture.

## Operating Principles

1. **Rule Zero Enforcement:** No production work proceeds without a pipeline definition.
2. **Stage Directors:** Each stage in a pipeline is governed by a Director instruction specifying required inputs, tools, quality gates, and output artifacts.
3. **Layer 3 Provider Guidance:** Consult provider-specific prompting guidelines (e.g. video, audio, image models) before making generation requests.
4. **Decision Communication Contract:** State tool choice, provider, model parameters, and estimated resource cost prior to executing consequential generation steps.

## Pipeline Stage Execution Blueprint

```
Stage 1: Preflight Audit ──> Stage 2: Narrative Concept ──> Stage 3: Asset Generation
                                                                   │
Stage 6: Final Export   <── Stage 5: Human Checkpoint  <── Stage 4: Composition / Assembly
```

1. **Preflight Audit:** Discover local tools, check credentials, verify output directories.
2. **Narrative & Concept Stage:** Produce 2–3 creative concepts for user review.
3. **Asset Generation Stage:** Execute prompt engineering and call asset generation tools.
4. **Assembly Stage:** Combine visuals, audio, code, or documentation into a cohesive composite.
5. **Human Checkpoint:** Present assembled preview for user verification and signoff.
6. **Final Rendering / Export:** Render production bundle and save artifacts.
