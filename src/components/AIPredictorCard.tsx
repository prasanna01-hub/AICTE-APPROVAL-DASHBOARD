import React, { useState } from 'react';
import { MLPredictionResponse } from '../types';
import { BrainCircuit, Cpu, AlertTriangle, ShieldCheck, Sparkles, RefreshCw, BarChart2 } from 'lucide-react';

interface AIPredictorCardProps {
  onPredict: (data: any) => Promise<{ success: boolean; source: string; data: MLPredictionResponse } | null>;
}

export const AIPredictorCard: React.FC<AIPredictorCardProps> = ({ onPredict }) => {
  const [totalIntake, setTotalIntake] = useState<number>(480);
  const [facultyCount, setFacultyCount] = useState<number>(32);
  const [totalLandAcres, setTotalLandAcres] = useState<number>(5.5);
  const [cadLabsCount, setCadLabsCount] = useState<number>(4);
  const [fireSafetyCert, setFireSafetyCert] = useState<boolean>(true);
  const [buildingSafetyCert, setBuildingSafetyCert] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<MLPredictionResponse | null>(null);
  const [predictionSource, setPredictionSource] = useState<string>('');

  const handleRunPrediction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await onPredict({
        totalIntake,
        facultyCount,
        totalLandAcres,
        cadLabsCount,
        fireSafetyCert,
        buildingSafetyCert
      });
      if (res && res.data) {
        setPrediction(res.data);
        setPredictionSource(res.source || 'Python FastAPI Microservice');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleRunPrediction();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <BrainCircuit className="h-6 w-6 text-purple-400" />
          <h1 className="text-xl font-bold text-white">AI / Machine Learning Deficiency & Approval Risk Predictor</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Powered by Python FastAPI + Scikit-Learn decision models. Predicts AICTE approval probability, calculates deficiency score %, and flags critical non-compliance risks before official inspection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Interactive Feature Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-semibold text-slate-200">ML Model Feature Inputs</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Scikit-learn Model
            </span>
          </div>

          <form onSubmit={handleRunPrediction} className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Student Intake</span>
                <span className="font-mono text-purple-300 font-bold">{totalIntake} Students</span>
              </div>
              <input
                type="range"
                min="60"
                max="1800"
                step="60"
                value={totalIntake}
                onChange={(e) => setTotalIntake(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Qualified Faculty</span>
                <span className="font-mono text-purple-300 font-bold">{facultyCount} Faculty</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="1"
                value={facultyCount}
                onChange={(e) => setFacultyCount(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>Land Area (Acres)</span>
                <span className="font-mono text-purple-300 font-bold">{totalLandAcres} Acres</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="20.0"
                step="0.5"
                value={totalLandAcres}
                onChange={(e) => setTotalLandAcres(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1">
                <span>CAD/CAM Labs</span>
                <span className="font-mono text-purple-300 font-bold">{cadLabsCount} Labs</span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={cadLabsCount}
                onChange={(e) => setCadLabsCount(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fireSafetyCert}
                  onChange={(e) => setFireSafetyCert(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0"
                />
                <span>Fire Safety Certificate Status</span>
              </label>

              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={buildingSafetyCert}
                  onChange={(e) => setBuildingSafetyCert(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0"
                />
                <span>Building Safety Certificate Status</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow transition cursor-pointer flex items-center justify-center space-x-2 text-xs"
            >
              <Cpu className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Predict Approval Probability (FastAPI API)</span>
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Output Dashboard */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-semibold text-slate-200">ML Prediction Output</h2>
            {predictionSource && (
              <span className="text-[10px] text-slate-400 font-mono">
                Source: {predictionSource}
              </span>
            )}
          </div>

          {prediction ? (
            <div className="space-y-4">
              
              {/* Approval Probability Score Arc */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-2">
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Predicted AICTE Approval Probability
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <span className={`text-4xl font-extrabold font-mono ${
                    (prediction.approval_probability || 0) >= 80 ? 'text-emerald-400' : (prediction.approval_probability || 0) >= 60 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {prediction.approval_probability || 0}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      (prediction.approval_probability || 0) >= 80 ? 'bg-emerald-500' : (prediction.approval_probability || 0) >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${prediction.approval_probability || 0}%` }}
                  ></div>
                </div>

                <div className="mt-2 text-xs text-slate-300 font-medium">
                  {prediction.recommendation}
                </div>
              </div>

              {/* Identified Deficiencies List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Identified Deficiency Bottlenecks ({(prediction.deficiencies || []).length})
                </div>

                {!(prediction.deficiencies) || prediction.deficiencies.length === 0 ? (
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>No critical deficiencies identified by ML model! High probability of instant EoA approval.</span>
                  </div>
                ) : (
                  (prediction.deficiencies || []).map((def: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{def.category}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          def.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {def.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{def.message}</p>
                    </div>
                  ))
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">Evaluating ML model features...</div>
          )}

        </div>

      </div>

    </div>
  );
};
