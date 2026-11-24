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
| `TC-AIC` | Matter-Aware Conversational AI Copilot | High | 4 |
| `TC-CPT` | Client Settlement Portal Simulator ("Pizza Tracker") | High | 4 |
| `TC-SRC` | Autonomous Search Ingestion & Encumbrance Sync | Critical | 4 |
| `TC-PRV` | Privacy Mode & Live PII Redaction | High | 4 |

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

---

### 2.10 Matter-Aware Conversational AI Copilot (`TC-AIC`)

#### `TC-AIC-001`: Active Matter Dynamic Context Injection
- **Objective:** Verify Copilot chat inherits active matter file parameters dynamically when opened from a workspace.
- **Test Steps:**
  1. Navigate to Matter `2026-0184` (`57 Prospect Road`).
  2. Open AI Copilot drawer (`#ai-toggle-btn`).
  3. Verify drawer subtext displays: *"Grounding: Active Matter 2026-0184 (57 Prospect Road, Norwood SA 5067)"*.
- **Expected Outcome:** Chat context reflects active file parameters without manual matter ID input.
- **Status:** Pass

#### `TC-AIC-002`: Contextual Quick Prompt Chips
- **Objective:** Verify clicking quick prompt chips populates input and triggers relevant domain responses.
- **Test Steps:**
  1. Click `Matter Summary` chip.
  2. Click `PEXA Figures` chip.
  3. Click `Cooling-Off Status` chip.
- **Expected Outcome:** Copilot provides immediate matter-specific answers citing price ($1,250,000), deposit ($125,000), ANZ mortgagee details, and cooling-off expiry.
- **Status:** Pass

#### `TC-AIC-003`: Custom Statutory Conveyancing Queries
- **Objective:** Test natural language legal queries.
- **Test Steps:**
  1. In chat input, ask: *"What are the stamp duty savings if this buyer is an eligible first home buyer?"*
- **Expected Outcome:** Copilot explains Section 14B rules: properties above $700,000 pay standard duty ($58,830 for $1,250,000) while properties under $650,000 pay $0.
- **Status:** Pass

#### `TC-AIC-004`: OpenTelemetry Tracing & AI Observability
- **Objective:** Verify every AI inference logs a structured telemetry span.
- **Test Steps:**
  1. Send a query in Copilot chat.
  2. In the audit ledger (`auditObservability`), verify an `AI_INFERENCE` record is generated with trace ID, span ID, prompt, and execution timestamp.
- **Expected Outcome:** Telemetry entry committed with valid SHA-256 Merkle link.
- **Status:** Pass

---

### 2.11 Client Settlement Portal Simulator (`TC-CPT`)

#### `TC-CPT-001`: Phone Simulator Modal Launch
- **Objective:** Ensure "Client Portal Preview" button launches the simulated Apple iPhone mobile modal.
- **Test Steps:**
  1. In matter workspace, click `Client Portal Preview`.
- **Expected Outcome:** `#client-portal-modal` opens displaying smartphone frame with notch, battery/wifi indicators, and responsive screen container.
- **Status:** Pass

#### `TC-CPT-002`: 5-Stage Milestone Tracker ("Pizza Tracker")
- **Objective:** Verify client milestone progress reflects actual matter lifecycle stage.
- **Test Steps:**
  1. Open preview for Matter `2026-0184` (Stage 4 / Settlement Booked).
  2. Inspect the 5 milestone steps:
     - Step 1: Contract Signed (Done, green check)
     - Step 2: Deposit Paid (Done, green check)
     - Step 3: Searches & Encumbrances (Done, green check)
     - Step 4: PEXA Workspace Ready (Active, blue pulsing badge)
     - Step 5: Settlement Day (Pending, grey badge)
- **Expected Outcome:** Correct steps marked done, active, and pending without visual offset.
- **Status:** Pass

#### `TC-CPT-003`: Financial Transfer Balance & Statutory Rights Card
- **Objective:** Verify calculation of purchase price, deposit received, and remaining settlement funds.
- **Test Steps:**
  1. In the client portal screen, inspect the Financial Balance card.
  2. Verify: Consideration = $1,250,000.00; Deposit = $125,000.00; Balance to Complete = $1,125,000.00.
  3. Inspect cooling-off rights text and statutory contact details.
- **Expected Outcome:** Financial math matches matter record to the cent; plain-English cooling-off explanation clearly rendered.
- **Status:** Pass

