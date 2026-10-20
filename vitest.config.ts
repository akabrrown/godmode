import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'deer-flow-main/**',
      'LibreChat-main/**',
      'OpenMontage-main/**',
      'agent-skills-main/**',
      'caveman-main/**',
      'marketingskills-main/**',
      'superpowers-main/**',
      'taste-skill-main/**',
      'ui-ux-pro-max-skill-main/**',
    ],
  },
});
