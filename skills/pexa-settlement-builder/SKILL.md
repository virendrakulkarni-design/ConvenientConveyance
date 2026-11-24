---
name: pexa-settlement-builder
description: Prepares balanced financial settlement schedule destination lines for PEXA electronic workspaces.
---

# PEXA Settlement Builder Skill

## Financial Destination Line Calculation Formula
1. **Base Credit**: `Purchase Price` ($)
2. **Deposit Deduction**: Less `Deposit Held in Trust` ($)
3. **Rates Adjustments**:
   - Council Rates (Pro-rata credit/debit based on paid-to date)
   - SA Water Rates & Special Meter Reading (SMR) consumption
   - Emergency Services Levy (ESL)
4. **Discharge Fees**: Less mortgagee registration and title discharge fees.
5. **Net PEXA Settlement Line**:
   $$\text{Net Due} = \text{Price} - \text{Deposit} + \text{Rates Adjustment} - \text{Discharges}$$

## Mandatory Invariant
The calculated balance must match the PEXA Workspace Financial Settlement Schedule within a **$0.00 variance**. Any discrepancy halts the Hard Gate authorization.
