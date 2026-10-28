import React, { useState } from 'react';
import { SystemHealthData } from '../types';
import { runBackendIntegrationTests } from '../services/api';
import { Server, Database, ShieldCheck, RefreshCw, CheckCircle2, XCircle, Play, FileCode2 } from 'lucide-react';

interface ServiceHealthCardProps {
  healthData: SystemHealthData | null;
  loading: boolean;
  onRefresh: () => void;
}

export const ServiceHealthCard: React.FC<ServiceHealthCardProps> = ({ healthData, loading, onRefresh }) => {
  const [runningTests, setRunningTests] = useState<boolean>(false);
  const [testSuiteResults, setTestSuiteResults] = useState<any>(null);

  const handleRunTests = async () => {
    setRunningTests(true);
    try {
      const res = await runBackendIntegrationTests();
      setTestSuiteResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setRunningTests(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner / Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-xl border border-indigo-900/40 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
              Regulatory Services Gateway: OPERATIONAL
            </span>
            <span className="text-slate-400 text-xs font-mono">
              System Uptime: {healthData?.uptimeSeconds || 0}s
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            AICTE System Gateway & Service Probe
          </h1>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
            Live service health inspector verifying system REST endpoints, handbook compliance rule engines, document checksum verifiers, and automated integration test suites.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleRunTests}
            disabled={runningTests}
            className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Play className={`h-3.5 w-3.5 ${runningTests ? 'animate-spin' : ''}`} />
            <span>Run System Integration Tests</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Service Probe</span>
          </button>
        </div>
      </div>

      {/* 4 Core Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Server className="h-5 w-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              OPERATIONAL
            </span>
          </div>
          <h3 className="font-semibold text-sm text-slate-200">Application API Router</h3>
          <p className="text-xs text-slate-400 mt-1">Workflow State Machine & REST Router</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Database className="h-5 w-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              ACTIVE
            </span>
          </div>
          <h3 className="font-semibold text-sm text-slate-200">Relational Database Engine</h3>
          <p className="text-xs text-slate-400 mt-1">Handbook Rules & Audit Trail Schema</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              ACTIVE
            </span>
          </div>
          <h3 className="font-semibold text-sm text-slate-200">Delay-Risk Analytics Service</h3>
          <p className="text-xs text-slate-400 mt-1">Stage Processing Risk Classifier</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              ENFORCED
            </span>
          </div>
          <h3 className="font-semibold text-sm text-slate-200">RBAC Access Control</h3>
          <p className="text-xs text-slate-400 mt-1">4 Portal Roles & Permissions Matrix</p>
        </div>
      </div>

      {/* Integration Test Suite Results Display */}
      {testSuiteResults && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <FileCode2 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                Automated System Test Results
              </h2>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Passed: {testSuiteResults.passedCount} / {testSuiteResults.totalTests}
              </span>
              {testSuiteResults.failedCount > 0 && (
                <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  Failed: {testSuiteResults.failedCount}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            {testSuiteResults.results?.map((res: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start space-x-2.5">
                  {res.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-slate-200">{res.testName}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{res.details}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 shrink-0">
                  {res.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
