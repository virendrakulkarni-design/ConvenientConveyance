# Governance Rule: Statutory Legal & Audit Compliance

```yaml
rule:
  id: RULE-COMP-001
  name: Statutory Legal & Audit Compliance Standards
  enforcement: MANDATORY_STRICT
  statutes:
    - Electronic Conveyancing National Law (ECNL)
    - ARNECC Model Participation Rules (MPR v6)
    - Legal Practitioners Act 1981 (SA) Schedule 2
    - Conveyancers Act 1994 (SA)
```

---

## 1. 7-Year Immutable Record Retention
Under South Australian conveyancing law, all matter files, signed client authorizations, Form 1 disclosure packages, trust receipts, and audit event logs must be preserved immutably for **a minimum of seven (7) years** from the settlement completion date.

## 2. Cryptographic Audit Log Immutability
* All audit records must maintain a continuous SHA-256 Merkle chain.
* Database triggers and table permissions must strictly prevent `UPDATE` or `DELETE` operations on `audit_log` tables.
* Every administrative export (JSON or CSV) must carry cryptographic proofs verifying that zero records were omitted or altered.
