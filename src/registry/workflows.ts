import fs from 'node:fs/promises';
import path from 'node:path';

export interface WorkflowMetadata {
  name: string;
  fileName: string;
  path: string;
  content: string;
}

export class WorkflowRegistry {
  private workflowsDir: string;
  private workflowsMap: Map<string, WorkflowMetadata> = new Map();

  constructor(workflowsDir: string) {
    this.workflowsDir = workflowsDir;
  }

  /**
   * Scans and indexes all markdown workflows in workflowsDir.
   */
  async initialize(): Promise<void> {
    this.workflowsMap.clear();

    try {
      const files = await fs.readdir(this.workflowsDir);

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(this.workflowsDir, file);
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const name = file.replace(/\.md$/, '');

          this.workflowsMap.set(name.toLowerCase(), {
            name,
            fileName: file,
            path: filePath,
            content,
          });
        } catch {
          // Skip unreadable files
          continue;
        }
      }
    } catch {
      // If directory is missing, stay empty
    }
  }

  /**
   * Returns all indexed workflows.
   */
  getAllWorkflows(): WorkflowMetadata[] {
    return Array.from(this.workflowsMap.values());
  }

  /**
   * Retrieves a specific workflow by name (handles both "name" and "name.md").
   */
  getWorkflow(name: string): WorkflowMetadata | undefined {
    const cleanName = name.toLowerCase().replace(/\.md$/, '');
    return this.workflowsMap.get(cleanName);
  }

  /**
   * Searches workflows by keyword in name or content.
   */
  search(query: string): WorkflowMetadata[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllWorkflows();

    return this.getAllWorkflows().filter((w) => {
      return (
        w.name.toLowerCase().includes(q) ||
        w.content.toLowerCase().includes(q)
      );
    });
  }
}
