/**
 * Builds a self-contained, serverless-ready bundle of the Express API.
 * Output: deploy/aicte-approval-api/api/*.js  (deployed to Vercel with `vercel deploy --prod`)
 */
import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';

const outDir = 'deploy/aicte-approval-api';
mkdirSync(`${outDir}/api`, { recursive: true });

const common = {
  entryPoints: ['server/serverless.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node20',
  external: ['vite'],
  logLevel: 'info',
  banner: {
    js: "import { createRequire as __aicteCreateRequire } from 'node:module'; const require = __aicteCreateRequire(import.meta.url);",
  },
};

await build({ ...common, outfile: `${outDir}/api/index.js` });

writeFileSync(
  `${outDir}/package.json`,
  JSON.stringify(
    {
      name: 'aicte-approval-api',
      private: true,
      version: '1.0.0',
      type: 'module',
      description: 'AICTE Approval & Compliance Automation — Express API (serverless build)',
    },
    null,
    2
  ) + '\n'
);

writeFileSync(
  `${outDir}/vercel.json`,
  JSON.stringify(
    {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      version: 2,
      functions: {
        'api/index.js': { memory: 1024, maxDuration: 30 },
      },
      rewrites: [
        { source: '/api', destination: '/api/index' },
        { source: '/api/(.*)', destination: '/api/index' },
      ],
    },
    null,
    2
  ) + '\n'
);

console.log(`✔ Serverless API built → ${outDir}/api`);
