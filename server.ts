import { config } from './server/config/env.js';
import { createApp } from './server/app.js';

async function startServer() {
  const isProduction = config.nodeEnv === 'production';

  const app = await createApp({
    serveFrontend: isProduction,
    viteDevServer: !isProduction,
  });

  const PORT = config.port;
  app.listen(PORT, '0.0.0.0', () => {
    console.log('================================================================');
    console.log('AICTE Integrated Approval & Compliance System Started!');
    console.log(`Express API Server running on port ${PORT}`);
    console.log(`Health Check Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`Test Suite Endpoint:   http://localhost:${PORT}/api/tests/run`);
    console.log('================================================================');
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
