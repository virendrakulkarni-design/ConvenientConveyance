# Governance Rule: Human-in-the-Loop (HITL) Gate Framework

```yaml
rule:
  id: RULE-GOV-002
  name: Human-in-the-Loop (HITL) Gate Tiers
  enforcement: MANDATORY_STRICT
  scope: ALL AGENT OPERATIONS & STATE MUTATIONS
```

---

## 1. Gate Definitions & Escalation Matrix

Every agent action belongs to one of three strictly defined gate tiers:

### Tier 1: HARD GATE (Red)
* **Trigger Conditions:** Any action that moves real money, locks a PEXA financial settlement line, issues a trust disbursement, or lodges an electronic legal document with the Registrar-General.
* **Agent Capability:** Autonomous preparation only. The agent calculates and balances, but **cannot call execution endpoints**.
* **Requirement:** Mandatory explicit practitioner sign-off via a line-item modal (e.g., `#pexa-breakdown-modal`).
* **Audit Requirement:** Cryptographic SHA-256 event logged with practitioner ID and timestamp.

### Tier 2: SOFT GATE (Amber)
* **Trigger Conditions:** Extraction of contractual parameters from uploaded PDFs, client data onboarding, or Form 1 disclosure ingestion.
* **Agent Capability:** Autonomous extraction and proposal staging.
* **Requirement:** Interactive side-by-side Visual Diff modal allowing practitioner inline field editing or 1-click commit.
* **Audit Requirement:** Diff state captured (before vs after) in the immutable ledger.

### Tier 3: ADVISORY GATE (Blue)
* **Trigger Conditions:** Legal RAG insights, stamp duty relief suggestions, or regulatory compliance alerts.
* **Agent Capability:** Autonomous generation and triage recommendation.
* **Requirement:** Triaging workflow with "Apply to Checklist", "Dismiss", or irreversible "Permanent Discard".
