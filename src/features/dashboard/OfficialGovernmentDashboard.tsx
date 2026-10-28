import React from 'react';
import { Bell, LogOut, LayoutDashboard, Building2, FileCheck, ShieldAlert, Users, BarChart3, Settings, AlertTriangle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { ApplicationRecord, AlertRecord } from '../../types';

interface OfficialGovernmentDashboardProps {
  applications: ApplicationRecord[];
  alerts: AlertRecord[];
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onNavigateToLanding1: () => void;
}

export const OfficialGovernmentDashboard: React.FC<OfficialGovernmentDashboardProps> = ({
  applications,
  alerts,
  onSelectTab,
  onLogout,
  onNavigateToLanding1
}) => {
  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex flex-col font-sans">
      
      {/* Official Government Top Header Bar - White background matching Image 1 */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-2xs">
        
        {/* Left Emblem & Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border-r border-slate-200 pr-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-serif text-xs font-bold text-slate-700 shadow-2xs">
              🏛️
            </div>
            <div className="text-[10px] leading-tight font-semibold text-slate-700">
              <div>Government of India</div>
              <div className="text-slate-500">Government of India</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateToLanding1}>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center p-1">
              <Building2 className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase leading-tight">
                ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
              </h1>
              <p className="text-[11px] font-medium text-slate-600 leading-tight">
                Compliance Monitoring and Alert Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right User Profile & Controls */}
        <div className="flex items-center space-x-6 text-xs">
          <button
            onClick={onNavigateToLanding1}
            className="hidden md:flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 transition cursor-pointer"
          >
            <span>Landing Page 1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-600 overflow-hidden">
              👤
            </div>
            <div className="leading-tight">
              <div className="font-bold text-slate-900">Welcome, <span className="text-blue-900">Dr. R. Sharma</span></div>
              <div className="text-[10px] text-slate-500">Director, Approval Bureau</div>
            </div>
          </div>

          <div className="relative cursor-pointer" onClick={() => onSelectTab('ALERTS')}>
            <Bell className="w-5 h-5 text-slate-600 hover:text-slate-900 transition" />
            <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-rose-600 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
              3
            </span>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-2xs transition cursor-pointer flex items-center space-x-1"
          >
            <span>Logout</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* Main Body Layout matching Image 1 */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Dark Navy Sidebar matching Image 1 */}
        <aside className="w-60 bg-[#0f172a] text-slate-300 flex flex-col shrink-0">
          <nav className="p-3 space-y-1 text-xs font-medium flex-1">
            
            <button
              onClick={() => onSelectTab('OFFICIAL_GOV')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-3 bg-blue-700 text-white font-semibold shadow-2xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('APPLICATIONS')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition"
            >
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Institution Management</span>
            </button>

            <button
              onClick={() => onSelectTab('APPLICATIONS')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition"
            >
              <FileCheck className="w-4 h-4 text-slate-400" />
              <span>Application Processing</span>
            </button>

            <button
              onClick={() => onSelectTab('COMPLIANCE')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition"
            >
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              <span>Compliance Monitoring</span>
            </button>

            <button
              onClick={() => onSelectTab('EVC')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>EVC Committee</span>
            </button>

            <button
              onClick={() => onSelectTab('REPORTS')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition"
            >
              <BarChart3 className="w-4 h-4 text-slate-400" />
              <span>Reports</span>
            </button>

            <button
              onClick={() => onSelectTab('TESTS')}
              className="w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-3 hover:bg-slate-800/80 hover:text-white transition"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </button>

          </nav>

          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-400">
            AICTE Official Portal v2.4 (Govt of India)
          </div>
        </aside>

        {/* Center & Right Work Area matching Image 1 */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Dashboard Column */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Title Header matching Image 1 */}
            <div>
              <h2 className="text-xl font-bold text-slate-900">Dashboard Overview (AY 2024-25)</h2>
            </div>

            {/* Top 4 Metric Cards matching Image 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-semibold text-slate-600">Total Applications</div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">3,452</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-semibold text-slate-600">Pending Scrutiny</div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">890</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-semibold text-slate-600">Awaiting EVC Visit</div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">156</div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <div className="text-xs font-semibold text-slate-600">Compliance Gaps</div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">45</div>
              </div>

            </div>

            {/* Critical Workflow Status Panel matching Image 1 */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Critical Workflow Status</h3>
                  <p className="text-xs text-slate-500">AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onSelectTab('APPLICATIONS')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 rounded transition cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onSelectTab('APPLICATIONS')}
                    className="px-3.5 py-1.5 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-semibold rounded shadow-2xs transition cursor-pointer"
                  >
                    Initiate Scrutiny
                  </button>
                </div>
              </div>

              {/* Graphic Stage Status Bar Strip matching Image 1 */}
              <div className="h-12 bg-slate-50 border border-slate-200 rounded p-2 flex items-end justify-center space-x-3 overflow-hidden">
                <div className="w-8 bg-blue-300 h-2/3 rounded-t" title="Submitted"></div>
                <div className="w-8 bg-[#1e3a8a] h-full rounded-t" title="Under Review"></div>
                <div className="w-8 bg-slate-400 h-3/4 rounded-t" title="EVC Visit"></div>
                <div className="w-8 bg-emerald-600 h-1/2 rounded-t" title="Compliance"></div>
                <div className="w-8 bg-rose-500 h-1/3 rounded-t" title="Approved"></div>
              </div>

              {/* Critical Workflow Table matching Image 1 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                      <th className="py-2.5 px-3">Institute ID</th>
                      <th className="py-2.5 px-3">Institute Name</th>
                      <th className="py-2.5 px-3">Application Type</th>
                      <th className="py-2.5 px-3">Current Stage</th>
                      <th className="py-2.5 px-3 text-center">Pending Since (Days)</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/80 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                      <td className="py-2.5 px-3 font-mono font-medium">Institute A</td>
                      <td className="py-2.5 px-3 font-semibold">Institute A</td>
                      <td className="py-2.5 px-3">EoA</td>
                      <td className="py-2.5 px-3">Awaiting Bureau Appro</td>
                      <td className="py-2.5 px-3 text-center font-mono">6</td>
                      <td className="py-2.5 px-3 font-medium">Awaiting Bureau Approval</td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                      <td className="py-2.5 px-3 font-mono font-medium">Institute B</td>
                      <td className="py-2.5 px-3 font-semibold">Institute B</td>
                      <td className="py-2.5 px-3">New Course</td>
                      <td className="py-2.5 px-3">EVC Report Submitted</td>
                      <td className="py-2.5 px-3 text-center font-mono">12</td>
                      <td className="py-2.5 px-3 font-medium">Institute D</td>
                    </tr>

                    <tr className="bg-rose-50/70 hover:bg-rose-50 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                      <td className="py-2.5 px-3 font-mono font-medium text-rose-900">Institute C</td>
                      <td className="py-2.5 px-3 font-semibold text-rose-900">Institute C</td>
                      <td className="py-2.5 px-3 text-rose-900">Intake Change</td>
                      <td className="py-2.5 px-3 font-bold text-rose-700">*Escalated*</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700">45</td>
                      <td className="py-2.5 px-3 font-bold text-rose-700">*Escalated: Pending Regional Officer Action*</td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                      <td className="py-2.5 px-3 font-mono font-medium">Institute A</td>
                      <td className="py-2.5 px-3 font-semibold">Institute A</td>
                      <td className="py-2.5 px-3">Intake Change</td>
                      <td className="py-2.5 px-3">Awaiting Bureau</td>
                      <td className="py-2.5 px-3 text-center font-mono">45</td>
                      <td className="py-2.5 px-3 font-medium">Institute A</td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                      <td className="py-2.5 px-3 font-mono font-medium">Institute B</td>
                      <td className="py-2.5 px-3 font-semibold">Institute A</td>
                      <td className="py-2.5 px-3">New Course</td>
                      <td className="py-2.5 px-3">Awaiting Bureau</td>
                      <td className="py-2.5 px-3 text-center font-mono">12</td>
                      <td className="py-2.5 px-3 font-medium">Institute B</td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                      <td className="py-2.5 px-3 font-mono font-medium">Institute C</td>
                      <td className="py-2.5 px-3 font-semibold">Institute B</td>
                      <td className="py-2.5 px-3">Intake Change</td>
                      <td className="py-2.5 px-3">EVC Report Submitted</td>
                      <td className="py-2.5 px-3 text-center font-mono">45</td>
                      <td className="py-2.5 px-3 font-medium">Institute C</td>
                    </tr>

                    <tr className="hover:bg-slate-50/80 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                      <td className="py-2.5 px-3 font-mono font-medium">Institute C</td>
                      <td className="py-2.5 px-3 font-semibold">Institute C</td>
                      <td className="py-2.5 px-3">Intake Change</td>
                      <td className="py-2.5 px-3">Awaiting Bureau</td>
                      <td className="py-2.5 px-3 text-center font-mono">45</td>
                      <td className="py-2.5 px-3 font-medium">Institute C</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

          {/* Right Column Alerts & Escalations Panel matching Image 1 */}
          <div className="lg:col-span-3 space-y-4">
            
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>Real-Time Alerts & Escalations</span>
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              </h3>

              <div className="space-y-3 text-xs">
                
                {/* Urgent Card */}
                <div 
                  onClick={() => onSelectTab('ALERTS')}
                  className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-1 hover:border-rose-300 transition cursor-pointer"
                >
                  <div className="font-extrabold text-rose-800 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Urgent</span>
                  </div>
                  <div className="text-rose-900 font-medium">
                    15 Applications Exceeding SLA
                  </div>
                </div>

                {/* Compliance Alert Card */}
                <div 
                  onClick={() => onSelectTab('COMPLIANCE')}
                  className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1 hover:border-emerald-300 transition cursor-pointer"
                >
                  <div className="font-bold text-emerald-800 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Compliance Alert</span>
                  </div>
                  <div className="text-emerald-900">
                    Institute D Pending Faculty Data
                  </div>
                </div>

                {/* EVC Schedule Conflict Card */}
                <div 
                  onClick={() => onSelectTab('EVC')}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1 hover:border-blue-300 transition cursor-pointer"
                >
                  <div className="font-bold text-blue-800 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>EVC Schedule Conflict</span>
                  </div>
                  <div className="text-blue-900">
                    Institute E
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
