import React, { useState } from 'react';
import { History, Download, ShieldCheck, Filter, FileText } from 'lucide-react';

export const AuditReportsView: React.FC = () => {
  const [filterType, setFilterType] = useState('ALL');

  const mockAuditLogs = [
    {
      id: 1,
      entityType: 'APPLICATION',
      entityId: 2,
      eventType: 'STAGE_TRANSITION',
      performedBy: 'Er. R. K. Viswanathan (Review Official)',
      changes: 'Advanced stage from REGIONAL_SCRUTINY to EVC_INSPECTION',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 2,
      entityType: 'DOCUMENT',
      entityId: 2,
      eventType: 'DOCUMENT_EXPIRY_DETECTED',
      performedBy: 'SYSTEM_EXPIRY_MONITOR',
      changes: 'Flagged Fire Safety NOC as EXPIRED on 2026-05-01',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 3,
      entityType: 'COMPLIANCE',
      entityId: 1,
      eventType: 'HANDBOOK_RULE_AUDIT',
      performedBy: 'COMPLIANCE_ENGINE',
      changes: 'Evaluated RULE-FSR-115 (1:15 Norm) against Handbook 2024-2027',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ];

  const filteredLogs = mockAuditLogs.filter(l => filterType === 'ALL' || l.entityType === filterType);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <History className="h-6 w-6 text-blue-400" />
            <span>Auditable Activity Trail & Compliance Summary Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Immutable audit logs tracking stage transitions, committee decisions, document upload checksums, and compliance re-evaluations.
          </p>
        </div>

        <button
          onClick={() => alert('Compliance Summary Report generated for download.')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-xs transition cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-semibold text-slate-200">System Activity Audit Trail</h2>

          <div className="flex items-center space-x-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300"
            >
              <option value="ALL">All Event Types</option>
              <option value="APPLICATION">Application</option>
              <option value="DOCUMENT">Document</option>
              <option value="COMPLIANCE">Compliance</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-blue-300">[{log.entityType}] Event #{log.id}</span>
                <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>

              <div className="font-semibold text-slate-200">{(log.eventType || '').replace(/_/g, ' ')}</div>
              <p className="text-[11px] text-slate-400">{log.changes}</p>
              <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
                Performed By: {log.performedBy}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
