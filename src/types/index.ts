export type RoleName = 'ADMINISTRATOR' | 'INSTITUTION_USER' | 'REVIEWING_OFFICIAL' | 'EVC_COORDINATOR';

export interface UserSession {
  id: number;
  username: string;
  email: string;
  role: RoleName;
  name: string;
  institutionId?: number;
  token?: string;
  avatar?: string;
}

export interface ApplicationRecord {
  id: number | string;
  applicationNumber: string;
  institutionId: number | string;
  institutionName: string;
  state: string;
  category: string;
  approvalType: string;
  academicYear: string;
  currentStage: 'SUBMITTED' | 'REGIONAL_SCRUTINY' | 'EVC_INSPECTION' | 'COMMITTEE_VERIFICATION' | 'APPELLATE_REVIEW' | 'FINAL_APPROVAL' | 'REJECTED';
  status: 'IN_PROGRESS' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DEFICIENCY_NOTIFIED';
  stageEnteredAt?: string;
  submittedAt: string;
  updatedAt: string;
  assignedOfficer?: string;
  deficiencyScore?: number;
  predictedApprovalProb?: number;
  stageHistory?: {
    stage: string;
    status: string;
    date: string;
    remarks: string;
  }[];
}

export interface HandbookRule {
  id: number;
  ruleCode: string;
  title: string;
  category: 'FACULTY_RATIO' | 'LAND_INFRASTRUCTURE' | 'CAD_LAB' | 'SAFETY_NOC';
  sourceHandbook: string;
  sourceSection: string;
  applicableYear: string;
  isVerifiedOfficial: boolean;
  thresholdValue: number;
  thresholdUnit: string;
  severityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RuleEvaluationResult {
  ruleCode: string;
  ruleTitle: string;
  sourceReference: string;
  isVerifiedOfficial: boolean;
  status: 'COMPLIANT' | 'DEFICIENT' | 'EXEMPT';
  observedValue: string;
  requiredValue: string;
  deficiencyDescription?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ComplianceAuditSummary {
  overallStatus: 'FULLY_COMPLIANT' | 'DEFICIENT';
  status?: string;
  criticalDeficienciesCount: number;
  results: RuleEvaluationResult[];
  evaluations?: any;
  totalDeficiencies?: number;
}

export interface DocumentRecord {
  id: number | string;
  applicationId: number | string;
  institutionId: number | string;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSizeBytes: number;
  fileMimeType?: string;
  checksumSha256?: string;
  uploadDate?: string;
  uploadedAt?: string;
  validFrom?: string;
  expiryDate?: string;
  verificationStatus: 'PENDING_VERIFICATION' | 'VERIFIED' | 'EXPIRED' | 'REJECTED';
  isVerified?: boolean;
}

export interface EVCScheduleRecord {
  id: number;
  applicationId: number;
  institutionId: number;
  scheduledDate: string;
  venueAddress: string;
  assignedExperts: string[];
  evcStatus: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'POSTPONED' | 'CANCELLED';
  preparationChecklistCompleted: boolean;
  hasSchedulingConflict: boolean;
  conflictReason?: string;
  reportSummary?: string;
}

export interface AIDelayPrediction {
  status: 'SUCCESS' | 'INSUFFICIENT_DATA';
  message?: string;
  model_version?: string;
  is_synthetic_prototype?: boolean;
  disclaimer?: string;
  risk_category: 'HIGH_DELAY_RISK' | 'MODERATE_DELAY_RISK' | 'LOW_DELAY_RISK' | 'UNKNOWN';
  calibrated_delay_probability?: number;
  approval_probability?: number;
  deficiency_score?: number;
  risk_tier?: string;
  predicted_days_overdue?: number;
  feature_contributions?: { factor: string; value: string; weight_percent: number }[];
  deficiencies?: any[];
  metrics_evaluated?: any;
  recommendation?: string;
}

export interface PriorityScoreRecord {
  applicationId: number;
  applicationNumber: string;
  overallPriorityScore: number;
  priorityLevel: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  factorBreakdown: {
    complianceSeverityWeight: number;
    deadlineUrgencyWeight: number;
    aiDelayRiskWeight: number;
    documentExpiryWeight: number;
  };
  explanation: string;
}

export interface AlertRecord {
  id: number | string;
  applicationId: number | string;
  institutionId: number | string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  type?: string;
  channel?: string;
  timestamp?: string;
  isRead?: boolean;
  reason?: string;
  recommendedAction?: string;
  dueDate?: string;
  status?: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  deduplicationHash?: string;
  createdAt?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface DashboardStats {
  totalApplications: number;
  applicationsByStage: Record<string, number>;
  complianceOverview: {
    fullyCompliantCount: number;
    deficientCount: number;
    verifiedHandbookYear: string;
  };
  alertsOverview: {
    totalActiveAlerts: number;
    criticalAlertsCount: number;
  };
  evcSchedulesOverview: {
    totalScheduled: number;
    pendingPreparation: number;
  };
}

// Aliases for legacy component support
export type SystemHealthData = any;
export type MLPredictionResponse = AIDelayPrediction;
export type AlertItem = AlertRecord;
export type ComplianceAuditResult = ComplianceAuditSummary;
export type UserRole = RoleName;
export type UserProfile = UserSession;
export type ApplicationItem = ApplicationRecord;
