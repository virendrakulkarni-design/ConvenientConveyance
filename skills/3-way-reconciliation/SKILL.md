---
name: 3-way-reconciliation
description: Mathematical double-entry verification engine for Statutory Trust Accounting compliance.
---

# 3-Way Reconciliation Skill

## Core Invariant
$$\text{Bank Statement Balance} - \text{Unpresented Cheques} + \text{Deposits in Transit} = \text{Cash Book Balance} = \sum_{i=1}^{n} \text{Client Sub-Ledgers}_i$$

## Operational Checks
1. Fetch latest bank cleared balance via Direct Bank API.
2. Sum all active client trust sub-ledgers.
3. Compare against the firm's central trust cash book.
4. If difference $> \$0.00$, isolate timing items (e.g. unpresented search disbursements).
5. If difference is unexplained, flag statutory violation immediately.
