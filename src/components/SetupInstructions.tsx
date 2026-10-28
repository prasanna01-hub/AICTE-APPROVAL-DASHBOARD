import React, { useState } from 'react';
import { Terminal, CheckSquare, Copy, Check, Play, Server, Cpu, Database, HelpCircle } from 'lucide-react';

export const SetupInstructions: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const windowsSteps = [
    {
      title: "1. Clone or Download Project Repository",
      cmd: "git clone https://github.com/your-org/aicte-workflow-automation.git\ncd aicte-workflow-automation",
      desc: "Open Command Prompt (cmd) or PowerShell on Windows and navigate into the project folder."
    },
    {
      title: "2. Install Node.js Dependencies (Frontend & Express Backend)",
      cmd: "npm install",
      desc: "Installs React, Express, Vite, Lucide-React, Recharts, and TypeScript packages."
    },
    {
      title: "3. Prepare Environment Variables (.env)",
      cmd: "copy .env.example .env",
      desc: "Creates your local .env configuration file from .env.example. Update database password if needed."
    },
    {
      title: "4. Setup PostgreSQL Database Schema",
      cmd: "psql -U postgres -d postgres -c \"CREATE DATABASE aicte_workflow_db;\"\npsql -U postgres -d aicte_workflow_db -f database/schema.sql",
      desc: "Executes PostgreSQL DDL script to create tables and insert sample test data."
    },
    {
      title: "5. Setup Python FastAPI AI Microservice",
      cmd: "cd ai_service\npython -m venv venv\nvenv\\Scripts\\activate\npip install -r requirements.txt\nuvicorn main:app --reload --port 8000",
      desc: "Creates a Python virtual environment on Windows, installs FastAPI & Scikit-Learn, and starts the ML microservice on port 8000."
    },
    {
      title: "6. Start Full-Stack Application (Express Server + React Frontend)",
      cmd: "npm run dev",
      desc: "Starts Node.js Express backend and Vite React frontend on port 3000."
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <Terminal className="h-6 w-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-white">Windows Installation & Service Startup Guide</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Simple step-by-step terminal commands and installation sequence to run the Frontend, Express Backend, PostgreSQL, and Python FastAPI ML service on Windows.
        </p>
      </div>

      {/* Windows Step-by-Step Terminal Commands */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <Play className="h-4 w-4 text-emerald-400" />
          <span>Windows Command Prompt / PowerShell Commands</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {windowsSteps.map((step, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-200">{step.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>

              <div className="relative group mt-2">
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 whitespace-pre-wrap overflow-x-auto">
                  {step.cmd}
                </pre>
                <button
                  onClick={() => copyToClipboard(step.cmd, idx)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] transition cursor-pointer"
                  title="Copy command"
                >
                  {copiedIndex === idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist to verify whether each service works */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <CheckSquare className="h-5 w-5 text-indigo-400" />
          <span>Service Verification & Testing Checklist</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-3">
            <span className="p-1 bg-blue-500/10 text-blue-400 rounded font-bold font-mono text-[10px]">1. React UI</span>
            <div className="text-slate-300">
              Open <code className="text-indigo-300 font-mono">http://localhost:3000</code> in your browser. Verify navigation tabs and role switcher render without errors.
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-3">
            <span className="p-1 bg-emerald-500/10 text-emerald-400 rounded font-bold font-mono text-[10px]">2. Express REST</span>
            <div className="text-slate-300">
              Open <code className="text-indigo-300 font-mono">http://localhost:3000/api/health</code>. Verify JSON response with <code className="text-emerald-400 font-mono">"status": "HEALTHY"</code>.
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-3">
            <span className="p-1 bg-purple-500/10 text-purple-400 rounded font-bold font-mono text-[10px]">3. Python FastAPI</span>
            <div className="text-slate-300">
              Open <code className="text-indigo-300 font-mono">http://localhost:8000/docs</code> (Interactive Swagger UI). Execute test POST request to <code className="text-purple-300 font-mono">/predict-approval</code>.
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start space-x-3">
            <span className="p-1 bg-amber-500/10 text-amber-400 rounded font-bold font-mono text-[10px]">4. PostgreSQL</span>
            <div className="text-slate-300">
              Run <code className="text-indigo-300 font-mono">psql -U postgres -d aicte_workflow_db -c "SELECT * FROM institutions;"</code> to confirm seeded rows exist.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
