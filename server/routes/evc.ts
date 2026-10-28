import { Router, Request, Response } from 'express';
import { evcService } from '../services/evcService.js';

const router = Router();

/**
 * GET /api/evc/schedules
 * List all EVC schedules
 */
router.get('/schedules', (req: Request, res: Response) => {
  const schedules = evcService.getSchedules();
  res.json({ success: true, count: schedules.length, data: schedules });
});

/**
 * GET /api/evc/schedules/application/:appId
 * Get EVC schedule for specific application
 */
router.get('/schedules/application/:appId', (req: Request, res: Response) => {
  const appId = parseInt(req.params.appId, 10);
  const schedule = evcService.getScheduleForApplication(appId);
  if (!schedule) {
    return res.status(404).json({ success: false, message: 'No EVC visit scheduled for this application.' });
  }
  res.json({ success: true, data: schedule });
});

/**
 * POST /api/evc/schedules
 * Schedule new EVC visit with conflict detection
 */
router.post('/schedules', (req: Request, res: Response) => {
  const { applicationId, institutionId, scheduledDate, venueAddress, assignedExperts } = req.body;

  if (!applicationId || !scheduledDate || !venueAddress) {
    return res.status(400).json({ success: false, message: 'Missing required EVC scheduling fields.' });
  }

  const record = evcService.scheduleVisit({
    applicationId: parseInt(applicationId, 10),
    institutionId: parseInt(institutionId || 1, 10),
    scheduledDate,
    venueAddress,
    assignedExperts: Array.isArray(assignedExperts) ? assignedExperts : ['Prof. Inspection Chair']
  });

  res.status(201).json({
    success: true,
    message: record.hasSchedulingConflict 
      ? 'EVC Visit scheduled with detected scheduling conflicts.' 
      : 'EVC Visit successfully scheduled.',
    data: record
  });
});

/**
 * PATCH /api/evc/schedules/:id/status
 * Update EVC visit status & report summary
 */
router.patch('/schedules/:id/status', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { evcStatus, checklistCompleted, reportSummary } = req.body;

  const updated = evcService.updateStatus(id, evcStatus, checklistCompleted, reportSummary);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'EVC schedule record not found.' });
  }

  res.json({ success: true, message: 'EVC status updated.', data: updated });
});

export default router;
