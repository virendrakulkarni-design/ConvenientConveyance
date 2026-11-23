# Conveyancing Legal & Document Workflows Specification
**Jurisdiction:** South Australia (*Real Property Act 1886*, *Land and Business (Sale and Conveyancing) Act 1994*, *SA Water Corporation Act 1994*, ARNECC Model Participation Rules)  
**System:** Conveyancing Practice Management System (CPMS)  
**Version:** 1.0.0

---

## 1. Overview of Conveyancing Document Lifecycle

South Australian property conveyancing requires compliance with strict statutory disclosure timelines, land titles registration rules, electronic settlement protocols (PEXA), and trust accounting regulations. This document defines the end-to-end document workflows supported by the CPMS platform.

```
       [Contract & Form 1 Ingestion]
                     │
                     ▼
       [Document Intelligence AI (OCR)]
                     │
                     ▼
       [Human-in-the-Loop Soft Gate Diff]
                     │
                     ▼
         [Statutory Searches (SAILIS / SA Water)]
                     │
                     ▼
         [Settlement Statement & Apportionments]
                     │
                     ▼
       [PEXA Financial Line Verification & Lock]
                     │
                     ▼
              [Electronic Settlement]
```

---

## 2. Standard Workflows

### 2.1 Workflow 1: Contract Intake & Document Intelligence Extraction

#### Objective
Ingest signed Contract of Sale (Residential or Commercial), extract key legal parameters with high confidence, verify against matter intake record, and flag discrepancy for practitioner approval.

#### Regulatory Precedents
- Standard Form Contract approved by REISA and the Law Society of South Australia.
- Section 66W *Law of Property Act 1936* (Cooling-off waiver certification).

#### Workflow Steps
1. **Document Upload**:
   - Practitioner or assistant uploads PDF into the workspace via `Upload Document` modal.
   - Document Category: `Contract`.
2. **AI Document Intelligence Agent Processing**:
   - Multi-modal OCR extracts the following structured fields:
     - Purchaser full names & tenancy (Joint Tenants vs Tenants in Common).
     - Vendor full names as registered on Certificate of Title.
     - Property legal description: Volume & Folio (e.g. `CT 5874/412`), Plan & Lot number.
     - Purchase consideration, deposit amount, and deposit stakeholder.
     - Scheduled settlement date & special conditions (finance clause, building inspection).
     - Cooling-off expiry date or Section 66W waiver certificate presence.
3. **Soft Gate Staging**:
   - System registers a **Soft Gate HITL Action Card** in the Copilot drawer.
   - Confidence metrics computed (target: ≥ 98.0%).
4. **Practitioner Diff Review**:
   - Practitioner clicks `View Visual Diff` to open `#diff-modal`.
   - Side-by-side comparison of extracted values vs currently unpopulated record.
5. **Commit to Ledger**:
   - On clicking `Approve & Commit to Record`, the matter record updates atomically.
   - State transition logs to the compliance audit trail.

---

### 2.2 Workflow 2: Section 7 Form 1 Vendor Disclosure & Search Management

#### Objective
Verify statutory disclosures mandated under the *Land and Business (Sale and Conveyancing) Act 1994* to ensure the purchaser's cooling-off period correctly commences and no undisclosed encumbrances exist.

#### Statutory Requirements
- **Cooling-Off Period**: Two business days from service of Form 1 or execution of contract (whichever is later).
- **Mandatory Searches**:
  1. **SAILIS Certificate of Title**: Verify registered proprietor, mortgages, caveats, encumbrances, easements, and agreements under *Development Act* / *Planning, Development and Infrastructure Act 2016*.
  2. **SA Water Section 7 Certificate**: Rates balance, sewer connection status, and encumbrances.
  3. **Local Council Search**: Rates assessment, zoning, heritage status, building notifications.
  4. **Emergency Services Levy (ESL)**: Current year assessment and balance.
  5. **RevenueSA Land Tax Certificate**: Single holding calculation and any existing first charge on land.

#### Workflow Steps
1. **Search Request Dispatch**:
   - Matter handler initiates search bundle for property parcel.
2. **SA Water Special Meter Reading (SMR) Booking**:
   - Exactly **14 business days prior to scheduled settlement**, an SMR is booked via SA Water e-Business / SAILIS portal.
   - Meter reader inspects physical water meter within **2 business days before handover**.
3. **Disclosure Review**:
   - Legal Advisory Copilot inspects Section 7 search results for encumbrances (e.g. SA Water drainage easements or heritage orders).
   - If cooling-off waiver (Certificate s66W) was executed, verifies independent legal practitioner signed before contract execution.

---

### 2.3 Workflow 3: Financial Settlement Statement & Statutory Apportionments

#### Objective
Generate the formal Settlement Statement apportioning council rates, SA Water charges, ESL, and strata levies on a strict per-diem basis between vendor and purchaser.

