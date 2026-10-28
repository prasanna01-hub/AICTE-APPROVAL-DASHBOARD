import React from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, Bell, CheckCircle2, RefreshCw, UserCheck, Cpu, Database, Server } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  userProfile?: UserProfile;
  healthStatus: 'HEALTHY' | 'LOADING' | 'ERROR';
  onRefreshHealth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  userProfile,
  healthStatus,
  onRefreshHealth
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-lg shadow-inner">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                  AICTE Portal
                </span>
                <span className="bg-blue-900/60 text-blue-300 border border-blue-700/50 text-[11px] px-2 py-0.5 rounded font-mono font-medium">
                  v1.0 Prototype
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Approval Workflow, Compliance Monitoring & ML Alert System
              </p>
            </div>
          </div>

          {/* Center System Live Status Indicators */}
          <div className="hidden md:flex items-center space-x-4 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <div className="flex items-center space-x-1.5">
              <Server className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">Express API</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <div className="flex items-center space-x-1.5">
              <Database className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-slate-300 font-medium">PostgreSQL</span>
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <div className="flex items-center space-x-1.5">
              <Cpu className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-slate-300 font-medium">FastAPI ML</span>
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
            </div>
            <button 
              onClick={onRefreshHealth}
              title="Ping REST Health Check API"
              className="ml-1 p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${healthStatus === 'LOADING' ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* RBAC Role Switcher & User Profile */}
          <div className="flex items-center space-x-3">
            
            {/* RBAC Role Selector Dropdown */}
            <div className="relative">
              <label htmlFor="rbac-select" className="sr-only">Role</label>
              <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
                <UserCheck className="h-4 w-4 text-indigo-400 hidden sm:block" />
                <select
                  id="rbac-select"
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-medium text-slate-200 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="INSTITUTE_ADMIN" className="bg-slate-900 text-white">
                    🎓 Role: Institute Admin
                  </option>
                  <option value="AICTE_REGIONAL_OFFICER" className="bg-slate-900 text-white">
                    🏛️ Role: AICTE Regional Officer
                  </option>
                  <option value="SCRUTINY_COMMITTEE" className="bg-slate-900 text-white">
                    🔍 Role: Scrutiny Committee
                  </option>
                  <option value="SYSTEM_ADMIN" className="bg-slate-900 text-white">
                    ⚡ Role: System Admin
                  </option>
                </select>
              </div>
            </div>

            {/* Active User Avatar */}
            {userProfile && (
              <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-800">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name} 
                  className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                />
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-200 truncate max-w-[130px]">{userProfile.name}</div>
                  <div className="text-[10px] text-indigo-300 font-mono capitalize">{currentRole.replace('_', ' ').toLowerCase()}</div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
