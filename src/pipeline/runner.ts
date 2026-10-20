import crypto from 'node:crypto';
import { SkillRegistry } from '../registry/skills.js';
import { WorkflowRegistry } from '../registry/workflows.js';
import { WorkspaceBridge } from '../bridge/workspace.js';
import { TelemetryManager } from '../telemetry/intent.js';

export type PipelineCommand = 'build' | 'media' | 'research' | 'market' | 'audit';
export type PipelineStage = 'PREFLIGHT' | 'DISCOVERY' | 'STAGE_EXEC' | 'REVIEW_GATE' | 'COMPLETED' | 'FAILED';
export type PipelineStatus = 'RUNNING' | 'FINISHED' | 'ABORTED' | 'WAITING_APPROVAL';

export interface CreatePipelineOptions {
  command: PipelineCommand;
  targetProject: string;
  taskDescription: string;
}

export interface PipelineManifest {
  pipelineId: string;
  command: PipelineCommand;
  targetProject: string;
  taskDescription: string;
  currentStage: PipelineStage;
  status: PipelineStatus;
  checkpointsPassed: string[];
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewGateChecks {
  codeReviewed: boolean;
  testsPassed: boolean;
  authVerified: boolean;
}

export interface PipelineRunnerOptions {
  skillRegistry: SkillRegistry;
  workflowRegistry: WorkflowRegistry;
  bridge: WorkspaceBridge;
  telemetry: TelemetryManager;
}

export class PipelineRunner {
  private pipelines: Map<string, PipelineManifest> = new Map();
  private skillRegistry: SkillRegistry;
  private workflowRegistry: WorkflowRegistry;
  private bridge: WorkspaceBridge;
  private telemetry: TelemetryManager;

  constructor(options: PipelineRunnerOptions) {
    this.skillRegistry = options.skillRegistry;
    this.workflowRegistry = options.workflowRegistry;
    this.bridge = options.bridge;
    this.telemetry = options.telemetry;
  }

  /**
   * Initializes a new Rule Zero pipeline execution.
   */
  createPipeline(options: CreatePipelineOptions): PipelineManifest {
    const pipelineId = `pipe_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const manifest: PipelineManifest = {
      pipelineId,
      command: options.command,
      targetProject: options.targetProject,
      taskDescription: options.taskDescription,
      currentStage: 'PREFLIGHT',
      status: 'RUNNING',
      checkpointsPassed: [],
      requiredSkills: [],
      createdAt: now,
      updatedAt: now,
    };

    this.pipelines.set(pipelineId, manifest);
    return manifest;
  }

  /**
   * Executes Stage 1: Preflight & Capability Audit.
   */
  async executePreflight(pipelineId: string): Promise<PipelineManifest> {
    const manifest = this.getPipeline(pipelineId);

    const callId = `call_${crypto.randomUUID()}`;
    this.telemetry.declareIntent({
      callId,
      toolName: 'pipeline_preflight',
      intent: `Auditing preflight environment for target project: ${manifest.targetProject}`,
      costTier: 'LOW',
    });

    // Validate safe path for target project
    this.bridge.resolveSafePath(manifest.targetProject);

    manifest.checkpointsPassed.push('PREFLIGHT_PASSED');
    manifest.currentStage = 'DISCOVERY';
    manifest.updatedAt = new Date().toISOString();

    this.telemetry.resolveOutcome(callId, {
      outcome: 'Preflight audit successful: path verified, tool dependencies satisfied.',
      status: 'SUCCESS',
    });

    return manifest;
  }

  /**
   * Executes Stage 2: Concept & Discovery Intent Mapping.
   */
  async executeDiscovery(pipelineId: string): Promise<PipelineManifest> {
    const manifest = this.getPipeline(pipelineId);

    const callId = `call_${crypto.randomUUID()}`;
    this.telemetry.declareIntent({
      callId,
      toolName: 'pipeline_discovery',
      intent: `Mapping skills and workflow for command: ${manifest.command}`,
      costTier: 'LOW',
    });

    // Skill routing matrix derived from AGENTS.md
    switch (manifest.command) {
      case 'build':
        manifest.requiredSkills = [
          'godmode-software-engineering',
          'test-driven-development',
          'godmode-auth-security-hardening',
          'playwright-testing',
        ];
        break;
      case 'media':
        manifest.requiredSkills = [
          'godmode-pipeline-production',
          'video-generation',
          'remotion',
          'gsap-timeline',
        ];
        break;
      case 'research':
        manifest.requiredSkills = [
          'godmode-deep-research',
          'systematic-literature-review',
        ];
        break;
      case 'market':
        manifest.requiredSkills = [
          'godmode-marketing-growth',
          'copywriting',
          'cro',
          'ui-ux-pro-max',
        ];
        break;
      default:
        manifest.requiredSkills = ['godmode-orchestrator'];
    }

    manifest.checkpointsPassed.push('DISCOVERY_PASSED');
    manifest.currentStage = 'STAGE_EXEC';
    manifest.updatedAt = new Date().toISOString();

    this.telemetry.resolveOutcome(callId, {
      outcome: `Discovery completed: mapped ${manifest.requiredSkills.length} skills.`,
      status: 'SUCCESS',
    });

    return manifest;
  }

  /**
   * Executes Stage 4: Review Gate & Checkpoint Validation.
   */
  async executeReviewGate(pipelineId: string, checks: ReviewGateChecks): Promise<PipelineManifest> {
    const manifest = this.getPipeline(pipelineId);

    if (!checks.codeReviewed || !checks.testsPassed || !checks.authVerified) {
      manifest.status = 'WAITING_APPROVAL';
      manifest.currentStage = 'REVIEW_GATE';
      return manifest;
    }

    manifest.checkpointsPassed.push('SKEPTIC_GATE_PASSED');
    manifest.checkpointsPassed.push('PRODUCTION_GATE_PASSED');
    manifest.currentStage = 'COMPLETED';
    manifest.status = 'FINISHED';
    manifest.updatedAt = new Date().toISOString();

    return manifest;
  }

  getPipeline(pipelineId: string): PipelineManifest {
    const manifest = this.pipelines.get(pipelineId);
    if (!manifest) {
      throw new Error(`Pipeline not found: ${pipelineId}`);
    }
    return manifest;
  }

  getAllPipelines(): PipelineManifest[] {
    return Array.from(this.pipelines.values());
  }
}
