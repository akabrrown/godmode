import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';

export class SecurityViolationError extends Error {
  constructor(message: string) {
    super(`[SECURITY VIOLATION] ${message}`);
    this.name = 'SecurityViolationError';
  }
}

export class WorkspaceBridge {
  private rootDirectory: string;
  private allowedRoots: string[];

  constructor(rootDirectory: string, additionalRoots: string[] = []) {
    this.rootDirectory = path.resolve(rootDirectory);
    this.allowedRoots = [
      this.rootDirectory,
      ...additionalRoots.map((r) => path.resolve(r)),
    ];
  }

  /**
   * Resolves a path safely inside one of the allowed roots.
   * Supports relative project names, subpaths, and absolute paths within approved roots.
   * Prevents path traversal and null-byte injection.
   */
  resolveSafePath(targetPath: string): string {
    if (targetPath.includes('\0')) {
      throw new SecurityViolationError('Null byte detected in path.');
    }

    // 1. If path is absolute, verify it belongs to one of the allowed roots
    if (path.isAbsolute(targetPath)) {
      const normalized = path.normalize(targetPath);
      const isAllowed = this.allowedRoots.some((root) => {
        const normRoot = path.normalize(root);
        return normalized === normRoot || normalized.startsWith(normRoot + path.sep);
      });

      if (!isAllowed) {
        throw new SecurityViolationError(
          `Target path '${normalized}' is outside allowed roots: [${this.allowedRoots.join(', ')}]`
        );
      }
      return normalized;
    }

    // 2. Check if relative path matches an existing entry in any secondary/additional root
    for (const root of this.allowedRoots) {
      const candidate = path.resolve(root, targetPath);
      const normRoot = path.normalize(root);
      if (candidate === normRoot || candidate.startsWith(normRoot + path.sep)) {
        if (fsSync.existsSync(candidate)) {
          return candidate;
        }
      }
    }

    // 3. Fallback: resolve against primary root and ensure it does not escape
    const candidate = path.resolve(this.rootDirectory, targetPath);
    const normPrimary = path.normalize(this.rootDirectory);
    const isWithinPrimary =
      candidate === normPrimary || candidate.startsWith(normPrimary + path.sep);

    if (!isWithinPrimary) {
      throw new SecurityViolationError(
        `Path traversal attempt detected. Target path '${candidate}' is outside allowed root '${normPrimary}'.`
      );
    }

    return candidate;
  }

  /**
   * Safely writes a file within the workspace root.
   */
  async writeFile(relativePath: string, content: string): Promise<void> {
    const safePath = this.resolveSafePath(relativePath);
    await fs.mkdir(path.dirname(safePath), { recursive: true });
    await fs.writeFile(safePath, content, 'utf8');
  }

  /**
   * Safely reads a file within the workspace root.
   */
  async readFile(relativePath: string): Promise<string> {
    const safePath = this.resolveSafePath(relativePath);
    return await fs.readFile(safePath, 'utf8');
  }

  /**
   * Lists child project directories across all allowed roots.
   */
  async listProjects(): Promise<string[]> {
    const projectNames = new Set<string>();

    for (const root of this.allowedRoots) {
      try {
        const entries = await fs.readdir(root, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && !entry.name.startsWith('.')) {
            projectNames.add(entry.name);
          }
        }
      } catch {
        // Skip inaccessible roots
      }
    }

    return Array.from(projectNames).sort();
  }

  getRootDirectory(): string {
    return this.rootDirectory;
  }

  getAllowedRoots(): string[] {
    return [...this.allowedRoots];
  }
}
