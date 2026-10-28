export interface PriorityScoreResult {
  applicationId: number;
  applicationNumber: string;
  overallPriorityScore: number; // 0 to 100
  priorityLevel: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  factorBreakdown: {
    complianceSeverityWeight: number; // Max 35
    deadlineUrgencyWeight: number;    // Max 25
    aiDelayRiskWeight: number;        // Max 20
    documentExpiryWeight: number;     // Max 20
  };
  explanation: string;
}

class PriorityService {
  /**
   * Calculate transparent, explainable application priority score
   */
  public calculatePriorityScore(
    app: any,
    complianceAudit: { overallStatus: string; criticalDeficienciesCount: number },
    documentMonitor: { missingDocuments: string[]; expiredDocuments: any[] },
    aiDelayRiskProb: number
  ): PriorityScoreResult {
    
    // 1. Compliance Severity Factor (Max 35 points)
    let complianceScore = 0;
    if (complianceAudit.overallStatus === 'DEFICIENT') {
      complianceScore = Math.min(35, 15 + complianceAudit.criticalDeficienciesCount * 10);
    }

    // 2. Deadline Urgency Factor (Max 25 points)
    // Days in current stage without action
    const stageEnteredDate = new Date(app.stageEnteredAt || app.submittedAt || Date.now());
    const daysInStage = Math.max(0, Math.floor((Date.now() - stageEnteredDate.getTime()) / (1000 * 3600 * 24)));
    const deadlineUrgencyScore = Math.min(25, Math.floor(daysInStage * 1.5));

    // 3. AI Delay Risk % Factor (Max 20 points)
    const aiDelayRiskScore = Math.min(20, Math.round((aiDelayRiskProb / 100) * 20));

    // 4. Document Expiry & Missing Penalty Factor (Max 20 points)
    const docPenalty = (documentMonitor.missingDocuments.length * 7) + (documentMonitor.expiredDocuments.length * 10);
    const documentExpiryScore = Math.min(20, docPenalty);

    // Calculate total score (0 to 100)
    const totalScore = Math.min(100, Math.round(complianceScore + deadlineUrgencyScore + aiDelayRiskScore + documentExpiryScore));

    let priorityLevel: PriorityScoreResult['priorityLevel'] = 'LOW';
    if (totalScore >= 75) {
      priorityLevel = 'URGENT';
    } else if (totalScore >= 50) {
      priorityLevel = 'HIGH';
    } else if (totalScore >= 30) {
      priorityLevel = 'MEDIUM';
    }

    // Build human-readable transparent explanation
    const reasons: string[] = [];
    if (complianceAudit.criticalDeficienciesCount > 0) {
      reasons.push(`${complianceAudit.criticalDeficienciesCount} critical handbook compliance deficiencies (+${complianceScore} pts)`);
    }
    if (daysInStage > 7) {
      reasons.push(`Application pending in current stage '${app.currentStage}' for ${daysInStage} days (+${deadlineUrgencyScore} pts)`);
    }
    if (aiDelayRiskProb > 60) {
      reasons.push(`High ML delay risk probability of ${aiDelayRiskProb}% (+${aiDelayRiskScore} pts)`);
    }
    if (documentMonitor.expiredDocuments.length > 0 || documentMonitor.missingDocuments.length > 0) {
      reasons.push(`${documentMonitor.expiredDocuments.length} expired & ${documentMonitor.missingDocuments.length} missing required documents (+${documentExpiryScore} pts)`);
    }

    const explanation = reasons.length > 0 
      ? `Priority elevated due to: ${reasons.join('; ')}.`
      : 'Application is fully compliant with low delay risk and active documentation.';

    return {
      applicationId: app.id,
      applicationNumber: app.applicationNumber || `APP-${app.id}`,
      overallPriorityScore: totalScore,
      priorityLevel,
      factorBreakdown: {
        complianceSeverityWeight: complianceScore,
        deadlineUrgencyWeight: deadlineUrgencyScore,
        aiDelayRiskWeight: aiDelayRiskScore,
        documentExpiryWeight: documentExpiryScore
      },
      explanation
    };
  }
}

export const priorityService = new PriorityService();
