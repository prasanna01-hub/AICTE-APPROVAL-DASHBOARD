import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginForm } from './features/auth/LoginForm';
import { DashboardView } from './features/dashboard/DashboardView';
import { PublicLandingView } from './features/landing/PublicLandingView';
import { ApplicationList } from './features/applications/ApplicationList';
import { ComplianceView } from './features/compliance/ComplianceView';
import { DocumentVaultView } from './features/documents/DocumentVaultView';
import { EVCManagementView } from './features/evc/EVCManagementView';
import { AIDelayRiskView } from './features/airisk/AIDelayRiskView';
import { PriorityQueueView } from './features/priority/PriorityQueueView';
import { AlertsView } from './features/notifications/AlertsView';
import { AuditReportsView } from './features/reports/AuditReportsView';

import { UserSession, RoleName, DashboardStats, ApplicationRecord, AlertRecord } from './types';
import { 
  fetchCurrentUser, 
  fetchDashboardStats, 
  fetchApplications, 
  submitApplication, 
  updateApplicationStage, 
  fetchAlerts 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('LANDING_1');
  const [currentUser, setCurrentUser] = useState<UserSession>({
    id: 1,
    username: 'admin_aicte',
    email: 'admin@aicte-india.org',
    role: 'ADMINISTRATOR',
    name: 'Dr. R. Sharma'
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [inspectApp, setInspectApp] = useState<ApplicationRecord | null>(null);

  // Initial Data Fetching
  const loadPortalData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetchDashboardStats();
      if (statsRes && statsRes.data) setDashboardStats(statsRes.data);

      const appsRes = await fetchApplications(currentUser.role);
      if (appsRes && appsRes.data) setApplications(appsRes.data);

      const alertsRes = await fetchAlerts();
      if (alertsRes && alertsRes.data) setAlerts(alertsRes.data);
    } catch (err) {
      console.warn('Portal data fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [currentUser.role]);

  const handleRoleChange = async (newRole: RoleName) => {
    try {
      const res = await fetchCurrentUser(newRole);
      if (res && res.user) {
        setCurrentUser(res.user);
      } else {
        setCurrentUser(prev => ({ ...prev, role: newRole }));
      }
    } catch (err) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const handleSubmitNewApp = async (data: any) => {
    await submitApplication(data, currentUser.role);
    await loadPortalData();
  };

  const handleAdvanceStage = async (id: number | string, nextStage: string, remarks: string) => {
    await updateApplicationStage(id, nextStage, remarks, currentUser.role);
    await loadPortalData();
  };
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* View Router */}
      {activeTab === 'LANDING_1' ? (
        <PublicLandingView
          onOpenLogin={() => setShowLoginModal(true)}
          onNavigateToGovPortal={() => setActiveTab('DASHBOARD')}
          onNavigateToExecutiveDashboard={() => setActiveTab('DASHBOARD')}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          
          {/* Main Navbar */}
          <Navbar
            currentUser={currentUser}
            onRoleChange={handleRoleChange}
            onOpenLoginModal={() => setShowLoginModal(true)}
            onLogout={() => {
              localStorage.removeItem('aicte_jwt_token');
              handleRoleChange('INSTITUTION_USER');
            }}
            alerts={alerts}
            onSelectTab={setActiveTab}
          />

          {/* Body Container */}
          <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
            
            {/* Sidebar */}
            <Sidebar
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              userRole={currentUser.role}
              activeAlertsCount={alerts.filter(a => a.status === 'ACTIVE').length}
            />

            {/* Main Workspace Area */}
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
              
              {activeTab === 'DASHBOARD' && (
                <DashboardView
                  stats={dashboardStats}
                  applications={applications}
                  alerts={alerts}
                  onSelectTab={setActiveTab}
                />
              )}

              {activeTab === 'APPLICATIONS' && (
                <ApplicationList
                  applications={applications}
                  userRole={currentUser.role}
                  onSubmitNewApp={handleSubmitNewApp}
                  onAdvanceStage={handleAdvanceStage}
                  onSelectApplicationForDetail={(app) => setInspectApp(app)}
                />
              )}

              {activeTab === 'COMPLIANCE' && (
                <ComplianceView />
              )}

              {activeTab === 'DOCUMENTS' && (
                <DocumentVaultView />
              )}

              {activeTab === 'EVC' && (
                <EVCManagementView />
              )}

              {activeTab === 'AI_RISK' && (
                <AIDelayRiskView />
              )}

              {activeTab === 'PRIORITY' && (
                <PriorityQueueView />
              )}

              {activeTab === 'ALERTS' && (
                <AlertsView />
              )}

              {activeTab === 'REPORTS' && (
                <AuditReportsView />
              )}

            </main>

          </div>

        </div>
      )}

      {/* Login Modal */}
      <LoginForm
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          loadPortalData();
        }}
      />

      {/* Application Detail Drawer Modal */}
      {inspectApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-slate-800 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-mono font-bold text-sm text-blue-900">{inspectApp.applicationNumber}</span>
              <button
                onClick={() => setInspectApp(null)}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded font-semibold cursor-pointer border border-slate-300"
              >
                Close Dossier
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900">{inspectApp.institutionName}</h3>
              <p className="text-slate-600">{inspectApp.category} | State: {inspectApp.state}</p>
              <div className="font-mono text-emerald-700 font-bold pt-2">Current Stage: {inspectApp.currentStage}</div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-slate-700">
                Submitted: {new Date(inspectApp.submittedAt).toLocaleDateString()} | Approval Type: {inspectApp.approvalType}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
