# CPMS End-to-End Test & Demo Scenarios
**Conveyancing Practice Management System (South Australia Jurisdiction)**  
**Version:** 1.0.0 | **Audience:** QA Engineers, Product Demonstrators, Conveyancing Practitioners

---

## 1. Scenario Catalog

| Scenario ID | Title | Property / Reference | Primary Focus |
| :--- | :--- | :--- | :--- |
| `SCN-01` | Urgent Residential Purchase Settlement | 57 Prospect Rd, Norwood (`2026-0184`) | PEXA Line Locking, SMR Rates, Stage Advance |
| `SCN-02` | High-Value Commercial Acquisition | 92 O'Connell St, North Adelaide (`2026-0178`) | Trust Allocation, Section 7 SMR, Corporate Client |
| `SCN-03` | AI Ingestion & Visual Diff Approval | 4/88 King William Rd, Hyde Park (`2026-0201`) | OCR Extraction, Soft Gate Diff, Cooling-off |
| `SCN-04` | Statutory Trust 3-Way Reconciliation Audit | Practice-wide Trust Ledger | Law Society Audit, Unpresented Cheque, New Receipt |
| `SCN-05` | New Matter Onboarding & Filtering Demo | 14 Beulah Rd, Norwood | Create File, Search & Filters, Lifecycle Pipeline |

---

## 2. Detailed Test Scenarios

### Scenario 1 (`SCN-01`): Urgent Residential Purchase Settlement
**Context:** A high-value residential property in Norwood is scheduled to settle in 3 days. ANZ Bank is the incoming lender, and the financial settlement line must be locked in PEXA.

#### Step-by-Step Execution:
1. **Launch App**: Open `http://localhost:8080/#/dashboard`.
2. **Review Priority Settlements**:
   - Locate matter `2026-0184` in the "Settlements in Priority Order" table.
   - Note the red urgency badge: `26/11/2026 (3d)`.
3. **Open Workspace**:
   - Click the row or click `Open File`.
   - Verify workspace loads at `#/workspaces/mt-1`.
   - Header confirms: `57 Prospect Road, Norwood SA 5067`, Title: `CT 5874/412`, Price: `$1,250,000.00`.
4. **Inspect Settlement Statement**:
   - Switch to the `Settlement Statement` tab.
   - Verify purchase price ($1,250,000.00), less deposit ($125,000.00), plus SA Water adjustments ($144.05) and council rates ($482.20).
   - Verify Net Balance Required to Settle: `$1,125,226.25`.
   - Click `Export PDF` to simulate client statement generation.
5. **Human-in-the-Loop Financial Line Authorisation**:
   - Open the **Agentic AI Copilot** drawer (`#ai-toggle-btn`).
   - Locate the **Hard Gate** card: `[2026-0184] Lock PEXA Financial Settlement Line`.
   - Click `Inspect Breakdown` to view line-item calculation.
   - Click `Authorise`.
   - Confirm state transition: notification confirms line locking in the PEXA audit ledger.
6. **Advance Matter Stage**:
   - In the workspace header, click `Sync PEXA` (button transitions to `PEXA Synced (Just now)`).
   - In the 5-Stage Life Cycle Pipeline, click step `5. Completed`.
   - Toast confirms matter status updated to "Completed".

---

### Scenario 2 (`SCN-02`): High-Value Commercial Acquisition with Section 7 SMR
**Context:** Harrison Property Group Pty Ltd is acquiring a prime mixed-use commercial asset on O'Connell Street, North Adelaide for $3,450,000.00.

#### Step-by-Step Execution:
1. **Find File via Global Search**:
   - In the topbar `#global-search` box, type `Harrison`.
   - The predictive dropdown displays `[2026-0178] 92 O'Connell Street, North Adelaide SA 5006`.
   - Click the search result item to navigate directly to the workspace.
2. **Review Commercial Details**:
   - Review property CT `6044/12` and commercial purchase price: `$3,450,000.00`.
   - Notice Cooling-Off status: `Commercial / Not Applicable` (statutory exemption for commercial transactions under SA law).
3. **Verify SMR Search Ingestion**:
   - Switch to the `Documents` tab.
   - Verify document `SA Water SMR Search Certificate` is on file.
4. **Query SA Water Commercial Tariffs via Copilot**:
   - Open AI Copilot drawer.
   - In RAG chat, ask: *"What is the commercial water usage rate under RD24?"*
   - Copilot confirms: *Flat $3.035 / kL for all commercial / non-residential usage*.
5. **Inspect Trust Sub-Ledger**:
   - Switch to `Trust Ledger` tab.
   - Verify commercial deposit: `TR-8890` +$345,000.00 held in statutory trust.

---

### Scenario 3 (`SCN-03`): AI Document Ingestion & Soft Gate Visual Diff
**Context:** A newly signed contract has arrived for a strata unit on King William Road. The Document Intelligence Agent has extracted the fields with 98.4% confidence and requires human review.

