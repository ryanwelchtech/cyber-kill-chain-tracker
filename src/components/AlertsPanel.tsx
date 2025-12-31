import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
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
          bg: 'bg-cyber-red/10',
          border: 'border-cyber-red/30',
          text: 'text-cyber-red'
        };
      case 'high':
        return {
          icon: AlertTriangle,
          bg: 'bg-cyber-orange/10',
          border: 'border-cyber-orange/30',
          text: 'text-cyber-orange'
        };
      case 'medium':
        return {
          icon: Info,
          bg: 'bg-cyber-yellow/10',
          border: 'border-cyber-yellow/30',
          text: 'text-cyber-yellow'
        };
      default:
        return {
          icon: Info,
          bg: 'bg-cyber-blue/10',
          border: 'border-cyber-blue/30',
          text: 'text-cyber-blue'
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
    <div className="bg-cyber-dark border border-cyan-900/30 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-cyan-900/30">
        <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
        <p className="text-sm text-gray-400">
          {unacknowledgedAlerts.length} unacknowledged
        </p>
      </div>

      <div className="divide-y divide-cyan-900/20 max-h-[400px] overflow-y-auto">
        {unacknowledgedAlerts.map((alert) => {
          const styles = getSeverityStyles(alert.severity);
          const IconComponent = styles.icon;

          return (
            <div
              key={alert.id}
              className={`p-4 ${styles.bg} border-l-2 ${styles.border}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 ${styles.text} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm text-white">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="px-2 py-0.5 bg-gray-800 rounded">
                        {getStageName(alert.stageId)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          );
        })}

        {acknowledgedAlerts.length > 0 && (
          <>
            <div className="p-2 bg-gray-900/50 text-xs text-gray-500 text-center">
              Acknowledged
            </div>
            {acknowledgedAlerts.map((alert) => {
              const styles = getSeverityStyles(alert.severity);

              return (
                <div key={alert.id} className="p-4 opacity-50">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-400">{alert.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-800 rounded">
                          {getStageName(alert.stageId)}
                        </span>
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
