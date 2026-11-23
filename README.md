# ConvenientConveyance (CPMS)
### Modern Conveyancing Practice Management System & Agentic AI Stack
*Jurisdiction: South Australia (Land and Business Act 1994, SAILIS, PEXA, ARNECC & ESCOSA RD24)*

---

## 🏛 Overview

**ConvenientConveyance** is an enterprise-grade Conveyancing Practice Management System (CPMS) designed for modern conveyancing practitioners, solicitors, and settlements officers. Built with a focus on precision, compliance, and practitioner ergonomics, the platform integrates an **Agentic AI Human-in-the-Loop (HITL)** architecture to automate routine extraction, reconciliation, and statutory checking while ensuring that legal practitioners maintain absolute supervisory control.

---

## ✨ Key Capabilities

### 1. Human-in-the-Loop (HITL) Review & Verification Panel
- **Hard Gates**: Automated calculation and verification of PEXA electronic settlement balance lines with theme-styled financial breakdown schedules.
- **Soft Gates (Interactive AI Extraction Diff)**: Document intelligence extracts contract metadata with editable values. Practitioners can modify, override, and review extracted fields before committing directly to matter records.
- **Advisory Gates**: Grounded legal & regulatory advisory assistant (RAG) providing real-time compliance guidance for SA Water 2024–28 (RD24) consumption tiers, Section 7 SMR searches, and SA Stamp Duties Act first-home buyer exemptions.

### 2. AI Advisory & Audit Decision Registry (Administration)
- **Applied to Checklist**: Tracks legal recommendations applied to matter task lists with immutable timestamps.
- **Dismissed List**: Retains dismissed advice with full contextual metadata; administrators can re-apply recommendations at any time to the same matter ID.
- **Permanently Discarded**: Irreversible statutory archive with confirmation guardrails, logging permanent discard datetime stamps and locking advice from ever being reapplied.

### 3. Comprehensive Matter Lifecycle Management
- **5-Stage Conveyancing Pipeline**: Tracks files seamlessly across *Enquiry & Intake*, *Contract Signed*, *Searches & Enquiries*, *Settlement Booked*, and *Completed*.
- **Sub-Ledger Trust Accounting**: Real-time statutory trust sub-ledgers, deposit receipts, disbursements, and PKF audit trails.
- **Document Assembly & Merge Engine**: Live previews and merged instance generators for Form 1 Vendor Statements, REISA Contracts of Sale, and Client Costs Disclosures.

### 4. Properties & Title Register with Google Maps Spatial Integration
- **SAILIS Certificate of Title Records**: CT references, plan/allotment identifiers, local council zoning, and capital/site valuation metrics.
- **Interactive Spatial Hovercard**: Instant hovercard displaying coordinates, satellite location, Valuer-General capital value, and direct links to Google Maps.

### 5. Multi-Theme Executive Design System
- **Agentic Amber & Teal**: Dominant Warm Copper Amber (`#C86518`) with Deep Ocean Teal accents (CPMS Agentic Stack).
- **Royal Sapphire & Slate**: Adelaide corporate executive navy and slate.
- **Nordic Arctic & Sky**: High-contrast Scandinavian minimalist green and sky blue.
- **Burgundy & Antique Gold**: Traditional legal heritage claret and antique seal gold.

---

## 📂 Repository Structure

```
ConvenientConveyance/
├── app/                           # Production Web Application (Zero-dependency vanilla)
│   ├── index.html                 # App shell, responsive scaffold, and dialog modals
│   ├── favicon.svg                # Brand legal scales favicon
│   ├── theme.css                  # Design tokens, variables & 4 jurisdictional palettes
│   ├── layout.css                 # Grid layout, sidebar, topbar & search popovers
│   ├── components.css             # KPI cards, data tables, buttons, badges, diff inputs
│   ├── drawer-tour.css            # Human Review HITL drawer & Spotlight Tour overlay
│   ├── styles.css                 # Master CSS entry point (@import modular index)
│   ├── data.js                    # Synthetic seed database (matters, clients, properties, trust)
│   ├── app.js                     # Core application router, state store, and lifecycle
│   ├── view-dashboard.js          # Dashboard view controller & KPI metrics
│   ├── view-workspaces.js         # Matters register & filtering
│   ├── view-matter-detail.js      # Detailed workspace, stage tracker, tabs & file upload
│   ├── view-clients.js            # Clients registry & VOI compliance tracking
│   ├── view-properties.js         # Properties & Title Register with spatial map hovercard
│   ├── view-documents.js          # Document template library, live assembly & merge
│   ├── view-trust.js              # Statutory trust ledger & PKF reconciliation
│   ├── view-settings.js           # Administration, themes & AI Advisory Decision Registry
│   ├── ai-copilot.js              # HITL Human Review controller & advisory logic
│   └── tour.js                    # Interactive onboarding & feature tour
│
├── docs/                          # Architecture Specifications & Regulatory Documents
│   ├── CPMS Agentic AI Stack Design.docx # Primary agentic architecture specification
│   ├── Domain Model & Data.docx          # Entity schemas, state machines & trust models
│   ├── Platform Foundation.docx          # Security, multi-tenancy & PEXA integration
│   ├── Standard & Decisions.docx         # Architectural decision records (ADRs)
│   ├── engg.docx                         # Engineering guidelines & technical roadmap
│   ├── Regulatory-Business-Plan_RD24-submission.pdf # ESCOSA SA Water regulatory plan
│   ├── DOCUMENT_WORKFLOWS.md             # Complete conveyancing document workflows
│   ├── TEST_CASES.md                     # Verification scenarios & test cases
│   └── TEST_SCENARIOS.md                 # End-to-end integration test scenarios
│
├── scripts/                       # Maintenance, extraction & inspection utilities
└── README.md                      # Project documentation & overview
```

---

## 🚀 Getting Started

The application is written in clean, dependency-free vanilla JavaScript, HTML5, and CSS3, requiring no build step or node package installations to run.

### Running with any Local Static HTTP Server

**Using Node / npx:**
```bash
npx serve app -p 8080
```

**Using Python:**
```bash
cd app
python -m http.server 8080
```

Open your browser and navigate to:
```
http://localhost:8080/
```

---

## ⚖️ License & Jurisdiction
Architected for conveyancing practices complying with the **South Australian Land and Business (Sale and Conveyancing) Act 1994**, **Legal Practitioners Act 1981**, and **ARNECC Model Operating Requirements**.
