export interface KillChainStage {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  mitigations: string[];
}

export interface Threat {
  id: string;
  name: string;
  type: 'apt' | 'malware' | 'ransomware' | 'phishing' | 'insider';
  severity: 'critical' | 'high' | 'medium' | 'low';
  currentStage: number;
  stages: ThreatStageProgress[];
  firstDetected: Date;
  lastActivity: Date;
  source: string;
  target: string;
  indicators: string[];
  status: 'active' | 'contained' | 'remediated';
}

export interface ThreatStageProgress {
  stageId: string;
  detected: boolean;
  timestamp?: Date;
  evidence?: string[];
  blocked?: boolean;
}

export interface Alert {
  id: string;
  threatId: string;
  stageId: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  acknowledged: boolean;
}

export interface DashboardStats {
  activeThreats: number;
  containedThreats: number;
  remediatedThreats: number;
  alertsToday: number;
  criticalAlerts: number;
  averageDetectionTime: number;
}
