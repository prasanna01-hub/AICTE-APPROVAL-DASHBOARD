import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, Code, Server, Database, Cpu, Lock, Bell, FileCheck, Info } from 'lucide-react';

export const FolderTreeViewer: React.FC = () => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'src': true,
    'server': true,
    'database': true,
    'ai_service': true
  });

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const folderStructure = [
    {
      key: 'src',
      name: 'Frontend (src/)',
      icon: <Code className="h-4 w-4 text-blue-400" />,
      purpose: 'React.js single-page user interface using Tailwind CSS and Recharts for AICTE approval workflow automation, compliance dashboards, ML prediction visualizers, and RBAC portal.',
      items: [
        'src/App.tsx - Core layout, role management, and tab navigation controller',
        'src/components/Navbar.tsx - Portal header with active user profile & service health badges',
        'src/components/Sidebar.tsx - Navigation panel for switching platform modules',
        'src/components/WorkflowTracker.tsx - Multi-stage AICTE approval process state tracker',
        'src/components/ComplianceChecker.tsx - Interactive AICTE handbook norms auditor',
        'src/components/AIPredictorCard.tsx - Scikit-learn machine learning probability calculator',
        'src/components/AlertManager.tsx - In-app alerts log & SMTP automated email draft generator',
        'src/components/DocStorageViewer.tsx - Document repository verification view',
        'src/components/SetupInstructions.tsx - Beginner setup commands & Windows run checklist',
        'src/types/index.ts - TypeScript interfaces for Applications, Audits, ML & Users',
        'src/services/api.ts - REST API client wrapper communicating with Express backend'
      ]
    },
    {
      key: 'server',
      name: 'Backend (server/ & server.ts)',
      icon: <Server className="h-4 w-4 text-emerald-400" />,
      purpose: 'Node.js + Express.js backend API server handling REST routes, JWT authentication, Role-Based Access Control (RBAC), and microservice integration.',
      items: [
        'server.ts - Express server entry point with Vite middleware on port 3000',
        'server/config/env.ts - Environment variable loader and fallback manager',
        'server/config/db.ts - PostgreSQL database pool & connection probe',
        'server/middleware/authMiddleware.ts - JWT & Role-Based Access Control (RBAC)',
        'server/middleware/errorHandler.ts - Centralized Express exception logger',
        'server/routes/health.ts - Multi-service status ping endpoint (/api/health)',
        'server/routes/applications.ts - AICTE application CRUD & stage advancing (/api/applications)',
        'server/routes/compliance.ts - AICTE handbook norm calculation engine (/api/compliance)',
        'server/routes/ai.ts - Python FastAPI microservice proxy endpoint (/api/ai-service/predict)',
        'server/routes/notifications.ts - Automated email & alert dispatching (/api/notifications)',
        'server/routes/auth.ts - User login & RBAC role switcher endpoint (/api/auth)',
        'server/routes/architecture.ts - Dynamic folder tree API (/api/architecture)'
      ]
    },
    {
      key: 'database',
      name: 'Database (database/schema.sql)',
      icon: <Database className="h-4 w-4 text-amber-400" />,
      purpose: 'PostgreSQL database setup and DDL schema scripts for institutions, approval applications, compliance audits, documents, alerts, and users.',
      items: [
        'database/schema.sql - Relational schema creation script with foreign keys & sample test data'
      ]
    },
    {
      key: 'ai_service',
      name: 'AI Microservice (ai_service/)',
      icon: <Cpu className="h-4 w-4 text-purple-400" />,
      purpose: 'Python + FastAPI microservice powering Scikit-Learn Machine Learning models for deficiency prediction and approval risk classification.',
      items: [
        'ai_service/main.py - FastAPI web application entry point running on port 8000',
        'ai_service/ml_model.py - Scikit-learn AICTE approval prediction logic',
        'ai_service/requirements.txt - Python package dependencies (fastapi, scikit-learn)'
      ]
    },
    {
      key: 'doc_storage',
      name: 'Document Storage (uploads/documents/)',
      icon: <FileCheck className="h-4 w-4 text-teal-400" />,
      purpose: 'Secure file upload repository structure for storing institution proof documents (Land NOC, Fire Safety, Building Stability, Faculty Matrix).',
      items: [
        'server/services/docStorageService.ts - File verification and checksum manager'
      ]
    },
    {
      key: 'notifications_service',
      name: 'Notifications & Alerts (server/services/notificationService.ts)',
      icon: <Bell className="h-4 w-4 text-rose-400" />,
      purpose: 'Automated email template renderer and in-app compliance alert dispatcher.',
      items: [
        'server/services/notificationService.ts - Email generator and alert store'
      ]
    },
    {
      key: 'config_env',
      name: 'Configuration & Environment Variables (.env.example)',
      icon: <Lock className="h-4 w-4 text-indigo-400" />,
      purpose: 'Centralized environment template holding database credentials, JWT secrets, and API ports safely without hardcoding sensitive details.',
      items: [
        '.env.example - Complete configuration file with comments in simple English'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Folder className="h-6 w-6 text-indigo-400" />
          <span>Project Folder Structure & Folder Purpose Guide</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          A clean, beginner-friendly modular architecture keeping Frontend, Backend, Database, AI Service, and Notifications separated into clear folders as requested in Task 1.
        </p>
      </div>

      {/* Interactive Folder Tree Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Tree view */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
            <span>Folder Tree Explorer</span>
            <span className="text-[10px] text-slate-500 font-mono">Click to expand</span>
          </h2>

          <div className="space-y-2 text-xs">
            {folderStructure.map((folder) => {
              const isExpanded = expandedFolders[folder.key];
              return (
                <div key={folder.key} className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/40">
                  <button
                    onClick={() => toggleFolder(folder.key)}
                    className="w-full flex items-center justify-between p-2.5 text-left font-semibold text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      {folder.icon}
                      <span className="truncate">{folder.name}</span>
                    </div>
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-slate-800/60 bg-slate-900/60">
                      {folder.items.map((file, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-400 pl-2">
                          <FileText className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <span className="font-mono text-slate-300 leading-tight">{file.split(' - ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Detailed explanations in simple English */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span>Folder Purpose & Technology Stack Breakdown</span>
          </h2>

          <div className="space-y-4">
            {folderStructure.map((folder) => (
              <div key={folder.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm hover:border-slate-700 transition">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1.5 bg-slate-800 rounded">
                    {folder.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white">{folder.name}</h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {folder.purpose}
                </p>

                <div className="bg-slate-950/80 rounded-lg p-3 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Key Files inside {folder.name.split(' ')[0]}:
                  </div>
                  {folder.items.map((item, idx) => {
                    const [fileName, fileDesc] = item.split(' - ');
                    return (
                      <div key={idx} className="text-xs flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 gap-1 pt-1 border-t border-slate-900 first:border-0 first:pt-0">
                        <span className="font-mono text-indigo-300 font-medium shrink-0">{fileName}</span>
                        <span className="text-[11px] text-slate-400 text-left sm:text-right">{fileDesc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
