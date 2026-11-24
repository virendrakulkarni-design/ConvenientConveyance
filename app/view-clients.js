// ============================================================================
// CPMS View: Clients Registry
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
// ==========================================================================
  // Render Clients Registry & Reactive Search
  // ==========================================================================
  renderClients() {
    const container = document.getElementById("page-content");
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Clients Registry</h2>
          <p>Individual, company and trust clients with reusable ARNECC VOI and AML/CTF screening records.</p>
        </div>
        <button class="btn-primary" onclick="appRouter.openAddClientModal()"><i data-lucide="user-plus"></i> Add Client</button>
      </div>

      <div class="card" data-tour="clients-table">
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-input">
              <i data-lucide="search"></i>
              <input type="text" placeholder="Search client name, ref, or email..." id="client-search" oninput="appRouter.filterClients()">
            </div>
            <select class="filter-select" id="client-filter-voi" onchange="appRouter.filterClients()">
              <option value="">All VOI Statuses</option>
              <option value="Verified">Verified</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <span style="font-size: 0.8rem; color: #64748b;" id="clients-count-label">Showing <strong>${CPMS_STORE.clients.length}</strong> clients</span>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr><th>Client Name</th><th>Type</th><th>Client Ref</th><th>Contact Details</th><th>VOI Compliance</th><th>Matters</th><th>Key Client</th></tr>
            </thead>
            <tbody id="clients-table-body">
              ${this.getClientsRowsHTML(CPMS_STORE.clients)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getClientsRowsHTML(clientsList) {
    if (clientsList.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No clients match the search criteria.</td></tr>`;
    }

    return clientsList.map(c => `
      <tr>
        <td class="pii-sensitive"><strong>${this.maskPII(c.name, "name")}</strong><br><small style="color: #64748b;">${this.maskPII(c.address, "address")}</small></td>
        <td><span class="badge badge-gray">${c.type}</span></td>
        <td><code>${c.reference}</code></td>
        <td class="pii-sensitive">${this.maskPII(c.email, "email")}<br><small style="color: #64748b;">${this.maskPII(c.phone, "phone")}</small></td>
        <td><span class="badge ${c.voi.includes('Verified') ? 'badge-green' : 'badge-amber'}">${c.voi}</span></td>
        <td><span class="badge badge-blue">${c.activeMatters} active</span></td>
        <td>${c.isKey ? '<span class="badge badge-amber">★ Key Client</span>' : '-'}</td>
      </tr>
    `).join('');
  },

  filterClients() {
    const query = (document.getElementById("client-search")?.value || "").toLowerCase().trim();
    const voiVal = document.getElementById("client-filter-voi")?.value || "";
    const tbody = document.getElementById("clients-table-body");
    const countLabel = document.getElementById("clients-count-label");

    const filtered = CPMS_STORE.clients.filter(c => {
      const matchQ = !query ||
        c.name.toLowerCase().includes(query) ||
        c.reference.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query) ||
        c.address.toLowerCase().includes(query);

      const matchVoi = !voiVal || c.voi.toLowerCase().includes(voiVal.toLowerCase());
      return matchQ && matchVoi;
    });

    if (tbody) tbody.innerHTML = this.getClientsRowsHTML(filtered);
    if (countLabel) countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> of ${CPMS_STORE.clients.length} clients`;
    if (window.lucide) window.lucide.createIcons();
  },

  openAddClientModal() {
    document.getElementById("new-client-name").value = "";
    document.getElementById("new-client-email").value = "";
    document.getElementById("new-client-phone").value = "";
    document.getElementById("new-client-address").value = "";
    document.getElementById("new-client-iskey").checked = false;
    document.getElementById("add-client-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeAddClientModal() {
    document.getElementById("add-client-modal").close();
  },

  submitAddClient() {
    const name = document.getElementById("new-client-name").value.trim();
    const type = document.getElementById("new-client-type").value;
    const email = document.getElementById("new-client-email").value.trim();
    const phone = document.getElementById("new-client-phone").value.trim();
    const address = document.getElementById("new-client-address").value.trim();
    const voi = document.getElementById("new-client-voi").value;
    const isKey = document.getElementById("new-client-iskey").checked;

    if (!name || !email || !phone) {
      alert("Please fill in client name, email, and phone.");
      return;
    }

    const newClient = {
      id: `cl-${Date.now()}`,
      name: name,
      type: type,
      reference: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      email: email,
      phone: phone,
      voi: voi,
      isKey: isKey,
      activeMatters: 0,
      address: address || "Adelaide SA"
    };

    CPMS_STORE.clients.unshift(newClient);
    this.closeAddClientModal();
    this.showToast(`Client "${name}" registered successfully.`, "success");
    this.renderClients();
  },
});
