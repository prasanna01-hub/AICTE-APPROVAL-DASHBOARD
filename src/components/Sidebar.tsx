import React from 'react';
import { 
  Activity, 
  FolderTree, 
  GitCommit, 
  Calculator, 
  BrainCircuit, 
  Bell, 
  FolderArchive, 
  Terminal
} from 'lucide-react';

export type TabType = 'HEALTH' | 'PROJECT_TREE' | 'WORKFLOW' | 'COMPLIANCE' | 'AI_PREDICTOR' | 'ALERTS' | 'DOCUMENTS' | 'SETUP_GUIDE';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, unreadAlertsCount }) => {
  const menuItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string | number; category?: string }[] = [
    { id: 'HEALTH', label: 'System Health & Overview', icon: <Activity className="h-4 w-4" /> },
    { id: 'PROJECT_TREE', label: 'Project Architecture & Tree', icon: <FolderTree className="h-4 w-4" />, badge: 'Modular' },
    { id: 'WORKFLOW', label: 'AICTE Approval Workflow', icon: <GitCommit className="h-4 w-4" /> },
    { id: 'COMPLIANCE', label: 'Compliance Audit Engine', icon: <Calculator className="h-4 w-4" /> },
    { id: 'AI_PREDICTOR', label: 'AI / ML Deficiency Predictor', icon: <BrainCircuit className="h-4 w-4" />, badge: 'FastAPI' },
    { id: 'ALERTS', label: 'Alerts & Email Manager', icon: <Bell className="h-4 w-4" />, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined },
    { id: 'DOCUMENTS', label: 'Secure Document Vault', icon: <FolderArchive className="h-4 w-4" /> },
    { id: 'SETUP_GUIDE', label: 'Windows Setup & Commands', icon: <Terminal className="h-4 w-4" />, badge: 'Guide' }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0 p-4 min-h-[calc(100vh-4rem)]">
      <div className="mb-4 px-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Module Navigation
        </h2>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-950/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof item.badge === 'number'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tech Stack Footer Card */}
      <div className="mt-8 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-300 mb-1">Target Stack Verification:</div>
        <ul className="space-y-1 text-[10px] list-disc list-inside text-slate-400 font-mono">
          <li>React.js (Port 3000)</li>
          <li>Node.js / Express</li>
          <li>PostgreSQL (Configured)</li>
          <li>Python FastAPI + Scikit-learn</li>
          <li>JWT + RBAC Security</li>
        </ul>
      </div>
    </aside>
  );
};
