import React, { useState } from 'react';
import { ApplicationItem, UserRole } from '../types';
import { GitCommit, ArrowRight, CheckCircle2, Clock, PlusCircle, Building2, UserCheck, AlertTriangle, FileText } from 'lucide-react';

interface WorkflowTrackerProps {
  applications: ApplicationItem[];
  currentRole: any;
  onSubmitNewApp: (data: any) => Promise<void>;
  onAdvanceStage: (id: string, nextStage: string, remarks: string) => Promise<void>;
}

export const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({
  applications,
  currentRole,
  onSubmitNewApp,
  onAdvanceStage
}) => {
  const [selectedAppId, setSelectedAppId] = useState<any>(applications[0]?.id || '1');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  
  // New application form state
  const [institutionName, setInstitutionName] = useState('Apex Institute of Technology & Engineering');
  const [category, setCategory] = useState('Engineering & Technology');
  const [approvalType, setApprovalType] = useState('Extension of Approval (EoA)');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [submitting, setSubmitting] = useState(false);

  // Stage advance state
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitNewApp({
        institutionName,
        category,
        approvalType,
        academicYear
      });
      setShowNewModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStageAdvance = async (nextStage: string) => {
    if (!selectedApp) return;
    setUpdating(true);
    try {
      await onAdvanceStage(String(selectedApp.id), nextStage, remarks || `Approved stage transition to ${nextStage}`);
      setRemarks('');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const stages = [
    { key: 'SUBMITTED', label: '1. Submitted by Institution', desc: 'Application & Proof Docs Uploaded' },
    { key: 'REGIONAL_SCRUTINY', label: '2. Regional Scrutiny', desc: 'AICTE Regional Office Document Verification' },
    { key: 'COMMITTEE_VERIFICATION', label: '3. Scrutiny Committee', desc: 'Expert Committee & Physical Audit' },
    { key: 'APPELLATE_REVIEW', label: '4. Standing Appellate Review', desc: 'Grievance / Appeal Hearing' },
    { key: 'APPROVED', label: '5. AICTE Final Approval', desc: 'Extension of Approval (EoA) Issued' }
  ];

  const getStageIndex = (stageKey: string) => {
    return stages.findIndex(s => s.key === stageKey);
  };

  const currentStageIndex = selectedApp ? getStageIndex(selectedApp.currentStage) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitCommit className="h-5 w-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">AICTE Approval Workflow Automation</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Automated multi-stage approval state machine tracking institutional applications from submission through Regional Office scrutiny, Scrutiny Committee review, and final AICTE approval issuance.
          </p>
        </div>

        {(currentRole === 'INSTITUTE_ADMIN' || currentRole === 'SYSTEM_ADMIN') && (
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-lg shadow-md hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Submit New AICTE Application</span>
          </button>
        )}
      </div>

      {/* Main Grid: Application List + Workflow State View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of Applications */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Institutional Applications ({applications.length})
          </h2>

          <div className="space-y-2">
            {applications.map((app) => {
              const isSelected = app.id === selectedAppId;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-600/80 shadow-md'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-300">{app.applicationNumber}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {app.currentStage.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-1 truncate">{app.institutionName}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{app.approvalType}</span>
                    <span className="text-emerald-400 font-mono font-medium">{app.predictedApprovalProb}% Approval Prob</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Workflow Stage Visualizer & Action Panel */}
        {selectedApp && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selected Application Meta */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-indigo-400">{selectedApp.applicationNumber}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Academic Year {selectedApp.academicYear}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-0.5">{selectedApp.institutionName}</h2>
                  <p className="text-xs text-slate-400">{selectedApp.category} | State: {selectedApp.state}</p>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-right">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase">AI Probability Score</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono">{selectedApp.predictedApprovalProb}%</div>
                  <div className="text-[10px] text-slate-400">Deficiency Score: {selectedApp.deficiencyScore}%</div>
                </div>
              </div>

              {/* Multi-Stage Visual Pipeline */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Approval Workflow State Pipeline
                </h3>

                <div className="space-y-3">
                  {stages.map((stg, idx) => {
                    const isPassed = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div
                        key={stg.key}
                        className={`flex items-start space-x-3 p-3 rounded-lg border transition ${
                          isCurrent
                            ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/30 border-blue-500/80 shadow-inner'
                            : isPassed
                            ? 'bg-slate-950/80 border-slate-800 text-slate-400'
                            : 'bg-slate-950/30 border-slate-800/50 opacity-60'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isPassed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          ) : isCurrent ? (
                            <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {idx + 1}
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isCurrent ? 'text-white' : isPassed ? 'text-slate-300' : 'text-slate-500'}`}>
                              {stg.label}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                ACTIVE STAGE
                              </span>
                            )}
                            {isPassed && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400">
                                PASSED
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{stg.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Committee Remarks & Advance Stage Action Box */}
              {(currentRole === 'AICTE_REGIONAL_OFFICER' || currentRole === 'SCRUTINY_COMMITTEE' || currentRole === 'SYSTEM_ADMIN') && currentStageIndex < stages.length - 1 && (
                <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-indigo-900/50 space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold">
                    <UserCheck className="h-4 w-4" />
                    <span>Committee Action: Advance Workflow Stage for {selectedApp.applicationNumber}</span>
                  </div>

                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter official committee review remarks, compliance verifications, or deficiency notices..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-16"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Next Stage: <strong className="text-white font-mono">{stages[currentStageIndex + 1]?.label}</strong>
                    </span>
                    <button
                      disabled={updating}
                      onClick={() => handleStageAdvance(stages[currentStageIndex + 1]?.key)}
                      className="flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow transition disabled:opacity-50 cursor-pointer"
                    >
                      <span>Approve & Advance Stage</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Submit New Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-indigo-400" />
              <span>Submit New AICTE Approval Application</span>
            </h2>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Institution Name</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Institution Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Management">Management</option>
                  <option value="Architecture & Planning">Architecture & Planning</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Approval Type</label>
                <select
                  value={approvalType}
                  onChange={(e) => setApprovalType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                  <option value="Increase in Approved Intake">Increase in Approved Intake</option>
                  <option value="New Course Addition">New Course Addition</option>
                  <option value="Establishment of New Institution">Establishment of New Institution</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
