// ============================================================================
// CPMS View: Dashboard
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
// ==========================================================================
  // Render Dashboard
  // ==========================================================================
  renderDashboard() {
    const container = document.getElementById("page-content");
    const settlingSoon = CPMS_STORE.matters.filter(m => m.daysLeft > 0 && m.daysLeft <= 14);

    container.innerHTML = `
      <div class="page-header" data-tour="header">
        <div>
          <h2>Practice Dashboard</h2>
          <p>Welcome back, ${CPMS_STORE.persona.user}. Here is your practice settlement and compliance overview.</p>
        </div>
        <div class="flex gap-2" style="flex-wrap: wrap;">
          <button class="btn-outline" onclick="window.tourEngine.start()"><i data-lucide="compass"></i> Start Tour</button>
          <button class="btn-primary" onclick="appRouter.openCreateMatterModal()"><i data-lucide="plus"></i> New Matter</button>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid" data-tour="tiles">
        <div class="kpi-card" onclick="appRouter.navigate('workspaces')" style="cursor: pointer;">
          <div class="kpi-header">
            <span class="kpi-title">Active Matters</span>
            <div class="kpi-icon-wrap blue"><i data-lucide="folder"></i></div>
          </div>
          <div class="kpi-value">${CPMS_STORE.matters.length}</div>
          <div class="kpi-subtext">Click to explore full matter workspace register</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Settling Within 14 Days</span>
            <div class="kpi-icon-wrap amber"><i data-lucide="calendar"></i></div>
          </div>
          <div class="kpi-value">${settlingSoon.length}</div>
          <div class="kpi-subtext"><span class="badge badge-amber">Next on 26/11/2026 (Norwood)</span></div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Awaiting Identity / VOI</span>
            <div class="kpi-icon-wrap purple"><i data-lucide="shield-alert"></i></div>
          </div>
          <div class="kpi-value">${CPMS_STORE.matters.filter(m => m.voiStatus !== 'verified').length}</div>
          <div class="kpi-subtext">LiveSign tracking active via ARNECC rules</div>
        </div>

        <div class="kpi-card" onclick="appRouter.navigate('trust')" style="cursor: pointer;">
          <div class="kpi-header">
            <span class="kpi-title">Trust Ledger Balance</span>
            <div class="kpi-icon-wrap emerald"><i data-lucide="landmark"></i></div>
          </div>
          <div class="kpi-value">${CPMS_STORE.trust.ledgerBalance}</div>
          <div class="kpi-subtext">Reconciled across ${CPMS_STORE.trust.accounts.length} client sub-ledgers</div>
        </div>
      </div>

      <!-- Settling Soon Table -->
      <div class="card" data-tour="settling">
        <div class="card-header">
          <div>
            <h3 class="card-title">Settlements in Priority Order</h3>
            <p class="card-description">Immediate settlement deadlines requiring electronic workspace readiness.</p>
          </div>
          <span class="badge badge-blue">South Australia Jurisdiction</span>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Transaction</th>
                <th>Property Address</th>
                <th>Client</th>
                <th>Settlement Date</th>
                <th>Stage</th>
                <th>VOI Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${CPMS_STORE.matters.map(m => `
                <tr onclick="appRouter.navigate('workspaces/${m.id}')">
                  <td><strong style="color: #2563eb;">${m.reference}</strong></td>
                  <td><span class="badge ${m.transactionType === 'purchase' ? 'badge-blue' : 'badge-green'}">${m.transactionType.toUpperCase()}</span></td>
                  <td><strong>${m.property}</strong></td>
                  <td>${m.client}</td>
                  <td>
                    ${m.daysLeft > 0 && m.daysLeft <= 4 ? `<span class="badge badge-red">${m.settlementDate} (${m.daysLeft}d)</span>` : m.daysLeft < 0 ? `<span class="badge badge-gray">${m.settlementDate} (Settled)</span>` : m.settlementDate}
                  </td>
                  <td><span class="badge badge-gray">${m.stage}</span></td>
                  <td>
                    <span class="badge ${m.voiStatus === 'verified' ? 'badge-green' : m.voiStatus === 'in_progress' ? 'badge-amber' : 'badge-red'}">
                      ${m.voiStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td><button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" onclick="event.stopPropagation(); appRouter.navigate('workspaces/${m.id}')">Open File</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
});
