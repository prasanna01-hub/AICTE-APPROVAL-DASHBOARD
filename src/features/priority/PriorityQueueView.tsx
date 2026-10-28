import React from 'react';
import { Sparkles } from 'lucide-react';

export const PriorityQueueView: React.FC = () => {
  const priorityItems = [
    { id: 1, appNo: 'AP0025/001', score: 92, reason: 'Overdue + High risk', status: 'In Progress' },
    { id: 2, appNo: 'AP0025/002', score: 78, reason: 'EVC pending + Deadline', status: 'In Progress' },
    { id: 3, appNo: 'AP0025/003', score: 65, reason: 'Compliance issues', status: 'Pending' },
    { id: 4, appNo: 'AP0025/004', score: 48, reason: 'Normal', status: 'In Progress' },
    { id: 5, appNo: 'AP0025/005', score: 32, reason: 'On track', status: 'Approved' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner matching Image 2 Bottom-Middle-Right */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-[#1e3a8a]" />
            <span>Smart Priority</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View and manage application priority
          </p>
        </div>
      </div>

      {/* Table matching Image 2 Bottom-Middle-Right */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Application No.</th>
                <th className="py-2.5 px-3">Priority Score</th>
                <th className="py-2.5 px-3">Reason</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {priorityItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">{item.appNo}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 text-[11px] font-extrabold font-mono rounded-full ${
                      item.score >= 75 ? 'bg-rose-100 text-rose-800' :
                      item.score >= 60 ? 'bg-amber-100 text-amber-800' :
                      item.score >= 40 ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.score}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{item.reason}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-semibold transition cursor-pointer">
                      View
                    </button>
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
