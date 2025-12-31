import React from 'react';
import { Shield, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  alertCount: number;
}

const Header: React.FC<HeaderProps> = ({ alertCount }) => {
  return (
    <header className="bg-cyber-dark border-b border-cyan-900/30 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-blue/10 rounded-lg">
            <Shield className="w-8 h-8 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Cyber Kill Chain Tracker</h1>
            <p className="text-sm text-gray-400">Lockheed Martin Framework</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-cyber-dark rounded-lg border border-cyan-900/30">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">System Online</span>
          </div>

          <button className="relative p-2 hover:bg-cyber-blue/10 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-red text-white text-xs rounded-full flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </button>

          <button className="p-2 hover:bg-cyber-blue/10 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
