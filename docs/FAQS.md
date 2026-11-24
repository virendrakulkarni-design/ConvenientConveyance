# ConvenientConveyance — Frequently Asked Questions (FAQs)

---

## 1. Architecture & Technology

### Q1.1: Are we using PostgreSQL as our database?
**Yes.** The core production backend architecture is designed around **PostgreSQL 16 or newer** hosted on Oracle Cloud Infrastructure (OCI, Sydney region).

* **Multi-Tenancy Isolation:** The database uses a shared database and shared schema model with **PostgreSQL Row-Level Security (RLS)**. Every business table contains a `tenant_id` column, and database sessions enforce strict tenant separation at the query engine level.
* **Vector Store & RAG:** Rather than managing an external vector database (such as Pinecone or Milvus), we leverage the native **`pgvector`** PostgreSQL extension. This co-locates relational conveyancing matter data with vector embeddings for the South Australian legal corpus, the *Stamp Duties Act*, and firm-specific precedent documents.
* **Immutable Audit Trail:** Statutory compliance (such as the 7-year document retention mandate) is backed by an append-only PostgreSQL ledger table with Write-Ahead Logging (WAL) cryptographic hash chaining.
* **Frontend Web Application:** The browser application (`app/`) is a decoupled Single Page Application (SPA). For local demonstrations and previews, it utilizes a reactive client-side store (`CPMS_STORE`) that synchronizes state with zero latency, designed to connect directly to the production NestJS + PostgreSQL REST and GraphQL endpoints.

---

## 2. Statutory Trust Accounting & Reconciliation

### Q2.1: What is the Trust Account Reconciliation step doing?
Under Australian conveyancing regulations (such as the *Conveyancers Act 1994* and the Law Society of South Australia rules), conveyancing practices must maintain statutory trust accounts and conduct regular **3-Way Trust Reconciliations**.

The Reconciliation engine continuously verifies that three distinct sources of financial truth remain in exact mathematical balance:

```
+-------------------------------------------------------------+
|                     3-WAY RECONCILIATION                    |
+------------------------------+------------------------------+
                               |
         +---------------------+---------------------+
         |                                           |
         v                                           v
[ 1. Bank Statement Balance ] <=====> [ 2. Internal Cash Book Balance ]
(Actual funds held at NAB/Macquarie)   (Receipts, payments & journals)
                                                     ^
                                                     |
                                                     v
                                      [ 3. Sum of Client Sub-Ledgers ]
                                       (Individual matter trust balances)
```

1. **Bank Statement Balance:** The cleared cash balance shown on the bank statement.
2. **Cash Book Balance:** The running balance of all recorded trust deposits, transfers, and disbursements.
3. **Client Sub-Ledgers Sum:** The total sum of individual client matter ledger balances (e.g., Matter 2026-0184: \$124,615.00).

### Q2.2: How does ConvenientConveyance handle reconciliation automatically?
* **Automated Bank Feed Comparison:** Automatically checks transactions from bank feeds against the internal trust cash book.
* **Discrepancy Identification:** Immediately flags timing differences (e.g., unpresented cheques such as SA Water search fees, or deposits in transit).
* **Negative Balance Prevention:** Blocks any proposed disbursement or transfer that would result in a client sub-ledger falling below zero, preventing statutory compliance breaches before transactions occur.

---

## 3. PEXA Integration & Digital Settlement

### Q3.1: What is the PEXA Sync functionality?
**PEXA (Property Exchange Australia)** is Australia’s national online property settlement platform used by conveyancers, lawyers, and financial institutions to complete property transfers and financial exchanges electronically.

The **PEXA Sync functionality** in ConvenientConveyance automates the interaction between internal matter files and the PEXA workspace:

