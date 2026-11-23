# CPMS Test Cases Specification
**Conveyancing Practice Management System (South Australia Jurisdiction)**  
**Version:** 1.0.0 | **Author:** Core Engineering & Quality Assurance  
**Target Environment:** Chrome, Edge, Safari, Firefox (Desktop & Tablet)

---

## 1. Test Suite Overview

This document specifies the functional, regression, and validation test cases for the CPMS application. Each test case includes test identifiers, prerequisites, execution steps, expected outcomes, and verification criteria.

| Suite ID | Functional Module | Priority | Test Count |
| :--- | :--- | :--- | :--- |
| `TC-DSH` | Practice Dashboard & KPIs | High | 4 |
| `TC-WKS` | Workspaces Master Register & Reactive Filtering | Critical | 6 |
| `TC-MAT` | Matter File Lifecycle & Sub-Tabs | Critical | 8 |
| `TC-NEW` | Create New File (Matter Initialization) | Critical | 4 |
| `TC-DOC` | Document Intelligence & Upload Management | High | 5 |
| `TC-VOI` | ARNECC Identity Verification (VOI) Inspection | High | 3 |
| `TC-TRU` | Statutory Trust Accounting & 3-Way Reconciliation | Critical | 5 |
| `TC-COP` | Agentic AI Copilot & HITL Decision Gates | High | 5 |
| `TC-RAG` | SA Water RD24 & Legal RAG Advisory Chat | High | 4 |

---

## 2. Test Case Specifications

### 2.1 Practice Dashboard & Navigation (`TC-DSH`)

#### `TC-DSH-001`: Dashboard Initialization & KPI Counts
- **Objective:** Verify that on initial launch (`#/dashboard`), KPI metric tiles accurately aggregate data from `CPMS_STORE`.
- **Pre-conditions:** App launched at `http://localhost:8080/#/dashboard`.
- **Test Steps:**
  1. Observe the top 4 KPI cards: "Active Matters", "Settling Within 14 Days", "Awaiting Identity / VOI", "Trust Ledger Balance".
  2. Verify the values match `CPMS_STORE.matters.length` (9), settling soon count, and total trust ledger balance (`$845,865.00`).
- **Expected Outcome:** All four metrics display accurate values and subtext without NaN or undefined errors.
- **Status:** Pass

#### `TC-DSH-002`: Priority Settlements Ordering
- **Objective:** Ensure the "Settlements in Priority Order" table correctly sorts matters by impending settlement date.
- **Test Steps:**
  1. Inspect the "Settlements in Priority Order" table.
  2. Check matters settling in ≤ 4 days (e.g. `2026-0184` with 3 days left).
- **Expected Outcome:** Urgent matters show highlighted red warning badges (`26/11/2026 (3d)`). Completed matters show neutral badges.
- **Status:** Pass

#### `TC-DSH-003`: Interactive Spotlight Tour Launch
- **Objective:** Verify the multi-route guided tour initializes properly.
- **Test Steps:**
  1. Click "Start Tour" in the dashboard header or sidebar footer.
  2. Advance using the "Next →" button or right arrow key (`ArrowRight`).
  3. Press `Esc` or click "Skip Tour".
- **Expected Outcome:** Spotlight moves across DOM elements smoothly; backdrop dims background; Esc terminates tour cleanly.
- **Status:** Pass

#### `TC-DSH-004`: Global Predictive Topbar Search
- **Objective:** Verify predictive search dropdown operates across matters, clients, and properties.
- **Test Steps:**
  1. Type "Norwood" into the topbar search input (`#global-search`).
  2. Verify dropdown `#global-search-dropdown` opens with categorized sections ("Matters", "Properties").
  3. Click `[2026-0184] 57 Prospect Road, Norwood SA 5067`.
- **Expected Outcome:** Dropdown closes, input clears, and route navigates directly to `#/workspaces/mt-1`.
- **Status:** Pass

---

### 2.2 Workspaces & Reactive Filtering (`TC-WKS`)

#### `TC-WKS-001`: Workspace Table Listing
- **Objective:** Verify all active matters render in the Workspaces table with correct transaction badges.
- **Test Steps:**
  1. Navigate to `#/workspaces`.
  2. Check the table rows and count label (`Showing 9 active matters`).
