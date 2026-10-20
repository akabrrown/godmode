import fs from 'node:fs/promises';
import path from 'node:path';

export class SecurityViolationError extends Error {
  constructor(message: string) {
    super(`[SECURITY VIOLATION] ${message}`);
    this.name = 'SecurityViolationError';
  }
}

export class WorkspaceBridge {
  private rootDirectory: string;

  constructor(rootDirectory: string) {
    this.rootDirectory = path.resolve(rootDirectory);
  }

  /**
   * Resolves a relative path safely inside rootDirectory.
   * Prevents path traversal and null-byte injection.
   */
  resolveSafePath(relativePath: string): string {
    if (relativePath.includes('\0')) {
      throw new SecurityViolationError('Null byte detected in path.');
    }

    const resolved = path.resolve(this.rootDirectory, relativePath);
    const normalizedRoot = path.normalize(this.rootDirectory);

    // Ensure the resolved path strictly starts with rootDirectory
    if (
      resolved !== normalizedRoot &&
      !resolved.startsWith(normalizedRoot + path.sep)
    ) {
      throw new SecurityViolationError(
        `Path traversal attempt detected. Target path '${resolved}' is outside allowed root '${normalizedRoot}'.`
      );
    }

    return resolved;
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
   * Lists child project directories within the root directory.
   */
  async listProjects(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.rootDirectory, { withFileTypes: true });
      return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
    } catch {
      return [];
    }
  }

  getRootDirectory(): string {
    return this.rootDirectory;
  }
}
