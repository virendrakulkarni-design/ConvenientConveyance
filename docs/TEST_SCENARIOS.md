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
| `SCN-06` | Client Settlement Portal Mobile Experience | 57 Prospect Rd, Norwood (`2026-0184`) | Mobile Simulator, Live Pizza Tracker, WhatsApp Sync |
| `SCN-07` | Autonomous Search Ingestion & Encumbrance Sync | 57 Prospect Rd, Norwood (`2026-0184`) | SAILIS Title Scan, Easement Extraction, Merkle Audit |
| `SCN-08` | Auditor Privacy Mode & Live PII Redaction | Practice-wide & Matter Files | Real-time DOM Blur, Client Masking, Auditor Mode |

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

---

### Scenario 6 (`SCN-06`): Client Settlement Portal Mobile Experience ("Pizza Tracker")
**Context:** A homebuyer wants to know their settlement progress on their smartphone without calling the conveyancer repeatedly. The practitioner uses the built-in Client Portal Simulator to preview and verify what the client sees.

#### Step-by-Step Execution:
1. **Open Matter Workspace**:
   - Navigate to `#/workspaces/mt-1` (57 Prospect Road, Norwood).
2. **Launch Client Portal Simulator**:
   - In the workspace header, click `Client Portal Preview`.
   - The interactive Apple iPhone-styled smartphone simulator modal opens (`#client-portal-modal`).
3. **Inspect Real-Time Settlement Tracker ("Pizza Tracker")**:
   - Observe the 5-step client milestone stepper:
     - Step 1: *Contract Signed & Ingested* (Green checkmark, Done).
     - Step 2: *Deposit Paid to Trust* (Green checkmark, Done).
     - Step 3: *Searches & Encumbrances Reviewed* (Green checkmark, Done).
     - Step 4: *PEXA Workspace Ready* (Blue pulse, Active — Settlement booked for 26/11/2026).
     - Step 5: *Settlement Day & Key Handover* (Grey, Pending).
4. **Inspect Financial Transfer Balance**:
   - Review the financial summary card:
     - Purchase Consideration: `$1,250,000.00`.
     - Deposit Paid: `$125,000.00` (10.0% deposited).
     - Stamp Duty Concession Estimate: Standard conveyance (non-FHB).
     - Net Balance Remaining to Complete: `$1,125,000.00`.
5. **Verify Statutory Rights & Client WhatsApp Action**:
   - Review the statutory cooling-off notice box.
   - Click `Send Update to Client via WhatsApp`.
   - Toast confirms WhatsApp notification dispatch to client mobile number.
6. **Close Simulator**:
   - Click the close button (`×`) above the mobile frame or press `Esc`.

---

### Scenario 7 (`SCN-07`): Autonomous SAILIS Search Ingestion, Encumbrance Discovery & Cryptographic Audit Commit
**Context:** A digital search certificate from Land Services SA (SAILIS) is ingested for 57 Prospect Road (`CT 5874/412`). The Document Intelligence Agent analyzes registered encumbrances and detects a statutory power easement that impacts building regulations.

#### Step-by-Step Execution:
1. **Trigger Ingestion**:
   - On the matter workspace (`#/workspaces/mt-1`), click `Ingest SAILIS Search`.
   - `#search-ingestion-modal` opens showing the simulated Lands Titles SA search result.
2. **Review AI OCR Extraction & Risk Determination**:
   - Search Type: *SAILIS Register Book Volume/Folio Certificate (CT 5874/412)*.
   - AI OCR Confidence: `99.1%`.
   - Detected Encumbrance: *Easement TG 189201 to SA Power Networks (SAPN) across rear 3.05m of allotment*.
   - Automated Conveyancing Implication: *Alert buyer that permanent structures, pools, and shed extensions are strictly prohibited within 3.05m of the rear boundary*.
3. **Commit Encumbrance to Active Matter Checklist**:
   - Click `Commit Encumbrance & Sync Checklist`.
   - Modal closes, and a success toast confirms checklist and audit synchronization.
4. **Verify Active Matter Checklist**:
   - Switch to the `Contract & Terms` tab.
   - Locate the **Active Compliance Checklist**.
   - Confirm new automated task is present:
     - *SAILIS Title Search Review: Verify Easement TG 189201 to SA Power Networks (3.05m along rear boundary). Confirm no unapproved structures breach easement boundary.*
     - Tagged with `AI Auto-Ingested` and `99.1% Confidence`.
5. **Verify Immutable Merkle Audit Entry**:
   - In the top navigation bar, open Human Review drawer (`#ai-toggle-btn`) or click `Audit Trail`.
   - Verify audit record `AUD-2026-0050` is committed with action: *Autonomous Search Ingestion: Registered Easement TG 189201 committed to matter compliance checklist*.
   - Confirm valid SHA-256 block hash chained from previous block.

---

### Scenario 8 (`SCN-08`): Auditor Privacy Mode & Live PII Redaction During Client Consultations
**Context:** The conveyancing practitioner is screen-sharing during a client video conference or open audit. To prevent unauthorized exposure of other clients' names, personal emails, and phone numbers, Privacy Mode is activated.

#### Step-by-Step Execution:
1. **Activate Privacy Mode**:
   - In the topbar, locate the `Privacy Mode` button (`#privacy-toggle-btn`).
   - Click `Privacy Mode`.
   - Button turns purple with an open eye icon and active glow.
2. **Inspect Redaction in Workspaces**:
   - Navigate to `#/workspaces`.
   - Client names across all matter rows are automatically masked:
     - "Margaret Thi Nguyen" appears as `M••••••t T•i N••••n`.
     - "Harrison Property Group" appears as `H••••••n P••••••y G•••p`.
     - "Siddharth & Priya Mehta" appears as `S•••••••h & P••••a M•••a`.
3. **Inspect Redaction in Matter Workspace**:
   - Click into matter `2026-0184`.
   - Header client name is masked.
   - Switch to `Parties & VOI` tab:
     - Client emails are masked (e.g., `m•••••••••••••n@example.com`).
     - Client phone numbers are masked (e.g., `+61  ••• ••• 678`).
4. **Test Dynamic Hover Unmasking**:
   - Move the mouse cursor directly over any masked field.
   - Notice the frosted blur effect transitions to sharp, unblurred text instantly.
   - Move mouse away: text returns to blurred privacy state immediately.
5. **Deactivate Privacy Mode**:
   - Click `Privacy Mode` in the topbar again.
   - All fields restore to normal unmasked rendering without requiring a page reload.
