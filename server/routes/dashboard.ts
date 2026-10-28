import { Router, Request, Response } from 'express';
import { alertEngine } from '../services/alertEngine.js';
import { computeApplicationStats } from '../data/applicationStore.js';

const router = Router();

/**
 * GET /api/dashboard/stats
 * Live aggregated KPIs computed from the shared application store + alert engine.
 */
router.get('/stats', (req: Request, res: Response) => {
  const alerts = alertEngine.getAlerts();
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE');
  const applicationStats = computeApplicationStats();

  res.json({
    success: true,
    source: 'LIVE_BACKEND_STORE',
    generatedAt: new Date().toISOString(),
    data: {
      totalApplications: applicationStats.totalApplications,
      applicationsByStage: applicationStats.applicationsByStage,
      applicationsByStatus: applicationStats.applicationsByStatus,
      complianceOverview: {
        fullyCompliantCount: applicationStats.applicationsByStatus.APPROVED,
        deficientCount: applicationStats.applicationsByStatus.DEFICIENCY_NOTIFIED,
        verifiedHandbookYear: '2024-2027',
      },
      alertsOverview: {
        totalActiveAlerts: activeAlerts.length,
        criticalAlertsCount: criticalAlerts.length,
      },
      evcSchedulesOverview: {
        totalScheduled: applicationStats.applicationsByStage.EVC_INSPECTION,
        pendingPreparation: applicationStats.applicationsByStage.COMMITTEE_VERIFICATION,
      },
    },
  });
});

export default router;
