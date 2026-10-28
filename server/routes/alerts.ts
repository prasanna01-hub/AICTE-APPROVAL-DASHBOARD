import { Router, Request, Response } from 'express';
import { alertEngine } from '../services/alertEngine.js';

const router = Router();

/**
 * GET /api/alerts
 * List all active and historic alerts
 */
router.get('/', (req: Request, res: Response) => {
  const alerts = alertEngine.getAlerts();
  res.json({ success: true, count: alerts.length, data: alerts });
});

/**
 * GET /api/alerts/application/:appId
 * Get alerts for specific application
 */
router.get('/application/:appId', (req: Request, res: Response) => {
  const appId = parseInt(req.params.appId, 10);
  const alerts = alertEngine.getAlertsForApplication(appId);
  res.json({ success: true, count: alerts.length, data: alerts });
});

/**
 * PATCH /api/alerts/:id/acknowledge
 * Acknowledge active alert
 */
router.patch('/:id/acknowledge', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const ack = alertEngine.acknowledgeAlert(id);
  if (!ack) return res.status(404).json({ success: false, message: 'Alert not found.' });
  res.json({ success: true, message: 'Alert acknowledged.', data: ack });
});

/**
 * PATCH /api/alerts/:id/resolve
 * Resolve alert
 */
router.patch('/:id/resolve', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const resld = alertEngine.resolveAlert(id);
  if (!resld) return res.status(404).json({ success: false, message: 'Alert not found.' });
  res.json({ success: true, message: 'Alert resolved.', data: resld });
});

/**
 * POST /api/alerts/dispatch
 * Dispatch new alert with deduplication & generate email draft
 */
router.post('/dispatch', (req: Request, res: Response) => {
  const { applicationId, institutionId, title, message, severity, reason, recommendedAction, institutionName } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  const result = alertEngine.createAlert({
    applicationId: parseInt(applicationId || 1, 10),
    institutionId: parseInt(institutionId || 1, 10),
    title,
    message,
    severity: severity || 'WARNING',
    reason: reason || 'COMPLIANCE_FAILURE',
    recommendedAction: recommendedAction || 'Review application compliance status in portal.'
  });

  const emailDraft = alertEngine.formatEmailDraft(
    result.alert,
    institutionName || 'Apex Institute of Technology & Engineering'
  );

  res.status(201).json({
    success: true,
    createdNew: result.created,
    message: result.created ? 'New compliance alert dispatched!' : 'Duplicate active alert exists (deduplicated).',
    data: {
      alert: result.alert,
      emailDraft
    }
  });
});

export default router;