- **Expected Outcome:** Table shows Reference, Type, Property, Client, Price, Settlement Date, Stage, Handler, and Action button.
- **Status:** Pass

#### `TC-WKS-002`: Search Input Filtering
- **Objective:** Test real-time substring search on reference, property address, client name, and manager.
- **Test Steps:**
  1. In `#workspace-search`, type `Nguyen`.
  2. In `#workspace-search`, type `CT 6102/89`.
  3. In `#workspace-search`, type `Rebecca`.
- **Expected Outcome:** Table updates immediately on each keypress; count indicator reflects matched subset; non-matching rows are hidden.
- **Status:** Pass

#### `TC-WKS-003`: Transaction Type Filter
- **Objective:** Filter by Purchase vs Sale.
- **Test Steps:**
  1. Select "Purchases Only" from `#workspace-filter-type`.
  2. Select "Sales Only" from `#workspace-filter-type`.
- **Expected Outcome:** "Purchases Only" displays only matters with `badge-blue` (PURCHASE). "Sales Only" displays only matters with `badge-green` (SALE).
- **Status:** Pass

#### `TC-WKS-004`: Milestone Stage Filter
- **Objective:** Filter matters by lifecycle progress stage.
- **Test Steps:**
  1. Select "Settlement Booked" from `#workspace-filter-stage`.
  2. Verify matters displayed (e.g., `2026-0184`, `2026-0167`).
- **Expected Outcome:** Only files with stage "Settlement booked" render.
- **Status:** Pass

#### `TC-WKS-005`: Combined Filters & Empty State
- **Objective:** Test multiple simultaneous filters and verify friendly empty state.
- **Test Steps:**
  1. Select "Purchases Only", Stage "Completed", and search for "NonExistentAddress".
- **Expected Outcome:** Table renders single row: *"No matters match your filter criteria. Try adjusting the search or filters."*
- **Status:** Pass

#### `TC-WKS-006`: Reset Filters
- **Objective:** Test "Reset" button clears all filter controls.
- **Test Steps:**
  1. Apply search and dropdown filters.
  2. Click "Reset".
- **Expected Outcome:** Inputs clear, select resets to "All", and all matters restore.
- **Status:** Pass

---

### 2.3 Create New File / Matter Initialization (`TC-NEW`)

#### `TC-NEW-001`: Modal Dialog Launch & Reference Auto-Sequencing
- **Objective:** Verify clicking "Create New File" opens the native `<dialog>` with next file reference pre-filled.
- **Test Steps:**
  1. On Workspaces page, click `+ Create New File`.
  2. Inspect `#new-matter-ref`.
- **Expected Outcome:** `#create-matter-modal` opens via native `showModal()`; reference is automatically sequenced (e.g. `2026-0213`).
- **Status:** Pass

#### `TC-NEW-002`: Form Validation
- **Objective:** Verify mandatory field constraints (*).
- **Test Steps:**
  1. Clear required fields and click "Open Matter File".
- **Expected Outcome:** Native browser validation or alert prevents submission until required fields are provided.
- **Status:** Pass

#### `TC-NEW-003`: Successful Matter Creation & Reactive State Update
- **Objective:** Verify submitting valid matter data updates the store, UI badges, and redirects.
- **Test Steps:**
  1. Fill form:
     - Reference: `2026-0215`
     - Type: Purchase
     - Property: `14 Beulah Road, Norwood SA 5067`
     - Title: `CT 6210/118`
     - Client: `Alexander & Sophie Wright`
     - Email: `alex.wright@example.com`
     - Price: `$850,000.00`
     - Settlement Date: `15/01/2027`
  2. Click "Open Matter File".
- **Expected Outcome:**
  - Modal closes.
  - Success toast appears: *"New Matter 2026-0215 (14 Beulah Road...) initialized successfully!"*.
  - Matter is prepended to `CPMS_STORE.matters`.
  - Client and Property records are registered.
  - View navigates to `#/workspaces/<newId>`.
- **Status:** Pass

