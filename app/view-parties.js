// ============================================================================
// CPMS View: All Parties Register (Buyers, Sellers, Mortgagees, Agents)
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
  categorizePartyRole(role) {
    const r = (role || "").toLowerCase();
    if (r.includes("purchaser") || r.includes("buyer")) return "Buyer / Purchaser";
    if (r.includes("vendor") || r.includes("seller")) return "Seller / Vendor";
    if (r.includes("mortgagee") || r.includes("bank") || r.includes("lender")) return "Mortgagee / Lender";
    return "Agent & Other";
  },

  getAllParties() {
    const list = [];
    (CPMS_STORE.matters || []).forEach(m => {
      (m.parties || []).forEach(p => {
        list.push({
          name: p.name,
          role: p.role,
          roleCategory: this.categorizePartyRole(p.role),
          phone: p.phone || "-",
          email: p.email || "-",
          voi: p.voi || "pending",
          matterId: m.id,
          matterRef: m.reference,
          property: m.property,
          transactionType: m.transactionType,
          settlementDate: m.settlementDate
        });
      });
    });
    return list;
  },

  renderParties() {
    const container = document.getElementById("page-content");
    const allParties = this.getAllParties();
    const buyersCount = allParties.filter(p => p.roleCategory === "Buyer / Purchaser").length;
    const sellersCount = allParties.filter(p => p.roleCategory === "Seller / Vendor").length;
    const thirdPartyCount = allParties.filter(p => p.roleCategory === "Mortgagee / Lender" || p.roleCategory === "Agent & Other").length;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Parties Register</h2>
          <p>Complete directory of all buyers, sellers, mortgagees, and agents across every active conveyancing file.</p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-outline" onclick="appRouter.navigate('workspaces')"><i data-lucide="folder"></i> View Workspaces</button>
        </div>
      </div>

      <!-- Parties Summary KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Total Parties</span>
            <div class="kpi-icon-wrap blue"><i data-lucide="users"></i></div>
          </div>
          <div class="kpi-value">${allParties.length}</div>
          <div class="kpi-subtext">Across ${CPMS_STORE.matters.length} conveyancing matters</div>
        </div>

        <div class="kpi-card" style="cursor: pointer;" onclick="document.getElementById('parties-filter-role').value='Buyer / Purchaser'; appRouter.filterParties();">
          <div class="kpi-header">
            <span class="kpi-title">Buyers / Purchasers</span>
            <div class="kpi-icon-wrap emerald"><i data-lucide="user-check"></i></div>
          </div>
          <div class="kpi-value">${buyersCount}</div>
          <div class="kpi-subtext">Click to filter purchasers</div>
        </div>

        <div class="kpi-card" style="cursor: pointer;" onclick="document.getElementById('parties-filter-role').value='Seller / Vendor'; appRouter.filterParties();">
          <div class="kpi-header">
            <span class="kpi-title">Sellers / Vendors</span>
            <div class="kpi-icon-wrap amber"><i data-lucide="user"></i></div>
          </div>
          <div class="kpi-value">${sellersCount}</div>
          <div class="kpi-subtext">Click to filter vendors</div>
        </div>

        <div class="kpi-card" style="cursor: pointer;" onclick="document.getElementById('parties-filter-role').value='Mortgagee / Lender'; appRouter.filterParties();">
          <div class="kpi-header">
            <span class="kpi-title">Mortgagees & Agents</span>
            <div class="kpi-icon-wrap purple"><i data-lucide="landmark"></i></div>
          </div>
          <div class="kpi-value">${thirdPartyCount}</div>
          <div class="kpi-subtext">Incoming/discharging lenders & agents</div>
        </div>
      </div>

      <div class="card">
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-input">
              <i data-lucide="search"></i>
              <input type="text" placeholder="Search party name, role, matter, or property..." id="parties-search" oninput="appRouter.filterParties()">
            </div>
            <select class="filter-select" id="parties-filter-role" onchange="appRouter.filterParties()">
              <option value="">All Party Roles</option>
              <option value="Buyer / Purchaser">Buyers / Purchasers</option>
              <option value="Seller / Vendor">Sellers / Vendors</option>
              <option value="Mortgagee / Lender">Mortgagees / Lenders</option>
              <option value="Agent & Other">Agents & Other</option>
            </select>
            <select class="filter-select" id="parties-filter-voi" onchange="appRouter.filterParties()">
              <option value="">All VOI Statuses</option>
              <option value="verified">Verified</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="exempt">Exempt</option>
            </select>
            <button class="btn-outline" style="padding: 0.4rem 0.75rem; font-size: 0.78rem;" onclick="appRouter.resetPartiesFilters()">Reset</button>
          </div>
          <span style="font-size: 0.8rem; color: #64748b;" id="parties-count-label">Showing <strong>${allParties.length}</strong> parties</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Party Name</th>
                <th>Role on File</th>
                <th>Category</th>
                <th>Matter & Property</th>
                <th>Contact Details</th>
                <th>ARNECC VOI</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="parties-table-body">
              ${this.getPartiesRowsHTML(allParties)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getPartiesRowsHTML(partiesList) {
    if (partiesList.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No parties match your filter criteria.</td></tr>`;
    }

    return partiesList.map(p => {
      const catBadge = p.roleCategory === "Buyer / Purchaser"
        ? "badge-blue"
        : p.roleCategory === "Seller / Vendor"
          ? "badge-green"
          : p.roleCategory === "Mortgagee / Lender"
            ? "badge-purple"
            : "badge-gray";

      const voiBadge = p.voi === "verified"
        ? "badge-green"
        : p.voi === "in_progress"
          ? "badge-amber"
          : p.voi === "exempt"
            ? "badge-gray"
            : "badge-red";

      const safeName = (this.maskPII(p.name, "name") || "").replace(/'/g, "\\'");

      return `
        <tr>
          <td class="pii-sensitive"><strong>${this.maskPII(p.name, "name")}</strong></td>
          <td><span class="badge ${catBadge}">${p.role}</span></td>
          <td><span style="font-size: 0.78rem; color: #475569;">${p.roleCategory}</span></td>
          <td>
            <a onclick="appRouter.navigate('workspaces/${p.matterId}')" style="cursor: pointer; color: #2563eb; font-weight: 700;">${p.matterRef}</a>
            <br><small style="color: #64748b;">${p.property}</small>
          </td>
          <td class="pii-sensitive">
            ${this.maskPII(p.email, "email")}
            <br><small style="color: #64748b;">${this.maskPII(p.phone, "phone")}</small>
          </td>
          <td><span class="badge ${voiBadge}">${p.voi.replace('_', ' ').toUpperCase()}</span></td>
          <td>
            <div style="display: flex; gap: 0.35rem;">
              <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="appRouter.navigate('workspaces/${p.matterId}')">Open File</button>
              <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="appRouter.openVoiModal('${safeName}', '${p.voi}')">VOI</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  filterParties() {
    const query = (document.getElementById("parties-search")?.value || "").toLowerCase().trim();
    const roleVal = document.getElementById("parties-filter-role")?.value || "";
    const voiVal = document.getElementById("parties-filter-voi")?.value || "";
    const tbody = document.getElementById("parties-table-body");
    const countLabel = document.getElementById("parties-count-label");

    const allParties = this.getAllParties();
    const filtered = allParties.filter(p => {
      const matchQ = !query ||
        (p.name || "").toLowerCase().includes(query) ||
        (p.role || "").toLowerCase().includes(query) ||
        (p.matterRef || "").toLowerCase().includes(query) ||
        (p.property || "").toLowerCase().includes(query) ||
        (p.email || "").toLowerCase().includes(query) ||
        (p.phone || "").toLowerCase().includes(query);

      const matchRole = !roleVal || p.roleCategory === roleVal;
      const matchVoi = !voiVal || p.voi === voiVal;
      return matchQ && matchRole && matchVoi;
    });

    if (tbody) tbody.innerHTML = this.getPartiesRowsHTML(filtered);
    if (countLabel) countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> of ${allParties.length} parties`;
    if (window.lucide) window.lucide.createIcons();
  },

  resetPartiesFilters() {
    const s = document.getElementById("parties-search");
    const r = document.getElementById("parties-filter-role");
    const v = document.getElementById("parties-filter-voi");
    if (s) s.value = "";
    if (r) r.value = "";
    if (v) v.value = "";
    this.filterParties();
  }
});
