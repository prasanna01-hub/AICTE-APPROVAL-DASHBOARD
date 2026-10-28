import React, { useState } from 'react';
import { CalendarDays, Plus, Search, Users, CheckCircle2, Clock } from 'lucide-react';

export const EVCManagementView: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [institutionName, setInstitutionName] = useState('ABC Engineering College');
  const [appNo, setAppNo] = useState('AP0025/001');
  const [visitDate, setVisitDate] = useState('2025-05-20');
  const [membersCount, setMembersCount] = useState(3);

  const [evcList, setEvcList] = useState([
    { id: 1, date: '20 May 2025', institution: 'ABC Engineering College', appNo: 'AP0025/001', status: 'Scheduled', members: 3 },
    { id: 2, date: '25 May 2025', institution: 'XYZ Institute of Technology', appNo: 'AP0025/002', status: 'In Progress', members: 4 },
    { id: 3, date: '28 May 2025', institution: 'Sunrise Polytechnic', appNo: 'AP0025/003', status: 'Pending', members: 3 },
    { id: 4, date: '02 Jun 2025', institution: 'Global Institute', appNo: 'AP0025/004', status: 'Completed', members: 5 },
    { id: 5, date: '10 Jun 2025', institution: 'Techno College', appNo: 'AP0025/005', status: 'Scheduled', members: 3 }
  ]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEvcList(prev => [
      ...prev,
      {
        id: Date.now(),
        date: new Date(visitDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        institution: institutionName,
        appNo: appNo,
        status: 'Scheduled',
        members: membersCount
      }
    ]);
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner matching Image 2 Middle-Right */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-[#1e3a8a]" />
            <span>EVC Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule and track expert visit committee activities
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Schedule EVC</span>
        </button>
      </div>

      {/* Filter Bar matching Image 2 Middle-Right */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none w-full sm:w-auto">
          <option value="ALL">All Status</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>

        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none w-full sm:w-auto">
          <option value="ALL">All Institutions</option>
          <option value="ABC">ABC Engineering College</option>
          <option value="XYZ">XYZ Institute of Technology</option>
        </select>

        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono text-[11px] w-full sm:w-auto">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <span>dd/mm/yyyy - dd/mm/yyyy</span>
        </div>

        <button className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer shrink-0">
          Search
        </button>
      </div>

      {/* Table matching Image 2 Middle-Right */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Institution</th>
                <th className="py-2.5 px-3">Application No.</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Members</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {evcList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-medium text-slate-700">{item.date}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{item.institution}</td>
                  <td className="py-3 px-3 font-mono text-blue-900 font-bold">{item.appNo}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      item.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'In Progress' ? 'bg-sky-100 text-sky-800' :
                      item.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">{item.members}</td>
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

      {/* Schedule EVC Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 text-slate-800 text-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-blue-900" />
              <span>Schedule Expert Visit Committee (EVC)</span>
            </h2>

            <form onSubmit={handleScheduleSubmit} className="space-y-3">
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
                <label className="block text-slate-600 mb-1 font-medium">Application No.</label>
                <input
                  type="text"
                  required
                  value={appNo}
                  onChange={(e) => setAppNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Scheduled Visit Date</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Committee Members Count</label>
                <input
                  type="number"
                  min="2"
                  max="7"
                  value={membersCount}
                  onChange={(e) => setMembersCount(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg font-semibold shadow-sm cursor-pointer"
                >
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
