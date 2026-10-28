import { Router, Request, Response } from 'express';
import { documentService } from '../services/documentService.js';

const router = Router();

/**
 * GET /api/documents/application/:appId
 * Fetch documents for application
 */
router.get('/application/:appId', (req: Request, res: Response) => {
  const appId = parseInt(req.params.appId, 10);
  const docs = documentService.getDocumentsForApplication(appId);
  res.json({ success: true, count: docs.length, data: docs });
});

/**
 * GET /api/documents/expiry-monitor/:appId
 * Monitor document validity, missing documents, and expiry dates
 */
router.get('/expiry-monitor/:appId', (req: Request, res: Response) => {
  const appId = parseInt(req.params.appId, 10);
  const monitorResult = documentService.monitorDocumentExpiry(appId);
  res.json({ success: true, data: monitorResult });
});

/**
 * POST /api/documents
 * Upload / Register document metadata
 */
router.post('/', (req: Request, res: Response) => {
  const { applicationId, institutionId, documentType, fileName, fileSizeBytes, fileMimeType, validFrom, expiryDate } = req.body;

  if (!applicationId || !documentType || !fileName) {
    return res.status(400).json({ success: false, message: 'Missing required document fields.' });
  }

  const doc = documentService.registerDocument({
    applicationId: parseInt(applicationId, 10),
    institutionId: parseInt(institutionId || 1, 10),
    documentType,
    fileName,
    filePath: `./uploads/documents/${fileName}`,
    fileSizeBytes: parseInt(fileSizeBytes || 1024000, 10),
    fileMimeType: fileMimeType || 'application/pdf',
    validFrom,
    expiryDate,
    verificationStatus: 'PENDING_VERIFICATION'
  });

  res.status(201).json({
    success: true,
    message: 'Document successfully uploaded and registered in vault.',
    data: doc
  });
});

export default router;
