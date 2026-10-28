import { RoleName } from './authService.js';

export type StageName = 
  | 'SUBMITTED' 
  | 'REGIONAL_SCRUTINY' 
  | 'EVC_INSPECTION' 
  | 'COMMITTEE_VERIFICATION' 
  | 'APPELLATE_REVIEW' 
  | 'FINAL_APPROVAL' 
  | 'REJECTED';

export interface WorkflowTransitionResult {
  success: boolean;
  message: string;
  previousStage?: StageName;
  newStage?: StageName;
  historyEntry?: any;
}

// Allowed Stage Transition Map
const ALLOWED_STAGE_TRANSITIONS: Record<StageName, StageName[]> = {
  SUBMITTED: ['REGIONAL_SCRUTINY', 'REJECTED'],
  REGIONAL_SCRUTINY: ['EVC_INSPECTION', 'COMMITTEE_VERIFICATION', 'REJECTED'],
  EVC_INSPECTION: ['COMMITTEE_VERIFICATION', 'REGIONAL_SCRUTINY', 'REJECTED'],
  COMMITTEE_VERIFICATION: ['APPELLATE_REVIEW', 'FINAL_APPROVAL', 'REJECTED'],
  APPELLATE_REVIEW: ['FINAL_APPROVAL', 'REJECTED'],
  FINAL_APPROVAL: [],
  REJECTED: ['SUBMITTED'] // Re-submission on appeal
};

class WorkflowService {
  /**
   * Validate stage transition rule
   */
  public isValidTransition(currentStage: StageName, targetStage: StageName): boolean {
    const allowed = ALLOWED_STAGE_TRANSITIONS[currentStage] || [];
    return allowed.includes(targetStage);
  }

  /**
   * Process a validated workflow transition with audit logging
   */
  public processTransition(
    app: any,
    targetStage: StageName,
    performedByRole: RoleName,
    performedByUserId: number,
    remarks: string
  ): WorkflowTransitionResult {
    const currentStage: StageName = app.currentStage as StageName;

    if (!this.isValidTransition(currentStage, targetStage)) {
      return {
        success: false,
        message: `Invalid stage transition from '${currentStage}' to '${targetStage}'. Permitted transitions: ${ALLOWED_STAGE_TRANSITIONS[currentStage]?.join(', ')}`
      };
    }

    // Apply stage update
    const previousStage = app.currentStage;
    app.currentStage = targetStage;
    app.stageEnteredAt = new Date().toISOString();
    app.updatedAt = new Date().toISOString();

    if (targetStage === 'FINAL_APPROVAL') {
      app.status = 'APPROVED';
    } else if (targetStage === 'REJECTED') {
      app.status = 'REJECTED';
    } else {
      app.status = 'IN_PROGRESS';
    }

    const historyEntry = {
      applicationId: app.id,
      fromStage: previousStage,
      toStage: targetStage,
      performedByUserId,
      performedByRole,
      actionRemarks: remarks,
      transitionTimestamp: new Date().toISOString()
    };

    return {
      success: true,
      message: `Application ${app.applicationNumber} advanced from ${previousStage} to ${targetStage}.`,
      previousStage,
      newStage: targetStage,
      historyEntry
    };
  }
}

export const workflowService = new WorkflowService();
