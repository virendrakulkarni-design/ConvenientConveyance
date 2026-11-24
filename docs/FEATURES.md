# ConvenientConveyance — Comprehensive Platform Features Specification
**Conveyancing Practice Management System (South Australia Jurisdiction)**  
**Target Environment:** 100% Cloud-Native & Mobile-First (Desktop, Tablet, Mobile)  
**Version:** 1.2.0 | **Author:** Core Engineering & Product Architecture

---

## 1. Executive Summary & Value Proposition

**ConvenientConveyance** is an agentic, cloud-native Conveyancing Practice Management System (CPMS) engineered specifically to replace legacy, desktop-bound solutions such as triConvey, Smokeball, and LEAP. It combines autonomous multi-agent intelligence with strict statutory human-in-the-loop (HITL) governance, end-to-end cryptographic auditability, and modern consumer-grade client portals.

### Core Architectural Differentiators:
* **Multi-Agent Agentic Stack:** Autonomous agents specialized in document OCR extraction, statutory legal RAG, PEXA settlement compilation, and double-entry trust accounting.
* **Zero Silent Modifications Mandate:** Fiduciary and relationship data can never be altered without explicit human practitioner authorization.
* **Immutable Merkle Audit Ledger:** SHA-256 cryptographically chained audit trail meeting Law Society 7-year statutory retention and audit standards.
* **Native Client Transparency:** Built-in mobile client portal simulator ("Pizza Tracker") keeping property buyers and sellers informed in real-time.
* **Instant Privacy Redaction:** 1-click live PII masking allowing practitioners to present files in open meetings or screen-shares without exposing client contact data.

---

## 2. Multi-Agent Intelligence Architecture

ConvenientConveyance distributes practice operations across four specialized autonomous agents defined with declarative contracts:

```
+-----------------------------------------------------------------------------------+
|                        CONVENIENTCONVEYANCE AGENTIC STACK                         |
+-----------------------------------------------------------------------------------+
                                          |
          +-------------------------------+-------------------------------+
          |                               |                               |
          v                               v                               v
[ Document Intelligence ]      [ Legal Advisory (RAG) ]       [ PEXA Integration ]
  * REISA Contract Ingestion     * SA Stamp Duties Act 1923     * Workspace Provisioning
  * Form 1 Cooling-Off OCR       * First Home Buyer Relief      * Settlement Line Calc
  * SAILIS Title & Encumbrance   * SA Water RD24 Tariffs        * Financial Destination
          |                               |                               |
          +-------------------------------+-------------------------------+
                                          |
                                          v
                         [ Trust Reconciliation Agent ]
                           * 3-Way Law Society Balance
                           * Continuous Anomaly Detection
                           * Negative Balance Intercept
```

### 2.1 Document Intelligence Agent (`agents/document-intelligence-agent.md`)
* Ingests South Australian REISA residential and commercial contracts of sale, Form 1 Vendor Statements, and Land Services SA (SAILIS) title searches.
* Extracts 14+ statutory attributes (Title reference, purchase price, deposit requirements, settlement date, cooling-off dates, easements, encumbrances) with OCR confidence scoring (≥ 98.4%).
* Staged behind a **Soft HITL Gate** via a side-by-side Visual Diff modal before committing changes to the matter master record.

### 2.2 Legal Advisory Agent (`agents/legal-advisory-agent.md`)
* Powers the legal Retrieval-Augmented Generation (RAG) engine grounded in current South Australian statutes (*Stamp Duties Act 1923*, *Land and Business Act 1994*, *Real Property Act 1886*).
* Automatically detects First Home Buyer eligibility and computes tiered relief under Section 14B ($0 duty below $650k, sliding relief up to $700k).
* Resolves SA Water Regulatory Determination 2024–28 (RD24) 3-tier stepped consumption tariffs and metropolitan sewerage formulas.

