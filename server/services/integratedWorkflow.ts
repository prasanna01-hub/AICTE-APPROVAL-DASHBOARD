import { complianceEngine } from './complianceEngine.js';
import { documentService } from './documentService.js';
import { evcService } from './evcService.js';
import { priorityService } from './priorityService.js';
import { alertEngine } from './alertEngine.js';

export interface IntegratedAssessment {
  applicationId: number;
  applicationNumber: string;
  institutionName: string;
  currentStage: string;
  status: string;
  complianceSummary: {
    overallStatus: string;
    criticalDeficienciesCount: number;
    results: any[];
  };
  documentStatus: {
    missingDocuments: string[];
    expiredDocuments: any[];
    verifiedDocuments: any[];
  };
  evcStatus?: any;
  aiDelayRisk: {
    riskCategory: string;
    delayProbability: number;
    predictedDaysOverdue: number;
  };
  priorityScore: any;
  activeAlertsCount: number;
  auditTrail: { event: string; timestamp: string }[];
}

class IntegratedWorkflowEngine {
  private auditLogs: { id: number; entityType: string; entityId: number; eventType: string; performedBy: string; changes: any; timestamp: string }[] = [];

  public logAuditEvent(entityType: string, entityId: number, eventType: string, performedBy: string, changes: any) {
    const entry = {
      id: this.auditLogs.length + 1,
      entityType,
      entityId,
      eventType,
      performedBy,
      changes,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(entry);
    return entry;
  }

  public getAuditLogs() {
    return this.auditLogs;
  }

  /**
   * Run the complete integrated end-to-end evaluation flow for an application
   */
  public runIntegratedAssessment(app: any, institution: any): IntegratedAssessment {
    const appId = app.id;

    // 1. Fetch & evaluate Document Status
    const docMonitor = documentService.monitorDocumentExpiry(appId);
    const allDocs = documentService.getDocumentsForApplication(appId);

    // 2. Evaluate Handbook-Based Compliance Rules against institution & docs
    const complianceSummary = complianceEngine.evaluateApplication(institution, allDocs);

    // 3. Fetch EVC Visit Schedule
    const evcRecord = evcService.getScheduleForApplication(appId);

    // 4. Calculate AI Delay Risk (Heuristic / Scikit-learn integration)
    let delayProb = 15; // baseline
    if (complianceSummary.overallStatus === 'DEFICIENT') delayProb += 35;
    if (docMonitor.expiredDocuments.length > 0) delayProb += 25;
    if (docMonitor.missingDocuments.length > 0) delayProb += 15;
    if (evcRecord?.hasSchedulingConflict) delayProb += 10;
    delayProb = Math.min(95, delayProb);

    const riskCategory = delayProb >= 70 ? 'HIGH_DELAY_RISK' : delayProb >= 40 ? 'MODERATE_DELAY_RISK' : 'LOW_DELAY_RISK';

    // 5. Calculate Intelligent Priority Score & Factors Breakdown
    const priorityResult = priorityService.calculatePriorityScore(app, complianceSummary, docMonitor, delayProb);

    // 6. Generate Actionable Alerts if critical issues found
    if (docMonitor.expiredDocuments.length > 0) {
      docMonitor.expiredDocuments.forEach(expDoc => {
        alertEngine.createAlert({
          applicationId: appId,
          institutionId: institution.id,
          title: `Expired Document (${expDoc.documentType}) for Application ${app.applicationNumber}`,
          message: `The uploaded ${expDoc.documentType} (${expDoc.fileName}) expired on ${expDoc.expiryDate}. Renewal required.`,
          severity: 'CRITICAL',
          reason: 'EXPIRED_DOCUMENT',
          recommendedAction: `Upload renewed ${expDoc.documentType} certificate.`
        });
      });
    }

    if (complianceSummary.overallStatus === 'DEFICIENT') {
      alertEngine.createAlert({
        applicationId: appId,
        institutionId: institution.id,
        title: `Handbook Compliance Deficiencies Detected for ${app.applicationNumber}`,
        message: `Application has ${complianceSummary.criticalDeficienciesCount} critical handbook compliance gaps.`,
        severity: 'CRITICAL',
        reason: 'COMPLIANCE_FAILURE',
        recommendedAction: 'Rectify faculty ratio and infrastructure gaps.'
      });
    }

    // 7. Audit log event
    this.logAuditEvent('APPLICATION', appId, 'INTEGRATED_ASSESSMENT_RUN', 'SYSTEM_ORCHESTRATOR', {
      complianceStatus: complianceSummary.overallStatus,
      priorityScore: priorityResult.overallPriorityScore,
      aiRiskCategory: riskCategory
    });

    const activeAlerts = alertEngine.getAlertsForApplication(appId).filter(a => a.status === 'ACTIVE');

    return {
      applicationId: appId,
      applicationNumber: app.applicationNumber || `APP-${appId}`,
      institutionName: institution.name || 'Institutional Applicant',
      currentStage: app.currentStage,
      status: app.status,
      complianceSummary,
      documentStatus: {
        missingDocuments: docMonitor.missingDocuments,
        expiredDocuments: docMonitor.expiredDocuments,
        verifiedDocuments: docMonitor.verifiedDocuments
      },
      evcStatus: evcRecord,
      aiDelayRisk: {
        riskCategory,
        delayProbability: delayProb,
        predictedDaysOverdue: delayProb > 60 ? 14 : 0
      },
      priorityScore: priorityResult,
      activeAlertsCount: activeAlerts.length,
      auditTrail: this.auditLogs.filter(l => l.entityId === appId).map(l => ({ event: l.eventType, timestamp: l.timestamp }))
    };
  }
}

export const integratedWorkflow = new IntegratedWorkflowEngine();