#### `TC-NEW-004`: Modal Cancellation
- **Objective:** Ensure "Cancel" or `Esc` closes the modal without altering state.
- **Test Steps:**
  1. Open modal, type partial data, and click "Cancel".
- **Expected Outcome:** Modal closes; `CPMS_STORE.matters.length` is unchanged.
- **Status:** Pass

---

### 2.4 Matter Lifecycle Workspace & Sub-Tabs (`TC-MAT`)

#### `TC-MAT-001`: Matter Detail Routing & Header Details
- **Objective:** Verify opening a workspace displays correct title, client, and file handler.
- **Test Steps:**
  1. Navigate to `#/workspaces/mt-1`.
  2. Inspect breadcrumbs, property title, and client name.
- **Expected Outcome:** Header displays `57 Prospect Road, Norwood SA 5067`, `CT 5874/412`, `Margaret Thi Nguyen`, `$1,250,000.00`.
- **Status:** Pass

#### `TC-MAT-002`: 5-Stage Lifecycle Pipeline Interactive Advance
- **Objective:** Verify clicking any stage in the pipeline updates the matter's status.
- **Test Steps:**
  1. In the 5-stage pipeline, click step "5. Completed".
  2. Observe stage styling and toast.
  3. Click step "4. Settlement Booked".
- **Expected Outcome:** Stage updates immediately; toast notification confirms transition; visual steps update with `.done` and `.current` classes.
- **Status:** Pass

#### `TC-MAT-003`: PEXA Electronic Settlement Workspace Sync
- **Objective:** Test simulated PEXA sync button.
- **Test Steps:**
  1. Click "Sync PEXA" in workspace header.
- **Expected Outcome:** Button displays temporary spinning state, updates to "PEXA Synced (Just now)", and toast notification appears.
- **Status:** Pass

#### `TC-MAT-004`: Parties & VOI Tab
- **Objective:** Verify parties on title, mortgagees, and real estate agents render.
- **Test Steps:**
  1. Switch to "Parties & VOI" tab.
  2. Verify Purchaser (`Margaret Thi Nguyen`), Vendors (`David & Sarah Miller`), Mortgagee (`ANZ`).
- **Expected Outcome:** Role badges, contact details, and VOI status pills render accurately.
- **Status:** Pass

#### `TC-MAT-005`: Add Settlement Party Modal
- **Objective:** Verify adding a new party (e.g. Conveyancer for Vendor) to the workspace.
- **Test Steps:**
  1. Click `Add Party`.
  2. Enter Name: `Johnston Conveyancing`, Role: `Practitioner for Other Party`, Email: `settlements@johnston.com.au`.
  3. Click `Save Party`.
- **Expected Outcome:** Party is appended to `matter.parties`; tab table re-renders; toast confirms addition.
- **Status:** Pass

#### `TC-MAT-006`: Contract & Terms Tab
- **Objective:** Verify purchase consideration, deposit, execution date, and stamp duty estimates display.
- **Test Steps:**
  1. Switch to "Contract & Terms" tab.
- **Expected Outcome:** Displays purchase price `$1,250,000.00`, deposit `$125,000.00`, scheduled settlement, Section 66W waiver status, and estimated stamp duty.
- **Status:** Pass

#### `TC-MAT-007`: Settlement Statement & Rate Adjustments Tab
- **Objective:** Check financial adjustment calculation breakdown.
- **Test Steps:**
  1. Switch to "Settlement Statement" tab.
  2. Inspect line items: Purchase Price, Deposit, Council Rates, SA Water Rates & Sewerage Adjustment, ESL, Discharge Fee.
  3. Verify Net Balance Required to Settle matches `$1,125,226.25`.
  4. Click "Export PDF".
- **Expected Outcome:** Net balance correctly matches PEXA financial line; browser print preview triggers.
- **Status:** Pass

#### `TC-MAT-008`: Trust Ledger Tab in Workspace
- **Objective:** Verify matter sub-ledger transactions render for the active file.
- **Test Steps:**
  1. Switch to "Trust Ledger" tab.
- **Expected Outcome:** Renders deposit receipt (`TR-8941` +$125,000.00), search disbursement (`TR-9022` -$385.00), and net balance (`$124,615.00`).
- **Status:** Pass

