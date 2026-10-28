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

class EVCService {
  private evcSchedules: EVCScheduleRecord[] = [
    {
      id: 1,
      applicationId: 2,
      institutionId: 2,
      scheduledDate: '2026-11-10T10:00:00Z',
      venueAddress: 'National College of Pharmacy, Campus Hall A, Bengaluru',
      assignedExperts: ['Prof. H. R. Nagendra', 'Dr. Priya Swaminathan'],
      evcStatus: 'SCHEDULED',
      preparationChecklistCompleted: false,
      hasSchedulingConflict: false
    }
  ];

  public getSchedules(): EVCScheduleRecord[] {
    return this.evcSchedules;
  }

  public getScheduleForApplication(applicationId: number): EVCScheduleRecord | undefined {
    return this.evcSchedules.find(s => s.applicationId === applicationId);
  }

  /**
   * Schedule new EVC visit with conflict detection
   */
  public scheduleVisit(data: {
    applicationId: number;
    institutionId: number;
    scheduledDate: string;
    venueAddress: string;
    assignedExperts: string[];
  }): EVCScheduleRecord {
    const targetDate = new Date(data.scheduledDate).toDateString();

    // Conflict detection: Check if expert assigned to another visit on same day
    let conflict = false;
    let conflictReason = '';

    for (const existing of this.evcSchedules) {
      if (new Date(existing.scheduledDate).toDateString() === targetDate) {
        const overlap = existing.assignedExperts.filter(e => data.assignedExperts.includes(e));
        if (overlap.length > 0) {
          conflict = true;
          conflictReason = `Expert conflict: ${overlap.join(', ')} already assigned to EVC schedule #${existing.id} on ${targetDate}.`;
          break;
        }
      }
    }

    const newRecord: EVCScheduleRecord = {
      id: this.evcSchedules.length + 1,
      applicationId: data.applicationId,
      institutionId: data.institutionId,
      scheduledDate: data.scheduledDate,
      venueAddress: data.venueAddress,
      assignedExperts: data.assignedExperts,
      evcStatus: 'SCHEDULED',
      preparationChecklistCompleted: false,
      hasSchedulingConflict: conflict,
      conflictReason: conflict ? conflictReason : undefined
    };

    this.evcSchedules.push(newRecord);
    return newRecord;
  }

  /**
   * Update EVC progress status
   */
  public updateStatus(id: number, status: EVCScheduleRecord['evcStatus'], checklistCompleted?: boolean, reportSummary?: string) {
    const record = this.evcSchedules.find(s => s.id === id);
    if (!record) return null;

    record.evcStatus = status;
    if (checklistCompleted !== undefined) record.preparationChecklistCompleted = checklistCompleted;
    if (reportSummary) record.reportSummary = reportSummary;

    return record;
  }
}

export const evcService = new EVCService();
