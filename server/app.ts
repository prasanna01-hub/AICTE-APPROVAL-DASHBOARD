import express, { Express, NextFunction, Request, Response } from 'express';
import path from 'node:path';
import { errorHandler } from './middleware/errorHandler.js';

// Backend API REST Routers
import healthRouter from './routes/health.js';
import applicationsRouter from './routes/applications.js';
import complianceRouter from './routes/compliance.js';
import aiRouter from './routes/ai.js';
import notificationsRouter from './routes/notifications.js';
import authRouter from './routes/auth.js';
import architectureRouter from './routes/architecture.js';
import documentsRouter from './routes/documents.js';
import evcRouter from './routes/evc.js';
import priorityRouter from './routes/priority.js';
import alertsRouter from './routes/alerts.js';
import dashboardRouter from './routes/dashboard.js';
import testsRouter from './routes/tests.js';

export interface CreateAppOptions {
  /** Serve the built React SPA from ./dist (production standalone mode). */
  serveFrontend?: boolean;
  /** Attach the Vite dev middleware (local development). */
  viteDevServer?: boolean;
}

/**
 * Cross-Origin Resource Sharing middleware.
 * Allows the Vercel-hosted frontend to call this API from any origin.
 * Restrict by setting CORS_ORIGINS="https://a.vercel.app,https://b.vercel.app".
 */
function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const configured = (process.env.CORS_ORIGINS || '*')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const origin = req.headers.origin;
  const allowAny = configured.includes('*');

  if (origin && (allowAny || configured.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (allowAny) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-user-role, X-Requested-With'
  );
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
}

/**
 * Builds the fully configured Express application.
 * Shared by the standalone Node server (Render / local) and the serverless API function (Vercel).
 */
export async function createApp(options: CreateAppOptions = {}): Promise<Express> {
  const app = express();

  app.disable('x-powered-by');
  if (process.env.VERCEL || process.env.RENDER) {
    app.set('trust proxy', true);
  }

  app.use(corsMiddleware);
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Core REST API routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/applications', applicationsRouter);
  app.use('/api/compliance', complianceRouter);
  app.use('/api/documents', documentsRouter);
  app.use('/api/evc', evcRouter);
  app.use('/api/priority', priorityRouter);
  app.use('/api/alerts', alertsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/ai-service', aiRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/architecture', architectureRouter);
  app.use('/api/tests', testsRouter);

  // Friendly API index so the backend URL is not a blank 404 page
  app.get('/api', (req: Request, res: Response) => {
    res.json({
      success: true,
      service: 'AICTE Approval & Compliance Automation API',
      version: '1.0.0',
      status: 'ONLINE',
      documentation: '/api/architecture',
      health: '/api/health',
      endpoints: [
        'GET    /api/health',
        'POST   /api/auth/login',
        'GET    /api/auth/me',
        'GET    /api/dashboard/stats',
        'GET    /api/applications',
        'POST   /api/applications',
        'PATCH  /api/applications/:id/stage',
        'GET    /api/compliance/rules',
        'POST   /api/compliance/audit',
        'GET    /api/documents/application/:appId',
        'GET    /api/documents/expiry-monitor/:appId',
        'POST   /api/documents',
        'GET    /api/evc/schedules',
        'POST   /api/evc/schedules',
        'PATCH  /api/evc/schedules/:id/status',
        'POST   /api/ai-service/predict-delay',
        'GET    /api/priority/ranked-queue',
        'GET    /api/priority/calculate/:appId',
        'GET    /api/alerts',
        'POST   /api/alerts/dispatch',
        'GET    /api/notifications',
        'POST   /api/notifications/send',
        'GET    /api/architecture',
        'GET    /api/tests/run',
      ],
    });
  });

  if (options.viteDevServer) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (options.serveFrontend) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath, { maxAge: '1h', index: false }));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api')) {
        next();
        return;
      }
      res.sendFile('index.html', { root: distPath }, (err) => {
        if (err) next();
      });
    });
  }

  // Unknown API route fallback (must be registered after all routers)
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `API route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}
