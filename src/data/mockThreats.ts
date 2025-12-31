import { Threat, Alert, DashboardStats } from '../types';
import { killChainStages } from './killChainStages';

const generateStageProgress = (currentStage: number, blocked?: number) => {
  return killChainStages.map((stage, index) => ({
    stageId: stage.id,
    detected: index <= currentStage,
    timestamp: index <= currentStage ? new Date(Date.now() - (currentStage - index) * 3600000) : undefined,
    evidence: index <= currentStage ? [`Evidence for ${stage.name}`] : undefined,
    blocked: blocked !== undefined && index === blocked
  }));
};

export const mockThreats: Threat[] = [
  {
    id: 'THR-001',
    name: 'APT-29 Cozy Bear',
    type: 'apt',
    severity: 'critical',
    currentStage: 5,
    stages: generateStageProgress(5),
    firstDetected: new Date(Date.now() - 86400000 * 3),
    lastActivity: new Date(Date.now() - 1800000),
    source: '185.220.101.xxx (Russia)',
    target: 'Executive Email Systems',
    indicators: ['powershell.exe spawning from outlook.exe', 'Base64 encoded commands', 'Unusual DNS queries'],
    status: 'active'
  },
  {
    id: 'THR-002',
    name: 'Emotet Campaign',
    type: 'malware',
    severity: 'high',
    currentStage: 3,
    stages: generateStageProgress(3, 3),
    firstDetected: new Date(Date.now() - 86400000),
    lastActivity: new Date(Date.now() - 7200000),
    source: 'Phishing Email',
    target: 'Finance Department',
    indicators: ['Macro-enabled document', 'WMI persistence', 'TrickBot payload'],
    status: 'contained'
  },
  {
    id: 'THR-003',
    name: 'LockBit 3.0',
    type: 'ransomware',
    severity: 'critical',
    currentStage: 4,
    stages: generateStageProgress(4, 4),
    firstDetected: new Date(Date.now() - 43200000),
    lastActivity: new Date(Date.now() - 3600000),
    source: 'Compromised RDP',
    target: 'File Servers',
    indicators: ['Lateral movement via PsExec', 'Volume shadow copy deletion', 'Encrypted file extensions'],
    status: 'contained'
  },
  {
    id: 'THR-004',
    name: 'Spear Phishing - CEO Fraud',
    type: 'phishing',
    severity: 'medium',
    currentStage: 2,
    stages: generateStageProgress(2, 2),
    firstDetected: new Date(Date.now() - 14400000),
    lastActivity: new Date(Date.now() - 14400000),
    source: 'Spoofed Email Domain',
    target: 'CFO Office',
    indicators: ['Domain typosquatting', 'Urgent wire transfer request', 'Reply-to mismatch'],
    status: 'remediated'
  },
  {
    id: 'THR-005',
    name: 'SolarWinds Supply Chain',
    type: 'apt',
    severity: 'critical',
    currentStage: 6,
    stages: generateStageProgress(6),
    firstDetected: new Date(Date.now() - 86400000 * 7),
    lastActivity: new Date(Date.now() - 900000),
    source: 'Compromised Update Server',
    target: 'IT Infrastructure',
    indicators: ['SUNBURST backdoor', 'DGA domain communication', 'Memory-only implant'],
    status: 'active'
  },
  {
    id: 'THR-006',
    name: 'Insider Data Exfiltration',
    type: 'insider',
    severity: 'high',
    currentStage: 6,
    stages: generateStageProgress(6),
    firstDetected: new Date(Date.now() - 172800000),
    lastActivity: new Date(Date.now() - 21600000),
    source: 'Internal - Engineering Dept',
    target: 'Source Code Repository',
    indicators: ['Unusual data access patterns', 'Large file transfers to personal cloud', 'After-hours activity'],
    status: 'active'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'ALR-001',
    threatId: 'THR-001',
    stageId: 'command-control',
    message: 'C2 beacon detected: Unusual DNS TXT queries to suspicious domain',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1800000),
    acknowledged: false
  },
  {
    id: 'ALR-002',
    threatId: 'THR-005',
    stageId: 'actions',
    message: 'Data exfiltration attempt: Large encrypted payload to external IP',
    severity: 'critical',
    timestamp: new Date(Date.now() - 900000),
    acknowledged: false
  },
  {
    id: 'ALR-003',
    threatId: 'THR-003',
    stageId: 'installation',
    message: 'Ransomware installation blocked by EDR',
    severity: 'high',
    timestamp: new Date(Date.now() - 3600000),
    acknowledged: true
  },
  {
    id: 'ALR-004',
    threatId: 'THR-006',
    stageId: 'actions',
    message: 'Insider threat: Abnormal repository clone activity detected',
    severity: 'high',
    timestamp: new Date(Date.now() - 21600000),
    acknowledged: false
  },
  {
    id: 'ALR-005',
    threatId: 'THR-002',
    stageId: 'exploitation',
    message: 'Emotet macro execution blocked by application control',
    severity: 'medium',
    timestamp: new Date(Date.now() - 7200000),
    acknowledged: true
  }
];

export const mockStats: DashboardStats = {
  activeThreats: 3,
  containedThreats: 2,
  remediatedThreats: 1,
  alertsToday: 12,
  criticalAlerts: 2,
  averageDetectionTime: 4.2
};
