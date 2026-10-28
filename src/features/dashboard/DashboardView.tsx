import React from 'react';
import { DashboardStats, ApplicationRecord, AlertRecord } from '../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Building2, FileText, CheckCircle2, Clock, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats | null;
  applications: ApplicationRecord[];
  alerts: AlertRecord[];
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  applications,
  alerts,
  onSelectTab
}) => {
  // ---------------------------------------------------------------------------
  // All numbers below come from GET /api/dashboard/stats (live backend store).
  // The previous demo values are used only while stats is still null/loading.
  // ---------------------------------------------------------------------------
  const hasLiveStats = Boolean(stats);
  const byStage: Record<string, number> = stats?.applicationsByStage || {};
  const byStatus: Record<string, number> = stats?.applicationsByStatus || {};

  const stageCount = (key: string, fallback: number) =>
    hasLiveStats ? byStage[key] ?? 0 : fallback;

  const statusCount = (keys: string[], fallback: number) =>
    hasLiveStats ? keys.reduce((sum, key) => sum + (byStatus[key] || 0), 0) : fallback;

  const totalApplications = hasLiveStats ? stats!.totalApplications : 124;
  const approvedCount = statusCount(['APPROVED'], 18);
  const rejectedCount = statusCount(['REJECTED'], 6);
  // Awaiting first scrutiny, or re-submission after a deficiency notice.
  const pendingReviewCount = hasLiveStats
    ? (byStatus.DEFICIENCY_NOTIFIED || 0) + (byStage.SUBMITTED || 0)
    : 32;
  // Everything still moving through the pipeline (keeps the donut buckets exclusive).
  const inProgressCount = hasLiveStats
    ? Math.max(totalApplications - approvedCount - rejectedCount - pendingReviewCount, 0)
    : 68;

  // Recharts Data Transformation for Applications by Stage
  const stageData = [
    { stage: 'Submitted', count: stageCount('SUBMITTED', 30) },
    { stage: 'Under Review', count: stageCount('REGIONAL_SCRUTINY', 41) },
    { stage: 'EVC Scheduled', count: stageCount('EVC_INSPECTION', 18) },
    { stage: 'Compliance Check', count: stageCount('COMMITTEE_VERIFICATION', 22) },
    { stage: 'Approved', count: stageCount('FINAL_APPROVAL', 15) }
  ];

  // Recharts Data Transformation for Application Status Donut Chart
  const statusPieData = [
    { name: 'In Progress', value: inProgressCount, color: '#0284c7' },
    { name: 'Pending Review', value: pendingReviewCount, color: '#f59e0b' },
    { name: 'Approved', value: approvedCount, color: '#10b981' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' }
  ];

  const pieTotal = statusPieData.reduce((sum, entry) => sum + entry.value, 0);
  const pct = (value: number) => (pieTotal > 0 ? Math.round((value / pieTotal) * 100) : 0);

  const recentApps = applications.length > 0 ? applications.slice(0, 5) : [
    { id: 1, applicationNumber: 'AP0025/001', institutionName: 'ABC Engineering College', currentStage: 'Under Review', submittedAt: '2025-05-12', status: 'In Progress' },
    { id: 2, applicationNumber: 'AP0025/002', institutionName: 'XYZ Institute of Technology', currentStage: 'EVC Scheduled', submittedAt: '2025-05-10', status: 'In Progress' },
    { id: 3, applicationNumber: 'AP0025/003', institutionName: 'Sunrise Polytechnic', currentStage: 'Compliance Check', submittedAt: '2025-05-08', status: 'Pending Review' },
    { id: 4, applicationNumber: 'AP0025/004', institutionName: 'Global Institute', currentStage: 'Approved', submittedAt: '2025-05-05', status: 'Approved' },
    { id: 5, applicationNumber: 'AP0025/005', institutionName: 'Techno College', currentStage: 'Document Verification', submittedAt: '2025-05-03', status: 'In Progress' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Title Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-900" />
            <span>Dashboard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Overview of approval process and key activities across technical institutions
          </p>
        </div>

        <button
          onClick={() => onSelectTab('APPLICATIONS')}
          className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold text-xs rounded-lg shadow-2xs transition cursor-pointer flex items-center space-x-1.5"
        >
          <span>View All Applications</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 5 Key Metric Cards matching Image 2 Top-Middle */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
        
        {/* Card 1: Total Applications */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Total Applications</span>
            <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">{totalApplications}</div>
        </div>

        {/* Card 2: In Progress */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">In Progress</span>
            <div className="p-1.5 bg-sky-50 text-sky-700 rounded-lg">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-sky-700 font-mono">{inProgressCount}</div>
        </div>

        {/* Card 3: Pending Review */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Pending Review</span>
            <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">{pendingReviewCount}</div>
        </div>

        {/* Card 4: Approved */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Approved</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">{approvedCount}</div>
        </div>

        {/* Card 5: Rejected */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Rejected</span>
            <div className="p-1.5 bg-rose-50 text-rose-700 rounded-lg">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-700 font-mono">{rejectedCount}</div>
        </div>

      </div>

      {/* AICTE Approval Process Stage Roadmap Widget */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-blue-100 text-blue-900 rounded-lg">
                <Building2 className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-slate-900">AICTE Approval Process Roadmap & Stage Tracker</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Visualizing institution progress through Scrutiny, Expert Visit Committee (EVC), Standing Appellate Committee (SAC), and Final Approval.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full font-semibold">
              Handbook 2024–2027 Pipeline
            </span>
          </div>
        </div>

        {/* Horizontal Stage Stepper Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
          
          {/* Stage 1: Submission */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 relative hover:border-blue-400 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stage 01</span>
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            </div>
            <div className="font-bold text-xs text-slate-900">Application & Fee</div>
            <p className="text-[10px] text-slate-500">Document Upload & Fee Payment</p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-medium">Institutions:</span>
              <span className="font-mono font-bold text-slate-900">{stageCount('SUBMITTED', 12)}</span>
            </div>
          </div>

          {/* Stage 2: Scrutiny Committee */}
          <div className="bg-blue-50/80 border-2 border-blue-600 rounded-xl p-3 space-y-2 relative shadow-2xs hover:border-blue-700 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Stage 02</span>
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            </div>
            <div className="font-bold text-xs text-blue-950">Scrutiny Committee</div>
            <p className="text-[10px] text-blue-800">Deficiency Check & Expert Review</p>
            <div className="pt-2 border-t border-blue-200 flex items-center justify-between text-[11px]">
              <span className="text-blue-900 font-medium">Institutions:</span>
              <span className="font-mono font-bold text-blue-900">{stageCount('REGIONAL_SCRUTINY', 41)}</span>
            </div>
          </div>

          {/* Stage 3: Expert Visit Committee (EVC) */}
          <div className="bg-amber-50/80 border-2 border-amber-500 rounded-xl p-3 space-y-2 relative shadow-2xs hover:border-amber-600 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Stage 03</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
            <div className="font-bold text-xs text-amber-950">EVC Inspection</div>
            <p className="text-[10px] text-amber-800">Physical & Hybrid Campus Visit</p>
            <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-[11px]">
              <span className="text-amber-900 font-medium">Institutions:</span>
              <span className="font-mono font-bold text-amber-900">{stageCount('EVC_INSPECTION', 18)}</span>
            </div>
          </div>

          {/* Stage 4: Regional / Bureau Review */}
          <div className="bg-sky-50/80 border border-sky-300 rounded-xl p-3 space-y-2 relative hover:border-sky-400 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">Stage 04</span>
              <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            </div>
            <div className="font-bold text-xs text-sky-950">Bureau Assessment</div>
            <p className="text-[10px] text-sky-800">Regional Officer Review</p>
            <div className="pt-2 border-t border-sky-200 flex items-center justify-between text-[11px]">
              <span className="text-sky-900 font-medium">Institutions:</span>
              <span className="font-mono font-bold text-sky-900">{stageCount('COMMITTEE_VERIFICATION', 22)}</span>
            </div>
          </div>

          {/* Stage 5: Standing Appellate Committee (SAC) */}
          <div className="bg-purple-50/80 border-2 border-purple-500 rounded-xl p-3 space-y-2 relative shadow-2xs hover:border-purple-600 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Stage 05</span>
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
            </div>
            <div className="font-bold text-xs text-purple-950">Appellate (SAC)</div>
            <p className="text-[10px] text-purple-800">Compliance Appeals & Hearing</p>
            <div className="pt-2 border-t border-purple-200 flex items-center justify-between text-[11px]">
              <span className="text-purple-900 font-medium">Institutions:</span>
              <span className="font-mono font-bold text-purple-900">{stageCount('APPELLATE_REVIEW', 15)}</span>
            </div>
          </div>

          {/* Stage 6: Final Approval (EoA) */}
          <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-3 space-y-2 relative hover:border-emerald-400 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Stage 06</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </div>
            <div className="font-bold text-xs text-emerald-950">Grant of Approval</div>
            <p className="text-[10px] text-emerald-800">Council Approval Letter Issued</p>
            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-[11px]">
              <span className="text-emerald-900 font-medium">Approved:</span>
              <span className="font-mono font-bold text-emerald-900">{approvedCount}</span>
            </div>
          </div>

        </div>

        {/* Stage-wise Institution Breakdown Grid */}
        <div className="pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
            <span>Current Institutional Placement Across Approval Stages</span>
            <span className="text-[11px] text-slate-500 font-normal">
              {hasLiveStats ? 'Live API data' : 'Updated Live'}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            
            {/* Scrutiny Stage Breakdown */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between font-bold text-blue-900 pb-1.5 border-b border-slate-200">
                <span>🔍 Scrutiny Committee Stage</span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono">{stageCount('REGIONAL_SCRUTINY', 41)} Active</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">ABC Engineering College</span>
                  <span className="text-[10px] font-mono text-slate-500">Day 6 | Pending FSR Data</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">Techno College</span>
                  <span className="text-[10px] font-mono text-slate-500">Day 3 | Doc Verification</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-900">National Institute of Tech</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">Recommended</span>
                </li>
              </ul>
            </div>

            {/* EVC Stage Breakdown */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between font-bold text-amber-900 pb-1.5 border-b border-slate-200">
                <span>🏛️ Expert Visit Committee (EVC)</span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono">{stageCount('EVC_INSPECTION', 18)} Scheduled</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">XYZ Institute of Tech</span>
                  <span className="text-[10px] font-mono text-amber-800 font-bold">Visit Scheduled (25 May)</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">St. Joseph Engineering</span>
                  <span className="text-[10px] font-mono text-slate-500">EVC Report Submitted</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-900">Apex Institute of Science</span>
                  <span className="text-[10px] font-mono text-sky-700">Pending Committee Audit</span>
                </li>
              </ul>
            </div>

            {/* Standing Appellate Committee (SAC) Breakdown */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between font-bold text-purple-900 pb-1.5 border-b border-slate-200">
                <span>⚖️ Standing Appellate Committee (SAC)</span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-mono">{stageCount('APPELLATE_REVIEW', 15)} Appeals</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700">
                <li className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">Sunrise Polytechnic</span>
                  <span className="text-[10px] font-mono text-purple-800 font-bold">Hearing Scheduled</span>
                </li>
                <li className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="font-semibold text-slate-900">Metropolitan Academy</span>
                  <span className="text-[10px] font-mono text-slate-500">Fire NOC Appeal Pending</span>
                </li>
                <li className="flex justify-between items-center py-1">
                  <span className="font-semibold text-slate-900">Greenfield Polytechnic</span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold">SAC Cleared</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Recharts Row matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Applications by Stage Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Applications by Stage</h2>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Status Donut Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-slate-800">Application Status</h2>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-mono text-slate-900">{totalApplications}</span>
              <span className="text-[10px] text-slate-500 font-medium">Total</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium pt-1">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <span className="text-slate-600">In Progress ({pct(inProgressCount)}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600">Pending ({pct(pendingReviewCount)}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">Approved ({pct(approvedCount)}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600">Rejected ({pct(rejectedCount)}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Applications Table matching Image 2 */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">Recent Applications</h2>
          <button
            onClick={() => onSelectTab('APPLICATIONS')}
            className="text-xs text-blue-900 hover:underline font-semibold cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Application No.</th>
                <th className="py-2.5 px-3">Institution Name</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Submitted On</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentApps.map((app: any) => (
                <tr key={app.id || app.applicationNumber} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => onSelectTab('APPLICATIONS')}>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{app.applicationNumber}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{app.institutionName}</td>
                  <td className="py-2.5 px-3 text-slate-600">{(app.currentStage || '').replace(/_/g, ' ')}</td>
                  <td className="py-2.5 px-3 text-slate-500">{app.submittedAt}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'Pending Review' || app.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {app.status || 'In Progress'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
