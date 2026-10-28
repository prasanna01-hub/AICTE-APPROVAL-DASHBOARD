import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

const outDir = 'deploy/aicte-approval-portal';
const apiBaseUrl = process.env.VITE_API_BASE_URL || '';
const apiProxyUrl = (process.env.API_PROXY_URL || '').replace(/\/+$/, '');

rmSync(outDir, { recursive: true, force: true });
rmSync('dist', { recursive: true, force: true });

execSync('npx vite build', {
  stdio: 'inherit',
  env: { ...process.env, VITE_API_BASE_URL: apiBaseUrl },
});

mkdirSync(outDir, { recursive: true });
cpSync('dist', outDir, { recursive: true });

const rewrites = [];
if (apiProxyUrl && !apiBaseUrl) {
  // Same-origin proxy: the browser calls /api/* on this domain and Vercel forwards
  // the request to the separately deployed API. No CORS, no baked-in URL.
  rewrites.push({ source: '/api/(.*)', destination: `${apiProxyUrl}/api/$1` });
}
rewrites.push({ source: '/(.*)', destination: '/index.html' });

writeFileSync(
  `${outDir}/vercel.json`,
  JSON.stringify(
    {
      $schema: 'https://openapi.vercel.sh/vercel.json',
      version: 2,
      rewrites,
      headers: [
        {
          source: '/assets/(.*)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/sw.js',
          headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
        },
        {
          source: '/manifest.webmanifest',
          headers: [{ key: 'Content-Type', value: 'application/manifest+json' }],
        },
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
        },
      ],
    },
    null,
    2
  ) + '\n'
);

console.log(`✔ Frontend build ready → ${outDir}`);
console.log(`  API base URL baked into bundle: ${apiBaseUrl || '/api (same-origin)'}`);
