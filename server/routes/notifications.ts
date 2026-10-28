import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService.js';

const router = Router();

/**
 * GET /api/notifications
 * Get all automated in-app and email compliance alerts
 */
router.get('/', (req: Request, res: Response) => {
  const alerts = notificationService.getAllAlerts();
  res.json({
    success: true,
    count: alerts.length,
    data: alerts
  });
});

/**
 * POST /api/notifications/send
 * Dispatch or draft a new compliance alert / automated email
 */
router.post('/send', (req: Request, res: Response) => {
  const { title, message, type, channel, institutionName } = req.body;

  if (!title || !message) {
    return res.status(400).json({ success: false, message: 'Title and message are required.' });
  }

  const createdAlert = notificationService.createAlert({
    institutionId: '1-109283741',
    title,
    message,
    type: type || 'WARNING',
    channel: channel || 'BOTH'
  });

  const emailPreview = notificationService.generateEmailTemplate(
    title,
    message,
    institutionName || 'Apex Institute of Technology & Engineering'
  );

  res.status(201).json({
    success: true,
    message: 'Compliance alert successfully queued and notification sent!',
    data: {
      alert: createdAlert,
      emailDraft: emailPreview
    }
  });
});

export default router;
