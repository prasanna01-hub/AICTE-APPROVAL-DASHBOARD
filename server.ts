import express from 'express';
import { createServer as createViteServer } from 'vite';
import { config } from './server/config/env.js';
import { errorHandler } from './server/middleware/errorHandler.js';

// Import Backend API REST Routers
import healthRouter from './server/routes/health.js';
import applicationsRouter from './server/routes/applications.js';
import complianceRouter from './server/routes/compliance.js';
import aiRouter from './server/routes/ai.js';
import notificationsRouter from './server/routes/notifications.js';
import authRouter from './server/routes/auth.js';
import architectureRouter from './server/routes/architecture.js';
import documentsRouter from './server/routes/documents.js';
import evcRouter from './server/routes/evc.js';
import priorityRouter from './server/routes/priority.js';
import alertsRouter from './server/routes/alerts.js';
import dashboardRouter from './server/routes/dashboard.js';
import testsRouter from './server/routes/tests.js';

async function startServer() {
  const app = express();

  // Express Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount Core Backend REST API Routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/applications', applicationsRouter);
  app.use('/api/compliance', complianceRouter);
  app.use('/api/documents', documentsRouter);
  app.use('/api/evc', evcRouter);
  app.use('/api/priority', priorityRouter);
  app.use('/api/alerts', alertsRouter);
  app.use('/api/ai-service', aiRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/architecture', architectureRouter);
  app.use('/api/tests', testsRouter);

  // Development setup: Attach Vite middleware for SPA
  if (config.nodeEnv !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  // Centralized Express Error Handler
  app.use(errorHandler);

  const PORT = config.port;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(`🚀 AICTE Integrated Approval & Compliance System Started!`);
    console.log(`📡 Express API Server running on port ${PORT}`);
    console.log(`🔗 Health Check Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test Suite Endpoint: http://localhost:${PORT}/api/tests/run`);
    console.log(`================================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