1. **Automated Workspace Provisioning:** Upon contract unconditional approval, the system creates the electronic workspace in PEXA, attaches Title References (Volume/Folio), and invites the counterpart conveyancer and mortgagees (e.g., ANZ, Commonwealth Bank).
2. **Financial Settlement Schedule Line Generation:** The agent automatically calculates net balance requirements (Purchase Price minus Deposit, pro-rata council rates, emergency services levies, SA Water adjustments, and discharge fees) and prepares the financial destination lines.
3. **Hard-Gate Human-in-the-Loop (HITL) Authorisation:** Financial transactions and title changes represent significant fiduciary risk. The AI agent calculates and prepares the schedule, but **never commits funds to PEXA without explicit human sign-off**. The conveyancer inspects the visual line-by-line breakdown modal and clicks "Authorise" to execute.
4. **Milestone Synchronization:** Automatically tracks PEXA status transitions (*Workspace Created &rarr; Documents Signed &rarr; Financial Line Locked &rarr; Settlement Ready &rarr; Settled*) and updates client milestones in real time.

---

## 4. Competitive Differentiation vs. triConvey

### Q4.1: How does ConvenientConveyance stand out from market leaders like triConvey?
**triConvey** (by Dye & Durham / Smokeball) is the incumbent conveyancing solution in Australia, but it relies on legacy desktop architectures and static rule-based templates. ConvenientConveyance delivers significant technological and workflow advantages:

| Capability | triConvey / Incumbents | ConvenientConveyance Advantage |
| :--- | :--- | :--- |
| **AI Architecture** | Basic mail-merge fields and static document templates. | **Autonomous Agentic Stack**: Multi-agent architecture with specialized agents (Document Intelligence, Legal RAG Advisory, PEXA Integration, Task Planner). |
| **Contract Ingestion** | Manual contract data entry. The conveyancer reads 60+ PDF pages and manually types dates, names, and clauses. | **Automated AI Extraction with Visual Diff**: Ingests contracts of sale in seconds, extracts 14+ key fields with confidence scores, and presents a visual diff modal with 1-click accept or inline field editing. |
| **Regulatory & Stamp Duty Advice** | Relies entirely on the conveyancer's personal knowledge of recent legislative changes. | **Live RAG Legal Advisory Gate**: Automatically screens contracts against current state legislation (e.g., SA June 2024 First Home Buyer Stamp Duty exemption up to \$650k, tiered relief to \$700k) and auto-generates client savings alerts. |
| **Search Parsing** | Facilitates ordering searches, but returned council/EPA/title PDFs must still be manually read and reviewed. | **Automated Search Encumbrance Detector**: Ingests search result PDFs, extracts easements, covenants, zoning alerts, and contamination flags into the active matter checklist. |
| **Settlement Adjustments** | Manual adjustment sheet calculations; manual PEXA destination data entry. | **One-Click PEXA Settlement Balance Sheet**: Automatically parses council rate notices & SA Water bills, calculates pro-rata adjustments to the cent, and stages verified lines into PEXA. |
| **Platform Accessibility** | Desktop-centric (often requires Windows desktop installs or companion software). | **100% Cloud-Native & Mobile-First**: Works on any device (iOS, Android, iPad, Mac, Windows) with responsive sliding navigation drawers and touch-optimized review panels. |
| **Trust Accounting Safety** | Periodic monthly reconciliation. | **Continuous 3-Way Reconciliation**: Real-time discrepancy detection and proactive overdraw prevention. |

---

## 5. Human-in-the-Loop (HITL) Governance

### Q5.1: How do we prevent AI hallucinations or unauthorized changes?
ConvenientConveyance enforces strict **Human-in-the-Loop (HITL) Gates**:
* **Hard Gates (Red):** Used for financial transactions (locking PEXA settlement lines, issuing trust disbursements). The AI can only prepare the data; it cannot submit or transfer funds without practitioner authorization.
* **Soft Gates (Amber):** Used for document ingestion and matter updates. The AI extracts parameters and presents a field-by-field diff for the conveyancer to verify, edit, or reject.
* **Advisory Gates (Blue):** Used for legal suggestions and regulatory alerts (e.g., stamp duty concessions). Practitioners can apply recommendations to the matter checklist, dismiss them, or discard them with a complete audit record (including timestamps and practitioner ID).
* **Strict Relationship Rules:** The system never infers or modifies contact or matter relationships without explicit practitioner confirmation.
