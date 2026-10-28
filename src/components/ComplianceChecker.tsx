import React, { useState } from 'react';
import { ComplianceAuditResult } from '../types';
import { Calculator, CheckCircle2, XCircle, AlertTriangle, RefreshCw, ShieldAlert, Award } from 'lucide-react';

interface ComplianceCheckerProps {
  onRunAudit: (data: any) => Promise<ComplianceAuditResult | null>;
}

export const ComplianceChecker: React.FC<ComplianceCheckerProps> = ({ onRunAudit }) => {
  const [totalIntake, setTotalIntake] = useState<number>(480);
  const [facultyCount, setFacultyCount] = useState<number>(32);
  const [totalLandAcres, setTotalLandAcres] = useState<number>(5.5);
  const [cadLabsCount, setCadLabsCount] = useState<number>(4);
  const [fireSafetyValid, setFireSafetyValid] = useState<boolean>(true);
  const [buildingSafetyValid, setBuildingSafetyValid] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<ComplianceAuditResult | null>(null);

  const handleAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await onRunAudit({
        totalIntake,
        facultyCount,
        totalLandAcres,
        cadLabsCount,
        fireSafetyValid,
        buildingSafetyValid
      });
      if (res) setAuditResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial audit on load
  React.useEffect(() => {
    handleAudit();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Calculator className="h-6 w-6 text-indigo-400" />
          <span>AICTE Compliance Audit Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Real-time compliance monitoring tool evaluating institution metrics against official AICTE Approval Process Handbook norms (Faculty Ratio 1:15, Land Acres, CAD Labs, Safety NOCs).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Interactive Metric Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Institutional Intake & Infrastructure Metrics
          </h2>

          <form onSubmit={handleAudit} className="space-y-4 text-xs">
            
            {/* Total Student Intake */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Total Approved Student Intake</span>
                <span className="font-mono text-indigo-300 font-bold">{totalIntake} Students</span>
              </div>
              <input
                type="range"
                min="60"
                max="2400"
                step="60"
                value={totalIntake}
                onChange={(e) => setTotalIntake(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Total Faculty Count */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Qualified Faculty Count</span>
                <span className="font-mono text-indigo-300 font-bold">{facultyCount} Faculty</span>
              </div>
              <input
                type="range"
                min="5"
                max="200"
                step="1"
                value={facultyCount}
                onChange={(e) => setFacultyCount(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                Required for 1:15 norm: {Math.ceil(totalIntake / 15)} Faculty
              </span>
            </div>

            {/* Total Land Acres */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Total Land Area (Acres)</span>
                <span className="font-mono text-indigo-300 font-bold">{totalLandAcres} Acres</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={totalLandAcres}
                onChange={(e) => setTotalLandAcres(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">
                AICTE Rural Norm: 5.0 Acres | Urban Norm: 2.5 Acres
              </span>
            </div>

            {/* CAD Labs Count */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>CAD / CAM Computer Laboratories</span>
                <span className="font-mono text-indigo-300 font-bold">{cadLabsCount} Labs</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={cadLabsCount}
                onChange={(e) => setCadLabsCount(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Safety Certificates Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fireSafetyValid}
                  onChange={(e) => setFireSafetyValid(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Valid Fire Safety NOC Certificate</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={buildingSafetyValid}
                  onChange={(e) => setBuildingSafetyValid(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>Valid Building Stability Certificate (PWD/Chartered)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow transition cursor-pointer flex items-center justify-center space-x-2 text-xs"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Calculate AICTE Compliance Audit</span>
            </button>
          </form>
        </div>

        {/* Right Column: Audit Evaluation Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Compliance Audit Report
          </h2>

          {auditResult ? (
            <div className="space-y-4">
              
              {/* Overall Status Badge */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                auditResult.status === 'FULLY_COMPLIANT'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : auditResult.status === 'PARTIALLY_COMPLIANT'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              }`}>
                <div className="flex items-center space-x-3">
                  {auditResult.status === 'FULLY_COMPLIANT' ? (
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-amber-400" />
                  )}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider">Overall Status</div>
                    <div className="text-base font-bold capitalize">{(auditResult.status || '').replace('_', ' ')}</div>
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <div className="text-slate-400 text-[10px]">Deficiencies Detected</div>
                  <div className="text-lg font-bold">{auditResult.totalDeficiencies}</div>
                </div>
              </div>

              {/* Norms Breakdown List */}
              <div className="space-y-3 text-xs">
                
                {/* 1. Faculty Ratio */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Faculty-Student Ratio (FSR)</div>
                    <div className="text-[11px] text-slate-400">Current: {auditResult.evaluations.facultyStudentRatio.current} | Norm: {auditResult.evaluations.facultyStudentRatio.requiredNorm}</div>
                    {auditResult.evaluations.facultyStudentRatio.facultyDeficit > 0 && (
                      <div className="text-[10px] text-rose-400 mt-0.5">Shortage of {auditResult.evaluations.facultyStudentRatio.facultyDeficit} qualified faculty</div>
                    )}
                  </div>
                  {auditResult.evaluations.facultyStudentRatio.isCompliant ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASS</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">FAIL</span>
                  )}
                </div>

                {/* 2. Land Infrastructure */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Land Area Norm</div>
                    <div className="text-[11px] text-slate-400">Current: {auditResult.evaluations.landInfrastructure.currentAcres} Acres | Required: {auditResult.evaluations.landInfrastructure.requiredAcres} Acres</div>
                  </div>
                  {auditResult.evaluations.landInfrastructure.isCompliant ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASS</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">FAIL</span>
                  )}
                </div>

                {/* 3. CAD Labs */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">CAD/CAM Laboratories</div>
                    <div className="text-[11px] text-slate-400">Current: {auditResult.evaluations.cadLaboratory.currentLabs} Labs | Required: {auditResult.evaluations.cadLaboratory.requiredLabs} Labs</div>
                  </div>
                  {auditResult.evaluations.cadLaboratory.isCompliant ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASS</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">FAIL</span>
                  )}
                </div>

                {/* 4. Safety NOC Certificates */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Fire & Building Safety NOCs</div>
                    <div className="text-[11px] text-slate-400">Fire NOC: {fireSafetyValid ? 'Valid' : 'Expired'} | Building Cert: {buildingSafetyValid ? 'Valid' : 'Missing'}</div>
                  </div>
                  {auditResult.evaluations.safetyCertificates.isCompliant ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PASS</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">FAIL</span>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Loading audit report...</div>
          )}

        </div>

      </div>

    </div>
  );
};
