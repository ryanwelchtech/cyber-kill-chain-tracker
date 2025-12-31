import React from 'react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface SimulationControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onTriggerAttack: () => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  onToggle,
  onReset,
  onTriggerAttack
}) => {
  return (
    <div className="bg-cyber-dark border border-cyan-900/30 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Attack Simulation Mode</h3>
          <p className="text-xs text-gray-400">
            Simulate real-time threat progression through the kill chain
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerAttack}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple border border-cyber-purple/30 rounded-lg transition-colors"
          >
            <Zap className="w-4 h-4" />
            New Attack
          </button>

          <button
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isRunning
                ? 'bg-cyber-orange/20 hover:bg-cyber-orange/30 text-cyber-orange border border-cyber-orange/30'
                : 'bg-cyber-green/20 hover:bg-cyber-green/30 text-cyber-green border border-cyber-green/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {isRunning && (
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
          <span className="text-xs text-cyber-green">Simulation running - threats progressing through kill chain</span>
        </div>
      )}
    </div>
  );
};

export default SimulationControls;
