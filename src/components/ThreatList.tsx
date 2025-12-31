import React from 'react';
import { AlertTriangle, Shield, ShieldCheck, Clock, MapPin, Target } from 'lucide-react';
import { Threat } from '../types';
import { killChainStages } from '../data/killChainStages';

interface ThreatListProps {
  threats: Threat[];
  selectedThreat: Threat | null;
  onSelectThreat: (threat: Threat) => void;
}

const ThreatList: React.FC<ThreatListProps> = ({ threats, selectedThreat, onSelectThreat }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-cyber-red bg-cyber-red/10 border-cyber-red/30';
      case 'high': return 'text-cyber-orange bg-cyber-orange/10 border-cyber-orange/30';
      case 'medium': return 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30';
      case 'low': return 'text-cyber-blue bg-cyber-blue/10 border-cyber-blue/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-cyber-red" />;
      case 'contained': return <Shield className="w-4 h-4 text-cyber-orange" />;
      case 'remediated': return <ShieldCheck className="w-4 h-4 text-cyber-green" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'apt': return 'APT';
      case 'malware': return 'Malware';
      case 'ransomware': return 'Ransomware';
      case 'phishing': return 'Phishing';
      case 'insider': return 'Insider';
      default: return type;
    }
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
    <div className="bg-cyber-dark border border-cyan-900/30 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-cyan-900/30">
        <h2 className="text-lg font-semibold text-white">Active Threats</h2>
        <p className="text-sm text-gray-400">Click to view kill chain progression</p>
      </div>

      <div className="divide-y divide-cyan-900/20 max-h-[500px] overflow-y-auto">
        {threats.map((threat) => (
          <button
            key={threat.id}
            onClick={() => onSelectThreat(threat)}
            className={`
              w-full text-left p-4 transition-all hover:bg-cyber-blue/5
              ${selectedThreat?.id === threat.id ? 'bg-cyber-blue/10 border-l-2 border-cyber-blue' : ''}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(threat.status)}
                <span className="font-medium text-white">{threat.name}</span>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded border ${getSeverityColor(threat.severity)}`}>
                {threat.severity.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
              <span className="px-2 py-0.5 bg-gray-800 rounded">{getTypeLabel(threat.type)}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTimeAgo(threat.lastActivity)}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {threat.source}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                {threat.target}
              </span>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-1">
                {killChainStages.map((stage, index) => {
                  const stageProgress = threat.stages.find(s => s.stageId === stage.id);
                  const isActive = stageProgress?.detected;
                  const isBlocked = stageProgress?.blocked;

                  return (
                    <div
                      key={stage.id}
                      className={`
                        h-1.5 flex-1 rounded-full transition-all
                        ${isBlocked ? 'bg-cyber-green' : isActive ? '' : 'bg-gray-700'}
                      `}
                      style={isActive && !isBlocked ? { backgroundColor: stage.color } : {}}
                      title={`${stage.name}${isBlocked ? ' (Blocked)' : ''}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-600">Reconnaissance</span>
                <span className="text-[10px] text-gray-600">Actions</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThreatList;
