import React from 'react';
import { Search, Wrench, Send, Zap, Download, Radio, Target, ArrowRight } from 'lucide-react';
import { KillChainStage, Threat } from '../types';

interface KillChainVisualizationProps {
  stages: KillChainStage[];
  selectedThreat: Threat | null;
  onStageClick: (stageId: string) => void;
}

const iconMap: { [key: string]: React.FC<{ className?: string; style?: React.CSSProperties }> } = {
  Search,
  Wrench,
  Send,
  Zap,
  Download,
  Radio,
  Target
};

const KillChainVisualization: React.FC<KillChainVisualizationProps> = ({
  stages,
  selectedThreat,
  onStageClick
}) => {
  const getStageStatus = (stageId: string) => {
    if (!selectedThreat) return 'inactive';
    const stageProgress = selectedThreat.stages.find(s => s.stageId === stageId);
    if (!stageProgress) return 'inactive';
    if (stageProgress.blocked) return 'blocked';
    if (stageProgress.detected) return 'detected';
    return 'inactive';
  };

  return (
    <div className="glass-panel mx-6 mt-6 p-8 animate-fade-in-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Kill Chain Progression</h2>
          <p className="text-sm text-slate-500 mt-1">
            {selectedThreat ? `Tracking: ${selectedThreat.name}` : 'Select a threat to visualize attack progression'}
          </p>
        </div>
        {selectedThreat && (
          <div className="glass-panel-sm px-4 py-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Current Stage</span>
            <span className="ml-2 text-cyan-400 font-semibold">{selectedThreat.currentStage + 1} / 7</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4 pt-6 px-4">
        {stages.map((stage, index) => {
          const IconComponent = iconMap[stage.icon] || Search;
          const status = getStageStatus(stage.id);
          const isDetected = status === 'detected';
          const isBlocked = status === 'blocked';
          const isInactive = status === 'inactive';

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onStageClick(stage.id)}
                className={`
                  relative flex flex-col items-center min-w-[120px] p-4 pt-6 rounded-2xl
                  transition-all duration-300 group overflow-visible
                  ${isInactive ? 'glass-panel-sm opacity-50 hover:opacity-100' : ''}
                  ${isDetected ? 'glass-panel-sm' : ''}
                  ${isBlocked ? 'glass-panel-sm' : ''}
                `}
                style={isDetected ? {
                  boxShadow: `0 0 0 1px ${stage.color}40, 0 0 30px -5px ${stage.color}60`,
                  background: `linear-gradient(135deg, ${stage.color}15 0%, ${stage.color}05 100%)`
                } : isBlocked ? {
                  boxShadow: '0 0 0 1px rgba(16, 185, 129, 0.4), 0 0 30px -5px rgba(16, 185, 129, 0.6)',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                } : {}}
              >
                {/* Blocked checkmark badge */}
                {isBlocked && (
                  <div className="absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 z-10">
                    <span className="text-xs font-bold text-slate-900">✓</span>
                  </div>
                )}

                {/* Stage number badge */}
                <div className={`
                  absolute -top-3 -left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-20
                  ${isInactive ? 'bg-slate-700 text-slate-400' : ''}
                  ${isDetected ? 'text-white' : ''}
                  ${isBlocked ? 'bg-emerald-500/20 text-emerald-400' : ''}
                `}
                  style={isDetected ? { backgroundColor: `${stage.color}40`, color: stage.color } : {}}
                >
                  {index + 1}
                </div>

                {/* Icon container */}
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-3
                    transition-all duration-300
                    ${isInactive ? 'bg-slate-800/50' : ''}
                    ${isBlocked ? 'bg-emerald-500/20' : ''}
                  `}
                  style={isDetected ? { backgroundColor: `${stage.color}25` } : {}}
                >
                  <IconComponent
                    className={`w-6 h-6 transition-all duration-300 ${isInactive ? 'text-slate-500' : ''} ${isBlocked ? 'text-emerald-400' : ''}`}
                    style={isDetected ? { color: stage.color } : {}}
                  />
                </div>

                {/* Stage name */}
                <span className={`
                  text-sm font-semibold text-center whitespace-nowrap
                  ${isInactive ? 'text-slate-500' : 'text-white'}
                `}>
                  {stage.name}
                </span>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${stage.color}10 0%, transparent 70%)` }}
                ></div>
              </button>

              {/* Connector arrow */}
              {index < stages.length - 1 && (
                <div className="flex items-center px-1">
                  <div className={`
                    w-8 h-0.5 rounded-full transition-all duration-300
                    ${selectedThreat && selectedThreat.currentStage > index
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : 'bg-slate-700/50'
                    }
                  `}></div>
                  <ArrowRight className={`
                    w-4 h-4 -ml-1 transition-colors duration-300
                    ${selectedThreat && selectedThreat.currentStage > index
                      ? 'text-blue-500'
                      : 'text-slate-700'
                    }
                  `} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress bar */}
      {selectedThreat && (
        <div className="mt-6">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((selectedThreat.currentStage + 1) / stages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KillChainVisualization;
