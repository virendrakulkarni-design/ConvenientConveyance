// ============================================================================
// CPMS View: Administration & Settings
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
  // ==========================================================================
  // Render Settings
  // ==========================================================================
  renderSettings() {
    this.activeAdvisoryTab = this.activeAdvisoryTab || "applied";
    const advisories = CPMS_STORE.advisories || [];
    const appliedList = advisories.filter(a => a.status === "applied");
    const dismissedList = advisories.filter(a => a.status === "dismissed");
    const discardedList = advisories.filter(a => a.status === "discarded");

    let currentList = appliedList;
    if (this.activeAdvisoryTab === "dismissed") currentList = dismissedList;
    if (this.activeAdvisoryTab === "discarded") currentList = discardedList;

    const formatDateTime = (iso) => {
      if (!iso) return "-";
      const d = new Date(iso);
      return d.toLocaleDateString("en-AU", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", hour12: true
      });
    };

    const container = document.getElementById("page-content");
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Practice Administration & Security</h2>
          <p>Role-based access control (RBAC), multi-tenancy settings, UI themes, and AI decision registry.</p>
        </div>
      </div>

      <!-- Theme & Appearance Customization -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Practice Visual Brand & UI Themes</h3>
            <p class="card-description">Select your firm's executive design theme. Changes persist across sessions.</p>
          </div>
          <span class="badge badge-green">Live Switcher</span>
        </div>
        <div style="padding: 1.25rem;">
          <div class="theme-showcase-grid">
            <div class="theme-showcase-card ${this.currentTheme === 'agentic-teal' ? 'active' : ''}" onclick="appRouter.setTheme('agentic-teal')">
              <div class="theme-showcase-banner" style="background: linear-gradient(135deg, #C86518, #E07B2A);">
                <span>CPMS Agentic Stack</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 0.85rem; color: #0f172a;">Agentic Amber & Teal</strong>
                ${this.currentTheme === 'agentic-teal' ? '<span class="badge badge-green">Active</span>' : ''}
              </div>
              <p style="font-size: 0.74rem; color: #64748b; line-height: 1.4;">Official colour combination from CPMS Agentic AI Stack Design: Dominant Warm Copper Amber (#C86518) with Deep Ocean Teal accents.</p>
            </div>

            <div class="theme-showcase-card ${this.currentTheme === 'sapphire' ? 'active' : ''}" onclick="appRouter.setTheme('sapphire')">
              <div class="theme-showcase-banner" style="background: linear-gradient(135deg, #1E3A8A, #2563EB);">
                <span>Royal Sapphire</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 0.85rem; color: #0f172a;">Royal Sapphire & Slate</strong>
                ${this.currentTheme === 'sapphire' ? '<span class="badge badge-blue">Active</span>' : ''}
              </div>
              <p style="font-size: 0.74rem; color: #64748b; line-height: 1.4;">Adelaide executive corporate palette with Deep Carbon Slate, Royal Sapphire, and Trust Emerald.</p>
            </div>

            <div class="theme-showcase-card ${this.currentTheme === 'nordic-slate' ? 'active' : ''}" onclick="appRouter.setTheme('nordic-slate')">
              <div class="theme-showcase-banner" style="background: linear-gradient(135deg, #0F766E, #0284C7);">
                <span>Nordic Arctic</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 0.85rem; color: #0f172a;">Nordic Arctic & Sky</strong>
                ${this.currentTheme === 'nordic-slate' ? '<span class="badge badge-blue">Active</span>' : ''}
              </div>
              <p style="font-size: 0.74rem; color: #64748b; line-height: 1.4;">Clean high-contrast Scandinavian minimalism with Arctic Ocean Green and Sky Blue accents.</p>
            </div>

            <div class="theme-showcase-card ${this.currentTheme === 'burgundy' ? 'active' : ''}" onclick="appRouter.setTheme('burgundy')">
              <div class="theme-showcase-banner" style="background: linear-gradient(135deg, #701A75, #D97706);">
                <span>Prestige Burgundy</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="font-size: 0.85rem; color: #0f172a;">Burgundy & Antique Gold</strong>
                ${this.currentTheme === 'burgundy' ? '<span class="badge badge-purple">Active</span>' : ''}
              </div>
              <p style="font-size: 0.74rem; color: #64748b; line-height: 1.4;">Traditional legal practice heritage theme with rich Claret Burgundy and Antique Seal Gold.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Practice-Wide Observability & Immutable Audit Trail -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h3 class="card-title">Practice-Wide Observability & Statutory Audit Ledger</h3>
              <span class="badge badge-purple"><i data-lucide="activity"></i> OpenTelemetry Tracing</span>
              <span class="badge badge-green"><i data-lucide="shield-check"></i> SHA-256 Chained</span>
            </div>
            <p class="card-description">
              Immutable event log capturing all practitioner authorizations, AI inferences, PEXA API transactions, and trust movements. Every event is cryptographically hash-chained, explainable, and replayable for statutory audits.
            </p>
          </div>
        </div>
        <div style="padding: 1.25rem;">
          ${window.auditObservability ? window.auditObservability.renderAuditTableHTML() : '<p>Initializing audit engine...</p>'}
        </div>
      </div>

      <!-- AI Advisory & Audit Decision Registry -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h3 class="card-title">AI Advisory & Audit Decision Registry</h3>
              <span class="badge badge-purple"><i data-lucide="shield-check"></i> Statutory Audit Ledger</span>
            </div>
            <p class="card-description">
              Centralized administrative record of legal intelligence advisories. Review approval/rejection timestamps, re-apply dismissed items to matter checklists, or archive to the permanent discard ledger.
            </p>
          </div>
        </div>

        <!-- Segmented Tab Navigation -->
        <div style="padding: 0 1.25rem 0.75rem 1.25rem; display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-subtle);">
          <button class="btn-outline" 
            style="font-size: 0.8rem; padding: 0.45rem 0.9rem; font-weight: 600; ${this.activeAdvisoryTab === 'applied' ? 'background: var(--color-primary-soft); color: var(--color-primary); border-color: var(--color-primary); font-weight: 700;' : ''}"
            onclick="appRouter.switchAdvisoryTab('applied')">
            <i data-lucide="check-circle-2"></i> Applied to Checklist (${appliedList.length})
          </button>
          <button class="btn-outline" 
            style="font-size: 0.8rem; padding: 0.45rem 0.9rem; font-weight: 600; ${this.activeAdvisoryTab === 'dismissed' ? 'background: var(--color-warning-soft); color: var(--color-warning); border-color: var(--color-warning); font-weight: 700;' : ''}"
            onclick="appRouter.switchAdvisoryTab('dismissed')">
            <i data-lucide="clock"></i> Dismissed List (${dismissedList.length})
          </button>
          <button class="btn-outline" 
            style="font-size: 0.8rem; padding: 0.45rem 0.9rem; font-weight: 600; ${this.activeAdvisoryTab === 'discarded' ? 'background: #f1f5f9; color: #475569; border-color: #94a3b8; font-weight: 700;' : ''}"
            onclick="appRouter.switchAdvisoryTab('discarded')">
            <i data-lucide="archive"></i> Permanently Discarded (${discardedList.length})
          </button>
        </div>

        <!-- Registry Table -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 14%;">Advisory ID / Matter</th>
                <th style="width: 32%;">Advisory Title & Details</th>
                <th style="width: 18%;">AI Agent Source</th>
                <th style="width: 18%;">Decision Timestamp</th>
                <th style="width: 18%; text-align: right;">Administrative Action</th>
              </tr>
            </thead>
            <tbody>
              ${currentList.length === 0 ? `
                <tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2.5rem 1rem;">
                  <i data-lucide="inbox" style="width: 32px; height: 32px; margin: 0 auto 0.5rem auto; color: var(--text-muted); display: block;"></i>
                  No advisories in this category.
                </td></tr>
              ` : currentList.map(a => `
                <tr>
                  <td>
                    <strong>${a.id}</strong><br>
                    <span class="badge badge-blue" style="font-size: 0.7rem; padding: 0.1rem 0.45rem; margin-top: 0.2rem;">${a.matterRef}</span>
                  </td>
                  <td>
                    <strong style="color: var(--text-primary); font-size: 0.84rem;">${a.title}</strong><br>
                    <small style="color: var(--text-secondary); line-height: 1.4; display: block; margin-top: 0.15rem;">${a.desc}</small>
                    <small style="color: var(--text-muted); font-size: 0.72rem;">Client: <strong class="pii-sensitive">${this.maskPII(a.client, "name")}</strong></small>
                  </td>
                  <td>
                    <span style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary);"><i data-lucide="bot" style="width: 13px; height: 13px; vertical-align: middle; margin-right: 3px;"></i>${a.agent}</span>
                  </td>
                  <td>
                    <div style="font-size: 0.78rem; font-weight: 600; color: var(--text-primary);">
                      ${formatDateTime(a.appliedAt || a.dismissedAt || a.discardedAt)}
                    </div>
                    <small style="color: var(--text-muted);">${a.lastAction} by ${a.actionBy}</small>
                  </td>
                  <td style="text-align: right;">
                    ${this.activeAdvisoryTab === 'applied' ? `
                      <button class="btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.74rem;" onclick="appRouter.viewAdvisoryDetails('${a.id}')">
                        <i data-lucide="eye"></i> View Details
                      </button>
                    ` : this.activeAdvisoryTab === 'dismissed' ? `
                      <div style="display: flex; gap: 0.4rem; justify-content: flex-end;">
                        <button class="btn-primary" style="padding: 0.35rem 0.65rem; font-size: 0.74rem;" onclick="appRouter.adminApplyAdvisory('${a.id}')" title="Re-apply advisory to matter checklist">
                          <i data-lucide="plus-circle"></i> Apply to Checklist
                        </button>
                        <button class="btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.74rem; color: var(--color-danger); border-color: var(--color-danger);" onclick="appRouter.adminPromptDiscard('${a.id}')" title="Permanently discard (cannot be reapplied)">
                          <i data-lucide="trash-2"></i> Discard
                        </button>
                      </div>
                    ` : `
                      <div style="display: flex; gap: 0.4rem; justify-content: flex-end; align-items: center;">
                        <span class="badge badge-gray" style="font-size: 0.7rem;"><i data-lucide="lock"></i> Locked</span>
                        <button class="btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.74rem;" onclick="appRouter.viewAdvisoryDetails('${a.id}')">
                          <i data-lucide="file-text"></i> Audit Record
                        </button>
                      </div>
                    `}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Practice Data Backup, Export & Restore -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div>
            <h3 class="card-title">Practice Data Export, Restore &amp; Reset</h3>
            <p class="card-description">Export a complete JSON snapshot of your matters, parties, clients, trust ledgers, and audit trail before resetting, or restore from a previous backup.</p>
          </div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="btn-primary" onclick="appRouter.exportAppData()"><i data-lucide="download"></i> Export Data (.json)</button>
            <button class="btn-outline" onclick="appRouter.triggerImportData()"><i data-lucide="upload"></i> Import / Restore (.json)</button>
            <button class="btn-outline" style="color: #dc2626; border-color: #fecaca;" onclick="appRouter.resetSyntheticData()"><i data-lucide="rotate-ccw"></i> Reset Demo Data</button>
          </div>
        </div>
      </div>

      <!-- Staff Members -->
      <div class="card">
        <div class="card-header"><h3 class="card-title">Staff Members & Assigned RBAC Roles</h3></div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr><th>User Name</th><th>Email</th><th>Role</th><th>Permissions</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Demo Conveyancer</strong></td>
                <td>demo.conveyancer@example.com</td>
                <td><span class="badge badge-purple">Senior Conveyancer</span></td>
                <td>Runs matters end-to-end, prepares documents, posts to trust</td>
                <td><span class="badge badge-green">Active</span></td>
              </tr>
              <tr>
                <td><strong>Tom Hargreaves</strong></td>
                <td>tom.hargreaves@example.com</td>
                <td><span class="badge badge-blue">Principal</span></td>
                <td>Full system access, compliance signoff, trust auditor</td>
                <td><span class="badge badge-green">Active</span></td>
              </tr>
              <tr>
                <td><strong>Rebecca Lindsay</strong></td>
                <td>rebecca.lindsay@example.com</td>
                <td><span class="badge badge-blue">Licensed Conveyancer</span></td>
                <td>File management, SAILIS searches, PEXA workspace authoring</td>
                <td><span class="badge badge-green">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  switchAdvisoryTab(tabName) {
    this.activeAdvisoryTab = tabName;
    this.renderSettings();
  },

  adminApplyAdvisory(advId) {
    if (!CPMS_STORE.advisories) return;
    const adv = CPMS_STORE.advisories.find(a => a.id === advId);
    if (!adv) return;

    adv.status = "applied";
    adv.appliedAt = new Date().toISOString();
    adv.lastAction = "Re-applied by Admin";
    adv.actionBy = "Administrator";

    // Attach to matter checklist
    const matter = CPMS_STORE.matters.find(m => m.reference === adv.matterRef);
    if (matter) {
      matter.checklist = matter.checklist || [];
      if (!matter.checklist.some(c => c.title === adv.title)) {
        matter.checklist.push({
          id: `chk-${Date.now()}`,
          title: adv.title,
          note: adv.desc,
          status: "pending",
          date: new Date().toLocaleDateString("en-AU")
        });
      }
    }

    this.showToast(`Advisory [${adv.id}] re-applied to Matter ${adv.matterRef} checklist.`, "success");
    this.renderSettings();
  },

  adminPromptDiscard(advId) {
    this.pendingDiscardAdvId = advId;
    const adv = (CPMS_STORE.advisories || []).find(a => a.id === advId);
    const modal = document.getElementById("confirm-discard-modal");
    const desc = document.getElementById("confirm-discard-desc");
    if (desc && adv) {
      desc.innerHTML = `
        <div style="font-size: 0.83rem; color: var(--text-primary); line-height: 1.5;">
          Are you sure you want to permanently discard <strong>${adv.id}</strong> (<em>${adv.title}</em> for Matter <strong>${adv.matterRef}</strong>)?
          <br><br>
          <div style="background: var(--color-danger-soft); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: var(--radius-md); padding: 0.75rem; color: #991b1b;">
            <strong>⚠ Irreversible Action:</strong> This advisory will be moved to the <strong>Permanently Discarded List</strong> with an immutable timestamp and <strong>can NEVER be re-applied</strong>.
          </div>
        </div>
      `;
    }
    if (modal) modal.showModal();
  },

  adminConfirmDiscard() {
    if (!this.pendingDiscardAdvId || !CPMS_STORE.advisories) return;
    const adv = CPMS_STORE.advisories.find(a => a.id === this.pendingDiscardAdvId);
    if (adv) {
      adv.status = "discarded";
      adv.discardedAt = new Date().toISOString();
      adv.lastAction = "Permanently Discarded by Admin";
      adv.actionBy = "Administrator";
    }
    this.closeConfirmDiscardModal();
    this.showToast(`Advisory permanently archived to Discarded List. Re-application permanently disabled.`, "warning");
    this.renderSettings();
  },

  closeConfirmDiscardModal() {
    this.pendingDiscardAdvId = null;
    const modal = document.getElementById("confirm-discard-modal");
    if (modal) modal.close();
  },

  viewAdvisoryDetails(advId) {
    const adv = (CPMS_STORE.advisories || []).find(a => a.id === advId);
    if (!adv) return;

    const modal = document.getElementById("advisory-details-modal");
    const titleEl = document.getElementById("adv-modal-title");
    const bodyEl = document.getElementById("adv-modal-body");

    if (titleEl) titleEl.innerText = `Advisory Audit: ${adv.id} [${adv.matterRef}]`;
    if (bodyEl) {
      const formatDT = (iso) => iso ? new Date(iso).toLocaleString("en-AU") : "Not recorded";
      bodyEl.innerHTML = `
        <div style="background: var(--surface-card-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
            <h4 style="margin: 0; font-size: 0.95rem; color: var(--text-primary); font-weight: 700;">${adv.title}</h4>
            <span class="badge ${adv.status === 'applied' ? 'badge-green' : adv.status === 'dismissed' ? 'badge-amber' : 'badge-gray'}">${adv.status.toUpperCase()}</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 0.75rem 0;">${adv.desc}</p>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 0.65rem;">
            <div><span style="color: var(--text-muted);">Matter Reference:</span> <strong>${adv.matterRef}</strong></div>
            <div><span style="color: var(--text-muted);">Client:</span> <strong class="pii-sensitive">${this.maskPII(adv.client || 'N/A', "name")}</strong></div>
            <div><span style="color: var(--text-muted);">Property:</span> <strong>${adv.property || 'N/A'}</strong></div>
            <div><span style="color: var(--text-muted);">AI Source:</span> <strong>${adv.agent}</strong></div>
          </div>
        </div>

        <h4 style="font-size: 0.82rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0;">Audit Trail & Datetime History</h4>
        <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 0.75rem; font-size: 0.76rem; font-family: monospace; line-height: 1.7;">
          <div>• Applied At: <span style="color: var(--color-trust-emerald); font-weight: 600;">${formatDT(adv.appliedAt)}</span></div>
          <div>• Dismissed At: <span style="color: var(--color-warning); font-weight: 600;">${formatDT(adv.dismissedAt)}</span></div>
          <div>• Discarded At: <span style="color: var(--color-danger); font-weight: 600;">${formatDT(adv.discardedAt)}</span></div>
          <div>• Last Action: <strong>${adv.lastAction || 'Created'}</strong> (${adv.actionBy || 'System'})</div>
        </div>
      `;
    }
    if (modal) {
      modal.showModal();
      if (window.lucide) window.lucide.createIcons();
    }
  },

  closeAdvisoryDetailsModal() {
    const modal = document.getElementById("advisory-details-modal");
    if (modal) modal.close();
  }
});
