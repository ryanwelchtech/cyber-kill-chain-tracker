import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, Clock, Check } from 'lucide-react';
import { Alert } from '../types';
import { killChainStages } from '../data/killChainStages';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertCircle,
          gradient: 'from-red-500/20 to-red-500/5',
          border: 'border-red-500/30',
          text: 'text-red-400',
          glow: 'shadow-red-500/10'
        };
      case 'high':
        return {
          icon: AlertTriangle,
          gradient: 'from-orange-500/20 to-orange-500/5',
          border: 'border-orange-500/30',
          text: 'text-orange-400',
          glow: 'shadow-orange-500/10'
        };
      case 'medium':
        return {
          icon: Info,
          gradient: 'from-amber-500/20 to-amber-500/5',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          glow: 'shadow-amber-500/10'
        };
      default:
        return {
          icon: Info,
          gradient: 'from-cyan-500/20 to-cyan-500/5',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
          glow: 'shadow-cyan-500/10'
        };
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

  const getStageName = (stageId: string) => {
    return killChainStages.find(s => s.id === stageId)?.name || stageId;
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);
  const acknowledgedAlerts = alerts.filter(a => a.acknowledged);

  return (
    <div className="glass-panel overflow-hidden animate-fade-in-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Alerts</h2>
            <p className="text-sm text-slate-500 mt-1">
              {unacknowledgedAlerts.length} requiring attention
            </p>
          </div>
          {unacknowledgedAlerts.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-md animate-pulse"></div>
              <div className="relative w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-700/30 max-h-[380px] overflow-y-auto">
        {unacknowledgedAlerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          const IconComponent = styles.icon;

          return (
            <div
              key={alert.id}
              className={`p-5 bg-gradient-to-r ${styles.gradient} border-l-2 ${styles.border} transition-all duration-300 hover:bg-white/[0.02]`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${styles.gradient} border ${styles.border} shadow-lg ${styles.glow}`}>
                  <IconComponent className={`w-4 h-4 ${styles.text}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 leading-relaxed">{alert.message}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700/50">
                      {getStageName(alert.stageId)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(alert.timestamp)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="flex items-center gap-2 px-3 py-2 glass-panel-sm text-xs font-medium text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300 group"
                >
                  <Check className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Acknowledge</span>
                </button>
              </div>
            </div>
          );
        })}

        {acknowledgedAlerts.length > 0 && (
          <>
            <div className="p-3 bg-slate-900/30 text-xs text-slate-600 text-center uppercase tracking-wider font-medium">
              Acknowledged
            </div>
            {acknowledgedAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="p-4 opacity-40">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-800/30">
                    <CheckCircle2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-500 line-clamp-1">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                      <span>{getStageName(alert.stageId)}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {alerts.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500">No active alerts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
