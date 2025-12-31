# Real Data Integration Guide - Cyber Kill Chain Tracker

## Overview
This guide explains how to integrate real threat intelligence and security data into the Cyber Kill Chain Tracker for production use.

---

## 1. MITRE ATT&CK Integration

### API Endpoint
```typescript
// src/services/mitreApi.ts
const MITRE_API = 'https://cti-taxii.mitre.org/stix/collections';

interface MitreAttackData {
  techniques: Technique[];
  tactics: Tactic[];
  groups: ThreatGroup[];
}

export async function fetchMitreData(): Promise<MitreAttackData> {
  const response = await fetch(`${MITRE_API}/enterprise-attack/objects`);
  return response.json();
}
```

### Mapping to Kill Chain
```typescript
const TACTIC_TO_STAGE: Record<string, string> = {
  'reconnaissance': 'reconnaissance',
  'resource-development': 'weaponization',
  'initial-access': 'delivery',
  'execution': 'exploitation',
  'persistence': 'installation',
  'command-and-control': 'command-control',
  'exfiltration': 'actions-on-objectives',
  'impact': 'actions-on-objectives'
};
```

---

## 2. SIEM Integration Options

### Splunk Integration
```typescript
// src/services/splunkApi.ts
import { SplunkClient } from '@splunk/splunk-sdk';

const splunk = new SplunkClient({
  host: process.env.SPLUNK_HOST,
  port: 8089,
  username: process.env.SPLUNK_USER,
  password: process.env.SPLUNK_PASS
});

export async function fetchSecurityAlerts() {
  const searchQuery = `
    search index=security sourcetype=threat_intel
    | eval stage=case(
        match(signature, "recon|scan"), "reconnaissance",
        match(signature, "malware|payload"), "weaponization",
        match(signature, "phish|email"), "delivery",
        match(signature, "exploit|CVE"), "exploitation",
        match(signature, "backdoor|persist"), "installation",
        match(signature, "c2|beacon"), "command-control",
        true(), "actions-on-objectives"
      )
    | table _time, src_ip, dest_ip, signature, severity, stage
  `;
  return splunk.search(searchQuery);
}
```

### Elastic SIEM Integration
```typescript
// src/services/elasticApi.ts
import { Client } from '@elastic/elasticsearch';

const elastic = new Client({
  node: process.env.ELASTIC_HOST,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY
  }
});

export async function fetchSecurityEvents() {
  const response = await elastic.search({
    index: 'security-*',
    body: {
      query: {
        bool: {
          must: [
            { range: { '@timestamp': { gte: 'now-24h' } } },
            { term: { 'event.category': 'intrusion_detection' } }
          ]
        }
      },
      aggs: {
        by_stage: {
          terms: { field: 'threat.tactic.name' }
        }
      }
    }
  });
  return response;
}
```

---

## 3. Threat Intelligence Feeds

### AlienVault OTX
```typescript
// src/services/otxApi.ts
const OTX_API = 'https://otx.alienvault.com/api/v1';

export async function fetchPulses(apiKey: string) {
  const response = await fetch(`${OTX_API}/pulses/subscribed`, {
    headers: { 'X-OTX-API-KEY': apiKey }
  });
  return response.json();
}

export async function fetchIndicators(pulseId: string, apiKey: string) {
  const response = await fetch(`${OTX_API}/pulses/${pulseId}/indicators`, {
    headers: { 'X-OTX-API-KEY': apiKey }
  });
  return response.json();
}
```

### VirusTotal Integration
```typescript
// src/services/virusTotalApi.ts
const VT_API = 'https://www.virustotal.com/api/v3';

export async function analyzeHash(hash: string, apiKey: string) {
  const response = await fetch(`${VT_API}/files/${hash}`, {
    headers: { 'x-apikey': apiKey }
  });
  return response.json();
}

export async function getRecentThreats(apiKey: string) {
  const response = await fetch(`${VT_API}/intelligence/hunting_rulesets`, {
    headers: { 'x-apikey': apiKey }
  });
  return response.json();
}
```

---

## 4. Real-Time Data with WebSockets

### Kafka Consumer for Live Alerts
```typescript
// src/services/kafkaConsumer.ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'kill-chain-tracker',
  brokers: [process.env.KAFKA_BROKER!]
});

const consumer = kafka.consumer({ groupId: 'threat-group' });

export async function subscribeToAlerts(onAlert: (alert: Alert) => void) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'security-alerts' });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const alert = JSON.parse(message.value!.toString());
      onAlert(mapToKillChainAlert(alert));
    }
  });
}
```

