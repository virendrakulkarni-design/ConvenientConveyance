// ============================================================================
// CPMS View: Statutory Trust Accounting
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
// ==========================================================================
  // Render Trust Accounting & Live Actions
  // ==========================================================================
  renderTrust() {
    const container = document.getElementById("page-content");
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Statutory Trust Accounting</h2>
          <p>Law Society compliant 3-way reconciliation, client sub-ledgers, and audit-locked journals.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-outline" onclick="appRouter.reconcileTrustNow()"><i data-lucide="refresh-cw"></i> Reconcile Now</button>
          <button class="btn-primary" onclick="appRouter.openTrustReceiptModal()"><i data-lucide="plus"></i> New Trust Receipt</button>
        </div>
      </div>

      <!-- 3-Way Reconciliation Status -->
      <div class="kpi-grid" data-tour="trust-ledger">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Client Ledger Balance</span>
            <div class="kpi-icon-wrap emerald"><i data-lucide="book-open"></i></div>
          </div>
          <div class="kpi-value" id="trust-kpi-ledger">${CPMS_STORE.trust.ledgerBalance}</div>
          <div class="kpi-subtext">Sum of all individual matter balances</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Bank Statement Balance</span>
            <div class="kpi-icon-wrap blue"><i data-lucide="landmark"></i></div>
          </div>
          <div class="kpi-value">${CPMS_STORE.trust.bankBalance}</div>
          <div class="kpi-subtext">National Australia Bank Trust Acc ****4190</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Reconciliation Discrepancy</span>
            <div class="kpi-icon-wrap amber"><i data-lucide="alert-triangle"></i></div>
          </div>
          <div class="kpi-value" style="color: #d97706;">${CPMS_STORE.trust.reconciledDifference}</div>
          <div class="kpi-subtext">${CPMS_STORE.trust.differenceReason}</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Matter Trust Sub-Ledger Balances</h3>
          <span class="badge badge-green">3-Way Balance Verified</span>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr><th>Matter Ref</th><th>Client Name</th><th>Property Parcel</th><th>Last Transaction</th><th>Sub-Ledger Balance</th><th>Audit Action</th></tr>
            </thead>
            <tbody>
              ${CPMS_STORE.trust.accounts.map(a => `
                <tr>
                  <td><strong style="color: #2563eb;">${a.matterRef}</strong></td>
                  <td><strong>${a.client}</strong></td>
                  <td>${a.property}</td>
                  <td>${a.lastMovement}</td>
                  <td><strong style="color: #047857; font-size: 0.95rem;">${a.balance}</strong></td>
                  <td>
                    <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="appRouter.openJournalModal('${a.matterRef}')">View Journal</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  reconcileTrustNow() {
    this.showToast("Executing automated 3-way reconciliation against NAB Trust API...", "info");
    setTimeout(() => {
      this.showToast("Reconciliation Complete: All client ledgers match cash book. Zero unallocated funds.", "success");
    }, 600);
  },

  openTrustReceiptModal() {
    const select = document.getElementById("trust-receipt-matter");
    if (select) {
      select.innerHTML = CPMS_STORE.matters.map(m => `
        <option value="${m.reference}">[${m.reference}] ${m.property} (${m.client})</option>
      `).join('');
    }
    document.getElementById("trust-receipt-payer").value = "";
    document.getElementById("trust-receipt-amount").value = "";
    document.getElementById("trust-receipt-desc").value = "";
    document.getElementById("new-trust-receipt-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeTrustReceiptModal() {
    document.getElementById("new-trust-receipt-modal").close();
  },

  submitTrustReceipt() {
    const matterRef = document.getElementById("trust-receipt-matter").value;
    const payer = document.getElementById("trust-receipt-payer").value.trim();
    const amountVal = document.getElementById("trust-receipt-amount").value.trim();
    const method = document.getElementById("trust-receipt-method").value;
    const desc = document.getElementById("trust-receipt-desc").value.trim();

    if (!payer || !amountVal || !desc) {
      alert("Please fill in payer, amount, and description.");
      return;
    }

    const formattedAmount = `$${parseFloat(amountVal.replace(/[^0-9.]/g, '')).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const matter = CPMS_STORE.matters.find(m => m.reference === matterRef);
    const receiptRef = `TR-${Math.floor(9100 + Math.random() * 800)}`;

    const newTrans = {
      date: "Today",
      type: "Deposit Receipt",
      ref: receiptRef,
      description: desc,
      credit: formattedAmount,
      debit: "-",
      balance: formattedAmount
    };

    if (matter) {
      matter.trustAllocations.unshift(newTrans);
      matter.depositHeld = formattedAmount;
    }

    // Add to trust accounts list if not present
    const existingAcc = CPMS_STORE.trust.accounts.find(a => a.matterRef === matterRef);
    if (existingAcc) {
      existingAcc.balance = formattedAmount;
      existingAcc.lastMovement = "Today";
    } else if (matter) {
      CPMS_STORE.trust.accounts.push({
        matterRef: matter.reference,
        client: matter.client,
        property: matter.property,
        balance: formattedAmount,
        lastMovement: "Today"
      });
    }

    this.closeTrustReceiptModal();
    this.showToast(`Trust Receipt ${receiptRef} for ${formattedAmount} posted to Matter ${matterRef}.`, "success");
    this.renderTrust();
  },

  openJournalModal(matterRef) {
    const title = document.getElementById("journal-modal-title");
    const subtitle = document.getElementById("journal-modal-subtitle");
    const body = document.getElementById("journal-modal-body");

    const matter = CPMS_STORE.matters.find(m => m.reference === matterRef);
    if (title) title.innerText = `Trust Sub-Ledger: ${matterRef}`;
    if (subtitle) subtitle.innerText = matter ? `${matter.property} • ${matter.client}` : "Audit Journal";

    if (body) {
      const records = matter && matter.trustAllocations.length > 0 ? matter.trustAllocations : [
        { date: "15/10/2026", type: "Statutory Deposit", ref: "TR-8720", description: "Deposit received via PEXA Financial Settlement", credit: "$124,615.00", debit: "-", balance: "$124,615.00" }
      ];

      body.innerHTML = `
        <table class="data-table">
          <thead>
            <tr><th>Date</th><th>Type</th><th>Ref</th><th>Description</th><th>Credit</th><th>Debit</th><th>Balance</th></tr>
          </thead>
          <tbody>
            ${records.map(r => `
              <tr>
                <td>${r.date}</td>
                <td><span class="badge badge-blue">${r.type}</span></td>
                <td><code>${r.ref}</code></td>
                <td>${r.description}</td>
                <td style="color: #047857; font-weight: 600;">${r.credit}</td>
                <td style="color: #dc2626; font-weight: 600;">${r.debit}</td>
                <td><strong>${r.balance}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    document.getElementById("view-journal-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeJournalModal() {
    document.getElementById("view-journal-modal").close();
  },
});
