import { Router, Response } from 'express';
import { authenticateToken, authorizeRoles, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { docStorageService } from '../services/docStorageService.js';
import { applicationsStore } from '../data/applicationStore.js';

const router = Router();

/**
 * GET /api/applications
 * List all AICTE workflow applications (Protected by RBAC)
 */
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  
  // Institution users only see their own applications; AICTE officers/admins see all
  if (user?.role === 'INSTITUTION_USER') {
    const filtered = applicationsStore.filter(app => app.institutionId === '1-109283741');
    return res.json({ success: true, count: filtered.length, data: filtered });
  }

  res.json({ success: true, count: applicationsStore.length, data: applicationsStore });
});

/**
 * GET /api/applications/:id
 * Get single application details with document links and workflow history
 */
router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const app = applicationsStore.find(a => a.id === req.params.id || a.applicationNumber === req.params.id);
  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  const documents = docStorageService.getSampleDocuments(app.applicationNumber);

  res.json({
    success: true,
    data: {
      ...app,
      documents
    }
  });
});

/**
 * POST /api/applications
 * Submit a new AICTE Approval Application
 */
router.post('/', authenticateToken, authorizeRoles('INSTITUTION_USER', 'ADMINISTRATOR'), (req: AuthenticatedRequest, res: Response) => {
  const { institutionName, category, approvalType, academicYear, totalIntake, totalFaculty } = req.body;

  const newApp = {
    id: String(applicationsStore.length + 1),
    applicationNumber: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    institutionId: '1-109283741',
    institutionName: institutionName || 'Apex Institute of Technology & Engineering',
    state: 'Tamil Nadu',
    category: category || 'Engineering & Technology',
    approvalType: approvalType || 'Extension of Approval (EoA)',
    academicYear: academicYear || '2026-2027',
    currentStage: 'SUBMITTED',
    status: 'IN_PROGRESS',
    deficiencyScore: 12.0,
    predictedApprovalProb: 88.0,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedOfficer: 'Pending Regional Office Assignment',
    stageHistory: [
      { stage: 'SUBMITTED', status: 'COMPLETED', date: new Date().toISOString(), remarks: 'Submitted via AICTE Workflow Portal.' }
    ]
  };

  applicationsStore.unshift(newApp);

  res.status(201).json({
    success: true,
    message: 'AICTE Application successfully submitted!',
    data: newApp
  });
});

/**
 * PATCH /api/applications/:id/stage
 * Advance workflow stage (Role-restricted to AICTE Regional Officers and Scrutiny Committee)
 */
router.patch('/:id/stage', authenticateToken, authorizeRoles('REVIEWING_OFFICIAL', 'ADMINISTRATOR'), (req: AuthenticatedRequest, res: Response) => {
  const { nextStage, remarks, status } = req.body;
  const appIndex = applicationsStore.findIndex(a => a.id === req.params.id || a.applicationNumber === req.params.id);

  if (appIndex === -1) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  const app = applicationsStore[appIndex];
  app.currentStage = nextStage || app.currentStage;
  app.status = status || app.status;
  app.updatedAt = new Date().toISOString();
  app.stageHistory.push({
    stage: nextStage,
    status: status || 'IN_PROGRESS',
    date: new Date().toISOString(),
    remarks: remarks || `Advanced to stage ${nextStage} by ${req.user?.name} (${req.user?.role})`
  });

  res.json({
    success: true,
    message: `Workflow stage updated to ${nextStage}`,
    data: app
  });
});

export default router;