### 2.3 PEXA Integration Agent (`agents/pexa-integration-agent.md`)
* Provisions digital workspaces on Property Exchange Australia (PEXA), invites counterpart conveyancers and incoming/outgoing mortgagees.
* Compiles financial settlement statements to the exact cent, integrating pro-rata council rates, emergency services levies (ESL), SA Water availability charges, and discharge fees.
* Enforces a mandatory **Hard HITL Gate**: financial destination lines cannot be locked in PEXA without explicit practitioner confirmation.

### 2.4 Trust Reconciliation Agent (`agents/trust-reconciliation-agent.md`)
* Continuously evaluates the statutory 3-Way Reconciliation equation:
  $$\text{Bank Statement Balance} = \text{Cash Book Balance} = \sum \text{Client Matter Sub-Ledgers}$$
* Flags timing differences (unpresented cheques, deposits in transit) and blocks any transaction that would overdraw an individual matter ledger.

---

## 3. Human-in-the-Loop (HITL) Governance & Verification Gates

To prevent AI hallucinations, unauthorized disbursements, or regulatory breaches, all automated agent outputs pass through graded decision gates:

| Gate Level | Color | Scope | Automation Rule |
| :--- | :--- | :--- | :--- |
| **Hard Gate** | Red | Financial lines, PEXA commit, Trust disbursements | **Zero autonomous execution.** Requires explicit practitioner password/authorisation click. |
| **Soft Gate** | Amber | Contract data extraction, Title ingestion | **Staged in Visual Diff.** Practitioner can accept all, reject, or edit individual fields inline. |
| **Advisory Gate** | Blue | Legislative insights, Stamp duty relief, Encumbrance warnings | **Non-blocking recommendations.** Practitioner can apply to checklist or dismiss with reason. |

---

## 4. Comprehensive Feature Catalog

### Feature 1: Autonomous Contract & Form 1 Ingestion with Visual Diff
* **Capability:** Drag-and-drop or upload multi-page contracts of sale and Form 1 disclosure packs.
* **Mechanism:** High-precision OCR isolates legal parties, land identifiers (Volume/Folio), consideration amounts, and cooling-off deadlines.
* **Interface:** Interactive modal displaying Extracted Value, Confidence Score, Current Record, and Discrepancy Flag. Practitioners can edit extracted values directly before committing.

### Feature 2: Real-Time Legislative RAG & SA Stamp Duty Relief Engine
* **Capability:** Automated screening of residential purchases against RevenueSA concessions.
* **Calculations:**
  * Purchases $\le \$650,000$: Full exemption (\$0 stamp duty payable; savings up to \$32,080).
  * Purchases between $\$650,001$ and $\$700,000$: Tiered relief formula ($(\$700,000 - \text{Price}) \times 0.6416$).
  * Purchases $> \$700,000$: Standard statutory stamp duty schedule.
* **Client Alert Generation:** Generates automated formal client advisory notices informing buyers of their estimated tax savings.

### Feature 3: One-Click PEXA Workspace Sync & Settlement Schedule Builder
* **Capability:** Eliminates manual double-entry into PEXA.
* **Workflow:** Translates internal financial statement line items (purchase price, deposit held in trust, SA Water adjustments, council rates, legal disbursements) directly into staged PEXA payment destination lines.
* **Status Sync:** Live status indicator tracks workspace state transitions (*Created $\to$ Signed $\to$ Financials Locked $\to$ Ready $\to$ Settled*).

### Feature 4: Continuous 3-Way Statutory Trust Reconciliation & Overdraw Protection
* **Capability:** Automated reconciliation conforming to the Law Society of South Australia Schedule 2 requirements.
* **Features:**
  * Real-time comparison across bank statement, internal cash book, and individual matter trust sub-ledgers.
  * Instant timing difference identification (e.g., unpresented SA Water search disbursement cheques).
  * Individual client ledger audit drawer showing historical trust receipts, payments, and running balances.

