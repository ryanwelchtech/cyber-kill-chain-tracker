import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldOff, Clock, Activity, AlertCircle } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsPanelProps {
  stats: DashboardStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Active Threats',
      value: stats.activeThreats,
      icon: AlertTriangle,
      color: 'text-cyber-red',
      bgColor: 'bg-cyber-red/10',
      borderColor: 'border-cyber-red/30'
    },
    {
      label: 'Contained',
      value: stats.containedThreats,
      icon: ShieldOff,
      color: 'text-cyber-orange',
      bgColor: 'bg-cyber-orange/10',
      borderColor: 'border-cyber-orange/30'
    },
    {
      label: 'Remediated',
      value: stats.remediatedThreats,
      icon: ShieldCheck,
      color: 'text-cyber-green',
      bgColor: 'bg-cyber-green/10',
      borderColor: 'border-cyber-green/30'
    },
    {
      label: 'Alerts Today',
      value: stats.alertsToday,
      icon: Activity,
      color: 'text-cyber-blue',
      bgColor: 'bg-cyber-blue/10',
      borderColor: 'border-cyber-blue/30'
    },
    {
      label: 'Critical Alerts',
      value: stats.criticalAlerts,
      icon: AlertCircle,
      color: 'text-cyber-red',
      bgColor: 'bg-cyber-red/10',
      borderColor: 'border-cyber-red/30'
    },
    {
      label: 'Avg Detection (hrs)',
      value: stats.averageDetectionTime,
      icon: Clock,
      color: 'text-cyber-purple',
      bgColor: 'bg-cyber-purple/10',
      borderColor: 'border-cyber-purple/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-4 transition-all hover:scale-105`}
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
