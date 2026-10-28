import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, AlertTriangle, Clock, XCircle, Calculator, BookOpen } from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');

  const complianceList = [
    { id: 1, appNo: 'AP0025/001', requirement: 'Faculty Qualification', status: 'Compliant', dueDate: '-', reference: 'AICTE Handbook 2024-27' },
    { id: 2, appNo: 'AP0025/001', requirement: 'Land & Building Documents', status: 'Missing', dueDate: '20 May 2025', reference: 'Chapter 6.2' },
    { id: 3, appNo: 'AP0025/002', requirement: 'Financial Statement', status: 'Due Soon', dueDate: '25 May 2025', reference: 'Chapter 7.1' },
    { id: 4, appNo: 'AP0025/003', requirement: 'Affiliation Certificate', status: 'Compliant', dueDate: '-', reference: 'Chapter 5.3' },
    { id: 5, appNo: 'AP0025/003', requirement: 'EVC Report', status: 'Overdue', dueDate: '10 May 2025', reference: 'Chapter 8.2' },
    { id: 6, appNo: 'AP0025/004', requirement: 'Fire Safety NOC', status: 'Compliant', dueDate: '-', reference: 'Chapter 4.1' },
    { id: 7, appNo: 'AP0025/005', requirement: 'CAD/CAM Lab Verification', status: 'Due Soon', dueDate: '30 May 2025', reference: 'Chapter 6.5' }
  ];

  const filteredItems = complianceList.filter(item => {
    const matchesSearch = item.appNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.requirement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-[#1e3a8a]" />
            <span>Compliance Monitoring</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track requirements and due dates based on AICTE Approval Process Handbook
          </p>
        </div>
      </div>

      {/* Filter Bar matching Image 2 Middle-Center */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by application or institution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-8 text-slate-800 focus:outline-none focus:border-blue-600 font-mono"
          />
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Status</option>
          <option value="Compliant">Compliant</option>
          <option value="Missing">Missing</option>
          <option value="Due Soon">Due Soon</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">All Stages</option>
          <option value="Review">Under Review</option>
          <option value="EVC">EVC Inspection</option>
          <option value="Approval">Final Approval</option>
        </select>

        <button className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer shrink-0">
          Search
        </button>
      </div>

      {/* Compliance Table matching Image 2 Middle-Center */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Application No.</th>
                <th className="py-2.5 px-3">Requirement</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">{item.appNo}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{item.requirement}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
                      item.status === 'Compliant' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      item.status === 'Missing' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      item.status === 'Due Soon' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">{item.dueDate}</td>
                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{item.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
