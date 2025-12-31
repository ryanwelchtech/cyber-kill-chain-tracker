import React from 'react';
import { Shield, Bell, Activity } from 'lucide-react';

interface HeaderProps {
  alertCount: number;
}

const Header: React.FC<HeaderProps> = ({ alertCount }) => {
  return (
    <header className="glass-panel-sm mx-6 mt-6 px-6 py-4 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl"></div>
            <div className="relative p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-500/20">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="gradient-text-cyan">Cyber Kill Chain</span>
              <span className="text-slate-300 ml-2 font-medium">Tracker</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase mt-0.5">
              Lockheed Martin Framework
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Status Indicator */}
          <div className="glass-panel-sm flex items-center gap-3 px-4 py-2.5">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-slate-300">Live Monitoring</span>
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-3 glass-panel-sm hover:bg-white/5 transition-all duration-300 group">
            <Bell className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
