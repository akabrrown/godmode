import { describe, it, expect, beforeEach } from 'vitest';
import path from 'node:path';
import { PipelineRunner } from '../../src/pipeline/runner.js';
import { SkillRegistry } from '../../src/registry/skills.js';
import { WorkflowRegistry } from '../../src/registry/workflows.js';
import { WorkspaceBridge } from '../../src/bridge/workspace.js';
import { TelemetryManager } from '../../src/telemetry/intent.js';

describe('PipelineRunner (TDD Red -> Green)', () => {
  let runner: PipelineRunner;

  beforeEach(async () => {
    const skillsDir = path.resolve(process.cwd(), '.agents/skills');
    const workflowsDir = path.resolve(process.cwd(), '.agents/workflows');
    const workspaceRoot = process.cwd();

    const skillRegistry = new SkillRegistry(skillsDir);
    const workflowRegistry = new WorkflowRegistry(workflowsDir);
    const bridge = new WorkspaceBridge(workspaceRoot);
    const telemetry = new TelemetryManager();

    await skillRegistry.initialize();
    await workflowRegistry.initialize();

    runner = new PipelineRunner({
      skillRegistry,
      workflowRegistry,
      bridge,
      telemetry,
    });
  });

  it('should initialize a new pipeline in PREFLIGHT stage', () => {
    const manifest = runner.createPipeline({
      command: 'build',
      targetProject: 'Writers website',
      taskDescription: 'Implement Stripe checkout webhook handler',
    });

    expect(manifest.pipelineId).toBeDefined();
    expect(manifest.currentStage).toBe('PREFLIGHT');
    expect(manifest.targetProject).toBe('Writers website');
    expect(manifest.status).toBe('RUNNING');
  });

  it('should pass preflight checks and advance to DISCOVERY stage', async () => {
    const manifest = runner.createPipeline({
      command: 'build',
      targetProject: 'Writers website',
      taskDescription: 'Add webhook verification',
    });

    const updated = await runner.executePreflight(manifest.pipelineId);
    expect(updated.currentStage).toBe('DISCOVERY');
    expect(updated.checkpointsPassed).toContain('PREFLIGHT_PASSED');
  });

  it('should map required skills during DISCOVERY stage', async () => {
    const manifest = runner.createPipeline({
      command: 'build',
      targetProject: 'Writers website',
      taskDescription: 'Implement user auth',
    });

    await runner.executePreflight(manifest.pipelineId);
    const discoveryManifest = await runner.executeDiscovery(manifest.pipelineId);

    expect(discoveryManifest.currentStage).toBe('STAGE_EXEC');
    expect(discoveryManifest.requiredSkills).toContain('godmode-software-engineering');
    expect(discoveryManifest.requiredSkills).toContain('test-driven-development');
  });

  it('should execute review gate and verify zero AI tells & security checks', async () => {
    const manifest = runner.createPipeline({
      command: 'build',
      targetProject: 'Writers website',
      taskDescription: 'Secure database route',
    });

    await runner.executePreflight(manifest.pipelineId);
    await runner.executeDiscovery(manifest.pipelineId);

    const reviewManifest = await runner.executeReviewGate(manifest.pipelineId, {
      codeReviewed: true,
      testsPassed: true,
      authVerified: true,
    });

    expect(reviewManifest.currentStage).toBe('COMPLETED');
    expect(reviewManifest.status).toBe('FINISHED');
    expect(reviewManifest.checkpointsPassed).toContain('SKEPTIC_GATE_PASSED');
    expect(reviewManifest.checkpointsPassed).toContain('PRODUCTION_GATE_PASSED');
  });
});
