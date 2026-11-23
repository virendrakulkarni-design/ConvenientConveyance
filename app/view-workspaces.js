// ============================================================================
// CPMS View: Workspaces & Matters List
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
// ==========================================================================
  // Render Workspaces & Reactive Filtering
  // ==========================================================================
  renderWorkspaces() {
    const container = document.getElementById("page-content");
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Workspaces & Active Matters</h2>
          <p>Electronic conveyancing files, matter life cycles, and settlement pipelines.</p>
        </div>
        <button class="btn-primary" onclick="appRouter.openCreateMatterModal()"><i data-lucide="plus"></i> Create New File</button>
      </div>

      <div class="card" data-tour="workspaces-table">
        <div class="filter-bar">
          <div class="filter-group" style="flex-wrap: wrap;">
            <div class="filter-input">
              <i data-lucide="search"></i>
              <input type="text" placeholder="Search address, client, or reference..." id="workspace-search" oninput="appRouter.filterWorkspaces()">
            </div>
            <select class="filter-select" id="workspace-filter-type" onchange="appRouter.filterWorkspaces()">
              <option value="">All Transactions</option>
              <option value="purchase">Purchases Only</option>
              <option value="sale">Sales Only</option>
            </select>
            <select class="filter-select" id="workspace-filter-stage" onchange="appRouter.filterWorkspaces()">
              <option value="">All Stages</option>
              <option value="Enquiry & Intake">Enquiry & Intake</option>
              <option value="Contract Signed">Contract Signed</option>
              <option value="Searches & Enquiries">Searches & Enquiries</option>
              <option value="Settlement booked">Settlement Booked</option>
              <option value="Completed">Completed</option>
            </select>
            <button class="btn-outline" onclick="appRouter.resetWorkspaceFilters()" style="font-size: 0.75rem; padding: 0.35rem 0.65rem;">Reset</button>
          </div>
          <span style="font-size: 0.8rem; color: #64748b;" id="workspace-count-label">Showing <strong>${CPMS_STORE.matters.length}</strong> active matters</span>
        </div>

        <div class="table-container">
          <table class="data-table" id="workspaces-table-elem">
            <thead>
              <tr>
                <th>File Ref</th>
                <th>Type</th>
                <th>Property</th>
                <th>Client</th>
                <th>Purchase Price</th>
                <th>Settlement</th>
                <th>Progress Stage</th>
                <th>File Handler</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="workspaces-table-body">
              ${this.getWorkspacesRowsHTML(CPMS_STORE.matters)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getWorkspacesRowsHTML(mattersList) {
    if (mattersList.length === 0) {
      return `<tr><td colspan="9" style="text-align: center; color: #64748b; padding: 2rem;">No matters match your filter criteria. Try adjusting the search or filters.</td></tr>`;
    }

    return mattersList.map(m => `
      <tr onclick="appRouter.navigate('workspaces/${m.id}')" style="cursor: pointer;">
        <td><span style="font-weight: 700; color: #1e3a8a;">${m.reference}</span></td>
        <td><span class="badge ${m.transactionType === 'purchase' ? 'badge-blue' : 'badge-green'}">${m.transactionType.toUpperCase()}</span></td>
        <td><strong>${m.property}</strong><br><small style="color: #64748b;">${m.title}</small></td>
        <td>${m.client}</td>
        <td><strong>${m.purchasePrice}</strong></td>
        <td>${m.settlementDate}</td>
        <td><span class="badge badge-gray">${m.stage}</span></td>
        <td><span style="font-size: 0.8rem; color: #475569;">${m.manager}</span></td>
        <td>
          <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="event.stopPropagation(); appRouter.navigate('workspaces/${m.id}')">
            View Workspace
          </button>
        </td>
      </tr>
    `).join('');
  },

  filterWorkspaces() {
    const searchInput = document.getElementById("workspace-search");
    const typeSelect = document.getElementById("workspace-filter-type");
    const stageSelect = document.getElementById("workspace-filter-stage");
    const tbody = document.getElementById("workspaces-table-body");
    const countLabel = document.getElementById("workspace-count-label");

    const query = (searchInput?.value || "").toLowerCase().trim();
    const typeVal = typeSelect?.value || "";
    const stageVal = stageSelect?.value || "";

    const filtered = CPMS_STORE.matters.filter(m => {
      const matchesQuery = !query ||
        m.reference.toLowerCase().includes(query) ||
        m.property.toLowerCase().includes(query) ||
        m.client.toLowerCase().includes(query) ||
        m.manager.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query);

      const matchesType = !typeVal || m.transactionType === typeVal;
      const matchesStage = !stageVal || m.stage.toLowerCase().includes(stageVal.toLowerCase());

      return matchesQuery && matchesType && matchesStage;
    });

    if (tbody) tbody.innerHTML = this.getWorkspacesRowsHTML(filtered);
    if (countLabel) countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> of ${CPMS_STORE.matters.length} matters`;
    if (window.lucide) window.lucide.createIcons();
  },

  resetWorkspaceFilters() {
    const searchInput = document.getElementById("workspace-search");
    const typeSelect = document.getElementById("workspace-filter-type");
    const stageSelect = document.getElementById("workspace-filter-stage");
    if (searchInput) searchInput.value = "";
    if (typeSelect) typeSelect.value = "";
    if (stageSelect) stageSelect.value = "";
    this.filterWorkspaces();
  },

  // ==========================================================================
  // Create New Matter Modal & Actions
  // ==========================================================================
  openCreateMatterModal() {
    // Generate next available reference
    const maxNum = CPMS_STORE.matters.reduce((max, m) => {
      const n = parseInt(m.reference.split("-")[1] || "0", 10);
      return n > max ? n : max;
    }, 210);
    const nextRef = `2026-${String(maxNum + 1).padStart(4, '0')}`;

    const refInput = document.getElementById("new-matter-ref");
    if (refInput) refInput.value = nextRef;

    document.getElementById("create-matter-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeCreateMatterModal() {
    document.getElementById("create-matter-modal").close();
  },

  submitCreateMatter() {
    const ref = document.getElementById("new-matter-ref").value.trim();
    const type = document.getElementById("new-matter-type").value;
    const address = document.getElementById("new-matter-address").value.trim();
    const title = document.getElementById("new-matter-title").value.trim();
    const client = document.getElementById("new-matter-client").value.trim();
    const email = document.getElementById("new-matter-email").value.trim() || `${client.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const price = document.getElementById("new-matter-price").value.trim();
    const deposit = document.getElementById("new-matter-deposit").value.trim() || "$0.00";
    const settlement = document.getElementById("new-matter-settlement").value.trim();
    const manager = document.getElementById("new-matter-manager").value;
    const stage = document.getElementById("new-matter-stage").value;

    if (!ref || !address || !title || !client || !price || !settlement) {
      alert("Please fill in all required fields marked with *.");
      return;
    }

    const stageMap = {
      "Enquiry & Intake": 0,
      "Contract Signed": 1,
      "Searches & Enquiries": 2,
      "Settlement booked": 3
    };

    const newId = `mt-${Date.now()}`;
    const newMatter = {
      id: newId,
      reference: ref,
      transactionType: type,
      property: address,
      title: title,
      client: client,
      manager: manager,
      settlementDate: settlement,
      daysLeft: 35,
      stage: stage,
      stageIndex: stageMap[stage] || 0,
      purchasePrice: price.startsWith("$") ? price : `$${price}`,
      depositHeld: deposit.startsWith("$") ? deposit : `$${deposit}`,
      balanceDue: price.startsWith("$") ? price : `$${price}`,
      voiStatus: "in_progress",
      contractDate: "Pending Execution",
      coolingOff: "Standard Statutory 2 Business Days",
      parties: [
        { name: client, role: type === "purchase" ? "Purchaser" : "Vendor", phone: "0400 123 456", email: email, voi: "in_progress" }
      ],
      documents: [
        { id: `doc-${Date.now()}`, name: "Client Authority and Costs Disclosure", category: "Authority", status: "draft", version: "v1.0", updatedOn: "Today", size: "1.1 MB" }
      ],
      trustAllocations: []
    };

    // Prepend to matters
    CPMS_STORE.matters.unshift(newMatter);

    // Register client if not exists
    if (!CPMS_STORE.clients.some(c => c.name.toLowerCase() === client.toLowerCase())) {
      CPMS_STORE.clients.unshift({
        id: `cl-${Date.now()}`,
        name: client,
        type: "Individual",
        reference: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
        email: email,
        phone: "0400 123 456",
        voi: "In Progress (LiveSign sent)",
        isKey: false,
        activeMatters: 1,
        address: address
      });
    }

    // Register property
    CPMS_STORE.properties.unshift({
      address: address,
      title: title,
      plan: "Deposited Plan Parcel",
      council: "South Australian Local Council",
      zoning: "Residential",
      tenancy: "Vacant Possession",
      matterRef: ref
    });

    this.closeCreateMatterModal();
    this.updateMattersBadge();
    this.showToast(`New Matter ${ref} (${address}) initialized successfully!`, "success");

    // Navigate to new matter workspace
    this.navigate(`workspaces/${newId}`);
  },
});
