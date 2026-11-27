# ConvenientConveyance — New Conveyancer End-to-End Walkthrough
**Role:** New Conveyancer Onboarding & Functional Flow Guide  
**Use Case:** *Sarah Connor's First Home Purchase — 14 Beulah Road, Norwood SA 5067 ($620,000.00)*

---

## 🎯 Why This Demo?
If you are a **new conveyancer** entering ConvenientConveyance for the first time, this guide walks you through **one complete, real-world South Australian residential purchase** from initial file creation to settlement, client portal preview, and data backup.

---

## 📹 Short Video Chapters (Functional Flows)

| Chapter | Flow Covered | Key Screens Used |
| :--- | :--- | :--- |
| **Part 1** | **Onboarding & File Creation** | Dashboard $\to$ Workspaces $\to$ `+ Create New File` |
| **Part 2** | **Parties & AI Legal Assistant** | Parties Register (`#/parties`) $\to$ AI Assistant + Help (`?`) |
| **Part 3** | **SAILIS Search, Trust & PEXA** | Matter Detail $\to$ SAILIS Search $\to$ Trust Accounting $\to$ Human Review |
| **Part 4** | **Client Portal, Privacy & Backup** | Client Portal Preview $\to$ Privacy Mode $\to$ Export `.json` |

---

## 🧭 Step-by-Step End-to-End Walkthrough

### Step 1: Enter the System & Create a New Matter File
1. Open **http://localhost:8080/#/dashboard**.
2. Review the 4 practice KPIs (*Active Matters*, *Settling Within 14 Days*, *Awaiting VOI*, *Trust Ledger Balance*).
3. Click **New Matter** (or navigate to **Workspaces** $\to$ **+ Create New File**).
4. Enter the new conveyancing file details:
   * **Transaction Type:** `Purchase (Purchaser Side)`
   * **Property Address:** `14 Beulah Road, Norwood SA 5067`
   * **Title Reference:** `CT 6210/118`
   * **Client Name:** `Sarah Connor`
   * **Client Email:** `sarah.connor@example.com`
   * **Purchase Price:** `$620,000.00`
   * **Deposit Held:** `$62,000.00`
   * **Settlement Date:** `15/01/2027`
   * **Initial Stage:** `2. Contract Signed`
5. Click **Open Matter File**. The system automatically creates the workspace and opens it.

---

### Step 2: Check All Parties in the Dedicated Parties Register
1. Click **Parties** in the left sidebar (`#/parties`).
2. Notice the **KPI cards** at the top (*Total Parties*, *Buyers / Purchasers*, *Sellers / Vendors*, *Mortgagees & Agents*).
3. Filter by **Buyers / Purchasers** or search `Sarah Connor` to verify her role on the file, contact details, and ARNECC VOI status.
4. Click **Open File** on Sarah's row to jump straight back into her Matter Workspace.

---

### Step 3: Use the AI Conveyancing Assistant (with Help Guide)
1. Click **AI Assistant** (the cyan sparkles button in the top bar).
2. Click the **Help icon (`?`)** in the AI Assistant header to see:
   * How **Active Matter Grounding** automatically reads `14 Beulah Road` without re-typing.
   * What statutes are indexed (*SA Water RD24*, *Section 7 SMR*, *Stamp Duties Act 1923*, *ARNECC VOI*).
3. Click the **`Matter Summary`** quick prompt chip to get an instant brief of Sarah's file.
4. Ask: *"What is the stamp duty for a $620,000 first home buyer?"*
   * Because the price is under `$650,000`, SA Section 14B grants a **full stamp duty exemption ($0 payable)**.

---

### Step 4: Ingest SAILIS Title Search & Sync Compliance Checklist
1. In the Matter Workspace header, click **Ingest SAILIS Search**.
2. Review the AI OCR extraction (`99.1%` confidence) flagging **Easement TG 189201** (SA Power Networks 3.05m rear boundary).
3. Click **Commit Encumbrance & Sync Checklist**.
4. Switch to the **Contract & Terms** tab to confirm the easement compliance task was automatically added and logged to the **Audit Trail** tab.

---

### Step 5: Record Trust Deposit & Run 3-Way Reconciliation
1. Click **Trust Accounting** in the left sidebar (`#/trust`).
2. Click **New Trust Receipt**, select Sarah's matter, enter Payer `Sarah Connor`, Amount `62000`, Method `EFT`, Description `10% Contract Deposit`, and click **Issue Trust Receipt**.
3. Click **Reconcile Now** to run the Law Society 3-Way Reconciliation check across Bank Statement, Cash Book, and Client Sub-Ledgers.

---

### Step 6: Authorise in Human Review & Sync PEXA
1. Click **Human Review** (top-right button with the gate badge).
2. Review pending **Hard**, **Soft**, and **Advisory** gates. Remember: AI never moves funds or mutates records silently — practitioner sign-off is required.
3. Return to Sarah's Matter Workspace, click **Sync PEXA**, and advance the 5-Stage Lifecycle Pipeline to **5. Completed**.

---

### Step 7: Preview Client Portal, Toggle Privacy Mode & Export Backup
1. Click **Client Portal Preview** in the Matter Workspace header to see the mobile **"Pizza Tracker"** view your client sees on their phone.
2. Click **Privacy Mode** in the top bar — notice how all client names, emails, phones, addresses, and trust balances across every screen are masked (`S•••h C••••r`) with frosted blur (hover to reveal).
3. Click **Reset Demo Data** in the top bar to open the **Practice Data Backup & Reset** modal:
   * Click **Export Data (`.json`)** to save your work before cleaning up.
   * Click **Clean Up & Clear All Data** to wipe the workspace clean.
   * Click **Import / Restore (`.json`)** and select your exported file to restore Sarah's matter and all data back into the app!
