import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, Check, X, RefreshCw } from 'lucide-react';
import { otxApi } from '../services/otxApi';

interface ApiSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySet: () => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({ isOpen, onClose, onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = otxApi.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
    }
  }, [isOpen]);

  const validateAndSave = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      otxApi.setApiKey(apiKey.trim());
      // Test the API key by fetching pulses
      await otxApi.getSubscribedPulses(1);
      setIsValid(true);
      onApiKeySet();
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Invalid API key');
      otxApi.clearApiKey();
    } finally {
      setIsValidating(false);
    }
  };

  const clearKey = () => {
    otxApi.clearApiKey();
    setApiKey('');
    setIsValid(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-panel w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
                <Key className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">API Configuration</h3>
                <p className="text-sm text-slate-500">Connect to live threat intelligence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl glass-panel-sm hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* AlienVault OTX */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white">AlienVault OTX API Key</label>
              <a
                href="https://otx.alienvault.com/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
              >
                Get free key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsValid(null);
                  setError(null);
                }}
                placeholder="Enter your OTX API key..."
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl
                  text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50
                  focus:ring-1 focus:ring-cyan-500/30 transition-all"
              />
              {isValid !== null && (
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${isValid ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  {isValid ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}

            <div className="text-xs text-slate-500 space-y-1">
              <p>1. Create a free account at otx.alienvault.com</p>
              <p>2. Go to Settings → API Integration</p>
              <p>3. Copy your OTX API Key and paste above</p>
            </div>
          </div>

          {/* Status indicator */}
          {isValid && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Connected to OTX</p>
                  <p className="text-xs text-slate-500">Live threat intelligence enabled</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30 flex gap-3">
          {isValid && (
            <button
              onClick={clearKey}
              className="px-4 py-2.5 rounded-xl font-medium text-sm
                bg-red-500/10 border border-red-500/30 text-red-400
                hover:bg-red-500/20 transition-all"
            >
              Disconnect
            </button>
          )}
          <button
            onClick={validateAndSave}
            disabled={isValidating || !apiKey.trim()}
            className="flex-1 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2
              bg-gradient-to-r from-cyan-500/20 to-blue-500/20
              border border-cyan-500/30 text-cyan-400
              hover:from-cyan-500/30 hover:to-blue-500/30
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all"
          >
            {isValidating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Validating...
              </>
            ) : (
              'Save & Connect'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiSettings;
