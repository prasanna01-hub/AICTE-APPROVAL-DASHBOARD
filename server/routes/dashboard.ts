import { Router, Request, Response } from 'express';
import { alertEngine } from '../services/alertEngine.js';

const router = Router();

/**
 * GET /api/dashboard/stats
 * Aggregated statistics for backend state and future frontend integration
 */
router.get('/stats', (req: Request, res: Response) => {
  const alerts = alertEngine.getAlerts();
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status === 'ACTIVE');

  res.json({
    success: true,
    data: {
      totalApplications: 3,
      applicationsByStage: {
        SUBMITTED: 1,
        REGIONAL_SCRUTINY: 1,
        EVC_INSPECTION: 1,
        COMMITTEE_VERIFICATION: 0,
        FINAL_APPROVAL: 0
      },
      complianceOverview: {
        fullyCompliantCount: 1,
        deficientCount: 2,
        verifiedHandbookYear: '2024-2027'
      },
      alertsOverview: {
        totalActiveAlerts: activeAlerts.length,
        criticalAlertsCount: criticalAlerts.length
      },
      evcSchedulesOverview: {
        totalScheduled: 1,
        pendingPreparation: 1
      }
    }
  });
});

export default router;
