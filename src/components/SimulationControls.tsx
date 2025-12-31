import React from 'react';
import { Play, Pause, RotateCcw, Zap, Sparkles, Globe, Settings, RefreshCw } from 'lucide-react';

interface SimulationControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onTriggerAttack: () => void;
  onFetchLiveThreats?: () => void;
  onOpenSettings?: () => void;
  isLoadingLive?: boolean;
  hasApiKey?: boolean;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isRunning,
  onToggle,
  onReset,
  onTriggerAttack,
  onFetchLiveThreats,
  onOpenSettings,
  isLoadingLive = false,
  hasApiKey = false
}) => {
  return (
    <div className="glass-panel-sm mx-6 mt-6 p-5 animate-fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/20">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Attack Simulation Mode</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate real-time threat progression through the kill chain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Threats Button (OTX) */}
          {onFetchLiveThreats && (
            <button
              onClick={onFetchLiveThreats}
              disabled={isLoadingLive}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm
                transition-all duration-300 group
                ${hasApiKey
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/20'
                  : 'bg-gradient-to-r from-slate-500/20 to-slate-500/10 border border-slate-500/30 text-slate-400 hover:border-cyan-500/30 hover:text-cyan-400'
                }
                disabled:opacity-50`}
            >
              {isLoadingLive ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
              )}
              {hasApiKey ? 'Fetch Live Threats' : 'Connect OTX'}
            </button>
          )}

          {/* Settings Button */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400
                hover:bg-slate-800 hover:text-slate-300 transition-all duration-300 group"
            >
              <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          )}

          {/* New Attack Button */}
          <button
            onClick={onTriggerAttack}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm
              bg-gradient-to-r from-purple-500/20 to-violet-500/20
              border border-purple-500/30 text-purple-400
              hover:from-purple-500/30 hover:to-violet-500/30
              hover:shadow-lg hover:shadow-purple-500/20
              transition-all duration-300 group"
          >
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            New Attack
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={onToggle}
            className={`
              flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm
              transition-all duration-300 group
              ${isRunning
                ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-400 hover:from-orange-500/30 hover:to-amber-500/30 hover:shadow-lg hover:shadow-orange-500/20'
                : 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 hover:from-emerald-500/30 hover:to-cyan-500/30 hover:shadow-lg hover:shadow-emerald-500/20'
              }
            `}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Start
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-medium text-sm
              bg-slate-800/50 border border-slate-700/50 text-slate-400
              hover:bg-slate-800 hover:text-slate-300
              transition-all duration-300 group"
          >
            <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-500" />
            Reset
          </button>
        </div>
      </div>

      {/* Running indicator */}
      {isRunning && (
        <div className="mt-4 pt-4 border-t border-slate-700/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              Simulation active — threats progressing through kill chain stages
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationControls;
