import crypto from 'crypto';
import { config } from '../config/env.js';

export interface AlertRecord {
  id: number;
  applicationId: number;
  institutionId: number;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  reason: 'MISSING_DOCUMENT' | 'EXPIRED_DOCUMENT' | 'COMPLIANCE_FAILURE' | 'STAGE_DELAY' | 'EVC_UPCOMING';
  recommendedAction: string;
  dueDate?: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  deduplicationHash: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

class AlertEngine {
  private alertsStore: AlertRecord[] = [
    {
      id: 1,
      applicationId: 2,
      institutionId: 2,
      title: 'Critical: Fire Safety NOC Expired for Application APP-2026-4410',
      message: 'The submitted Fire Safety NOC Certificate expired on 2026-05-01. EVC inspection cannot proceed until a valid certificate is uploaded.',
      severity: 'CRITICAL',
      reason: 'EXPIRED_DOCUMENT',
      recommendedAction: 'Upload renewed Fire Safety Certificate issued by State Fire Department.',
      status: 'ACTIVE',
      deduplicationHash: 'HASH-EXPIRED-FIRE-DOC-2',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];

  public getAlerts(): AlertRecord[] {
    return this.alertsStore;
  }

  public getAlertsForApplication(applicationId: number): AlertRecord[] {
    return this.alertsStore.filter(a => a.applicationId === applicationId);
  }

  /**
   * Dispatch or create alert with deduplication hash check
   */
  public createAlert(alertData: {
    applicationId: number;
    institutionId: number;
    title: string;
    message: string;
    severity: AlertRecord['severity'];
    reason: AlertRecord['reason'];
    recommendedAction: string;
    dueDate?: string;
  }): { created: boolean; alert: AlertRecord } {
    // Generate deduplication hash
    const rawHash = `${alertData.applicationId}_${alertData.reason}_${alertData.title}`;
    const deduplicationHash = crypto.createHash('md5').update(rawHash).digest('hex');

    // Check for existing active duplicate
    const existing = this.alertsStore.find(a => a.deduplicationHash === deduplicationHash && a.status === 'ACTIVE');
    if (existing) {
      return { created: false, alert: existing };
    }

    const newAlert: AlertRecord = {
      id: this.alertsStore.length + 1,
      ...alertData,
      status: 'ACTIVE',
      deduplicationHash,
      createdAt: new Date().toISOString()
    };

    this.alertsStore.unshift(newAlert);
    return { created: true, alert: newAlert };
  }

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert(alertId: number): AlertRecord | null {
    const alert = this.alertsStore.find(a => a.id === alertId);
    if (!alert) return null;
    alert.status = 'ACKNOWLEDGED';
    alert.acknowledgedAt = new Date().toISOString();
    return alert;
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: number): AlertRecord | null {
    const alert = this.alertsStore.find(a => a.id === alertId);
    if (!alert) return null;
    alert.status = 'RESOLVED';
    alert.resolvedAt = new Date().toISOString();
    return alert;
  }

  /**
   * Format safe email draft notification
   */
  public formatEmailDraft(alert: AlertRecord, institutionName: string): string {
    return `
===================================================================
ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
AUTOMATED COMPLIANCE MONITORING & ALERT SYSTEM
===================================================================

To: Principal / Director, ${institutionName}
Date: ${new Date().toLocaleDateString()}
Severity: [${alert.severity}]
Subject: [ACTION REQUIRED] ${alert.title}

Dear Institution Head,

This is an automated compliance notice regarding your AICTE Approval Application.

NOTICE DETAILS:
-------------------------------------------------------------------
${alert.message}

RECOMMENDED NEXT ACTION:
-------------------------------------------------------------------
${alert.recommendedAction}
${alert.dueDate ? `Due Date: ${new Date(alert.dueDate).toLocaleDateString()}` : ''}

Please log into the AICTE Web Portal to complete the required action: ${config.appUrl}

Regards,
AICTE Automated Approval System
    `.trim();
  }
}

export const alertEngine = new AlertEngine();
