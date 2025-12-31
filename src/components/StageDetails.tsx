import React from 'react';
import { X, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { KillChainStage, Threat } from '../types';

interface StageDetailsProps {
  stage: KillChainStage | null;
  threat: Threat | null;
  onClose: () => void;
}

const StageDetails: React.FC<StageDetailsProps> = ({ stage, threat, onClose }) => {
  if (!stage) return null;

  const stageProgress = threat?.stages.find(s => s.stageId === stage.id);
  const isDetected = stageProgress?.detected;
  const isBlocked = stageProgress?.blocked;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div
        className="glass-panel max-w-lg w-full max-h-[80vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  backgroundColor: `${stage.color}20`,
                  boxShadow: `0 0 20px ${stage.color}30`
                }}
              >
                <Shield className="w-6 h-6" style={{ color: stage.color }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{stage.name}</h3>
                <p className="text-sm text-slate-500">Kill Chain Stage</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl glass-panel-sm hover:bg-white/5 transition-all duration-300 group"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Status Banner */}
          {threat && (
            <div
              className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-300 ${
                isBlocked
                  ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30'
                  : isDetected
                  ? 'bg-gradient-to-r from-red-500/20 to-red-500/5 border border-red-500/30'
                  : 'bg-gradient-to-r from-slate-500/20 to-slate-500/5 border border-slate-700/50'
              }`}
            >
              {isBlocked ? (
                <>
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="text-emerald-400 font-semibold">Attack blocked at this stage</span>
                </>
              ) : isDetected ? (
                <>
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <span className="text-red-400 font-semibold">Threat detected at this stage</span>
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg bg-slate-500/20">
                    <Shield className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-slate-400 font-medium">No activity detected</span>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Description</h4>
            <p className="text-sm text-slate-400 leading-relaxed">{stage.description}</p>
          </div>

          {/* Evidence (if threat is selected and detected) */}
          {threat && stageProgress?.evidence && stageProgress.evidence.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Evidence</h4>
              <ul className="space-y-2">
                {stageProgress.evidence.map((ev, idx) => (
                  <li key={idx} className="text-sm text-slate-400 flex items-center gap-3 p-3 glass-panel-sm">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mitigations */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Recommended Mitigations</h4>
            <ul className="space-y-2">
              {stage.mitigations.map((mitigation, idx) => (
                <li
                  key={idx}
                  className="text-sm text-slate-400 flex items-start gap-3 p-3 glass-panel-sm group hover:bg-white/[0.02] transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  {mitigation}
                </li>
              ))}
            </ul>
          </div>

          {/* Timestamp */}
          {stageProgress?.timestamp && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-700/50">
              <Clock className="w-3.5 h-3.5" />
              Detected: {stageProgress.timestamp.toLocaleString()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-medium text-sm
              bg-gradient-to-r from-cyan-500/20 to-blue-500/20
              border border-cyan-500/30 text-cyan-400
              hover:from-cyan-500/30 hover:to-blue-500/30
              hover:shadow-lg hover:shadow-cyan-500/20
              transition-all duration-300"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default StageDetails;
