// AlienVault OTX (Open Threat Exchange) API Integration
// Get your FREE API key at: https://otx.alienvault.com/api

const OTX_API_BASE = 'https://otx.alienvault.com/api/v1';

export interface OTXPulse {
  id: string;
  name: string;
  description: string;
  author_name: string;
  created: string;
  modified: string;
  tags: string[];
  targeted_countries: string[];
  malware_families: string[];
  attack_ids: Array<{ id: string; name: string; display_name: string }>;
  industries: string[];
  TLP: string;
  adversary: string;
  indicators: OTXIndicator[];
}

export interface OTXIndicator {
  id: number;
  indicator: string;
  type: string;
  created: string;
  content: string;
  title: string;
  description: string;
  is_active: number;
}

export interface OTXSubscribedPulses {
  count: number;
  next: string | null;
  previous: string | null;
  results: OTXPulse[];
}

// Map OTX attack IDs (MITRE ATT&CK) to Kill Chain stages
const MITRE_TO_KILLCHAIN: Record<string, string> = {
  // Reconnaissance
  'T1595': 'reconnaissance', // Active Scanning
  'T1592': 'reconnaissance', // Gather Victim Host Information
  'T1589': 'reconnaissance', // Gather Victim Identity Information
  'T1590': 'reconnaissance', // Gather Victim Network Information
  'T1591': 'reconnaissance', // Gather Victim Org Information
  'T1598': 'reconnaissance', // Phishing for Information
  'T1597': 'reconnaissance', // Search Closed Sources
  'T1596': 'reconnaissance', // Search Open Technical Databases
  'T1593': 'reconnaissance', // Search Open Websites/Domains
  'T1594': 'reconnaissance', // Search Victim-Owned Websites

  // Weaponization (Resource Development)
  'T1583': 'weaponization', // Acquire Infrastructure
  'T1586': 'weaponization', // Compromise Accounts
  'T1584': 'weaponization', // Compromise Infrastructure
  'T1587': 'weaponization', // Develop Capabilities
  'T1585': 'weaponization', // Establish Accounts
  'T1588': 'weaponization', // Obtain Capabilities
  'T1608': 'weaponization', // Stage Capabilities

  // Delivery (Initial Access)
  'T1189': 'delivery', // Drive-by Compromise
  'T1190': 'delivery', // Exploit Public-Facing Application
  'T1133': 'delivery', // External Remote Services
  'T1200': 'delivery', // Hardware Additions
  'T1566': 'delivery', // Phishing
  'T1091': 'delivery', // Replication Through Removable Media
  'T1195': 'delivery', // Supply Chain Compromise
  'T1199': 'delivery', // Trusted Relationship
  'T1078': 'delivery', // Valid Accounts

  // Exploitation (Execution)
  'T1059': 'exploitation', // Command and Scripting Interpreter
  'T1609': 'exploitation', // Container Administration Command
  'T1610': 'exploitation', // Deploy Container
  'T1203': 'exploitation', // Exploitation for Client Execution
  'T1559': 'exploitation', // Inter-Process Communication
  'T1106': 'exploitation', // Native API
  'T1053': 'exploitation', // Scheduled Task/Job
  'T1129': 'exploitation', // Shared Modules
  'T1072': 'exploitation', // Software Deployment Tools
  'T1569': 'exploitation', // System Services
  'T1204': 'exploitation', // User Execution
  'T1047': 'exploitation', // Windows Management Instrumentation

  // Installation (Persistence)
  'T1098': 'installation', // Account Manipulation
  'T1197': 'installation', // BITS Jobs
  'T1547': 'installation', // Boot or Logon Autostart Execution
  'T1037': 'installation', // Boot or Logon Initialization Scripts
  'T1176': 'installation', // Browser Extensions
  'T1554': 'installation', // Compromise Client Software Binary
  'T1136': 'installation', // Create Account
  'T1543': 'installation', // Create or Modify System Process
  'T1546': 'installation', // Event Triggered Execution
  'T1574': 'installation', // Hijack Execution Flow
  'T1525': 'installation', // Implant Internal Image
  'T1556': 'installation', // Modify Authentication Process
  'T1137': 'installation', // Office Application Startup
  'T1542': 'installation', // Pre-OS Boot
  'T1505': 'installation', // Server Software Component
  'T1205': 'installation', // Traffic Signaling

  // Command & Control
  'T1071': 'command-control', // Application Layer Protocol
  'T1092': 'command-control', // Communication Through Removable Media
  'T1132': 'command-control', // Data Encoding
  'T1001': 'command-control', // Data Obfuscation
  'T1568': 'command-control', // Dynamic Resolution
  'T1573': 'command-control', // Encrypted Channel
  'T1008': 'command-control', // Fallback Channels
  'T1105': 'command-control', // Ingress Tool Transfer
  'T1104': 'command-control', // Multi-Stage Channels
  'T1095': 'command-control', // Non-Application Layer Protocol
  'T1571': 'command-control', // Non-Standard Port
  'T1572': 'command-control', // Protocol Tunneling
  'T1090': 'command-control', // Proxy
  'T1219': 'command-control', // Remote Access Software
  'T1102': 'command-control', // Web Service

  // Actions on Objectives (Exfiltration/Impact)
  'T1020': 'actions-on-objectives', // Automated Exfiltration
  'T1030': 'actions-on-objectives', // Data Transfer Size Limits
  'T1048': 'actions-on-objectives', // Exfiltration Over Alternative Protocol
  'T1041': 'actions-on-objectives', // Exfiltration Over C2 Channel
  'T1011': 'actions-on-objectives', // Exfiltration Over Other Network Medium
  'T1052': 'actions-on-objectives', // Exfiltration Over Physical Medium
  'T1567': 'actions-on-objectives', // Exfiltration Over Web Service
  'T1029': 'actions-on-objectives', // Scheduled Transfer
  'T1537': 'actions-on-objectives', // Transfer Data to Cloud Account
  'T1531': 'actions-on-objectives', // Account Access Removal
  'T1485': 'actions-on-objectives', // Data Destruction
  'T1486': 'actions-on-objectives', // Data Encrypted for Impact
  'T1565': 'actions-on-objectives', // Data Manipulation
  'T1491': 'actions-on-objectives', // Defacement
  'T1561': 'actions-on-objectives', // Disk Wipe
  'T1499': 'actions-on-objectives', // Endpoint Denial of Service
  'T1495': 'actions-on-objectives', // Firmware Corruption
  'T1490': 'actions-on-objectives', // Inhibit System Recovery
  'T1498': 'actions-on-objectives', // Network Denial of Service
  'T1496': 'actions-on-objectives', // Resource Hijacking
  'T1489': 'actions-on-objectives', // Service Stop
  'T1529': 'actions-on-objectives', // System Shutdown/Reboot
};

