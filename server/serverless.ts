import { createApp } from './app.js';

/**
 * Single serverless entry point used by Vercel.
 * Vercel routes every /api/* request to this handler through vercel.json.
 */
const appPromise = createApp({ serveFrontend: false });

export default async function handler(req: any, res: any) {
  const app = await appPromise;
  return app(req, res);
}
