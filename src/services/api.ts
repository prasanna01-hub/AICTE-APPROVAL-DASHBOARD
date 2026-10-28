import { 
  UserSession, 
  ApplicationRecord, 
  HandbookRule, 
  ComplianceAuditSummary, 
  DocumentRecord, 
  EVCScheduleRecord, 
  AIDelayPrediction, 
  PriorityScoreRecord, 
  AlertRecord, 
  DashboardStats,
  SystemHealthData,
  RoleName 
} from '../types';

const API_BASE = '/api';

/**
 * Generic Fetch Wrapper with Error Handling & Auth Token Headers
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}, role?: RoleName): Promise<T> {
  const token = localStorage.getItem('aicte_jwt_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (role) {
    headers['x-user-role'] = role;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'API Request Failed' }));
    throw new Error(errorData.message || `HTTP ${res.status} Error`);
  }

  return res.json();
}

// 0. System Health & Integration Tests APIs
export async function fetchSystemHealth(): Promise<SystemHealthData> {
  return apiFetch<SystemHealthData>('/health');
}

export async function runBackendIntegrationTests(): Promise<any> {
  return apiFetch<any>('/tests/run');
}

// 1. Authentication APIs
export async function loginUser(credentials: { username?: string; email?: string; password?: string; role?: RoleName }) {
  const data = await apiFetch<{ success: boolean; token: string; user: UserSession }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  if (data.token) {
    localStorage.setItem('aicte_jwt_token', data.token);
  }
  return data;
}

export async function fetchCurrentUser(role?: RoleName) {
  return apiFetch<{ success: boolean; user: UserSession; availableRoles: any[] }>('/auth/me', {}, role);
}

// 2. Dashboard APIs
export async function fetchDashboardStats() {
  return apiFetch<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
}

// 3. Application Management APIs
export async function fetchApplications(role?: RoleName) {
  return apiFetch<{ success: boolean; count: number; data: ApplicationRecord[] }>('/applications', {}, role);
}

export async function submitApplication(appData: any, role?: RoleName) {
  return apiFetch<{ success: boolean; message: string; data: ApplicationRecord }>('/applications', {
    method: 'POST',
    body: JSON.stringify(appData)
  }, role);
}

export async function updateApplicationStage(id: number | string, nextStage: string, remarks: string, role?: RoleName) {
  return apiFetch<{ success: boolean; message: string; data: ApplicationRecord }>(`/applications/${id}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ nextStage, remarks })
  }, role);
}

// 4. Handbook Compliance APIs
export async function fetchHandbookRules() {
  return apiFetch<{ success: boolean; data: HandbookRule[] }>('/compliance/rules');
}

export async function runComplianceAudit(data: any) {
  return apiFetch<{ success: boolean; data: ComplianceAuditSummary }>('/compliance/audit', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// 5. Document Management APIs
export async function fetchApplicationDocuments(appId: number | string) {
  return apiFetch<{ success: boolean; count: number; data: DocumentRecord[] }>(`/documents/application/${appId}`);
}

export async function fetchDocumentExpiryMonitor(appId: number | string) {
  return apiFetch<{
    success: boolean;
    data: {
      missingDocuments: string[];
      expiredDocuments: DocumentRecord[];
      soonToExpireDocuments: DocumentRecord[];
      verifiedDocuments: DocumentRecord[];
    }
  }>(`/documents/expiry-monitor/${appId}`);
}

export async function registerDocument(docData: any) {
  return apiFetch<{ success: boolean; message: string; data: DocumentRecord }>('/documents', {
    method: 'POST',
    body: JSON.stringify(docData)
  });
}

// 6. EVC Scheduling APIs
export async function fetchEVCSchedules() {
  return apiFetch<{ success: boolean; count: number; data: EVCScheduleRecord[] }>('/evc/schedules');
}

export async function scheduleEVCVisit(data: any) {
  return apiFetch<{ success: boolean; message: string; data: EVCScheduleRecord }>('/evc/schedules', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateEVCStatus(id: number, evcStatus: string, checklistCompleted?: boolean, reportSummary?: string) {
  return apiFetch<{ success: boolean; message: string; data: EVCScheduleRecord }>(`/evc/schedules/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ evcStatus, checklistCompleted, reportSummary })
  });
}

// 7. AI Delay Risk APIs
export async function predictDelayRisk(payload: any) {
  return apiFetch<{ success: boolean; data: AIDelayPrediction }>('/ai-service/predict-delay', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// 8. Smart Priority APIs
export async function fetchPriorityScore(appId: number | string) {
  return apiFetch<{ success: boolean; data: PriorityScoreRecord }>(`/priority/calculate/${appId}`);
}

export async function fetchRankedPriorityQueue() {
  return apiFetch<{ success: boolean; count: number; data: PriorityScoreRecord[] }>('/priority/ranked-queue');
}

// 9. Alert & Notification APIs
export async function fetchAlerts() {
  return apiFetch<{ success: boolean; count: number; data: AlertRecord[] }>('/alerts');
}

export async function acknowledgeAlert(id: number) {
  return apiFetch<{ success: boolean; message: string; data: AlertRecord }>(`/alerts/${id}/acknowledge`, {
    method: 'PATCH'
  });
}

export async function resolveAlert(id: number) {
  return apiFetch<{ success: boolean; message: string; data: AlertRecord }>(`/alerts/${id}/resolve`, {
    method: 'PATCH'
  });
}

export async function dispatchAlert(data: any) {
  return apiFetch<{ success: boolean; createdNew: boolean; message: string; data: { alert: AlertRecord; emailDraft: string } }>('/alerts/dispatch', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
