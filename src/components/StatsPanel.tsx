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
      gradient: 'from-red-500 to-orange-500',
      glowClass: 'glow-border-red',
      textColor: 'text-red-400',
      bgColor: 'from-red-500/10 to-orange-500/10'
    },
    {
      label: 'Contained',
      value: stats.containedThreats,
      icon: ShieldOff,
      gradient: 'from-orange-500 to-amber-500',
      glowClass: 'glow-border-orange',
      textColor: 'text-orange-400',
      bgColor: 'from-orange-500/10 to-amber-500/10'
    },
    {
      label: 'Remediated',
      value: stats.remediatedThreats,
      icon: ShieldCheck,
      gradient: 'from-emerald-500 to-cyan-500',
      glowClass: 'glow-border-green',
      textColor: 'text-emerald-400',
      bgColor: 'from-emerald-500/10 to-cyan-500/10'
    },
    {
      label: 'Alerts Today',
      value: stats.alertsToday,
      icon: Activity,
      gradient: 'from-cyan-500 to-blue-500',
      glowClass: 'glow-border-cyan',
      textColor: 'text-cyan-400',
      bgColor: 'from-cyan-500/10 to-blue-500/10'
    },
    {
      label: 'Critical',
      value: stats.criticalAlerts,
      icon: AlertCircle,
      gradient: 'from-red-500 to-pink-500',
      glowClass: 'glow-border-red',
      textColor: 'text-red-400',
      bgColor: 'from-red-500/10 to-pink-500/10'
    },
    {
      label: 'Avg Detection',
      value: `${stats.averageDetectionTime}h`,
      icon: Clock,
      gradient: 'from-purple-500 to-violet-500',
      glowClass: 'glow-border-purple',
      textColor: 'text-purple-400',
      bgColor: 'from-purple-500/10 to-violet-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 px-6 mt-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`
            glass-panel-sm p-5 hover-lift cursor-default
            animate-fade-in-up opacity-0
          `}
          style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'forwards' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.textColor}`} />
            </div>
          </div>

          <div className={`text-3xl font-bold ${stat.textColor} tracking-tight`}>
            {stat.value}
          </div>

          <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
            {stat.label}
          </div>

          {/* Subtle gradient line at bottom */}
          <div className={`h-0.5 w-full mt-4 rounded-full bg-gradient-to-r ${stat.gradient} opacity-30`}></div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