### Feature 5: Matter-Aware Conversational AI Copilot with Contextual Quick Chips
* **Capability:** Contextual AI assistant integrated directly inside the review drawer.
* **Dynamic Grounding:** Automatically binds to the active matter workspace (`window.appRouter.activeMatterId`), dynamically injecting property details, consideration amounts, cooling-off dates, and settlement progress into prompt context.
* **Contextual Quick Chips:** 1-click prompt buttons tailored to conveyancing workflows:
  * `Matter Summary`: High-level brief of parties, property, and key dates.
  * `Cooling-Off Status`: Statutory countdown and service verification.
  * `PEXA Figures`: Net balance breakdown and lender details.
  * `Rates Adjustment`: SA Water per-diem and quarterly calculations.
  * `SMR / Section 7`: Special Meter Reading statutory requirements.
  * `2024-28 Tiers`: Stepped water consumption rates under RD24.
* **Telemetry:** Emits structured `AI_INFERENCE` spans into the audit ledger for every prompt and response.

### Feature 6: Client Settlement Portal Simulator ("Pizza Tracker")
* **Capability:** An interactive smartphone simulator rendering the exact real-time interface seen by property buyers and sellers.
* **Visual Frame:** Apple iPhone-styled mobile device simulator with camera notch, dynamic island, status bar, and responsive touch layout.
* **5-Stage Milestone Progress Tracker:**
  1. *Contract Signed & Ingested* (Form 1 Cooling-Off active)
  2. *Deposit Paid to Trust* (Receipt verified)
  3. *Searches & Encumbrances Reviewed* (Title & council checks complete)
  4. *PEXA Workspace Ready* (Lender funds staged & settlement booked)
  5. *Settlement Day & Key Handover* (Funds transferred & title registered)
* **Financial Transfer Overview:** Displays contract consideration, deposit received, stamp duty concession estimate, and net balance required to complete settlement.
* **Statutory Cooling-Off Rights:** Plain-English explanation of cooling-off rights under Section 5 of the *Land and Business Act 1994*, including active deadline timer.
* **Instant Client Notification:** Integrated WhatsApp action button allowing conveyancers to send simulated milestones directly to client mobile devices.

### Feature 7: Autonomous SAILIS Search Ingestion & Encumbrance Discovery Engine
* **Capability:** Autonomous ingestion and legal interpretation of Lands Titles SA (SAILIS) title search certificates.
* **Extraction:**
  * Scans Register Book Volume/Folio certificates (e.g., CT 5874/412).
  * Isolates registered easements, covenants, encumbrances, water liens, and council statutory charges with an AI OCR confidence score (99.1%).
  * Surfaces detected encumbrances (e.g., *Easement TG 189201 to SA Power Networks across rear 3.05m*).
  * Automatically calculates conveyancing implications: alerts the buyer that permanent structures, pools, and extensions are strictly prohibited within the easement boundary.
* **Automated Compliance Workflow:**
  * 1-click commitment adds a verified compliance task directly into the active matter checklist under **Contract & Terms**.
  * Commits an immutable, cryptographically chained audit record (`AUD-2026-0050`) into the SHA-256 Merkle audit trail.

### Feature 8: Auditor Privacy Mode & Live PII Redaction
* **Capability:** Instant redaction of Personally Identifiable Information (PII) throughout the DOM.
* **Toggle Access:** Dedicated Privacy Mode button in the top navigation bar with active state indicator.
* **Masking Rules:**
  * Client Names: Retains first and last letters with middle characters obscured (e.g., `M••••••t T•i N••••n`).
  * Emails: Preserves domain while masking username (e.g., `m•••••••••••••n@example.com`).
  * Phone Numbers: Masks middle six digits (e.g., `+61 ••• ••• 678`).
  * Financial Balances: Frosted glass blur effect applied to sensitive ledger figures.
* **Interactive Inspection:** Frosted elements unblur seamlessly on practitioner hover and re-blur immediately on exit, enabling private reviews during live client consultations.

