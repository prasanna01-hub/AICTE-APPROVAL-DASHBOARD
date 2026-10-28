import React, { useState } from 'react';
import { FileText, Plus, Search, Download, Upload, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export const DocumentVaultView: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docName, setDocName] = useState('Affiliation Certificate');
  const [appNo, setAppNo] = useState('AP0025/001');
  const [validTill, setValidTill] = useState('2026-12-31');

  const [docsList, setDocsList] = useState([
    { id: 1, name: 'Affiliation Certificate', appNo: 'AP0025/001', status: 'Valid', validTill: '31 Dec 2026', action: 'Download' },
    { id: 2, name: 'Land & Building Docs', appNo: 'AP0025/001', status: 'Missing', validTill: '-', action: 'Upload' },
    { id: 3, name: 'Faculty List', appNo: 'AP0025/002', status: 'Valid', validTill: '31 Dec 2026', action: 'Download' },
    { id: 4, name: 'Financial Statement', appNo: 'AP0025/003', status: 'Expiring Soon', validTill: '15 Jun 2025', action: 'View' },
    { id: 5, name: 'EVC Report', appNo: 'AP0025/004', status: 'Valid', validTill: '30 Nov 2026', action: 'Download' }
  ]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDocsList(prev => [
      ...prev,
      {
        id: Date.now(),
        name: docName,
        appNo: appNo,
        status: 'Valid',
        validTill: new Date(validTill).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        action: 'Download'
      }
    ]);
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner matching Image 2 Bottom-Left */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="h-6 w-6 text-[#1e3a8a]" />
            <span>Documents</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage and track application documents
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Upload Document</span>
        </button>
      </div>

      {/* Filter Bar matching Image 2 Bottom-Left */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none w-full sm:w-auto">
          <option value="ALL">All Applications</option>
          <option value="AP0025/001">AP0025/001</option>
          <option value="AP0025/002">AP0025/002</option>
        </select>

        <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none w-full sm:w-auto">
          <option value="ALL">All Status</option>
          <option value="Valid">Valid</option>
          <option value="Missing">Missing</option>
          <option value="Expiring Soon">Expiring Soon</option>
        </select>

        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 pl-8 text-slate-800 focus:outline-none focus:border-blue-600 font-mono"
          />
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-3" />
        </div>
      </div>

      {/* Table matching Image 2 Bottom-Left */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Document Name</th>
                <th className="py-2.5 px-3">Application No.</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Valid Till</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {docsList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">{item.appNo}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      item.status === 'Valid' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Missing' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">{item.validTill}</td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-semibold transition cursor-pointer">
                      {item.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 text-slate-800 text-xs">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Upload className="h-5 w-5 text-blue-900" />
              <span>Upload Document</span>
            </h2>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Document Title</label>
                <select
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                >
                  <option value="Affiliation Certificate">Affiliation Certificate</option>
                  <option value="Land & Building Docs">Land & Building Docs</option>
                  <option value="Faculty List">Faculty List</option>
                  <option value="Financial Statement">Financial Statement</option>
                  <option value="EVC Report">EVC Report</option>
                </select>
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
                <label className="block text-slate-600 mb-1 font-medium">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={validTill}
                  onChange={(e) => setValidTill(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">File Attachment (PDF / PNG / JPG)</label>
                <input
                  type="file"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:outline-none text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg font-semibold shadow-sm cursor-pointer"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
