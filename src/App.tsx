import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import StatsPanel from './components/StatsPanel';
import KillChainVisualization from './components/KillChainVisualization';
import ThreatList from './components/ThreatList';
import AlertsPanel from './components/AlertsPanel';
import StageDetails from './components/StageDetails';
import SimulationControls from './components/SimulationControls';
import ApiSettings from './components/ApiSettings';
import { killChainStages } from './data/killChainStages';
import { mockThreats, mockAlerts, mockStats } from './data/mockThreats';
import { Threat, Alert, KillChainStage, DashboardStats } from './types';
import { otxApi } from './services/otxApi';

function App() {
  const [threats, setThreats] = useState<Threat[]>(mockThreats);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [selectedStage, setSelectedStage] = useState<KillChainStage | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isLoadingOTX, setIsLoadingOTX] = useState(false);

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  const handleStageClick = (stageId: string) => {
    const stage = killChainStages.find(s => s.id === stageId);
    if (stage) {
      setSelectedStage(stage);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const generateNewThreat = useCallback(() => {
    const threatTypes = ['apt', 'malware', 'ransomware', 'phishing', 'insider'] as const;
    const severities = ['critical', 'high', 'medium'] as const;
    const sources = [
      '103.224.xxx.xxx (China)',
      '185.220.xxx.xxx (Russia)',
      '91.219.xxx.xxx (Ukraine)',
      'Phishing Email',
      'Compromised Endpoint',
      'Supply Chain Vector'
    ];
    const targets = [
      'Domain Controllers',
      'Financial Systems',
      'HR Database',
      'Email Servers',
      'Development Environment',
      'Customer Portal'
    ];
    const names = [
      'Lazarus Group',
      'Fancy Bear APT-28',
      'BlackCat Ransomware',
      'Qakbot Loader',
      'Cobalt Strike Beacon',
      'IcedID Campaign'
    ];

    const newThreat: Threat = {
      id: `THR-${String(Date.now()).slice(-6)}`,
      name: names[Math.floor(Math.random() * names.length)],
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      currentStage: 0,
      stages: killChainStages.map(stage => ({
        stageId: stage.id,
        detected: false,
        timestamp: undefined,
        evidence: undefined,
        blocked: false
      })),
      firstDetected: new Date(),
      lastActivity: new Date(),
      source: sources[Math.floor(Math.random() * sources.length)],
      target: targets[Math.floor(Math.random() * targets.length)],
      indicators: ['Initial indicators pending analysis'],
      status: 'active'
    };

    // Set first stage as detected
    newThreat.stages[0] = {
      ...newThreat.stages[0],
      detected: true,
      timestamp: new Date(),
      evidence: ['Suspicious reconnaissance activity detected']
    };

    setThreats(prev => [newThreat, ...prev]);

    // Create alert for new threat
    const newAlert: Alert = {
      id: `ALR-${String(Date.now()).slice(-6)}`,
      threatId: newThreat.id,
      stageId: 'reconnaissance',
      message: `New threat detected: ${newThreat.name} targeting ${newThreat.target}`,
      severity: newThreat.severity,
      timestamp: new Date(),
      acknowledged: false
    };

    setAlerts(prev => [newAlert, ...prev]);
    setSelectedThreat(newThreat);

    // Update stats
    setStats(prev => ({
      ...prev,
      activeThreats: prev.activeThreats + 1,
      alertsToday: prev.alertsToday + 1,
      criticalAlerts: newThreat.severity === 'critical' ? prev.criticalAlerts + 1 : prev.criticalAlerts
    }));
  }, []);

  // Simulation effect - progress active threats through kill chain
  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(() => {
      setThreats(prev => {
        const updated = prev.map(threat => {
          if (threat.status !== 'active') return threat;

          const currentStageIndex = threat.currentStage;
          if (currentStageIndex >= killChainStages.length - 1) return threat;

          // 30% chance to progress each interval
          if (Math.random() > 0.3) return threat;

          // 20% chance to be blocked
          const isBlocked = Math.random() < 0.2;

          const newStages = [...threat.stages];
          const nextStageIndex = currentStageIndex + 1;

          newStages[nextStageIndex] = {
            ...newStages[nextStageIndex],
            detected: true,
            timestamp: new Date(),
            evidence: [`Activity detected at ${killChainStages[nextStageIndex].name}`],
            blocked: isBlocked
          };

          // Generate alert for progression
          const newAlert: Alert = {
            id: `ALR-${String(Date.now()).slice(-6)}`,
            threatId: threat.id,
            stageId: killChainStages[nextStageIndex].id,
            message: isBlocked
              ? `${threat.name} blocked at ${killChainStages[nextStageIndex].name} stage`
              : `${threat.name} progressed to ${killChainStages[nextStageIndex].name} stage`,
            severity: isBlocked ? 'medium' : (nextStageIndex >= 4 ? 'critical' : 'high'),
            timestamp: new Date(),
            acknowledged: false
          };

          setAlerts(prevAlerts => [newAlert, ...prevAlerts]);

          return {
            ...threat,
            currentStage: nextStageIndex,
            stages: newStages,
            lastActivity: new Date(),
            status: (isBlocked ? 'contained' : threat.status) as 'active' | 'contained' | 'remediated'
          };
        });

        // Update selected threat if it was modified
        if (selectedThreat) {
          const updatedSelected = updated.find(t => t.id === selectedThreat.id);
          if (updatedSelected && JSON.stringify(updatedSelected) !== JSON.stringify(selectedThreat)) {
            setSelectedThreat(updatedSelected as Threat);
          }
        }

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulationRunning, selectedThreat]);

  const handleReset = () => {
    setThreats(mockThreats);
    setAlerts(mockAlerts);
    setStats(mockStats);
    setSelectedThreat(null);
    setIsSimulationRunning(false);
  };

  // Fetch live threats from AlienVault OTX
  const fetchOTXThreats = useCallback(async () => {
    if (!otxApi.getApiKey()) {
      setIsApiSettingsOpen(true);
      return;
    }

    setIsLoadingOTX(true);
    try {
      const pulses = await otxApi.getSubscribedPulses(10);
      const otxThreats: Threat[] = pulses.map(pulse => {
        const mapped = otxApi.mapPulseToThreat(pulse);
        const detectedStages = mapped.stages.filter(s => s.detected);
        const currentStage = detectedStages.length > 0 ?
          killChainStages.findIndex(s => s.id === detectedStages[detectedStages.length - 1].stageId) : 0;

        return {
          id: mapped.id,
          name: mapped.name,
          type: mapped.type,
          severity: mapped.severity,
          currentStage: Math.max(0, currentStage),
          stages: killChainStages.map(stage => {
            const mappedStage = mapped.stages.find(s => s.stageId === stage.id);
            return {
              stageId: stage.id,
              detected: mappedStage?.detected || false,
              timestamp: mappedStage?.detected ? new Date() : undefined,
              evidence: mappedStage?.evidence,
              blocked: false
            };
          }),
          firstDetected: new Date(),
          lastActivity: new Date(),
          source: mapped.source,
          target: 'Multiple Targets',
          indicators: mapped.indicators,
          status: 'active' as const
        };
      });

      setThreats(prev => [...otxThreats, ...prev.filter(t => !t.id.startsWith('OTX-'))]);

      // Create alerts for new OTX threats
      const newAlerts: Alert[] = otxThreats.slice(0, 5).map(threat => ({
        id: `ALR-OTX-${threat.id}`,
        threatId: threat.id,
        stageId: 'reconnaissance',
        message: `Live threat from OTX: ${threat.name}`,
        severity: threat.severity,
        timestamp: new Date(),
        acknowledged: false
      }));

      setAlerts(prev => [...newAlerts, ...prev.filter(a => !a.id.includes('OTX'))]);

      // Update stats
      setStats(prev => ({
        ...prev,
        activeThreats: prev.activeThreats + otxThreats.length,
        alertsToday: prev.alertsToday + newAlerts.length
      }));
    } catch (error) {
      console.error('Failed to fetch OTX threats:', error);
    } finally {
      setIsLoadingOTX(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="mesh-gradient"></div>

      {/* Noise texture overlay */}
      <div className="noise-overlay"></div>

      {/* Content */}
      <div className="relative z-10">
        <Header alertCount={unacknowledgedCount} />

        <main className="pb-8">
          <StatsPanel stats={stats} />

          <SimulationControls
            isRunning={isSimulationRunning}
            onToggle={() => setIsSimulationRunning(!isSimulationRunning)}
            onReset={handleReset}
            onTriggerAttack={generateNewThreat}
            onFetchLiveThreats={fetchOTXThreats}
            onOpenSettings={() => setIsApiSettingsOpen(true)}
            isLoadingLive={isLoadingOTX}
            hasApiKey={!!otxApi.getApiKey()}
          />

          <KillChainVisualization
            stages={killChainStages}
            selectedThreat={selectedThreat}
            onStageClick={handleStageClick}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 mt-6">
            <ThreatList
              threats={threats}
              selectedThreat={selectedThreat}
              onSelectThreat={setSelectedThreat}
            />
            <AlertsPanel
              alerts={alerts}
              onAcknowledge={handleAcknowledgeAlert}
            />
          </div>
        </main>

        <StageDetails
          stage={selectedStage}
          threat={selectedThreat}
          onClose={() => setSelectedStage(null)}
        />

        <ApiSettings
          isOpen={isApiSettingsOpen}
          onClose={() => setIsApiSettingsOpen(false)}
          onApiKeySet={fetchOTXThreats}
        />
      </div>
    </div>
  );
}

export default App;