### Feature 9: Cryptographic Merkle Audit Ledger & Full OpenTelemetry Observability
* **Capability:** Complete explainability and tamper-evident audit logging for every system event.
* **Merkle Chain Integrity:** Every action (AI inference, user login, PEXA sync, HITL approval, search commit) generates a deterministic 64-character SHA-256 cryptographic hash chained from the previous block. Any manual data tampering immediately invalidates downstream block hashes.
* **Verification Drawer:** Interactive cryptographic audit verification modal with 1-click integrity verification ("All blocks valid & uncorrupted") and JSON dossier export.
* **OpenTelemetry Observability:** Structured distributed trace spans capturing Trace ID, Span ID, timestamp, practitioner ID, and latency metrics.

### Feature 10: Multi-Theme Engine & Mobile-First Responsive PWA Experience
* **Capability:** Fully responsive, zero-dependency modern architecture operating smoothly across mobile phones, tablets, and wide desktop displays.
* **Theme Customization:** 3 curated professional themes:
  * *Agentic Amber* (Default, energetic warm palette)
  * *Corporate Sapphire* (Deep corporate blue)
  * *Modern Emerald* (Crisp, clean green)
* **Responsive Optimizations:** Mobile slide-out drawer, touch-friendly tab navigation, collapsible topbar icons, and responsive dialog viewports.

---

## 5. Competitive Comparison Table vs. Incumbents

| Capability | ConvenientConveyance | triConvey | Smokeball | LEAP |
| :--- | :--- | :--- | :--- | :--- |
| **Architecture** | 100% Cloud-Native PWA | Legacy Windows Client | Hybrid Desktop / Cloud | Desktop / Cloud Hybrid |
| **Agentic AI Stack** | 4 Specialized Agents (OCR, RAG, PEXA, Trust) | None (Static Templates) | Basic AI Drafting | Basic AI Add-on |
| **Visual Contract Diff** | Included (Field-level confidence & 1-click commit) | Not Available | Not Available | Not Available |
| **Client Progress Tracker** | Interactive Mobile Simulator ("Pizza Tracker") | Communio App (Limited) | Client Portal (Standard) | LawConnect |
| **Search Encumbrance AI** | Autonomous Extraction (SAILIS Easements & Rules) | Manual Review | Manual Review | Manual Review |
| **Stamp Duty Engine** | Dynamic RAG (SA FHB Section 14B tiered relief) | Static Lookup Tables | Static Lookup Tables | Third-party Integrations |
| **Trust Reconciliation** | Continuous 3-Way Auto-Reconciliation | Manual Batch Monthly | Manual Batch Monthly | Standard Reconciliation |
| **Audit Ledger Security** | SHA-256 Merkle Chaining + OpenTelemetry | Standard SQL Logs | Standard SQL Logs | Standard Logs |
| **Auditor Privacy Mode** | Live DOM Blur / PII Masking | Not Available | Not Available | Not Available |
| **Mobile Experience** | Fluid Responsive Mobile & Tablet Layout | Limited iOS/Android Companion | Mobile Companion | Mobile Companion |

---

## 6. Statutory Compliance & Jurisdictional Standards

ConvenientConveyance is designed in strict compliance with Australian regulatory frameworks:

1. **ARNECC (Australian Registrars' National Electronic Conveyancing Council):** Model Operating Requirements (MOR) and Model Participation Rules (MPR) compliance for electronic conveyancing and Client Authorization / VOI.
2. **Law Society of South Australia:** Legal Practitioners Act 1981 Trust Accounting Schedule 2 and 3-way monthly reconciliation guidelines.
3. **RevenueSA:** South Australian *Stamp Duties Act 1923* Section 14B first home buyer exemption and tiered relief schedules.
4. **Land and Business (Sale and Conveyancing) Act 1994:** Statutory 2-day cooling-off calculations and Section 7 Form 1 vendor disclosure requisitions.
5. **SA Water Regulatory Determination (RD24):** 2024–28 three-tier stepped residential water usage tariffs, commercial tariffs, and metropolitan sewerage formulas.