#### Apportionment Principles
All periodic rates and taxes are apportioned as follows:
$$\text{Per Diem Rate} = \frac{\text{Quarterly / Annual Total}}{\text{Days in Rating Period}}$$
- Vendor is liable for the settlement day (in SA, vendor pays up to and including the day of settlement; purchaser pays thereafter).

#### SA Water Rate Apportionment Breakdown (RD24 Determination)
1. **Water Supply Availability Charge**:
   - Fixed at **$74.20 per quarter** ($296.80/year) for residential connections.
   - Apportioned per-diem for the billing quarter of settlement.
2. **Sewerage Charge**:
   - Assessed on the Valuer-General Capital Value:
     - Metropolitan Adelaide: **$0.1535 per $1,000** of Capital Value ($0.614/year per $1k).
     - Country / Regional SA: **$0.2325 per $1,000** of Capital Value ($0.930/year per $1k).
     - Minimum Sewerage Charge: **$79.50/quarter** ($318.00/year).
   - Apportioned per-diem.
3. **Water Consumption (Usage)**:
   - Vendor pays all usage up to settlement date.
   - Calculated either via the SMR reading or daily average formula against the 2024–28 3-Tier tariff:
     - *Tier 1 (0 to 383.6 L/day)*: **$2.126 / kL**
     - *Tier 2 (383.6 to 1,424.7 L/day)*: **$3.035 / kL**
     - *Tier 3 (> 1,424.7 L/day)*: **$3.288 / kL**
4. **Pensioner / DHS Concessions**:
   - Non-transferable. Conveyancer must adjust on the **gross rate figure**, stripping vendor concessions so the purchaser inherits accurate liabilities.

#### Workflow Steps
1. Navigate to Matter Detail > `Settlement Statement` tab.
2. Verify Line Item breakdown:
   - Credit Vendor: Purchase Price + Apportioned Council Rates + Apportioned SA Water + Apportioned ESL.
   - Debit Purchaser: Deposit Paid to Agent + Registration Discharge Fees + Stamp Duty (if applicable).
3. The Net Balance matches the PEXA Line Item.
4. Click `Export PDF` to generate the formal client settlement sheet.

---

### 2.4 Workflow 4: ARNECC Identity Verification (VOI) & Client Authority

#### Objective
Ensure strict compliance with ARNECC Model Participation Rules (Schedule 8) to prevent identity fraud and ensure electronic certificate validity.

#### ARNECC Category 1 Standard
- Australian Passport (current or expired within 2 years) OR Foreign Passport with valid Visa.
- Australian Driver Licence OR Proof of Age Card.
- Face-to-face in-person verification OR certified biometric liveness verification (LiveSign / EasyAML).

#### Workflow Steps
1. Navigate to Matter Detail > `Parties & VOI` tab.
2. Review VOI Status badge:
   - `VERIFIED`: Complete ARNECC Schedule 8 certification on file.
   - `IN_PROGRESS`: LiveSign link dispatched to client mobile/email.
   - `PENDING`: Intake ongoing, awaiting document collection.
   - `EXEMPT`: Authorized Deposit-taking Institutions (ADIs) or corporate entities.
3. Practitioner clicks `Inspect VOI` to inspect government DVS match results and liveness confidence (e.g. 99.4%).
4. Client Authority & Costs Disclosure form is compiled and signed prior to electronic workspace authoring.

---

### 2.5 Workflow 5: Electronic Settlement Execution via PEXA / Sympli

#### Objective
Synchronize the matter record with the national electronic conveyancing platform (PEXA), verify participant readiness, lock financial settlement schedule lines, and execute digital settlement.

#### Electronic Workspace Steps
1. **Workspace Creation & Participant Invitation**:
   - PEXA Integration Agent creates digital workspace linked to Certificate of Title.
   - Invites Discharging Mortgagee (e.g. CBA, NAB) and Incoming Mortgagee (e.g. ANZ, Westpac).
2. **Financial Settlement Schedule Line Verification**:
   - PEXA Agent calculates source of funds: incoming loan proceeds + trust funds held + deposit.
   - Proposes locking the net balance required to settle.
3. **Hard Gate Human-in-the-Loop Signoff**:
   - Conveyancer reviews `Lock PEXA Financial Settlement Line` card in Copilot.
   - Reviews Purchase Price, Deposit, Adjustments, and Net Balance.
   - Clicks `Authorise` to digitally sign off on the financial schedule.
4. **Document Digital Signing**:
   - Transfer of Land (National Mortgage Form) digitally signed using practitioner cryptographic certificate.
5. **Settlement Handover**:
   - At scheduled settlement time, funds transfer via RBA exchange settlement accounts; title registers instantly on SAILIS.
   - System updates matter stage to `5. Completed`.
