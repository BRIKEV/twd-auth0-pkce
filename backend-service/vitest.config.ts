// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    sequence: {
      shuffle: false,
      concurrent: false,
    },
    fileParallelism: false,
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        // Configuration files that are showing up in coverage
        '.next/**',
        'next-env.d.ts',
        '**/postcss.config.mjs',
        '**/tailwind.config.ts',
        '**/tsconfig.json',
        '**/package.json',
        '**/package-lock.json',
        '**/next.config.ts',
        '**/vitest.config.ts',
        '**/*.tsx',
      ],
      // Clean coverage reports before running
      clean: true,
      // Clean coverage reports on each run
      cleanOnRerun: true,
    },
  },
})