### WebSocket Server for Real-Time Updates
```typescript
// src/services/websocketServer.ts
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

export function broadcastThreatUpdate(threat: Threat) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'THREAT_UPDATE',
        payload: threat
      }));
    }
  });
}
```

---

## 5. Cloud Security Platform Integration

### AWS Security Hub
```typescript
// src/services/awsSecurityHub.ts
import { SecurityHub } from '@aws-sdk/client-securityhub';

const securityHub = new SecurityHub({ region: 'us-east-1' });

export async function fetchFindings() {
  const response = await securityHub.getFindings({
    Filters: {
      SeverityLabel: [{ Value: 'CRITICAL', Comparison: 'EQUALS' }],
      RecordState: [{ Value: 'ACTIVE', Comparison: 'EQUALS' }]
    },
    MaxResults: 100
  });
  return response.Findings;
}
```

### Microsoft Sentinel
```typescript
// src/services/sentinelApi.ts
import { LogsQueryClient } from '@azure/monitor-query';
import { DefaultAzureCredential } from '@azure/identity';

const client = new LogsQueryClient(new DefaultAzureCredential());

export async function querySecurityIncidents(workspaceId: string) {
  const response = await client.queryWorkspace(
    workspaceId,
    `SecurityIncident
     | where TimeGenerated > ago(24h)
     | project Title, Severity, Status, CreatedTime`,
    { duration: 'P1D' }
  );
  return response.tables;
}
```

---

## 6. Environment Variables

```env
# .env.local
SPLUNK_HOST=your-splunk-instance.com
SPLUNK_USER=admin
SPLUNK_PASS=your-password

ELASTIC_HOST=https://your-elastic-cluster.com
ELASTIC_API_KEY=your-api-key

OTX_API_KEY=your-otx-key
VIRUSTOTAL_API_KEY=your-vt-key

KAFKA_BROKER=localhost:9092

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret

AZURE_TENANT_ID=your-tenant
AZURE_CLIENT_ID=your-client
AZURE_CLIENT_SECRET=your-secret
SENTINEL_WORKSPACE_ID=your-workspace
```

---

## 7. Data Transformation Example

```typescript
// src/utils/transformers.ts
import { Threat, Alert, KillChainStage } from '../types';

export function transformSiemEventToThreat(event: any): Threat {
  return {
    id: `THR-${event.id}`,
    name: event.signature || event.rule_name,
    type: mapEventTypeToThreatType(event.category),
    severity: mapSeverity(event.severity),
    currentStage: getKillChainStage(event.tactic),
    stages: buildStageProgress(event),
    firstDetected: new Date(event.timestamp),
    lastActivity: new Date(event.last_seen),
    source: event.src_ip,
    target: event.dest_ip,
    indicators: event.indicators || [],
    status: 'active'
  };
}

function mapEventTypeToThreatType(category: string): ThreatType {
  const mapping: Record<string, ThreatType> = {
    'advanced-persistent-threat': 'apt',
    'malware': 'malware',
    'ransomware': 'ransomware',
    'phishing': 'phishing',
    'insider-threat': 'insider'
  };
  return mapping[category] || 'malware';
}
```

---

## Recommended Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Threat Intel   │────▶│   Backend    │────▶│   Frontend      │
│  Feeds (OTX,    │     │   (Node.js)  │     │   (React)       │
│  VirusTotal)    │     │              │     │                 │
└─────────────────┘     │  - REST API  │     │  - Real-time    │
                        │  - WebSocket │     │    updates      │
┌─────────────────┐     │  - Kafka     │     │  - Kill Chain   │
│  SIEM           │────▶│    consumer  │     │    visualization│
│  (Splunk/       │     │              │     │                 │
│   Elastic)      │     └──────────────┘     └─────────────────┘
└─────────────────┘            │
                               │
┌─────────────────┐            │
│  Cloud Security │────────────┘
│  (AWS/Azure/    │
│   GCP)          │
└─────────────────┘
```

---

## Getting Started

1. Choose your data sources based on your security stack
2. Set up environment variables for API credentials
3. Implement the relevant service modules
4. Create data transformation functions
5. Connect to the React state management (Context/Redux)
6. Test with sample data before going live

For enterprise deployment, consider using:
- Redis for caching frequently accessed threat data
- PostgreSQL for persistent threat history
- Elasticsearch for full-text search of IOCs
- Grafana for additional metrics and dashboards
