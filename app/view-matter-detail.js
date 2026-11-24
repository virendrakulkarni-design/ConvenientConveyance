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
          <p>Client: <strong>${matter.client}</strong> • Title: <strong>${matter.title}</strong> • Price: <strong>${matter.purchasePrice}</strong> • File Handler: <strong>${matter.manager}</strong></p>
        </div>
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
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
                      <td><strong>${p.name}</strong></td>
                      <td><span class="badge badge-blue">${p.role}</span></td>
                      <td>${p.email}<br><small style="color: #64748b;">${p.phone}</small></td>
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
});
