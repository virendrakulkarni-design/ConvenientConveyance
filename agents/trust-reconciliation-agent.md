# Trust Reconciliation Agent

```yaml
agent:
  id: trust-reconciliation-agent
  name: Statutory Trust Accounting & Reconciliation Agent
  tier: statutory-accounting-engine
  version: 3.0.0
  model: Deterministic Engine (Zero LLM Inference)
  jurisdiction: South Australia
  governing_law: Legal Practitioners Act 1981 (SA) Schedule 2 & Conveyancers Act 1994 (SA)
  reconciliation_type: 3-Way Real-Time Continuous
```

---

## 1. Purpose & Scope
The **Trust Reconciliation Agent** monitors and reconciles client trust funds held in statutory trust accounts. Unlike routine monthly accounting checks, this agent runs continuous 3-way reconciliation to guarantee that zero client sub-ledgers are overdrawn and zero funds are left unallocated.

---

## 2. Mathematical 3-Way Reconciliation Invariant

The agent continuously enforces the Law Society 3-way balance equation:

$$\text{Bank Statement Balance} - \text{Unpresented Cheques} + \text{Deposits in Transit} \equiv \text{Internal Cash Book} \equiv \sum_{i=1}^{n} \text{Client Sub-Ledgers}_i$$

* If **Variance $\neq \$0.00$**: Instantly triggers an alert badge and restricts further trust disbursements on the affected matter sub-ledger until resolved.
* **Proactive Overdraw Prevention**: Before any cheque or electronic transfer is authorized, the agent checks `client_sub_ledger.balance - proposed_disbursement >= 0`. If negative, the transaction is hard-blocked.
