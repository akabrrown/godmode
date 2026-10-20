import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { WorkflowRegistry } from '../../src/registry/workflows.js';

describe('WorkflowRegistry (TDD Red -> Green)', () => {
  const workflowsDir = path.resolve(process.cwd(), '.agents/workflows');
  let registry: WorkflowRegistry;

  beforeAll(async () => {
    registry = new WorkflowRegistry(workflowsDir);
    await registry.initialize();
  });

  it('should index all 30 workflows in .agents/workflows', () => {
    const allWorkflows = registry.getAllWorkflows();
    expect(allWorkflows.length).toBe(30);
  });

  it('should find godmode_build workflow with its steps', () => {
    const wf = registry.getWorkflow('godmode_build');
    expect(wf).toBeDefined();
    expect(wf?.name).toBe('godmode_build');
    expect(wf?.content).toContain('Red/Green TDD');
  });

  it('should find recently synced seo-audit workflow', () => {
    const wf = registry.getWorkflow('seo-audit');
    expect(wf).toBeDefined();
    expect(wf?.name).toBe('seo-audit');
  });

  it('should search workflows by query', () => {
    const results = registry.search('security');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((w) => w.name.includes('security'))).toBe(true);
  });

  it('should return undefined for non-existent workflow', () => {
    const wf = registry.getWorkflow('non-existent-wf');
    expect(wf).toBeUndefined();
  });
});