---

### 2.5 Document Intelligence & Uploads (`TC-DOC`)

#### `TC-DOC-001`: Document Upload Modal Launch
- **Objective:** Verify "Upload Document" opens ingestion modal for current matter.
- **Test Steps:**
  1. On Documents tab, click `Upload Document`.
- **Expected Outcome:** `#upload-document-modal` opens with pre-filled target matter reference.
- **Status:** Pass

#### `TC-DOC-002`: File Selection Simulation
- **Objective:** Select a mock document file and verify size/name detection.
- **Test Steps:**
  1. Click the dashed dropzone area.
  2. Select any local PDF file.
- **Expected Outcome:** Dropzone text updates to green with file name and size in MB; document title field automatically populates.
- **Status:** Pass

#### `TC-DOC-003`: Ingestion & AI OCR Extraction
- **Objective:** Ingest document and verify table addition.
- **Test Steps:**
  1. Enter Title: `SA Water Section 7 Certificate`.
  2. Select Category: `Search`.
  3. Click `Ingest Document`.
- **Expected Outcome:** Modal closes; toast confirms AI OCR ingestion; document appears in table; tab badge increments.
- **Status:** Pass

---

### 2.6 ARNECC Identity Verification (VOI) Inspection (`TC-VOI`)

#### `TC-VOI-001`: Inspect VOI Modal Launch
- **Objective:** Verify clicking "Inspect VOI" on any party opens the ARNECC audit certificate modal.
- **Test Steps:**
  1. In Parties & VOI tab, click "Inspect VOI" on Margaret Thi Nguyen.
- **Expected Outcome:** `#inspect-voi-modal` opens displaying ARNECC Category 1 verification details, passport DVS match, and biometric liveness score (99.4%).
- **Status:** Pass

#### `TC-VOI-002`: Gateway Re-Verification
- **Objective:** Test simulated re-verification against government DVS gateway.
- **Test Steps:**
  1. Click "Re-Verify Gateway".
- **Expected Outcome:** Modal closes and toast confirms: *"VOI Certificate re-verified against DVS gateway."*
- **Status:** Pass

---

### 2.7 Statutory Trust Accounting (`TC-TRU`)

#### `TC-TRU-001`: 3-Way Reconciliation Display
- **Objective:** Verify client ledger, bank statement, and difference values match statutory audit requirements.
- **Test Steps:**
  1. Navigate to `#/trust`.
  2. Verify Client Ledger Balance ($845,865.00), Bank Balance ($845,480.00), Discrepancy ($385.00).
- **Expected Outcome:** Discrepancy accurately identifies unpresented cheque #004128 to SA Water.
- **Status:** Pass

#### `TC-TRU-002`: Post New Trust Receipt
- **Objective:** Post trust deposit money and verify sub-ledger updates.
- **Test Steps:**
  1. Click `New Trust Receipt`.
  2. Select Matter: `2026-0201` (S. & P. Mehta).
  3. Enter Payer: `Siddharth Mehta`, Amount: `74000`, Method: `EFT / Direct Credit`, Description: `10% Contract Deposit`.
  3. Click `Issue Trust Receipt`.
- **Expected Outcome:** Receipt reference (e.g. `TR-9214`) generates; sub-ledger updates; toast confirms issuance; accounts table reflects updated balance.
- **Status:** Pass

#### `TC-TRU-003`: View Journal Audit Trail
- **Objective:** View full transaction history for a specific matter sub-ledger.
- **Test Steps:**
  1. Click "View Journal" on `2026-0184`.
- **Expected Outcome:** `#view-journal-modal` opens showing all credits, debits, transaction dates, and running balances.
- **Status:** Pass

#### `TC-TRU-004`: Reconcile Now Execution
- **Objective:** Test real-time automated 3-way reconciliation run.
- **Test Steps:**
  1. Click "Reconcile Now" in trust accounting header.
- **Expected Outcome:** Toast indicates API connection to bank, followed by verification success confirmation.
- **Status:** Pass

---

### 2.8 Agentic AI Copilot & HITL Decision Gates (`TC-COP`)

