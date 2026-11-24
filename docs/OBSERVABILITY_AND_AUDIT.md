# ConvenientConveyance — Observability & Statutory Audit Trail Architecture

---

## 1. Executive Summary & Regulatory Mandate

In legal conveyancing and statutory trust accounting, software operations are subject to strict legal liability and rigorous professional oversight:
* **ARNECC Model Participation Rules (MPR v6)**: Requires an unbroken, tamper-evident chain of custody for all digital land transactions and electronic settlement authorizations.
* **Law Society of South Australia (Schedule 2)**: Demands complete, immutable auditing of trust account journals, disbursements, and 3-way reconciliations.
* **ISO 27001 & SOC 2 Type II Compliance**: Dictates comprehensive system observability, non-repudiation, and structured logging of all human and automated actions.
* **Agentic AI Explainability Standards**: Every AI inference, document parameter extraction, and legal advisory must carry full telemetry, model provenance, confidence metrics, and deterministic justification.

ConvenientConveyance provides an enterprise-grade **Observability & Statutory Audit Ledger** designed to make every activity **explainable and replayable** from both an **end-user practitioner** and an **external auditor** perspective.

---

## 2. Observability & Telemetry Architecture

Every system operation is instrumented using an **OpenTelemetry-compatible schema**, capturing deep operational metrics alongside domain data:

```
+-----------------------------------------------------------------------------------------+
|                                    AUDIT EVENT RECORD                                   |
+-----------------------------------------------------------------------------------------+
| [Core Metadata]                                                                         |
|  - id: AUD-2026-0045                     - timestamp: 2026-11-24T08:15:22.140Z          |
|  - matterRef: 2026-0184                  - category: PEXA_TRANSACTION                   |
|  - severity: CRITICAL                    - action: "Authorised PEXA Settlement Line"    |
+-----------------------------------------------------------------------------------------+
| [Actor Context]                                                                         |
|  - type: USER | AGENT | SYSTEM           - name: "Demo Conveyancer"                     |
|  - role: "Senior Conveyancer"            - ip: "10.14.2.88" / session: "sess_7f991c"    |
+-----------------------------------------------------------------------------------------+
| [Explainability & Reasoning]                                                            |
|  - rationale: "Practitioner inspected and verified financial destination line..."      |
|  - confidence: 100%                      - governingRule: "ARNECC MPR v6 Clause 5.2"    |
+-----------------------------------------------------------------------------------------+
| [OpenTelemetry Tracing]                                                                 |
|  - traceId: tr-7f41a0e9b201              - spanId: sp-9902                              |
|  - durationMs: 420 ms                    - model: "Direct Human Verification (HITL)"    |
|  - tokens: prompt=0, completion=0        - temperature: 0.0                             |
+-----------------------------------------------------------------------------------------+
| [Cryptographic Hash Chain]                                                              |
|  - prevHash:  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855         |
|  - eventHash: 9a2f7c3905e1b626e2df4a9386d4e2840c884cbbe531f82e811776510a74d284         |
|  - verified:  true (SHA-256 Merkle Link)                                                |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Cryptographic Tamper-Evident Ledger (SHA-256)

To guarantee that past audit logs cannot be altered, deleted, or backdated:
1. **Hash Chaining**: Each audit entry incorporates the cryptographic hash of the preceding entry (`prevHash`), the current timestamp, actor identity, action type, and JSON payload:
   $$\text{eventHash} = \text{SHA-256}(\text{prevHash} \mathbin{\Vert} \text{timestamp} \mathbin{\Vert} \text{action} \mathbin{\Vert} \text{payload})$$
2. **Append-Only Immutability**: Any modification to a historical event's parameters instantly invalidates the hashes of all subsequent events in the ledger.
3. **One-Click Auditor Verification**: The UI includes a built-in **Verify Chain** tool (`auditObservability.verifyChainModal()`) that recalculates the cryptographic chain across all ledger blocks in real time and certifies ledger integrity.

---

## 4. End-User & Auditor Explainability

Every event captured in ConvenientConveyance answers four core audit questions:

1. **Who executed the action?**
   - Human User (Conveyancer, Admin, Principal with authenticated session and IP).
   - AI Agent (e.g. Document Intelligence Agent v2.4, Legal Advisory Agent RAG, PEXA Integration Agent).
   - System Process (e.g. Statutory Trust 3-Way Reconciler).
2. **Why was the action taken?**
   - Natural-language rationale explaining the trigger and logic.
   - For AI agents: Confidence score (0.0 to 1.0) and model telemetry (model ID, latency, prompt/completion tokens).
   - Statutory reference (e.g. *Section 14B Stamp Duties (Relief Measures) Amendment Act 2024 (SA)*, *Section 7 Land and Business Act 1994*).
3. **What data changed?**
   - State transition diff recording the exact **Before State** and **After State**.
   - Full transaction payload preserved in raw JSON format.
4. **Is it reproducible?**
   - Every event can be re-evaluated through the **Deterministic Replay Engine**.

---

## 5. Deterministic Replay Engine

Auditors require the ability to "step back in time" and verify how a specific state was reached.

The built-in **Replay Engine** (`auditObservability.replayEvent(id)`):
* Extracts the pre-event state snapshot from the ledger.
* Applies the event's recorded parameters through the deterministic state transition rules.
* Compares the resulting output hash against the immutable ledger hash.
* Confirms zero state divergence, proving that no unauthorized background mutations occurred.

---

## 6. Real-Time Event Interception Points

The Observability Engine automatically intercepts and records activities across all system modules:

| Event Category | Triggering Action | Captured Observability Data |
| :--- | :--- | :--- |
| **PEXA_TRANSACTION** | Financial schedule line authorisation; workspace sync | Destination line breakdown, incoming/outgoing mortgagee info, ARNECC compliance rules, practitioner 2FA confirmation. |
| **AI_INFERENCE** | Contract of Sale PDF upload & OCR extraction | Extracted fields, confidence percentages per field, token usage, latency, visual diff state. |
| **LEGAL_ADVISORY** | Stamp Duty / Regulatory RAG evaluation | State legislation section, computed savings, RAG vector distance, corpus version citation. |
| **TRUST_RECONCILIATION**| Statutory 3-Way Trust Reconciliation | Bank feed balance, cash book balance, sum of client sub-ledgers, identified unpresented cheques/discrepancies. |
| **HITL_DECISION** | Soft/Hard Gate approval, advisory dismissal/discard | Practitioner ID, timestamp, approval/rejection rationale, confirmation safeguards. |
| **STAGE_PROGRESSION** | Matter workflow milestone transition | Previous stage, new stage, milestone checklist status. |

---

## 7. Export & External Compliance Reporting

For external audits by the **Law Society**, **RevenueSA**, or **PEXA compliance officers**:
* **Export Audit Dossier (JSON)**: Produces a fully structured machine-readable JSON export with complete cryptographic proofs, telemetry headers, and payloads.
* **Export Audit Dossier (CSV)**: Generates a tabular CSV formatted for spreadsheet review and regulatory submission.

Both exports are available on-demand with a single click from the **Administration & Observability Panel** (`#/settings`) or directly within each matter's workspace (`#/workspaces/mt-1` &rarr; *Audit Trail & Telemetry* tab).