#### `TC-CPT-004`: WhatsApp Notification Simulation
- **Objective:** Verify conveyancer-to-client mobile notification action.
- **Test Steps:**
  1. In the simulator footer, click `Send Update to Client via WhatsApp`.
- **Expected Outcome:** Toast notification confirms WhatsApp dispatch simulation to registered client mobile number; simulator closes smoothly.
- **Status:** Pass

---

### 2.12 Autonomous Search Ingestion & Encumbrance Sync (`TC-SRC`)

#### `TC-SRC-001`: Search Ingestion Dialog Launch
- **Objective:** Verify "Ingest SAILIS Search" button opens search ingestion modal.
- **Test Steps:**
  1. On workspace header, click `Ingest SAILIS Search`.
- **Expected Outcome:** `#search-ingestion-modal` opens with Land Services SA (SAILIS) certificate preview, volume/folio reference (CT 5874/412), and AI extraction breakdown.
- **Status:** Pass

#### `TC-SRC-002`: AI OCR Encumbrance & Easement Extraction
- **Objective:** Ensure Document Intelligence Agent correctly extracts statutory easements and computes compliance rules.
- **Test Steps:**
  1. Review detected encumbrance card:
     - Easement TG 189201 to SA Power Networks (SAPN)
     - Width: 3.05m along rear boundary
     - AI OCR Confidence: 99.1%
     - Restriction Rule: No permanent structures, swimming pools, or extensions permitted within 3.05m of rear boundary.
- **Expected Outcome:** All four fields accurately rendered with amber risk badge.
- **Status:** Pass

#### `TC-SRC-003`: 1-Click Checklist Synchronization
- **Objective:** Verify committing encumbrance updates active matter compliance checklist.
- **Test Steps:**
  1. In `#search-ingestion-modal`, click `Commit Encumbrance & Sync Checklist`.
  2. Navigate to `Contract & Terms` tab.
  3. Inspect the Active Compliance Checklist.
- **Expected Outcome:** New compliance item dynamically injected with `AI Auto-Ingested` and `99.1% Confidence` badges.
- **Status:** Pass

#### `TC-SRC-004`: Cryptographic Merkle Audit Commitment
- **Objective:** Confirm search ingestion is logged to immutable Merkle audit ledger.
- **Test Steps:**
  1. Check audit log entries.
  2. Locate record `AUD-2026-0050`.
- **Expected Outcome:** Record contains action `Autonomous Search Ingestion: Registered Easement TG 189201 committed to matter compliance checklist` with valid SHA-256 hash chaining.
- **Status:** Pass

---

### 2.13 Privacy Mode & Live PII Redaction (`TC-PRV`)

#### `TC-PRV-001`: Privacy Mode Toggle Activation
- **Objective:** Verify clicking `#privacy-toggle-btn` activates privacy mode and updates UI state.
- **Test Steps:**
  1. Click `Privacy Mode` in topbar.
- **Expected Outcome:** Button gains `.active-privacy` styling; `document.body` receives `.privacy-mode` class; icon changes to active state.
- **Status:** Pass

#### `TC-PRV-002`: Client Name Masking in Master Tables & Headers
- **Objective:** Verify all client names across workspaces and detail headers are redacted.
- **Test Steps:**
  1. In Privacy Mode, navigate to `#/workspaces`.
  2. Inspect client column.
- **Expected Outcome:** Names masked with middle characters dotted (e.g. `M••••••t T•i N••••n`).
- **Status:** Pass

#### `TC-PRV-003`: Sensitive Contact Details Redaction (Parties & VOI)
- **Objective:** Verify email addresses and phone numbers are redacted in matter workspace.
- **Test Steps:**
  1. Open Matter `2026-0184` `Parties & VOI` tab while Privacy Mode is active.
- **Expected Outcome:** Emails masked preserving domain (`m•••••••••••••n@example.com`); phone numbers masked concealing middle digits (`+61 ••• ••• 678`).
- **Status:** Pass

#### `TC-PRV-004`: Interactive Hover Unmasking
- **Objective:** Verify practitioner can temporarily reveal sensitive data on hover without disabling system privacy mode.
- **Test Steps:**
  1. While in Privacy Mode, hover mouse cursor over masked client name or email.
  2. Move cursor away.
- **Expected Outcome:** On mouseenter, element transitions from blurred to crisp readable text; on mouseleave, element re-blurs instantly.
- **Status:** Pass
