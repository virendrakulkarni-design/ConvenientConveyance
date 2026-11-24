// ============================================================================
// CPMS View: Matter Detail Workspace & Tabs
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
// ==========================================================================
  // Render Detailed Workspace
  // ==========================================================================
  renderMatterDetail(matterId) {
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    const container = document.getElementById("page-content");

    const stages = [
      "1. Enquiry & Intake",
      "2. Contract Signed",
      "3. Searches & Enquiries",
      "4. Settlement Booked",
      "5. Completed"
    ];

    container.innerHTML = `
      <div class="page-header" style="margin-bottom: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.25rem;">
            <a onclick="appRouter.navigate('workspaces')" style="cursor: pointer; color: #2563eb; font-size: 0.82rem; font-weight: 600;">← Back to Workspaces</a>
            <span style="color: #cbd5e1;">/</span>
            <span style="font-size: 0.82rem; color: #64748b;">${matter.reference}</span>
          </div>
          <h2>${matter.property}</h2>
          <p>Client: <strong class="pii-sensitive">${this.maskPII(matter.client, "name")}</strong> • Title: <strong>${matter.title}</strong> • Price: <strong>${matter.purchasePrice}</strong> • File Handler: <strong>${matter.manager}</strong></p>
        </div>
        <div class="matter-header-actions" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="btn-outline" onclick="appRouter.openClientPortalModal('${matter.id}')" title="Preview live mobile tracker seen by client"><i data-lucide="smartphone"></i> Client Portal Preview</button>
          <button class="btn-outline" onclick="appRouter.simulateSearchIngestion('${matter.id}')" title="Simulate autonomous SAILIS title search & encumbrance detection"><i data-lucide="search-check"></i> Ingest SAILIS Search</button>
          <button class="btn-outline" onclick="aiCopilot.triggerDocumentDiff()"><i data-lucide="sparkles"></i> AI Contract Diff</button>
          <button class="btn-primary" id="pexa-sync-btn" onclick="appRouter.syncPexa('${matter.id}')"><i data-lucide="refresh-cw"></i> Sync PEXA</button>
        </div>
      </div>

      <!-- Milestone Progress Tracker Card -->
      <div class="milestone-tracker-card" data-tour="matter-stages">
        <div class="milestone-tracker-header">
          <div>
            <div class="milestone-tracker-title">
              <i data-lucide="git-commit" style="color: var(--color-primary-light);"></i>
              <span>File Lifecycle Stage: <strong>Stage ${matter.stageIndex + 1} of 5 — ${matter.stage}</strong></span>
              <span class="badge ${matter.stageIndex === 4 ? 'badge-green' : 'badge-blue'}">${matter.stageIndex === 4 ? 'Completed' : 'Active Progress'}</span>
            </div>
            <p class="milestone-tracker-subtitle">
              Click any milestone step below to advance or set the statutory file stage. (Below this are the matter workspace data tabs).
            </p>
          </div>
          <button class="btn-outline" style="font-size: 0.72rem; padding: 0.25rem 0.55rem; gap: 0.35rem;" onclick="appRouter.showStageHelpModal()">
            <i data-lucide="help-circle"></i> Stage Explanations
          </button>
        </div>

        <div class="stages-pipeline">
          ${stages.map((st, idx) => {
      let cls = "";
      let statusLabel = "";
      if (idx < matter.stageIndex) { cls = "done"; statusLabel = "✓ Passed"; }
      else if (idx === matter.stageIndex) { cls = "current"; statusLabel = "● Active Stage"; }
      else { statusLabel = "○ Pending"; }
      return `
              <div class="stage-step ${cls}" onclick="appRouter.setMatterStage('${matter.id}', ${idx})" title="Click to set file status to ${st}" style="cursor: pointer;">
                <div class="stage-step-num">${idx < matter.stageIndex ? '✓' : idx + 1}</div>
                <div style="display: flex; flex-direction: column;">
                  <span style="font-weight: 700;">${st.substring(3)}</span>
                  <small style="font-size: 0.65rem; opacity: 0.85;">${statusLabel}</small>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>

      <!-- Tab Divider & Instruction -->
      <div style="margin-bottom: 0.6rem; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">
          Workspace Information Tabs:
        </span>
        <span style="font-size: 0.72rem; color: #94a3b8;">Click tabs below to view matter records, settlement figures, documents and trust ledgers</span>
      </div>

      <!-- Workspace Sub-tabs Navigation -->
      <div class="tab-nav" data-tour="matter-tabs">
        <button class="tab-btn ${this.activeMatterTab === 'parties' ? 'active' : ''}" onclick="appRouter.switchMatterTab('parties', '${matter.id}')"><i data-lucide="users"></i> Parties & VOI (${matter.parties.length})</button>
        <button class="tab-btn ${this.activeMatterTab === 'contract' ? 'active' : ''}" onclick="appRouter.switchMatterTab('contract', '${matter.id}')"><i data-lucide="file-check"></i> Contract & Terms</button>
        <button class="tab-btn ${this.activeMatterTab === 'settlement' ? 'active' : ''}" onclick="appRouter.switchMatterTab('settlement', '${matter.id}')"><i data-lucide="calculator"></i> Settlement Statement</button>
        <button class="tab-btn ${this.activeMatterTab === 'documents' ? 'active' : ''}" onclick="appRouter.switchMatterTab('documents', '${matter.id}')"><i data-lucide="files"></i> Documents (${matter.documents.length})</button>
        <button class="tab-btn ${this.activeMatterTab === 'trust' ? 'active' : ''}" onclick="appRouter.switchMatterTab('trust', '${matter.id}')"><i data-lucide="landmark"></i> Trust Ledger (${matter.trustAllocations.length})</button>
        <button class="tab-btn ${this.activeMatterTab === 'audit' ? 'active' : ''}" onclick="appRouter.switchMatterTab('audit', '${matter.id}')"><i data-lucide="history"></i> Audit Trail & Telemetry (${CPMS_STORE.auditLog ? CPMS_STORE.auditLog.filter(e => e.matterRef === matter.reference).length : 0})</button>
      </div>

      <!-- Tab Content Area -->
      <div id="matter-tab-content">
        ${this.getMatterTabHTML(this.activeMatterTab, matter)}
      </div>
    `;
  },

  setMatterStage(matterId, stageIdx) {
    const matter = CPMS_STORE.matters.find(m => m.id === matterId);
    if (!matter) return;

    const stages = [
      "Enquiry & Intake",
      "Contract Signed",
      "Searches & Enquiries",
      "Settlement booked",
      "Completed"
    ];

    const stageExplanations = [
      "Stage 1: Enquiry & Intake — Initial instructions & client onboarding active.",
      "Stage 2: Contract Signed — Contract exchanged & cooling-off tracking active.",
      "Stage 3: Searches & Enquiries — SAILIS title & SA Water SMR searches ordered.",
      "Stage 4: Settlement Booked — PEXA digital workspace ready & financial schedule locked.",
      "Stage 5: Completed — Funds transferred, property settled & title registered."
    ];

    const beforeIdx = matter.stageIndex;
    matter.stageIndex = stageIdx;
    matter.stage = stages[stageIdx];
    this.showToast(stageExplanations[stageIdx], "info");

    if (window.auditObservability) {
      window.auditObservability.recordEvent({
        matterRef: matter.reference,
        category: "HITL_DECISION",
        severity: "INFO",
        action: `Matter Advanced to Stage: ${stages[stageIdx]}`,
        explainability: {
          rationale: stageExplanations[stageIdx],
          confidence: 1.0,
          governingRule: "Firm Matter Milestone Policy & ARNECC Conveyancing Practice Guidelines",
          telemetry: { model: "Practitioner Stage Transition (Direct HITL)" }
        },
        payload: { stageIndex: stageIdx, stageName: stages[stageIdx] },
        stateDiff: {
          field: "matter.stageIndex",
          before: beforeIdx,
          after: stageIdx,
          beforeLabel: stages[beforeIdx],
          afterLabel: stages[stageIdx]
        }
      });
    }

    this.renderMatterDetail(matterId);
    if (window.lucide) window.lucide.createIcons();
  },

  showStageHelpModal() {
    const modal = document.getElementById("stage-help-modal");
    if (modal) modal.showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeStageHelpModal() {
    const modal = document.getElementById("stage-help-modal");
    if (modal) modal.close();
  },

  syncPexa(matterId) {
    const btn = document.getElementById("pexa-sync-btn");
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    if (btn) {
      btn.innerHTML = `<i data-lucide="loader" class="spin"></i> Syncing...`;
    }
    setTimeout(() => {
      if (btn) {
        btn.innerHTML = `<i data-lucide="check"></i> PEXA Synced (Just now)`;
        btn.classList.add("btn-outline");
        btn.classList.remove("btn-primary");
      }

      if (window.auditObservability) {
        window.auditObservability.recordEvent({
          matterRef: matter.reference,
          category: "PEXA_TRANSACTION",
          severity: "INFO",
          action: "PEXA Workspace Synchronised",
          explainability: {
            rationale: `Synchronised settlement status and participant certificates with PEXA API gateway for Matter ${matter.reference}. Workspace verified active.`,
            confidence: 1.0,
            governingRule: "PEXA Participation Rules (Operating Condition 5)",
            telemetry: {
              traceId: `tr-pexa-${Math.random().toString(16).slice(2, 8)}`,
              durationMs: 380,
              model: "PEXA REST Integration Connector v2.1"
            }
          },
          payload: {
            workspaceStatus: "Settlement Booked",
            participantMortgagee: "ANZ Banking Group",
            titleRef: matter.title
          },
          stateDiff: {
            field: "pexaSyncStatus",
            before: "Pending Sync",
            after: "Synchronised"
          }
        });
      }

      this.showToast(`PEXA Workspace synchronised for Matter ${matterId}. All participant certificates verified.`, "success");
      if (window.lucide) window.lucide.createIcons();
    }, 700);
  },

  switchMatterTab(tabName, matterId) {
    this.activeMatterTab = tabName;
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    document.querySelectorAll(".tab-btn").forEach(btn => {
      if (btn.innerText.toLowerCase().includes(tabName)) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    document.getElementById("matter-tab-content").innerHTML = this.getMatterTabHTML(tabName, matter);
    if (window.lucide) window.lucide.createIcons();
  },

  getMatterTabHTML(tabName, matter) {
    switch (tabName) {
      case "parties":
        return `
          <div class="card" data-tour="matter-parties">
            <div class="card-header">
              <h3 class="card-title">Parties on Title & Electronic Settlement Participants</h3>
              <button class="btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="appRouter.openAddPartyModal('${matter.id}')"><i data-lucide="user-plus"></i> Add Party</button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Party Name</th>
                    <th>Role on File</th>
                    <th>Contact Information</th>
                    <th>ARNECC VOI Verification</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${matter.parties.map(p => `
                    <tr>
                      <td class="pii-sensitive"><strong>${this.maskPII(p.name, "name")}</strong></td>
                      <td><span class="badge badge-blue">${p.role}</span></td>
                      <td class="pii-sensitive">${this.maskPII(p.email, "email")}<br><small style="color: #64748b;">${this.maskPII(p.phone, "phone")}</small></td>
                      <td>
                        <span class="badge ${p.voi === 'verified' ? 'badge-green' : p.voi === 'in_progress' ? 'badge-amber' : p.voi === 'exempt' ? 'badge-gray' : 'badge-red'}">
                          ${p.voi.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="appRouter.openVoiModal('${p.name}', '${p.voi}')">Inspect VOI</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      case "contract":
        return `
          <div class="card">
            <div class="card-header"><h3 class="card-title">Contract Terms & Milestone Conditions</h3></div>
            <div style="padding: 1.25rem; display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
              <div>
                <p style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Purchase Price</p>
                <p style="font-size: 1.3rem; font-weight: 700; color: #0f172a; margin-bottom: 1rem;">${matter.purchasePrice}</p>

                <p style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Deposit Amount</p>
                <p style="font-size: 1.1rem; font-weight: 600; color: #047857; margin-bottom: 1rem;">${matter.depositHeld} (Held in Agent Trust)</p>

                <p style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Contract Execution Date</p>
                <p style="font-size: 0.95rem; font-weight: 600; color: #334155;">${matter.contractDate}</p>
              </div>
              <div>
                <p style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Scheduled Settlement Date</p>
                <p style="font-size: 1.3rem; font-weight: 700; color: #2563eb; margin-bottom: 1rem;">${matter.settlementDate}</p>

                <p style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Cooling-off Status</p>
                <p style="font-size: 0.95rem; font-weight: 600; color: #0f172a; margin-bottom: 1rem;">${matter.coolingOff}</p>

                <p style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Estimated Stamp Duty (RevenueSA)</p>
                <p style="font-size: 0.95rem; font-weight: 600; color: #d97706;">$56,830.00 (Standard Residential)</p>
              </div>
            </div>
            ${matter.checklist && matter.checklist.length > 0 ? `
              <div style="border-top: 1px solid var(--border-subtle); padding: 1.25rem;">
                <h4 style="font-size: 0.85rem; font-weight: 700; color: #0f172a; margin: 0 0 0.75rem 0; display: flex; align-items: center; gap: 0.4rem;">
                  <i data-lucide="check-square" style="width: 16px; height: 16px; color: #2563eb;"></i>
                  <span>Active Compliance & Encumbrance Checklist (${matter.checklist.length})</span>
                </h4>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  ${matter.checklist.map(c => `
                    <div style="background: #f8fafc; border: 1px solid var(--border-subtle); border-left: 4px solid #2563eb; border-radius: 6px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong style="font-size: 0.82rem; color: #0f172a;">${c.title}</strong>
                        <p style="font-size: 0.72rem; color: #64748b; margin: 2px 0 0 0;">${c.note} (${c.date})</p>
                      </div>
                      <span class="badge ${c.status === 'completed' ? 'badge-green' : 'badge-amber'}">${c.status.toUpperCase()}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      case "settlement":
        return `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Settlement Statement & Council/Water Rate Adjustments</h3>
              <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="appRouter.exportSettlementStatement('${matter.id}')"><i data-lucide="download"></i> Export PDF</button>
            </div>
            <div style="padding: 1.25rem;">
              <table class="data-table">
                <thead>
                  <tr><th>Item Breakdown</th><th>Credit Vendor</th><th>Debit Purchaser</th></tr>
                </thead>
                <tbody>
                  <tr><td>Purchase Price</td><td>${matter.purchasePrice}</td><td>-</td></tr>
                  <tr><td>Less Deposit Paid to Real Estate Agent</td><td>-</td><td>(${matter.depositHeld})</td></tr>
                  <tr><td>Council Rates Adjustment (City of Norwood Payneham & St Peters)</td><td>$482.20</td><td>-</td></tr>
                  <tr><td>SA Water Rates & Sewerage Adjustment (RD24 Tariff)</td><td>$144.05</td><td>-</td></tr>
                  <tr><td>Emergency Services Levy (ESL) Adjustment</td><td>$68.90</td><td>-</td></tr>
                  <tr><td>Discharge of Mortgage Registration Fee</td><td>-</td><td>$181.00</td></tr>
                  <tr style="background: #f1f5f9; font-weight: 700; font-size: 0.92rem;">
                    <td>Net Balance Required to Settle (PEXA Financial Line)</td>
                    <td colspan="2" style="text-align: right; color: #1e3a8a;">${matter.balanceDue}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        `;
      case "documents":
        return `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Matter Documents & Legal Exhibits</h3>
              <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="appRouter.openUploadDocModal('${matter.id}')"><i data-lucide="upload"></i> Upload Document</button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr><th>Document Title</th><th>Category</th><th>Version</th><th>Status</th><th>Updated</th><th>Size</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  ${matter.documents.length > 0 ? matter.documents.map(d => `
                    <tr>
                      <td><strong>${d.name}</strong></td>
                      <td><span class="badge badge-gray">${d.category}</span></td>
                      <td><span class="badge badge-blue">${d.version}</span></td>
                      <td><span class="badge ${d.status === 'signed' ? 'badge-green' : 'badge-amber'}">${d.status.toUpperCase()}</span></td>
                      <td>${d.updatedOn}</td>
                      <td>${d.size}</td>
                      <td>
                        <button class="btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.72rem;" onclick="appRouter.showToast('Opened preview for ${d.name}', 'info')">View</button>
                      </td>
                    </tr>
                  `).join('') : `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No documents uploaded yet. Click "Upload Document" to ingest.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `;
      case "trust":
        return `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Matter Sub-Ledger (Statutory Trust)</h3>
              <button class="btn-primary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="appRouter.openTrustReceiptModal()"><i data-lucide="plus"></i> Post Trust Money</button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr><th>Date</th><th>Type</th><th>Ref</th><th>Description</th><th>Credit</th><th>Debit</th><th>Sub-Ledger Balance</th></tr>
                </thead>
                <tbody>
                  ${matter.trustAllocations.length > 0 ? matter.trustAllocations.map(t => `
                    <tr>
                      <td>${t.date}</td>
                      <td><span class="badge badge-blue">${t.type}</span></td>
                      <td><code>${t.ref}</code></td>
                      <td>${t.description}</td>
                      <td style="color: #047857; font-weight: 600;">${t.credit}</td>
                      <td style="color: #dc2626; font-weight: 600;">${t.debit}</td>
                      <td><strong>${t.balance}</strong></td>
                    </tr>
                  `).join('') : `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No trust transactions posted to this matter sub-ledger yet.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `;

      case "audit":
        return `
          <div class="card">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <h3 class="card-title">Matter Observability & Audit Trail</h3>
                  <span class="badge badge-purple"><i data-lucide="shield-check"></i> Statutory Audit Ledger</span>
                </div>
                <p class="card-description">
                  Chronological, explainable, and tamper-evident event log for matter ${matter.reference}. Replay decisions, inspect telemetry, and export audit proofs.
                </p>
              </div>
            </div>
            <div style="padding: 1.25rem;">
              ${window.auditObservability ? window.auditObservability.renderAuditTableHTML(matter.reference) : '<p>Audit engine initializing...</p>'}
            </div>
          </div>
        `;
    }
  },

  // ==========================================================================
  // Document Upload Handling
  // ==========================================================================
  openUploadDocModal(matterId) {
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    const refInput = document.getElementById("upload-doc-matter-ref");
    if (refInput) refInput.value = `${matter.reference} - ${matter.property}`;
    const statusText = document.getElementById("upload-file-status");
    if (statusText) statusText.innerText = "Accepts PDF, TIFF, DOCX up to 50MB";
    this.selectedUploadFile = null;
    document.getElementById("upload-document-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeUploadDocModal() {
    document.getElementById("upload-document-modal").close();
  },

  handleFileSelected(input) {
    if (input.files && input.files[0]) {
      this.selectedUploadFile = input.files[0];
      const statusText = document.getElementById("upload-file-status");
      if (statusText) {
        statusText.innerHTML = `<strong style="color: #047857;">Selected: ${input.files[0].name}</strong> (${(input.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
      }
      const titleInput = document.getElementById("upload-doc-title");
      if (titleInput && !titleInput.value) {
        titleInput.value = input.files[0].name.replace(/\.[^/.]+$/, "");
      }
    }
  },

  submitUploadDocument() {
    const title = document.getElementById("upload-doc-title").value.trim();
    const category = document.getElementById("upload-doc-category").value;

    if (!title) {
      alert("Please enter a document title.");
      return;
    }

    const matter = CPMS_STORE.matters.find(m => m.id === this.activeMatterId) || CPMS_STORE.matters[0];
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: title,
      category: category,
      status: "signed",
      version: "v1.0",
      updatedOn: "Today",
      size: this.selectedUploadFile ? `${(this.selectedUploadFile.size / 1024 / 1024).toFixed(1)} MB` : "1.8 MB"
    };

    matter.documents.unshift(newDoc);
    this.closeUploadDocModal();
    this.showToast(`Document "${title}" ingested and processed by AI OCR successfully.`, "success");
    this.renderMatterDetail(matter.id);
  },

  // ==========================================================================
  // Add Party Handling
  // ==========================================================================
  openAddPartyModal(matterId) {
    document.getElementById("new-party-name").value = "";
    document.getElementById("new-party-email").value = "";
    document.getElementById("new-party-phone").value = "";
    document.getElementById("add-party-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeAddPartyModal() {
    document.getElementById("add-party-modal").close();
  },

  submitAddParty() {
    const name = document.getElementById("new-party-name").value.trim();
    const role = document.getElementById("new-party-role").value;
    const email = document.getElementById("new-party-email").value.trim();
    const phone = document.getElementById("new-party-phone").value.trim() || "-";
    const voi = document.getElementById("new-party-voi").value;

    if (!name || !email) {
      alert("Please provide party name and email.");
      return;
    }

    const matter = CPMS_STORE.matters.find(m => m.id === this.activeMatterId) || CPMS_STORE.matters[0];
    matter.parties.push({ name, role, email, phone, voi });

    this.closeAddPartyModal();
    this.showToast(`Party "${name}" added to Matter ${matter.reference}.`, "success");
    this.renderMatterDetail(matter.id);
  },

  // ==========================================================================
  // VOI Inspection Modal
  // ==========================================================================
  openVoiModal(partyName, voiStatus) {
    const subtitle = document.getElementById("voi-modal-subtitle");
    if (subtitle) subtitle.innerText = `Party: ${partyName} • ARNECC Compliance`;

    const body = document.getElementById("voi-modal-body");
    if (body) {
      body.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid var(--border-subtle); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">${partyName}</h4>
              <p style="font-size: 0.75rem; color: #64748b;">ARNECC Model Participation Rules Schedule 8 (Category 1)</p>
            </div>
            <span class="badge ${voiStatus === 'verified' ? 'badge-green' : 'badge-amber'}">${voiStatus.toUpperCase()}</span>
          </div>

          <table class="data-table" style="font-size: 0.78rem;">
            <tr><td><strong>Identity Verification Standard:</strong></td><td>ARNECC Category 1 (Face-to-Face / Biometric LiveSign)</td></tr>
            <tr><td><strong>Primary Photo Document:</strong></td><td>Australian Passport (DVS Verified • Exp 2029)</td></tr>
            <tr><td><strong>Secondary Identification:</strong></td><td>SA Driver Licence (Match 100% on SA Registrar of MV)</td></tr>
            <tr><td><strong>Liveness Facial Match:</strong></td><td>99.4% Biometric Confidence Score</td></tr>
            <tr><td><strong>Certification Officer:</strong></td><td>Demo Conveyancer (Practitioner Ref: DC-SA-881)</td></tr>
          </table>
        </div>
      `;
    }

    document.getElementById("inspect-voi-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeVoiModal() {
    document.getElementById("inspect-voi-modal").close();
  },

  // Export PDF Statement
  exportSettlementStatement(matterId) {
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    this.showToast(`Generated Settlement Statement PDF for ${matter.reference}. Preparing print preview...`, "info");
    setTimeout(() => {
      window.print();
    }, 500);
  },

  // ==========================================================================
  // Client Settlement Portal Simulator (Phone Modal)
  // ==========================================================================
  openClientPortalModal(matterId) {
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    const screen = document.getElementById("client-portal-screen");
    if (!screen) return;

    const maskedClient = this.maskPII(matter.client, "name");
    const stages = [
      { name: "Contract Signed & Accepted", desc: "Contract exchanged with vendor. Deposit secured.", status: "done" },
      { name: "Identity Verified (VOI)", desc: "ARNECC Category 1 DVS passport check verified.", status: "done" },
      { name: "Council & Water Searches Clear", desc: "SAILIS Title & SA Water searches reviewed.", status: "done" },
      { name: "PEXA Settlement Scheduled", desc: `Electronic settlement booked: ${matter.settlementDate} at 2:00 PM.`, status: "active" },
      { name: "Funds Transferred & Key Handover", desc: "Balance paid to vendor. Collect keys from agent.", status: "pending" }
    ];

    screen.innerHTML = `
      <!-- App Header -->
      <div style="background: linear-gradient(135deg, #1e3a8a, #0284c7); padding: 1.25rem 1rem 1rem 1rem; color: #ffffff;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <div style="background: rgba(255,255,255,0.2); width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">⚖️</div>
            <strong style="font-size: 0.82rem; letter-spacing: 0.02em;">Aldgate Conveyancing</strong>
          </div>
          <span style="font-size: 0.65rem; background: rgba(255,255,255,0.25); padding: 0.15rem 0.45rem; border-radius: 12px;">Live Client Hub</span>
        </div>
        <h3 style="font-size: 1.05rem; font-weight: 700; margin: 0 0 2px 0;">Hi, ${maskedClient}</h3>
        <p style="font-size: 0.72rem; opacity: 0.9; margin: 0;">Tracking your property settlement in real time</p>
      </div>

      <!-- Property Address Card -->
      <div style="padding: 0.85rem 1rem;">
        <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 0.85rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
            <i data-lucide="home" style="width: 16px; height: 16px; color: #2563eb;"></i>
            <strong style="font-size: 0.82rem; color: #0f172a;">${matter.property}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #64748b; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px dashed var(--border-subtle);">
            <span>Matter: <strong>${matter.reference}</strong></span>
            <span>Settlement: <strong style="color: #2563eb;">${matter.settlementDate}</strong></span>
          </div>
        </div>

        <!-- Live Settlement Tracker Stepper -->
        <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 0.85rem;">
          <h4 style="font-size: 0.78rem; font-weight: 700; color: #0f172a; margin: 0 0 0.65rem 0; text-transform: uppercase; letter-spacing: 0.04em;">Settlement Tracker</h4>
          <div class="client-stepper">
            ${stages.map((st, i) => `
              <div class="client-step-item">
                <div class="client-step-icon ${st.status}">
                  ${st.status === 'done' ? '✓' : i + 1}
                </div>
                <div style="flex: 1;">
                  <strong style="font-size: 0.78rem; color: ${st.status === 'active' ? '#2563eb' : '#0f172a'}; display: block;">${st.name}</strong>
                  <span style="font-size: 0.68rem; color: #64748b; line-height: 1.3; display: block;">${st.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Financial Summary Card -->
        <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 0.85rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 0.85rem;">
          <h4 style="font-size: 0.78rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem 0;">Financial Balance</h4>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem;">
            <span style="color: #64748b;">Purchase Price:</span>
            <strong>${matter.purchasePrice}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 0.25rem;">
            <span style="color: #64748b;">Deposit Held in Trust:</span>
            <strong style="color: #059669;">${matter.depositHeld}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px solid var(--border-subtle);">
            <span style="color: #0f172a; font-weight: 600;">Net Balance Required:</span>
            <strong style="color: #2563eb; font-size: 0.84rem;">${matter.balanceDue}</strong>
          </div>
        </div>

        <!-- Plain English Form 1 / Cooling-Off Card -->
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 0.75rem; margin-bottom: 0.85rem; font-size: 0.72rem; color: #1e40af; line-height: 1.4;">
          <strong><i data-lucide="shield-check" style="width: 12px; height: 12px; display: inline;"></i> Cooling-Off Rights:</strong><br>
          ${matter.coolingOff.includes('Waived') 
            ? 'Your statutory 2-day cooling-off rights were formally waived under Section 66W prior to contract exchange.'
            : 'Statutory 2-day cooling-off period is active. Contact your conveyancer immediately if you have any questions.'}
        </div>

        <!-- Direct Action Buttons -->
        <button class="btn-primary" style="background: #16a34a; border-color: #16a34a; width: 100%; justify-content: center; font-size: 0.78rem; padding: 0.55rem; margin-bottom: 0.4rem;" onclick="appRouter.showToast('Connecting you to Demo Conveyancer via WhatsApp...', 'success')">
          <i data-lucide="message-circle"></i> Chat with Your Conveyancer
        </button>
        <button class="btn-outline" style="width: 100%; justify-content: center; font-size: 0.74rem; padding: 0.45rem;" onclick="appRouter.showToast('Downloaded Client Settlement Summary PDF.', 'info')">
          <i data-lucide="download"></i> Download Settlement Statement
        </button>
      </div>
    `;

    document.getElementById("client-portal-modal").showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeClientPortalModal() {
    const modal = document.getElementById("client-portal-modal");
    if (modal) modal.close();
  },

  // ==========================================================================
  // Autonomous Search Ordering & Encumbrance Ingestion Simulator
  // ==========================================================================
  simulateSearchIngestion(matterId) {
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    const modal = document.getElementById("search-ingestion-modal");
    const body = document.getElementById("search-ingestion-modal-body");
    const footer = document.getElementById("search-ingestion-modal-footer");
    if (!modal || !body || !footer) return;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <!-- Status & Telemetry Header -->
        <div style="background: var(--surface-card-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.9rem 1.15rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <strong style="font-size: 0.88rem; color: #0f172a;">Land Services SA (SAILIS) Title Search: ${matter.title}</strong>
            <span style="display: block; font-size: 0.74rem; color: #64748b;">Target: ${matter.property} • Parcel Plan Lot 412 in Filed Plan 18290</span>
          </div>
          <span class="badge badge-purple" style="font-size: 0.74rem; font-weight: 700;"><i data-lucide="bot"></i> AI OCR Confidence: 99.1%</span>
        </div>

        <!-- Discovered Encumbrance Alert Box -->
        <div style="border: 1px solid #fde68a; background: #fffbeb; border-radius: var(--radius-md); padding: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; color: #92400e;">
            <i data-lucide="alert-triangle" style="width: 18px; height: 18px;"></i>
            <strong style="font-size: 0.88rem;">Statutory Encumbrance Detected on Register Book</strong>
          </div>
          <p style="font-size: 0.82rem; color: #78350f; line-height: 1.5; margin: 0 0 0.75rem 0;">
            The Document Intelligence Agent parsed the 12-page Title Dealing Annexure and extracted an active registered restriction:
          </p>
          <div style="background: #ffffff; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; padding: 0.75rem; font-size: 0.78rem; line-height: 1.6; color: #1e293b; border-radius: 4px; font-family: monospace;">
            <strong>Dealing:</strong> Easement TG 189201 to SA Power Networks<br>
            <strong>Extent:</strong> Full and free right of way across rear 3.05 metres for electrical conduits and substations.<br>
            <strong>Statutory Caveat:</strong> No permanent structures or swimming pools permitted within 3.05m rear boundary without prior written utility consent.
          </div>
        </div>

        <!-- Compliance Impact & Action Plan -->
        <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.9rem; background: #ffffff;">
          <h4 style="font-size: 0.84rem; font-weight: 700; color: #0f172a; margin: 0 0 0.4rem 0;">Conveyancer Action Required:</h4>
          <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.78rem; color: #475569; line-height: 1.6;">
            <li>Cross-check Section 7 Form 1 disclosure to verify vendor disclosed Easement TG 189201.</li>
            <li>Verify existing building footprint against aerial council survey to confirm no building encroachment into rear 3.05m strip.</li>
            <li>Notify purchaser's lender (ANZ Bank) of registered utility easement.</li>
          </ul>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn-outline" onclick="appRouter.closeSearchIngestionModal()">Close</button>
      <button class="btn-primary" onclick="appRouter.commitDiscoveredEncumbrance('${matter.id}')"><i data-lucide="check"></i> Accept & Add to Matter Checklist</button>
    `;

    modal.showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeSearchIngestionModal() {
    const modal = document.getElementById("search-ingestion-modal");
    if (modal) modal.close();
  },

  commitDiscoveredEncumbrance(matterId) {
    const matter = CPMS_STORE.matters.find(m => m.id === matterId) || CPMS_STORE.matters[0];
    matter.checklist = matter.checklist || [];

    const itemTitle = "Verify SA Power Networks Easement TG 189201 (Rear 3.05m boundary)";
    if (!matter.checklist.some(c => c.title === itemTitle)) {
      matter.checklist.push({
        id: `chk-ease-${Date.now()}`,
        title: itemTitle,
        note: "Auto-ingested from SAILIS Title Search. Ensure rear 3.05m electrical conduit easement has no building encroachment.",
        status: "pending",
        date: new Date().toLocaleDateString("en-AU")
      });
    }

    if (window.auditObservability) {
      window.auditObservability.recordEvent({
        matterRef: matter.reference,
        category: "AI_INFERENCE",
        severity: "WARNING",
        action: "Autonomous Search Ingestion: Discovered Easement TG 189201",
        explainability: {
          rationale: "Document Intelligence Agent parsed 12-page Land Services SA Register Book Title Search for CT 5874/412. Discovered active statutory easement TG 189201 across rear 3.05m to SA Power Networks.",
          confidence: 0.991,
          governingRule: "Real Property Act 1886 (SA) & Land and Business Act 1994 Section 7",
          telemetry: {
            traceId: `tr-sailis-${Math.random().toString(16).slice(2, 8)}`,
            durationMs: 460,
            model: "claude-3-5-sonnet-20241022 (SAILIS LTO OCR Pipeline)"
          }
        },
        payload: {
          titleRef: matter.title,
          dealingType: "Easement",
          dealingNumber: "TG 189201",
          grantee: "SA Power Networks",
          restrictionZone: "Rear 3.05 metres"
        },
        stateDiff: {
          field: "matter.checklist",
          before: "Checklist without easement item",
          after: itemTitle
        }
      });
    }

    this.closeSearchIngestionModal();
    this.showToast(`Easement TG 189201 added to Matter Checklist & Form 1 Review. Recorded in cryptographic audit ledger.`, "success");
    this.renderMatterDetail(matter.id);
  },
});
