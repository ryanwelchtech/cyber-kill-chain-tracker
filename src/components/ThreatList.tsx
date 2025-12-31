import React from 'react';
import { AlertTriangle, Shield, ShieldCheck, Clock, MapPin, Target, ChevronRight } from 'lucide-react';
import { Threat } from '../types';
import { killChainStages } from '../data/killChainStages';

interface ThreatListProps {
  threats: Threat[];
  selectedThreat: Threat | null;
  onSelectThreat: (threat: Threat) => void;
}

const ThreatList: React.FC<ThreatListProps> = ({ threats, selectedThreat, onSelectThreat }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'from-red-500/20 to-red-500/5', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' };
      case 'high':
        return { bg: 'from-orange-500/20 to-orange-500/5', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' };
      case 'medium':
        return { bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/30', text: 'text-amber-400', glow: 'shadow-amber-500/20' };
      case 'low':
        return { bg: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/30', text: 'text-cyan-400', glow: 'shadow-cyan-500/20' };
      default:
        return { bg: 'from-slate-500/20 to-slate-500/5', border: 'border-slate-500/30', text: 'text-slate-400', glow: 'shadow-slate-500/20' };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Active' };
      case 'contained':
        return { icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Contained' };
      case 'remediated':
        return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Remediated' };
      default:
        return { icon: AlertTriangle, color: 'text-slate-400', bg: 'bg-slate-500/20', label: status };
    }
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: { label: string; color: string } } = {
      apt: { label: 'APT', color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30' },
      malware: { label: 'Malware', color: 'from-red-500/20 to-red-500/5 text-red-400 border-red-500/30' },
      ransomware: { label: 'Ransomware', color: 'from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/30' },
      phishing: { label: 'Phishing', color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30' },
      insider: { label: 'Insider', color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/30' }
    };
    return types[type] || { label: type, color: 'from-slate-500/20 to-slate-500/5 text-slate-400 border-slate-500/30' };
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="glass-panel overflow-hidden animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Threats</h2>
            <p className="text-sm text-slate-500 mt-1">Click to track kill chain progression</p>
          </div>
          <div className="glass-panel-sm px-3 py-1.5">
            <span className="text-xs font-medium text-slate-400">{threats.length} total</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-700/30 max-h-[480px] overflow-y-auto">
        {threats.map((threat) => {
          const severity = getSeverityStyles(threat.severity);
          const status = getStatusInfo(threat.status);
          const type = getTypeLabel(threat.type);
          const StatusIcon = status.icon;
          const isSelected = selectedThreat?.id === threat.id;

          return (
            <button
              key={threat.id}
              onClick={() => onSelectThreat(threat)}
              className={`
                w-full text-left p-5 transition-all duration-300 group relative
                ${isSelected ? 'bg-cyan-500/10' : 'hover:bg-white/[0.02]'}
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500"></div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${status.bg}`}>
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                  </div>
                  <div>
                    <span className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {threat.name}
                    </span>
                    <span className="text-xs text-slate-600 ml-2 font-mono">{threat.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r ${severity.bg} ${severity.text} border ${severity.border}`}>
                    {threat.severity.toUpperCase()}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all duration-300 ${isSelected ? 'translate-x-1' : ''}`} />
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-lg bg-gradient-to-r ${type.color} border`}>
                  {type.label}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(threat.lastActivity)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-600" />
                  <span className="truncate max-w-[120px]">{threat.source}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-slate-600" />
                  <span className="truncate max-w-[120px]">{threat.target}</span>
                </span>
              </div>

              {/* Kill chain progress bar */}
              <div className="flex items-center gap-0.5">
                {killChainStages.map((stage, index) => {
                  const stageProgress = threat.stages.find(s => s.stageId === stage.id);
                  const isActive = stageProgress?.detected;
                  const isBlocked = stageProgress?.blocked;

                  return (
                    <div
                      key={stage.id}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                      style={{
                        backgroundColor: isBlocked
                          ? 'rgb(16, 185, 129)'
                          : isActive
                          ? stage.color
                          : 'rgb(51, 65, 85)'
                      }}
                      title={`${stage.name}${isBlocked ? ' (Blocked)' : ''}`}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThreatList;
