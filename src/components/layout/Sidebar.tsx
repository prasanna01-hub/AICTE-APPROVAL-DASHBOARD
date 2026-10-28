import React from 'react';
import { RoleName } from '../../types';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  FolderArchive, 
  CalendarDays, 
  BrainCircuit, 
  BarChart3, 
  Bell, 
  History, 
  ShieldCheck,
  Building2,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  userRole: RoleName;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  userRole,
  activeAlertsCount
}) => {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'APPLICATIONS', label: 'Applications', icon: <FileText className="h-4 w-4" /> },
    { id: 'INSTITUTIONS', label: 'Institutions', icon: <Building2 className="h-4 w-4" /> },
    { id: 'EVC', label: 'EVC Management', icon: <CalendarDays className="h-4 w-4" /> },
    { id: 'COMPLIANCE', label: 'Compliance', icon: <CheckCircle className="h-4 w-4" /> },
    { id: 'DOCUMENTS', label: 'Documents', icon: <FolderArchive className="h-4 w-4" /> },
    { id: 'AI_RISK', label: 'AI Delay Prediction', icon: <BrainCircuit className="h-4 w-4" /> },
    { id: 'PRIORITY', label: 'Smart Priority', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'ALERTS', label: 'Alerts', icon: <Bell className="h-4 w-4" />, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined },
    { id: 'REPORTS', label: 'Reports', icon: <History className="h-4 w-4" /> }
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 p-4 min-h-[calc(100vh-4rem)] text-slate-700 shadow-2xs">
      
      {/* Active Role Context */}
      <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Authorized User Context</div>
        <div className="font-bold text-xs text-blue-900 mt-0.5 capitalize flex items-center justify-between">
          <span>{userRole.replace('_', ' ').toLowerCase()}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id || (item.id === 'INSTITUTIONS' && activeTab === 'APPLICATIONS');
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id === 'INSTITUTIONS' ? 'APPLICATIONS' : item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-[#1e3a8a] text-white shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-white' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : typeof item.badge === 'number'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Official AICTE Handbook Citation Badge */}
      <div className="mt-8 p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
        <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
          <BookOpen className="h-3.5 w-3.5 text-blue-900" />
          <span>Handbook Norms</span>
        </div>
        <p className="text-[10px] leading-relaxed text-slate-500">
          AICTE Approval Process Handbook (APH 2024–2027) Compliance Engine.
        </p>
      </div>

    </aside>
  );
};
