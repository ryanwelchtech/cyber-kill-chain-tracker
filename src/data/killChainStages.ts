import { KillChainStage } from '../types';

export const killChainStages: KillChainStage[] = [
  {
    id: 'reconnaissance',
    name: 'Reconnaissance',
    description: 'Adversary identifies and selects targets. Harvests email addresses, social relationships, and technology information.',
    icon: 'Search',
    color: '#9d4edd',
    mitigations: [
      'Limit public exposure of employee information',
      'Web application firewall (WAF)',
      'Monitor for reconnaissance scanning',
      'Threat intelligence feeds',
      'Social media awareness training'
    ]
  },
  {
    id: 'weaponization',
    name: 'Weaponization',
    description: 'Adversary creates malware payload tailored to the target. Couples exploit with backdoor into deliverable payload.',
    icon: 'Wrench',
    color: '#ff9500',
    mitigations: [
      'Threat intelligence on malware families',
      'Sandbox analysis of suspicious files',
      'Malware information sharing',
      'Attack pattern analysis',
      'YARA rules development'
    ]
  },
  {
    id: 'delivery',
    name: 'Delivery',
    description: 'Adversary transmits weapon to target. Common vectors: email attachments, websites, USB drives.',
    icon: 'Send',
    color: '#ffcc00',
    mitigations: [
      'Email security gateway',
      'Web proxy filtering',
      'USB device control',
      'User awareness training',
      'Network segmentation'
    ]
  },
  {
    id: 'exploitation',
    name: 'Exploitation',
    description: 'Malware code triggers, exploiting vulnerability to execute on target system.',
    icon: 'Zap',
    color: '#ff3366',
    mitigations: [
      'Patch management',
      'Host-based intrusion prevention',
      'Endpoint detection and response (EDR)',
      'Application whitelisting',
      'Exploit mitigation (DEP, ASLR)'
    ]
  },
  {
    id: 'installation',
    name: 'Installation',
    description: 'Malware installs backdoor or implant to maintain persistent access.',
    icon: 'Download',
    color: '#ff3366',
    mitigations: [
      'Endpoint detection and response (EDR)',
      'Application control policies',
      'File integrity monitoring',
      'Behavioral analysis',
      'Privilege access management'
    ]
  },
  {
    id: 'command-control',
    name: 'Command & Control',
    description: 'Implant establishes command channel for remote manipulation of target.',
    icon: 'Radio',
    color: '#00d4ff',
    mitigations: [
      'Network traffic analysis',
      'DNS monitoring and filtering',
      'Egress filtering',
      'SSL/TLS inspection',
      'Network behavior anomaly detection'
    ]
  },
  {
    id: 'actions',
    name: 'Actions on Objectives',
    description: 'Adversary accomplishes mission goals: data exfiltration, destruction, or encryption.',
    icon: 'Target',
    color: '#00ff88',
    mitigations: [
      'Data loss prevention (DLP)',
      'Network segmentation',
      'Privileged access monitoring',
      'Backup and recovery',
      'Incident response plan'
    ]
  }
];