#### Step-by-Step Execution:
1. **Navigate to Hyde Park Workspace**:
   - Navigate to `#/workspaces`.
   - In `#workspace-search`, type `Hyde Park`.
   - Click row `2026-0201` (`4/88 King William Road`).
2. **Trigger Visual Diff**:
   - In workspace header, click `AI Contract Diff` (or open Copilot drawer and locate `[2026-0201] Contract Data Extraction Ready for Review`).
   - Click `View Visual Diff`.
3. **Inspect Field-by-Field Diff**:
   - Review `#diff-modal`:
     - Purchase Price: Extracted `$740,000.00` (99.8% confidence) vs Current `$0.00`.
     - Deposit Required: Extracted `$74,000.00` (99.5% confidence).
     - Settlement Date: Extracted `18/12/2026` (98.2% confidence).
     - Cooling-Off Period: Extracted `Expires 25/11/2026 5:00 PM` (96.9% confidence).
4. **Approve & Commit**:
   - Click `Approve & Commit to Record`.
   - Modal closes, toast confirms commitment, and proposal card clears from Copilot queue.
5. **Post Contract Deposit to Trust**:
   - In the workspace header, click `Parties & VOI` or navigate to `#/trust`.
   - Click `New Trust Receipt`.
   - Select Matter `2026-0201`.
   - Enter Payer: `Siddharth & Priya Mehta`, Amount: `74000.00`, Method: `EFT / Direct Credit`, Description: `Contract 10% Deposit`.
   - Click `Issue Trust Receipt`.
   - Toast confirms trust receipt issued.

---

### Scenario 4 (`SCN-04`): Statutory Trust Accounting 3-Way Reconciliation Audit
**Context:** The practice is performing its mandatory monthly trust accounting reconciliation in compliance with the *Legal Practitioners Act 1981* and Law Society of SA regulations.

#### Step-by-Step Execution:
1. **Navigate to Trust Accounting**:
   - Click `Trust Accounting` in the sidebar (`#/trust`).
2. **Review 3-Way Balance Tiles**:
   - Card 1: Client Ledger Balance = `$845,865.00`.
   - Card 2: Bank Statement Balance = `$845,480.00`.
   - Card 3: Reconciliation Discrepancy = `$385.00`.
   - Reason: *One unpresented cheque (Chq #004128 to SA Water) not yet debited by bank*.
3. **Execute Live Reconciliation**:
   - Click `Reconcile Now` in the header.
   - System connects to simulated NAB Trust API.
   - Toast confirms: *"Reconciliation Complete: All client ledgers match cash book. Zero unallocated funds."*
4. **Audit Matter Sub-Ledgers**:
   - In the Matter Trust Sub-Ledger Balances table, find `2026-0184` (Margaret Thi Nguyen).
   - Balance: `$124,615.00`.
   - Click `View Journal`.
   - `#view-journal-modal` opens showing all transactions:
     - `25/10/2026`: Deposit Receipt `TR-8941` +$125,000.00
     - `02/11/2026`: Search Disbursement `TR-9022` -$385.00 (SAILIS & SA Water)
     - Net Sub-Ledger Balance: `$124,615.00`.
   - Click `Close`.

---

### Scenario 5 (`SCN-05`): Opening a New File & Testing Real-Time Filtering
**Context:** A new client walks in to open a conveyancing file for a residential purchase in Norwood.

#### Step-by-Step Execution:
1. **Open New Matter Modal**:
   - Go to `#/workspaces`.
   - Click `+ Create New File`.
2. **Complete Intake Form**:
   - Matter Reference: Auto-populated (e.g. `2026-0215`).
   - Transaction Type: `Purchase (Purchaser Side)`.
   - Property Address: `14 Beulah Road, Norwood SA 5067`.
   - Title Reference: `CT 6210/118`.
   - File Manager: `Demo Conveyancer`.
   - Client Name: `Alexander & Sophie Wright`.
   - Client Email: `alex.wright@example.com`.
   - Purchase Consideration: `$850,000.00`.
   - Deposit Held: `$85,000.00`.
   - Settlement Date: `15/01/2027`.
   - Initial Stage: `2. Contract Signed`.
3. **Submit & Verify Workspace**:
   - Click `Open Matter File`.
   - Toast confirms matter initialized.
   - App automatically navigates to the new workspace!
   - Pipeline shows stage 2 ("Contract Signed") active.
4. **Test Dynamic Filtering in Workspaces**:
   - Click `← Back to Workspaces`.
   - Total matters count is now `10`.
   - In `#workspace-search`, type `Beulah`.
   - Table immediately filters to only `2026-0215` (`14 Beulah Road`).
   - Select "Purchases Only" -> file remains visible.
   - Select "Sales Only" -> table displays empty state (*"No matters match your filter criteria"*).
   - Click `Reset` -> all 10 matters re-appear.
5. **Verify Clients Register**:
   - Navigate to `#/clients`.
   - `Alexander & Sophie Wright` is now registered with active matters: 1.
