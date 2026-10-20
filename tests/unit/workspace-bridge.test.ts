import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs/promises';
import { WorkspaceBridge, SecurityViolationError } from '../../src/bridge/workspace.js';

describe('WorkspaceBridge (TDD Red -> Green)', () => {
  const testRoot = path.resolve(process.cwd(), 'temp_test_workspace');
  let bridge: WorkspaceBridge;

  beforeEach(async () => {
    await fs.mkdir(testRoot, { recursive: true });
    bridge = new WorkspaceBridge(testRoot);
  });

  afterEach(async () => {
    try {
      await fs.rm(testRoot, { recursive: true, force: true });
    } catch {
      // Clean up
    }
  });

  it('should safely resolve paths inside the allowed root', () => {
    const safePath = bridge.resolveSafePath('src/index.ts');
    expect(safePath).toBe(path.join(testRoot, 'src', 'index.ts'));
  });

  it('should throw SecurityViolationError on path traversal attempt using ../', () => {
    expect(() => {
      bridge.resolveSafePath('../secret.txt');
    }).toThrow(SecurityViolationError);
  });

  it('should throw SecurityViolationError on null byte injection', () => {
    expect(() => {
      bridge.resolveSafePath('file.txt\0.exe');
    }).toThrow(SecurityViolationError);
  });

  it('should safely write and read file content inside workspace', async () => {
    const testFile = 'test-file.txt';
    const content = 'hello godmode os';

    await bridge.writeFile(testFile, content);
    const read = await bridge.readFile(testFile);

    expect(read).toBe(content);
  });

  it('should list projects inside a parent directory', async () => {
    await fs.mkdir(path.join(testRoot, 'ProjectA'), { recursive: true });
    await fs.mkdir(path.join(testRoot, 'ProjectB'), { recursive: true });

    const projects = await bridge.listProjects();
    expect(projects).toContain('ProjectA');
    expect(projects).toContain('ProjectB');
  });
});
