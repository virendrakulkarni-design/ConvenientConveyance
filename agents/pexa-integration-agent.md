# PEXA & Platform Integration Agent

```yaml
agent:
  id: pexa-integration-agent
  name: PEXA & Platform Integration Agent
  tier: financial-and-settlement-orchestration
  version: 2.1.0
  model: claude-3-haiku-20240307 (Deterministic Tool Calling)
  integrations: [PEXA API, SAILIS API, SA Water EPIC, RevenueSA Online]
  gate_type: HARD_GATE
  idempotency_enforced: true
```

---

## 1. Purpose & Scope
The **PEXA Integration Agent** is the bridge between internal matter records and Australia's national electronic conveyancing platform (PEXA). It is responsible for electronic workspace lifecycle management and financial destination scheduling.

---

## 2. Hard-Gate Settlement Flow

```mermaid
sequenceDiagram
    participant Agent as PEXA Integration Agent
    participant CPMS as ConvenientConveyance Core
    participant User as Human Practitioner (HITL)
    participant PEXA as PEXA National API Gateway

    Agent->>CPMS: Calculate Net Settlement & Destination Lines
    Agent->>CPMS: Stage "HARD GATE" Authorization Card
    Note over User,CPMS: Practitioner clicks "Inspect Breakdown"
    User->>CPMS: Verify line items (Rate adj, discharges, net balance)
    User->>CPMS: Click "Authorise"
    CPMS->>Agent: Emit Verified Authorization Token + Idempotency Key
    Agent->>PEXA: POST /workspaces/{id}/financial-lines
    PEXA-->>Agent: 200 OK (Schedule Locked)
    Agent->>CPMS: Emit Audit Event AUD-PEXA-LOCK
```

---

## 3. Invariants & Guardrails
1. **Zero Unconfirmed Financial Lodgement**: No destination line, payment disbursement, or title transfer is ever committed to PEXA without explicit practitioner click-to-authorise.
2. **Idempotency Key Enforcement**: Every API payload carries a UUIDv7 idempotency key. Network retries can never result in duplicate financial destination lines.
3. **Discharge Cross-Checking**: Net PEXA balance must mathematically balance:
   $$\text{Net PEXA Line} = \text{Purchase Price} - \text{Deposit} + \text{Rates Adjustments} - \text{Mortgage Discharges} \pm \text{Disbursements}$$
