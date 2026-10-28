/**
 * Shared in-memory application store for the prototype backend.
 * Used by the applications router (CRUD + workflow transitions) and by the
 * dashboard router (aggregated KPIs), so both always agree.
 *
 * Swap this module for a PostgreSQL repository (see database/schema.sql)
 * when moving from prototype to production persistence.
 */

export interface StoredStageHistory {
  stage: string;
  status: string;
  date: string;
  remarks: string;
}

export interface StoredApplication {
  id: string;
  applicationNumber: string;
  institutionId: string;
  institutionName: string;
  state: string;
  category: string;
  approvalType: string;
  academicYear: string;
  currentStage: string;
  status: string;
  deficiencyScore: number;
  predictedApprovalProb: number;
  submittedAt: string;
  updatedAt: string;
  assignedOfficer: string;
  stageHistory: StoredStageHistory[];
}

export const applicationsStore: StoredApplication[] = [
  {
    id: '1',
    applicationNumber: 'APP-2026-8912',
    institutionId: '1-109283741',
    institutionName: 'Apex Institute of Technology & Engineering',
    state: 'Tamil Nadu',
    category: 'Engineering & Technology',
    approvalType: 'Extension of Approval (EoA)',
    academicYear: '2026-2027',
    currentStage: 'REGIONAL_SCRUTINY', // SUBMITTED -> REGIONAL_SCRUTINY -> COMMITTEE_VERIFICATION -> APPELLATE_REVIEW -> APPROVED
    status: 'UNDER_REVIEW',
    deficiencyScore: 18.5,
    predictedApprovalProb: 81.5,
    submittedAt: '2026-10-15T09:30:00Z',
    updatedAt: '2026-10-25T14:20:00Z',
    assignedOfficer: 'Er. R. K. Viswanathan (RO Southern Region)',
    stageHistory: [
      {
        stage: 'SUBMITTED',
        status: 'COMPLETED',
        date: '2026-10-15T09:30:00Z',
        remarks: 'Application submitted by Principal with digital signature.',
      },
      {
        stage: 'REGIONAL_SCRUTINY',
        status: 'IN_PROGRESS',
        date: '2026-10-20T11:00:00Z',
        remarks: 'Regional Office reviewing Land NOC and Faculty Ratio proof.',
      },
    ],
  },
  {
    id: '2',
    applicationNumber: 'APP-2026-4410',
    institutionId: '1-982736452',
    institutionName: 'National College of Pharmacy & Research',
    state: 'Karnataka',
    category: 'Pharmacy',
    approvalType: 'New Course Addition (B.Pharm Data Analytics)',
    academicYear: '2026-2027',
    currentStage: 'SUBMITTED',
    status: 'IN_PROGRESS',
    deficiencyScore: 32.0,
    predictedApprovalProb: 68.0,
    submittedAt: '2026-10-22T16:45:00Z',
    updatedAt: '2026-10-22T16:45:00Z',
    assignedOfficer: 'Pending Assignment',
    stageHistory: [
      {
        stage: 'SUBMITTED',
        status: 'COMPLETED',
        date: '2026-10-22T16:45:00Z',
        remarks: 'Initial application submitted.',
      },
    ],
  },
];

/** Aggregate KPIs computed from the live store. */
export function computeApplicationStats() {
  const byStage: Record<string, number> = {
    SUBMITTED: 0,
    REGIONAL_SCRUTINY: 0,
    EVC_INSPECTION: 0,
    COMMITTEE_VERIFICATION: 0,
    APPELLATE_REVIEW: 0,
    FINAL_APPROVAL: 0,
    REJECTED: 0,
  };

  const byStatus: Record<string, number> = {
    IN_PROGRESS: 0,
    UNDER_REVIEW: 0,
    APPROVED: 0,
    REJECTED: 0,
    DEFICIENCY_NOTIFIED: 0,
  };

  for (const app of applicationsStore) {
    byStage[app.currentStage] = (byStage[app.currentStage] || 0) + 1;
    byStatus[app.status] = (byStatus[app.status] || 0) + 1;
  }

  return {
    totalApplications: applicationsStore.length,
    applicationsByStage: byStage,
    applicationsByStatus: byStatus,
  };
}
