import fs from 'node:fs/promises';
import path from 'node:path';

export interface SkillMetadata {
  name: string;
  description: string;
  path: string;
  hasReferences: boolean;
  hasScripts: boolean;
  hasEvals: boolean;
}

export class SkillRegistry {
  private skillsDir: string;
  private skillsMap: Map<string, SkillMetadata> = new Map();

  constructor(skillsDir: string) {
    this.skillsDir = skillsDir;
  }

  /**
   * Initializes the registry by scanning all directories in skillsDir.
   */
  async initialize(): Promise<void> {
    this.skillsMap.clear();

    try {
      const entries = await fs.readdir(this.skillsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const skillPath = path.join(this.skillsDir, entry.name);
        const skillMdPath = path.join(skillPath, 'SKILL.md');

        try {
          const content = await fs.readFile(skillMdPath, 'utf8');
          const frontmatter = this.parseFrontmatter(content);

          const hasReferences = await this.dirExists(path.join(skillPath, 'references'));
          const hasScripts = await this.dirExists(path.join(skillPath, 'scripts'));
          const hasEvals = await this.dirExists(path.join(skillPath, 'evals'));

          const skillName = frontmatter.name || entry.name;
          const description = frontmatter.description || '';

          this.skillsMap.set(skillName, {
            name: skillName,
            description,
            path: skillPath,
            hasReferences,
            hasScripts,
            hasEvals,
          });
        } catch {
          // If SKILL.md is missing or unreadable, ignore this directory
          continue;
        }
      }
    } catch {
      // If skillsDir itself does not exist, registry stays empty
    }
  }

  /**
   * Returns all indexed skills.
   */
  getAllSkills(): SkillMetadata[] {
    return Array.from(this.skillsMap.values());
  }

  /**
   * Returns a specific skill by name.
   */
  getSkill(name: string): SkillMetadata | undefined {
    return this.skillsMap.get(name);
  }

  /**
   * Searches skills by query keyword in name or description.
   */
  search(query: string): SkillMetadata[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllSkills();

    return this.getAllSkills().filter((skill) => {
      return (
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q)
      );
    });
  }

  /**
   * Parses simple YAML frontmatter between leading --- fences.
   */
  private parseFrontmatter(content: string): { name?: string; description?: string } {
    const trimmed = content.trimStart();
    if (!trimmed.startsWith('---')) {
      return {};
    }

    const endIndex = trimmed.indexOf('---', 3);
    if (endIndex === -1) {
      return {};
    }

    const frontmatterBlock = trimmed.slice(3, endIndex).trim();
    const result: { name?: string; description?: string } = {};

    const lines = frontmatterBlock.split(/\r?\n/);
    let currentKey = '';
    let currentValue = '';

    for (const line of lines) {
      const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
      if (match) {
        if (currentKey) {
          result[currentKey as 'name' | 'description'] = currentValue.trim().replace(/^["']|["']$/g, '');
        }
        currentKey = match[1];
        currentValue = match[2] || '';
      } else if (currentKey) {
        // Multi-line continuation
        currentValue += ' ' + line.trim();
      }
    }

    if (currentKey) {
      result[currentKey as 'name' | 'description'] = currentValue.trim().replace(/^["']|["']$/g, '');
    }

    return result;
  }

  private async dirExists(dirPath: string): Promise<boolean> {
    try {
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }
}
