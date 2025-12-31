import React from 'react';
import { X, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-dark border border-cyan-900/30 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-cyan-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${stage.color}30` }}
            >
              <Shield className="w-5 h-5" style={{ color: stage.color }} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{stage.name}</h3>
              <p className="text-xs text-gray-400">Kill Chain Stage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Status Banner */}
          {threat && (
            <div
              className={`p-3 rounded-lg flex items-center gap-3 ${
                isBlocked
                  ? 'bg-green-900/20 border border-green-500/30'
                  : isDetected
                  ? 'bg-red-900/20 border border-red-500/30'
                  : 'bg-gray-800/50 border border-gray-700'
              }`}
            >
              {isBlocked ? (
                <>
                  <CheckCircle className="w-5 h-5 text-cyber-green" />
                  <span className="text-cyber-green font-medium">Attack blocked at this stage</span>
                </>
              ) : isDetected ? (
                <>
                  <AlertTriangle className="w-5 h-5 text-cyber-red" />
                  <span className="text-cyber-red font-medium">Threat detected at this stage</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400">No activity detected</span>
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Description</h4>
            <p className="text-sm text-gray-400">{stage.description}</p>
          </div>

          {/* Evidence (if threat is selected and detected) */}
          {threat && stageProgress?.evidence && stageProgress.evidence.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Evidence</h4>
              <ul className="space-y-1">
                {stageProgress.evidence.map((ev, idx) => (
                  <li key={idx} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyber-blue rounded-full"></span>
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mitigations */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Recommended Mitigations</h4>
            <ul className="space-y-2">
              {stage.mitigations.map((mitigation, idx) => (
                <li
                  key={idx}
                  className="text-sm text-gray-400 flex items-start gap-2 p-2 bg-gray-800/30 rounded"
                >
                  <CheckCircle className="w-4 h-4 text-cyber-green flex-shrink-0 mt-0.5" />
                  {mitigation}
                </li>
              ))}
            </ul>
          </div>

          {/* Timestamp */}
          {stageProgress?.timestamp && (
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-800">
              Detected: {stageProgress.timestamp.toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StageDetails;
