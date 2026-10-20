import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { SkillRegistry } from '../../src/registry/skills.js';

describe('SkillRegistry (TDD Red -> Green)', () => {
  const workspaceSkillsDir = path.resolve(process.cwd(), '.agents/skills');
  let registry: SkillRegistry;

  beforeAll(async () => {
    registry = new SkillRegistry(workspaceSkillsDir);
    await registry.initialize();
  });

  it('should successfully index all skills in the workspace', () => {
    const allSkills = registry.getAllSkills();
    expect(allSkills.length).toBeGreaterThanOrEqual(285);
  });

  it('should retrieve a specific skill by exact name with parsed frontmatter', () => {
    const tddSkill = registry.getSkill('test-driven-development');
    expect(tddSkill).toBeDefined();
    expect(tddSkill?.name).toBe('test-driven-development');
    expect(tddSkill?.description).toContain('test');
    expect(tddSkill?.path).toContain('test-driven-development');
  });

  it('should correctly detect UI/UX Pro Max skill and its data capabilities', () => {
    const uiSkill = registry.getSkill('ui-ux-pro-max');
    expect(uiSkill).toBeDefined();
    expect(uiSkill?.name).toBe('ui-ux-pro-max');
    expect(uiSkill?.hasReferences).toBe(true);
    expect(uiSkill?.hasScripts).toBe(true);
  });

  it('should search skills by keyword across name and description', () => {
    const searchResults = registry.search('video');
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some((s) => s.name.includes('video'))).toBe(true);
  });

  it('should return undefined for non-existent skill without throwing', () => {
    const nonExistent = registry.getSkill('non-existent-skill-xyz');
    expect(nonExistent).toBeUndefined();
  });
});
