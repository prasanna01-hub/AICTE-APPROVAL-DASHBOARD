import React, { useState } from 'react';
import { ApplicationRecord, RoleName } from '../../types';
import { FileText, Search, Plus, ArrowRight, CheckCircle2, Clock, UserCheck, Eye, Building2 } from 'lucide-react';

interface ApplicationListProps {
  applications: ApplicationRecord[];
  userRole: RoleName;
  onSubmitNewApp: (data: any) => Promise<void>;
  onAdvanceStage: (id: number | string, nextStage: string, remarks: string) => Promise<void>;
  onSelectApplicationForDetail: (app: ApplicationRecord) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  applications,
  userRole,
  onSubmitNewApp,
  onAdvanceStage,
  onSelectApplicationForDetail
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(applications[0] || null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [institutionName, setInstitutionName] = useState('ABC Engineering College');
  const [category, setCategory] = useState('Engineering & Technology');
  const [approvalType, setApprovalType] = useState('Extension of Approval (EoA)');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [submitting, setSubmitting] = useState(false);

  const [remarks, setRemarks] = useState('');
  const [advancing, setAdvancing] = useState(false);

  const filteredApps = applications.filter(app => {
    const matchesSearch = (app.applicationNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (app.institutionName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'ALL' || app.currentStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitNewApp({
        institutionName,
        category,
        approvalType,
        academicYear
      });
      setShowSubmitModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdvance = async (nextStage: string) => {
    if (!selectedApp) return;
    setAdvancing(true);
    try {
      await onAdvanceStage(selectedApp.id, nextStage, remarks || `Advanced workflow stage to ${nextStage}`);
      setRemarks('');
    } catch (err) {
      console.error(err);
    } finally {
      setAdvancing(false);
    }
  };

  const stagesList = [
    { key: 'SUBMITTED', label: '1. Application Submitted' },
    { key: 'REGIONAL_SCRUTINY', label: '2. Under Review' },
    { key: 'EVC_INSPECTION', label: '3. EVC Scheduled' },
    { key: 'COMMITTEE_VERIFICATION', label: '4. Compliance Check' },
    { key: 'FINAL_APPROVAL', label: '5. Final Decision' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar matching Image 2 Top-Right */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="h-6 w-6 text-[#1e3a8a]" />
            <span>Applications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage and track institution applications
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ New Application</span>
        </button>
      </div>

      {/* Main Grid: Filterable Table + Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Filterable List */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
          
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 pl-8 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-500 text-[11px] font-medium">Stage Filter:</label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Stages ({applications.length})</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="REGIONAL_SCRUTINY">Under Review</option>
                <option value="EVC_INSPECTION">EVC Scheduled</option>
                <option value="COMMITTEE_VERIFICATION">Compliance Check</option>
                <option value="FINAL_APPROVAL">Final Approval</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {filteredApps.length === 0 ? (
              <div className="p-4 text-center text-slate-500">No applications match filter.</div>
            ) : (
              filteredApps.map((app) => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-900">{app.applicationNumber}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                        {(app.currentStage || '').replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-900 mt-1 truncate">{app.institutionName}</div>
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                      <span>{app.approvalType}</span>
                      <span className="text-emerald-700 font-bold">AY {app.academicYear}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Column: Application Details & Workflow Timeline matching Image 2 Middle-Left */}
        {selectedApp && (
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-blue-900">{selectedApp.applicationNumber}</span>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
                      AY {selectedApp.academicYear}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-0.5">{selectedApp.institutionName}</h2>
                  <p className="text-xs text-slate-500">{selectedApp.category} | Location: Chennai, Tamil Nadu</p>
                </div>

                <button
                  onClick={() => onSelectApplicationForDetail(selectedApp)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold border border-slate-300 transition cursor-pointer flex items-center space-x-1"
                >
                  <Eye className="h-3.5 w-3.5 text-blue-900" />
                  <span>Inspect Full Dossier</span>
                </button>
              </div>

              {/* Application Details Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <div className="text-slate-500 text-[10px]">Application No.</div>
                  <div className="font-mono font-bold text-slate-800">{selectedApp.applicationNumber}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Academic Year</div>
                  <div className="font-mono font-bold text-slate-800">{selectedApp.academicYear}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Course Category</div>
                  <div className="font-semibold text-slate-800">{selectedApp.category}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">Submitted On</div>
                  <div className="font-semibold text-slate-800">{new Date(selectedApp.submittedAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Workflow Pipeline */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Approval Workflow State Machine
                </h3>

                <div className="space-y-2">
                  {stagesList.map((stg, idx) => {
                    const currentIdx = stagesList.findIndex(s => s.key === selectedApp.currentStage);
                    const isPassed = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div
                        key={stg.key}
                        className={`flex items-center justify-between p-3 rounded-lg border text-xs transition ${
                          isCurrent
                            ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold'
                            : isPassed
                            ? 'bg-slate-50 border-slate-200 text-slate-600'
                            : 'bg-white border-slate-100 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isPassed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          ) : isCurrent ? (
                            <Clock className="h-4 w-4 text-amber-600 animate-pulse shrink-0" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                              {idx + 1}
                            </div>
                          )}
                          <span>{stg.label}</span>
                        </div>

                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            Current Stage
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Official Action Form */}
              {(userRole === 'REVIEWING_OFFICIAL' || userRole === 'ADMINISTRATOR') && selectedApp.currentStage !== 'FINAL_APPROVAL' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-blue-200 space-y-3 mt-4">
                  <div className="flex items-center space-x-2 text-blue-900 text-xs font-bold">
                    <UserCheck className="h-4 w-4" />
                    <span>Review Official Action: Advance Stage</span>
                  </div>

                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter official committee review remarks or handbook compliance verification..."
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 h-16"
                  />

                  <div className="flex items-center justify-end space-x-2">
                    <button
                      disabled={advancing}
                      onClick={() => {
                        const currentIdx = stagesList.findIndex(s => s.key === selectedApp.currentStage);
                        if (currentIdx < stagesList.length - 1) {
                          handleAdvance(stagesList[currentIdx + 1].key);
                        }
                      }}
                      className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold text-xs rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer flex items-center space-x-1.5"
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

      {/* Submit Application Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 text-slate-800">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-blue-900" />
              <span>Submit New Application</span>
            </h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Institution Name</label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Engineering & Technology">Engineering & Technology</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Management">Management</option>
                  <option value="Architecture">Architecture</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Approval Type</label>
                <select
                  value={approvalType}
                  onChange={(e) => setApprovalType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                  <option value="New Course Addition">New Course Addition</option>
                  <option value="Increase in Approved Intake">Increase in Approved Intake</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg font-semibold shadow-sm cursor-pointer disabled:opacity-50"
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
