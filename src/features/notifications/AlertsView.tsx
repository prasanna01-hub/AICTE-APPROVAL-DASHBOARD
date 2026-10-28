import React, { useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, FileText, CalendarDays, ShieldAlert, Brain } from 'lucide-react';

export const AlertsView: React.FC = () => {
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');

  const alertsList = [
    { id: 1, type: 'Overdue', message: 'Application AP0025/001 is overdue', relatedApp: 'AP0025/001', date: '15 May 2025', read: false },
    { id: 2, type: 'Document', message: 'Land & Building document expiring soon', relatedApp: 'AP0025/002', date: '20 May 2025', read: false },
    { id: 3, type: 'EVC', message: 'EVC visit scheduled for ABC Engineering College', relatedApp: 'AP0025/003', date: '25 May 2025', read: false },
    { id: 4, type: 'Compliance', message: 'Missing faculty qualification proof', relatedApp: 'AP0025/004', date: '18 May 2025', read: true },
    { id: 5, type: 'AI Risk', message: 'High delay risk predicted by AI model', relatedApp: 'AP0025/005', date: '16 May 2025', read: true }
  ];

  const filteredAlerts = alertsList.filter(a => {
    if (activeFilterTab === 'UNREAD') return !a.read;
    if (activeFilterTab === 'ACKNOWLEDGED') return a.read;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner matching Image 2 Bottom-Right */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-6 w-6 text-[#1e3a8a]" />
            <span>Alerts & Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stay updated with important actions and reminders
          </p>
        </div>

        <button className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition cursor-pointer">
          <CheckCheck className="h-4 w-4 text-emerald-600" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Tabs Filter Bar matching Image 2 Bottom-Right */}
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveFilterTab('ALL')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeFilterTab === 'ALL' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All (12)
          </button>
          <button
            onClick={() => setActiveFilterTab('UNREAD')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeFilterTab === 'UNREAD' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unread (8)
          </button>
          <button
            onClick={() => setActiveFilterTab('ACKNOWLEDGED')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeFilterTab === 'ACKNOWLEDGED' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Acknowledged (2)
          </button>
          <button
            onClick={() => setActiveFilterTab('RESOLVED')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeFilterTab === 'RESOLVED' ? 'bg-[#1e3a8a] text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Resolved (2)
          </button>
        </div>
      </div>

      {/* Table matching Image 2 Bottom-Right */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Message</th>
                <th className="py-2.5 px-3">Related App</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAlerts.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      item.type === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                      item.type === 'Document' ? 'bg-amber-100 text-amber-800' :
                      item.type === 'EVC' ? 'bg-sky-100 text-sky-800' :
                      item.type === 'Compliance' ? 'bg-purple-100 text-purple-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{item.message}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">{item.relatedApp}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{item.date}</td>
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
