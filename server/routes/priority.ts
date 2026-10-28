import { Router, Request, Response } from 'express';
import { priorityService } from '../services/priorityService.js';
import { complianceEngine } from '../services/complianceEngine.js';
import { documentService } from '../services/documentService.js';

const router = Router();

// Sample in-memory apps for demonstration
const mockApps = [
  { id: 1, applicationNumber: 'APP-2026-8912', currentStage: 'REGIONAL_SCRUTINY', totalIntake: 480, facultyCount: 32, totalLandAcres: 5.5, cadLabsCount: 4 },
  { id: 2, applicationNumber: 'APP-2026-4410', currentStage: 'EVC_INSPECTION', totalIntake: 240, facultyCount: 14, totalLandAcres: 2.2, cadLabsCount: 2 },
  { id: 3, applicationNumber: 'APP-2026-1029', currentStage: 'SUBMITTED', totalIntake: 300, facultyCount: 20, totalLandAcres: 4.0, cadLabsCount: 3 }
];

/**
 * GET /api/priority/calculate/:appId
 * Calculate intelligent priority score and transparent factor breakdown
 */
router.get('/calculate/:appId', (req: Request, res: Response) => {
  const appId = parseInt(req.params.appId, 10);
  const app = mockApps.find(a => a.id === appId) || mockApps[0];

  const docs = documentService.getDocumentsForApplication(appId);
  const docMonitor = documentService.monitorDocumentExpiry(appId);
  const compliance = complianceEngine.evaluateApplication(app, docs);

  // Heuristic delay risk %
  const delayRiskProb = compliance.overallStatus === 'DEFICIENT' ? 75 : 20;

  const priorityResult = priorityService.calculatePriorityScore(app, compliance, docMonitor, delayRiskProb);

  res.json({
    success: true,
    data: priorityResult
  });
});

/**
 * GET /api/priority/ranked-queue
 * Get ranked queue of applications sorted by priority score
 */
router.get('/ranked-queue', (req: Request, res: Response) => {
  const ranked = mockApps.map(app => {
    const docs = documentService.getDocumentsForApplication(app.id);
    const docMonitor = documentService.monitorDocumentExpiry(app.id);
    const compliance = complianceEngine.evaluateApplication(app, docs);
    const delayRiskProb = compliance.overallStatus === 'DEFICIENT' ? 75 : 20;
    return priorityService.calculatePriorityScore(app, compliance, docMonitor, delayRiskProb);
  }).sort((a, b) => b.overallPriorityScore - a.overallPriorityScore);

  res.json({
    success: true,
    count: ranked.length,
    data: ranked
  });
});

export default router;
