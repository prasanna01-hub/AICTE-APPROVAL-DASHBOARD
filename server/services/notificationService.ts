import { config } from '../config/env.js';

export interface AlertNotification {
  id: string;
  institutionId: string;
  title: string;
  message: string;
  type: 'WARNING' | 'CRITICAL' | 'INFO' | 'DEADLINE';
  channel: 'IN_APP' | 'EMAIL' | 'BOTH';
  timestamp: string;
  isRead: boolean;
}

/**
 * Alert Management & Email Dispatch Service
 */
class NotificationService {
  private alerts: AlertNotification[] = [
    {
      id: 'ALT-2026-001',
      institutionId: '1-109283741',
      title: 'AICTE Compliance Warning: Faculty-Student Ratio Gap',
      message: 'Your current Faculty-Student ratio is 1:18. Norm requirement is 1:15. Please recruit 4 additional M.Tech/Ph.D faculty before Scrutiny Committee visit on 15th Nov.',
      type: 'WARNING',
      channel: 'BOTH',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      isRead: false
    },
    {
      id: 'ALT-2026-002',
      institutionId: '1-109283741',
      title: 'Urgent: Fire Safety NOC Renewal Deadline',
      message: 'Fire Safety Certificate expires in 12 days. Upload renewed certificate to prevent application rejection.',
      type: 'CRITICAL',
      channel: 'BOTH',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      isRead: false
    },
    {
      id: 'ALT-2026-003',
      institutionId: '1-109283741',
      title: 'Application Stage Updated: Sent to Regional Scrutiny',
      message: 'Application APP-2026-8912 has successfully passed automated document verification and is assigned to Regional Officer (Southern Region).',
      type: 'INFO',
      channel: 'IN_APP',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      isRead: true
    }
  ];

  public getAllAlerts() {
    return this.alerts;
  }

  public createAlert(alert: Omit<AlertNotification, 'id' | 'timestamp' | 'isRead'>) {
    const newAlert: AlertNotification = {
      ...alert,
      id: `ALT-2026-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  public generateEmailTemplate(alertTitle: string, alertMessage: string, institutionName: string) {
    return `
===================================================================
ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)
AUTOMATED COMPLIANCE MONITORING & ALERT SYSTEM
===================================================================

To: Principal / Director, ${institutionName}
Date: ${new Date().toLocaleDateString()}
Subject: [ACTION REQUIRED] ${alertTitle}

Dear Institution Head,

This is an automated compliance notification from the AICTE Web Portal regarding your Extension of Approval (EoA) / New Course Application.

NOTICE DETAILS:
-------------------------------------------------------------------
${alertMessage}

REQUIRED ACTION:
1. Log into the AICTE Portal: ${config.appUrl}
2. Navigate to 'Compliance Audit' tab.
3. Upload missing/renewed documents or update Faculty Cadre details.
4. Re-submit application before the committee evaluation cutoff date.

For assistance, email support@aicte-india.org or contact your Regional Office.

Regards,
Member Secretary, AICTE New Delhi
-------------------------------------------------------------------
(This is an automated system email. Please do not reply directly to this mail.)
    `.trim();
  }
}

export const notificationService = new NotificationService();
