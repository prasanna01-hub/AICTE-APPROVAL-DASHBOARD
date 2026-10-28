import React from 'react';
import { FolderArchive, FileCheck, ShieldCheck, HardDrive, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const DocStorageViewer: React.FC = () => {
  const sampleDocs = [
    {
      type: 'LAND_USE_CERTIFICATE',
      name: 'Apex_Institute_Land_NOC_2026.pdf',
      size: '2.45 MB',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      verified: true,
      path: '/uploads/documents/Apex_Institute_Land_NOC_2026.pdf'
    },
    {
      type: 'FIRE_SAFETY_NOC',
      name: 'Fire_Safety_NOC_Renewal_2026.pdf',
      size: '1.82 MB',
      checksum: 'a2f981249c12b3991209e812ab34d2819230e3812903120b3921092309102931',
      verified: true,
      path: '/uploads/documents/Fire_Safety_NOC_Renewal_2026.pdf'
    },
    {
      type: 'FACULTY_CADRE_LIST',
      name: 'AALA_Faculty_Cadre_Matrix.xlsx',
      size: '0.98 MB',
      checksum: '312903120b3921092309102931a2f981249c12b3991209e812ab34d2819230e',
      verified: false,
      path: '/uploads/documents/AALA_Faculty_Cadre_Matrix.xlsx'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <FolderArchive className="h-6 w-6 text-teal-400" />
          <h1 className="text-xl font-bold text-white">Secure Document Vault Structure</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Encrypted document storage structure for storing institutional proof documents (Land NOC, Fire NOC, Building Stability, Faculty Matrix). Verified via cryptographic hash checksums.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Storage Metadata */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center space-x-2">
            <HardDrive className="h-4 w-4 text-teal-400" />
            <span>Document Repository Settings</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Directory Storage Path</div>
              <div className="font-mono text-teal-300 font-medium text-xs mt-0.5">`./uploads/documents`</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Max File Upload Size</div>
              <div className="font-mono text-slate-200 font-bold text-xs mt-0.5">10 MB Per Document</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Allowed Formats</div>
              <div className="font-mono text-slate-200 font-bold text-xs mt-0.5">PDF, PNG, JPEG, ZIP, XLSX</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center space-x-2 text-emerald-400">
              <Lock className="h-4 w-4 shrink-0" />
              <span className="font-medium text-xs">256-bit SHA Checksum Integrity Active</span>
            </div>
          </div>
        </div>

        {/* Right Col: Document List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Uploaded Proof Documents Vault ({sampleDocs.length})
          </h2>

          <div className="space-y-3">
            {sampleDocs.map((doc, idx) => (
              <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="h-5 w-5 text-teal-400" />
                    <div>
                      <div className="font-semibold text-xs text-slate-200">{doc.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{doc.type} | {doc.size}</div>
                    </div>
                  </div>

                  {doc.verified ? (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>HASH VERIFIED</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      PENDING AUDIT
                    </span>
                  )}
                </div>

                <div className="p-2 bg-slate-900/80 rounded border border-slate-800 font-mono text-[10px] text-slate-400 truncate">
                  SHA256: {doc.checksum}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
