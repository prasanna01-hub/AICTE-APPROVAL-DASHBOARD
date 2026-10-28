import React from 'react';
import { Brain, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export const AIDelayRiskView: React.FC = () => {
  const predictions = [
    { id: 1, appNo: 'AP0025/001', riskLevel: 'High', probability: '78%', factors: 'Missing documents Delay in review' },
    { id: 2, appNo: 'AP0025/002', riskLevel: 'Medium', probability: '52%', factors: 'Pending actions EVC scheduling' },
    { id: 3, appNo: 'AP0025/003', riskLevel: 'Low', probability: '18%', factors: 'On track' },
    { id: 4, appNo: 'AP0025/004', riskLevel: 'Medium', probability: '46%', factors: 'Compliance issues Deadline approaching' },
    { id: 5, appNo: 'AP0025/005', riskLevel: 'Low', probability: '22%', factors: 'Complete' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner matching Image 2 Bottom-Middle-Left */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Brain className="h-6 w-6 text-[#1e3a8a]" />
            <span>AI Delay Prediction</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Predict application delay risk using machine learning models trained on historical AICTE approval bottlenecks
          </p>
        </div>
      </div>

      {/* Table matching Image 2 Bottom-Middle-Left */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="py-2.5 px-3">Application No.</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Probability</th>
                <th className="py-2.5 px-3">Key Factors</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {predictions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-900">{item.appNo}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      item.riskLevel === 'High' ? 'bg-rose-100 text-rose-800' :
                      item.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{item.probability}</td>
                  <td className="py-3 px-3 text-slate-600 font-medium">{item.factors}</td>
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

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Note: Predictions are based on historical data and may not be 100% accurate.</span>
        </div>
      </div>

    </div>
  );
};