#### `TC-COP-001`: Copilot Drawer Toggle
- **Objective:** Toggle the AI Copilot right-hand drawer.
- **Test Steps:**
  1. Click the "AI Copilot" button in the topbar or the close icon inside the drawer.
- **Expected Outcome:** Drawer smoothly slides into viewport from right; active badge indicates pending practitioner actions.
- **Status:** Pass

#### `TC-COP-002`: Hard Gate Practitioner Approval
- **Objective:** Test authorising a high-stakes financial line (PEXA Financial Line Locking).
- **Test Steps:**
  1. Locate `[2026-0184] Lock PEXA Financial Settlement Line` (Hard Gate).
  2. Click `Authorise`.
- **Expected Outcome:** State transition commits to audit ledger; proposal is dismissed; badge counter decrements.
- **Status:** Pass

#### `TC-COP-003`: Soft Gate Visual Diff Inspection
- **Objective:** Test opening and reviewing extracted document data vs existing record.
- **Test Steps:**
  1. Locate `[2026-0201] Contract Data Extraction Ready for Review` (Soft Gate).
  2. Click `View Visual Diff`.
- **Expected Outcome:** `#diff-modal` opens showing field comparison table (Purchase Price, Deposit, Settlement Date, Cooling-Off) with confidence scores (>96%).
- **Status:** Pass

#### `TC-COP-004`: Visual Diff Approval & Commit
- **Objective:** Approve diff from modal and commit to matter record.
- **Test Steps:**
  1. In `#diff-modal`, click `Approve & Commit to Record`.
- **Expected Outcome:** Modal closes, data commits to Matter 2026-0201 record, proposal card clears.
- **Status:** Pass

#### `TC-COP-005`: Advisory Gate Dismissal / Acknowledgment
- **Objective:** Acknowledge first-home buyer stamp duty exemption notice.
- **Test Steps:**
  1. Locate Advisory Gate card for Matter 2026-0210.
  2. Click `Apply to Checklist`.
- **Expected Outcome:** Task is appended to matter checklist; card clears.
- **Status:** Pass

---

### 2.9 SA Water RD24 & Statutory RAG Chat (`TC-RAG`)

#### `TC-RAG-001`: Click Suggested SA Water Question Chips
- **Objective:** Verify clicking quick suggestion chips populates and executes query.
- **Test Steps:**
  1. In the AI Copilot drawer, click the `Settlement Adjustment` chip.
- **Expected Outcome:** Input populates, user message sends, and Copilot responds with the exact per-diem SA Water adjustment formula ($74.20/qtr availability + sewerage + usage).
- **Status:** Pass

#### `TC-RAG-002`: SA Water 2024-28 (RD24) Consumption Tiers
- **Objective:** Query 3-tier stepped water consumption pricing.
- **Test Steps:**
  1. Click `2024-28 Consumption Tiers` chip or ask *"What are the water tiers?"*.
- **Expected Outcome:** Copilot outputs:
  - Tier 1 (0 to 383.6 L/day): $2.126 / kL
  - Tier 2 (383.6 to 1,424.7 L/day): $3.035 / kL
  - Tier 3 (> 1,424.7 L/day): $3.288 / kL
- **Status:** Pass

#### `TC-RAG-003`: Adelaide Metropolitan Sewerage Formula
- **Objective:** Verify Valuer-General Capital Value rate calculation.
- **Test Steps:**
  1. Click `Metro Sewerage Formula` chip.
- **Expected Outcome:** Copilot explains $0.1535 per $1,000 property value ($0.614/year per $1k) and minimum sewerage charge of $79.50/quarter ($318.00/year).
- **Status:** Pass

#### `TC-RAG-004`: Special Meter Reading (SMR) & Section 7 Rule
- **Objective:** Query statutory meter reading requirements under *Land and Business (Sale and Conveyancing) Act 1994*.
- **Test Steps:**
  1. Click `SMR / Section 7 Rule` chip.
- **Expected Outcome:** Copilot explains the 14-day pre-settlement booking rule, physical read within 2 business days of handover, and warning that unpaid water rates remain a charge on the land.
- **Status:** Pass
