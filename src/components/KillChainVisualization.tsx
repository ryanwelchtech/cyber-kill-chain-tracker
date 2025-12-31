import React from 'react';
import { Search, Wrench, Send, Zap, Download, Radio, Target, ChevronRight } from 'lucide-react';
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
    <div className="bg-cyber-dark border border-cyan-900/30 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Kill Chain Progression</h2>

      <div className="flex items-center justify-between overflow-x-auto pb-4">
        {stages.map((stage, index) => {
          const IconComponent = iconMap[stage.icon] || Search;
          const status = getStageStatus(stage.id);

          const statusStyles = {
            inactive: 'bg-gray-800/50 border-gray-700 text-gray-500',
            detected: `bg-opacity-20 border-opacity-50`,
            blocked: 'bg-green-900/30 border-green-500/50 text-green-400'
          };

          const isDetected = status === 'detected';
          const isBlocked = status === 'blocked';

          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onStageClick(stage.id)}
                className={`
                  relative flex flex-col items-center min-w-[100px] p-4 rounded-lg border-2 transition-all
                  hover:scale-105 cursor-pointer
                  ${status === 'inactive' ? statusStyles.inactive : ''}
                  ${isDetected ? `border-2` : ''}
                  ${isBlocked ? statusStyles.blocked : ''}
                `}
                style={isDetected ? {
                  backgroundColor: `${stage.color}20`,
                  borderColor: `${stage.color}80`,
                  color: stage.color
                } : {}}
              >
                {isBlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyber-green rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-black">✓</span>
                  </div>
                )}

                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${status === 'inactive' ? 'bg-gray-700' : ''}
                    ${isBlocked ? 'bg-green-500/20' : ''}
                  `}
                  style={isDetected ? { backgroundColor: `${stage.color}30` } : {}}
                >
                  <IconComponent
                    className={`w-6 h-6 ${status === 'inactive' ? 'text-gray-500' : ''}`}
                    style={isDetected ? { color: stage.color } : {}}
                  />
                </div>

                <span className="text-xs font-medium text-center whitespace-nowrap">
                  {stage.name}
                </span>

                <span className="text-[10px] mt-1 opacity-60">
                  Stage {index + 1}
                </span>
              </button>

              {index < stages.length - 1 && (
                <ChevronRight
                  className={`w-6 h-6 flex-shrink-0 mx-2 ${
                    selectedThreat && selectedThreat.currentStage > index
                      ? 'text-cyber-blue'
                      : 'text-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!selectedThreat && (
        <p className="text-center text-gray-500 mt-4">
          Select a threat to visualize its kill chain progression
        </p>
      )}
    </div>
  );
};

export default KillChainVisualization;
