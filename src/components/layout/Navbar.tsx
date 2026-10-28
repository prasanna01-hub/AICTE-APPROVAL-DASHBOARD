import React, { useState } from 'react';
import { UserSession, RoleName, AlertRecord } from '../../types';
import { Shield, Bell, UserCheck, Key, Building2, Globe, LayoutDashboard } from 'lucide-react';

interface NavbarProps {
  currentUser: UserSession;
  onRoleChange: (role: RoleName) => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  alerts: AlertRecord[];
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onRoleChange,
  onOpenLoginModal,
  onLogout,
  alerts,
  onSelectTab
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE');

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-50 shadow-2xs">
      
      {/* Official Government Regulatory Banner */}
      <div className="bg-slate-100 px-4 py-1.5 text-[11px] border-b border-slate-200 text-slate-600 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-900 tracking-wide">GOVERNMENT OF INDIA</span>
          <span className="text-slate-400">•</span>
          <span>Ministry of Education | All India Council for Technical Education (AICTE New Delhi)</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[10px] font-mono text-slate-500">
          <span>Handbook: <strong className="text-blue-900">2024–2027</strong></span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-semibold">Regulatory Gateway: ACTIVE</span>
        </div>
      </div>

      {/* Main Official Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Domain Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('DASHBOARD')}>
            <div className="bg-[#1e3a8a] text-white p-2 rounded-lg shadow-2xs">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  AICTE Approval Portal
                </span>
                <span className="bg-blue-100 text-blue-900 border border-blue-200 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  Compliance Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Integrated Approval Workflow Automation, Compliance Monitoring & Alert Management System
              </p>
            </div>
          </div>

          {/* Right Authority Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Regulatory Notifications Indicator */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition relative cursor-pointer"
                title="View Active Compliance Notices"
              >
                <Bell className="h-4 w-4" />
                {activeAlerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeAlerts.length}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden text-xs">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <Bell className="h-3.5 w-3.5 text-blue-900" />
                      <span>Active Compliance Notices ({activeAlerts.length})</span>
                    </span>
                    <button
                      onClick={() => { setShowNotifications(false); onSelectTab('ALERTS'); }}
                      className="text-[10px] text-blue-900 hover:underline cursor-pointer font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {activeAlerts.length === 0 ? (
                      <div className="p-4 text-center text-slate-500">No active compliance notices.</div>
                    ) : (
                      activeAlerts.slice(0, 4).map((alt) => (
                        <div key={alt.id} className="p-3 hover:bg-slate-50 transition">
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-slate-900 line-clamp-1">{alt.title}</span>
                            <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${
                              alt.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {alt.severity}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{alt.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Authority Role Selector */}
            <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="h-3.5 w-3.5 text-blue-900 hidden sm:block" />
              <select
                value={currentUser.role}
                onChange={(e) => onRoleChange(e.target.value as RoleName)}
                className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer py-1 pr-1"
              >
                <option value="INSTITUTION_USER" className="bg-white text-slate-900">🎓 Role: Institution Applicant</option>
                <option value="REVIEWING_OFFICIAL" className="bg-white text-slate-900">🏛️ Role: AICTE Regional Officer</option>
                <option value="EVC_COORDINATOR" className="bg-white text-slate-900">📋 Role: EVC Coordinator</option>
                <option value="ADMINISTRATOR" className="bg-white text-slate-900">⚡ Role: System Administrator</option>
              </select>
            </div>

            {/* Login Modal Action */}
            <button
              onClick={onOpenLoginModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Key className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Portal Login</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