class OTXApiService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('otx_api_key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('otx_api_key');
    }
    return this.apiKey;
  }

  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('otx_api_key');
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OTX API key not set. Get your free key at https://otx.alienvault.com/api');
    }

    const response = await fetch(`${OTX_API_BASE}${endpoint}`, {
      headers: {
        'X-OTX-API-KEY': apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid OTX API key');
      }
      throw new Error(`OTX API error: ${response.status}`);
    }

    return response.json();
  }

  // Get subscribed threat pulses
  async getSubscribedPulses(limit: number = 10): Promise<OTXPulse[]> {
    const data = await this.fetch<OTXSubscribedPulses>(
      `/pulses/subscribed?limit=${limit}&modified_since=${getLastWeekDate()}`
    );
    return data.results;
  }

  // Get pulse details by ID
  async getPulseDetails(pulseId: string): Promise<OTXPulse> {
    return this.fetch<OTXPulse>(`/pulses/${pulseId}`);
  }

  // Get indicators for a pulse
  async getPulseIndicators(pulseId: string): Promise<OTXIndicator[]> {
    const data = await this.fetch<{ results: OTXIndicator[] }>(
      `/pulses/${pulseId}/indicators`
    );
    return data.results;
  }

  // Search for pulses by keyword
  async searchPulses(query: string, limit: number = 10): Promise<OTXPulse[]> {
    const data = await this.fetch<OTXSubscribedPulses>(
      `/search/pulses?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return data.results;
  }

  // Convert OTX pulse to Kill Chain threat format
  mapPulseToThreat(pulse: OTXPulse): {
    id: string;
    name: string;
    type: 'apt' | 'malware' | 'ransomware' | 'phishing' | 'insider';
    severity: 'critical' | 'high' | 'medium' | 'low';
    stages: Array<{ stageId: string; detected: boolean; evidence: string[] }>;
    source: string;
    indicators: string[];
  } {
    // Determine threat type from tags/malware families
    let type: 'apt' | 'malware' | 'ransomware' | 'phishing' | 'insider' = 'malware';
    const tags = pulse.tags.map(t => t.toLowerCase());

    if (tags.some(t => t.includes('apt') || t.includes('threat actor'))) {
      type = 'apt';
    } else if (tags.some(t => t.includes('ransomware'))) {
      type = 'ransomware';
    } else if (tags.some(t => t.includes('phishing'))) {
      type = 'phishing';
    }

    // Determine severity based on TLP and targeted industries
    let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    if (pulse.TLP === 'red' || pulse.industries.length > 3) {
      severity = 'critical';
    } else if (pulse.TLP === 'amber' || pulse.malware_families.length > 0) {
      severity = 'high';
    }

    // Map MITRE ATT&CK IDs to kill chain stages
    const stageMap = new Map<string, string[]>();
    pulse.attack_ids.forEach(attack => {
      const stage = MITRE_TO_KILLCHAIN[attack.id];
      if (stage) {
        const evidence = stageMap.get(stage) || [];
        evidence.push(`${attack.display_name} (${attack.id})`);
        stageMap.set(stage, evidence);
      }
    });

    const allStages = [
      'reconnaissance', 'weaponization', 'delivery',
      'exploitation', 'installation', 'command-control', 'actions-on-objectives'
    ];

    const stages = allStages.map(stageId => ({
      stageId,
      detected: stageMap.has(stageId),
      evidence: stageMap.get(stageId) || [],
    }));

    return {
      id: `OTX-${pulse.id.substring(0, 8)}`,
      name: pulse.name.substring(0, 50),
      type,
      severity,
      stages,
      source: pulse.adversary || 'Unknown',
      indicators: pulse.indicators?.slice(0, 5).map(i => i.indicator) || [],
    };
  }
}

function getLastWeekDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

export const otxApi = new OTXApiService();
export default otxApi;
