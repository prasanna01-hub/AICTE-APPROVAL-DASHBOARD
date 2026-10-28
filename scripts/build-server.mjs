import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';

mkdirSync('dist', { recursive: true });

await build({
  entryPoints: ['server.ts'],
  outfile: 'dist/server.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  packages: 'external',
  sourcemap: false,
  logLevel: 'info',
  banner: {
    js: "import { createRequire as __aicteCreateRequire } from 'node:module'; const require = __aicteCreateRequire(import.meta.url);",
  },
});

console.log('✔ Server bundle written to dist/server.js (run with: node dist/server.js)');
