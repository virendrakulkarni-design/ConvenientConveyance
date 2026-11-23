// ============================================================================
// CPMS View: Document Templates Library
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
// ==========================================================================
  // Render Document Template Library & Search
  // ==========================================================================
  renderDocuments() {
    const container = document.getElementById("page-content");
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Document Template Library</h2>
          <p>Government forms and firm templates your practice generates documents and settlement packs from.</p>
        </div>
        <button class="btn-primary" onclick="appRouter.openCreateTemplateModal()"><i data-lucide="plus"></i> New Template</button>
      </div>

      <div class="card" data-tour="templates-table">
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-input">
              <i data-lucide="search"></i>
              <input type="text" placeholder="Search templates..." id="template-search" oninput="appRouter.filterTemplates()">
            </div>
            <select class="filter-select" id="template-filter-cat" onchange="appRouter.filterTemplates()">
              <option value="">All Categories</option>
              <option value="Disclosure">Disclosure</option>
              <option value="Contract">Contract</option>
              <option value="Authority">Authority</option>
              <option value="Settlement">Settlement</option>
              <option value="Identity">Identity</option>
            </select>
          </div>
          <span style="font-size: 0.8rem; color: #64748b;" id="templates-count-label">Showing <strong>${CPMS_STORE.templates.length}</strong> templates</span>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr><th>Template Name</th><th>Classification</th><th>Category</th><th>Merge Fields</th><th>Status</th><th>Last Revision</th><th>Action</th></tr>
            </thead>
            <tbody id="templates-table-body">
              ${this.getTemplatesRowsHTML(CPMS_STORE.templates)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getTemplatesRowsHTML(tplList) {
    if (tplList.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; color: #64748b; padding: 2rem;">No document templates match your filters.</td></tr>`;
    }

    return tplList.map(t => `
      <tr onclick="appRouter.previewTemplate('${t.id}')" style="cursor: pointer;">
        <td><strong>${t.name}</strong><br><small style="color: #64748b;">${t.description.substring(0, 60)}...</small></td>
        <td><span class="badge ${t.type.includes('Government') ? 'badge-blue' : 'badge-purple'}">${t.type}</span></td>
        <td><span class="badge badge-gray">${t.category}</span></td>
        <td><strong>${t.fields} fields</strong></td>
        <td><span class="badge ${t.status === 'Active' ? 'badge-green' : 'badge-amber'}">${t.status}</span></td>
        <td>${t.updatedOn}</td>
        <td><button class="btn-outline" style="padding: 0.2rem 0.55rem; font-size: 0.72rem;">Preview</button></td>
      </tr>
    `).join('');
  },

  filterTemplates() {
    const query = (document.getElementById("template-search")?.value || "").toLowerCase().trim();
    const catVal = document.getElementById("template-filter-cat")?.value || "";
    const tbody = document.getElementById("templates-table-body");
    const countLabel = document.getElementById("templates-count-label");

    const filtered = CPMS_STORE.templates.filter(t => {
      const matchQ = !query ||
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query);

      const matchCat = !catVal || t.category === catVal;
      return matchQ && matchCat;
    });

    if (tbody) tbody.innerHTML = this.getTemplatesRowsHTML(filtered);
    if (countLabel) countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> of ${CPMS_STORE.templates.length} templates`;
    if (window.lucide) window.lucide.createIcons();
  },

  openCreateTemplateModal() {
    const modal = document.getElementById("create-template-modal");
    if (!modal) return;
    document.getElementById("create-template-form")?.reset();
    modal.showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  closeCreateTemplateModal() {
    document.getElementById("create-template-modal")?.close();
  },

  submitCreateTemplate() {
    const name = document.getElementById("new-template-name")?.value.trim();
    const type = document.getElementById("new-template-type")?.value || "Firm Template";
    const cat = document.getElementById("new-template-cat")?.value || "Disclosure";
    const fields = parseInt(document.getElementById("new-template-fields")?.value, 10) || 12;
    const status = document.getElementById("new-template-status")?.value || "Active";
    const desc = document.getElementById("new-template-desc")?.value.trim();
    const body = document.getElementById("new-template-body")?.value.trim();

    if (!name || !desc) {
      this.showToast("Please provide both a Template Title and Description.", "error");
      return;
    }

    const newTpl = {
      id: "tpl-" + (CPMS_STORE.templates.length + 1) + "-" + Date.now().toString(36).substr(-4),
      name: name,
      type: type,
      category: cat,
      fields: fields,
      status: status,
      description: desc,
      body: body || `RE: Matter {{ matter.reference }}\nProperty: {{ property.address }}\nPurchaser: {{ purchaser.full_name }}`,
      updatedOn: new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "2-digit", year: "numeric" })
    };

    CPMS_STORE.templates.unshift(newTpl);
    this.closeCreateTemplateModal();
    this.renderDocuments();
    this.showToast(`Template "${name}" registered successfully and added to library.`, "success");
    if (window.lucide) window.lucide.createIcons();
  },

  previewTemplate(templateId) {
    const t = CPMS_STORE.templates.find(item => item.id === templateId);
    if (!t) return;
    this.currentPreviewTemplate = t;

    const titleEl = document.getElementById("modal-template-title");
    const metaEl = document.getElementById("modal-template-meta");
    const descEl = document.getElementById("modal-template-desc");
    const docTitleEl = document.getElementById("merged-doc-title");
    const rawViewEl = document.getElementById("tpl-raw-view");
    const mergedViewEl = document.getElementById("tpl-merged-view");

    if (titleEl) titleEl.innerText = t.name;
    if (metaEl) metaEl.innerText = `${t.type} • ${t.category} • ${t.fields} Merge Fields`;
    if (descEl) descEl.innerText = t.description;
    if (docTitleEl) docTitleEl.innerText = t.name;

    if (mergedViewEl) {
      mergedViewEl.innerHTML = `
        <div style="border-bottom: 2px solid #0f172a; padding-bottom: 0.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <h4 id="merged-doc-title" style="font-size: 1.05rem; font-weight: 700; color: #0f172a; font-family: 'Inter', sans-serif;">${t.name}</h4>
            <span style="font-size: 0.72rem; color: #64748b; font-family: 'Inter', sans-serif;">${t.type} • Category: ${t.category} • South Australia Jurisdiction</span>
          </div>
          <span class="badge badge-green" style="font-family: 'Inter', sans-serif;">Live Assembled Instance</span>
        </div>
        <p><strong>FILE REFERENCE:</strong> 2026-0184 (Aldgate Conveyancing)</p>
        <p><strong>TO THE PURCHASER:</strong> Margaret Thi Nguyen (18 Rosslyn Street, Glenside SA 5065)</p>
        <p><strong>VENDOR:</strong> Estate of Anthony Richard Miller (Dec'd)</p>
        <p><strong>SUBJECT PROPERTY:</strong> 57 Prospect Road, Norwood SA 5067 (Certificate of Title: <strong>CT 5874/412</strong>)</p>
        <p><strong>PURCHASE CONSIDERATION:</strong> $1,250,000.00 AUD</p>
        <p><strong>DEPOSIT PAID:</strong> $125,000.00 AUD (Held in Aldgate Conveyancing Statutory Trust Account)</p>
        <p><strong>COOLING-OFF STATUS:</strong> Waived pursuant to Section 66W Certificate</p>
        <p><strong>STATUTORY WATER CHARGES (SA Water RD24):</strong> Supply Availability: $74.20/quarter • Sewerage assessed on Valuer-General Capital Value • SMR reading booked 14 business days prior to settlement.</p>
        <div style="margin-top: 1rem; padding: 0.75rem; background: #f8fafc; border-radius: 6px; font-size: 0.78rem; color: #475569;">
          <em>Template Summary: ${t.description}</em>
        </div>
      `;
    }

    if (rawViewEl) {
      rawViewEl.innerHTML = `
        <div style="color: #64748b; margin-bottom: 0.5rem; font-family: sans-serif; font-size: 0.75rem;">// Active Merge Tags Syntax (South Australian Jurisdiction Schema)</div>
        <span style="color: #2563eb;">{{ matter.reference }}</span> • TO THE PURCHASER: <span style="color: #047857;">{{ purchaser.full_name }}</span><br>
        PROPERTY PARCEL: <span style="color: #b45309;">{{ property.address }}</span> (Title Reference: <span style="color: #b45309;">{{ property.certificate_of_title }}</span>)<br>
        PURCHASE CONSIDERATION: <span style="color: #1e3a8a; font-weight: 700;">{{ contract.purchase_price }}</span><br>
        DEPOSIT HELD IN TRUST: <span style="color: #1e3a8a;">{{ contract.deposit_amount }}</span><br>
        COOLING-OFF EXPIRY: <span style="color: #dc2626;">{{ contract.cooling_off_date }}</span><br>
        WATER & RATES ADJUSTMENT: <span style="color: #047857;">{{ adjustments.water_and_council }}</span><br>
        <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed #cbd5e1; color: #475569;">
          {{ matter.disclosures_checklist }}<br>
          {{ statutory_notice_clauses }}
        </div>
      `;
    }

    this.switchTemplatePreviewMode('merged');
    const modal = document.getElementById("template-preview-modal");
    if (modal) modal.showModal();
    if (window.lucide) window.lucide.createIcons();
  },

  switchTemplatePreviewMode(mode) {
    const rawView = document.getElementById("tpl-raw-view");
    const mergedView = document.getElementById("tpl-merged-view");
    const rawBtn = document.getElementById("tpl-tab-raw");
    const mergedBtn = document.getElementById("tpl-tab-merged");

    if (mode === "raw") {
      if (rawView) rawView.style.display = "block";
      if (mergedView) mergedView.style.display = "none";
      if (rawBtn) { rawBtn.className = "btn-primary"; }
      if (mergedBtn) { mergedBtn.className = "btn-outline"; }
    } else {
      if (rawView) rawView.style.display = "none";
      if (mergedView) mergedView.style.display = "block";
      if (rawBtn) { rawBtn.className = "btn-outline"; }
      if (mergedBtn) { mergedBtn.className = "btn-primary"; }
    }
  },

  downloadMergedTemplateInstance() {
    const t = this.currentPreviewTemplate || CPMS_STORE.templates[0];
    const textContent = `=======================================================
${t.name.toUpperCase()}
Generated by CPMS (South Australia Electronic Conveyancing)
Date: ${new Date().toLocaleString("en-AU")}
=======================================================

MATTER REFERENCE: 2026-0184
CLIENT / PURCHASER: Margaret Thi Nguyen
VENDOR: Estate of Anthony Richard Miller (Dec'd)
PROPERTY: 57 Prospect Road, Norwood SA 5067
TITLE REFERENCE: Certificate of Title CT 5874/412
PURCHASE CONSIDERATION: $1,250,000.00 AUD
STATUTORY DEPOSIT: $125,000.00 AUD (Held in Trust)
SETTLEMENT DATE: 18/11/2026
ELECTRONIC WORKSPACE: PEXA SA-99824

SA WATER RD24 STATUTORY ADJUSTMENT SCHEDULE:
- Supply availability charge: $74.20/quarter
- Water use allocation adjustment calculated to settlement date
- Special Meter Reading (SMR) confirmed

STATUS: ASSEMBLED AND AUDIT-LOCKED
`;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${t.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_Instance_2026-0184.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast(`Assembled document for "${t.name}" downloaded successfully.`, "success");
  },

  closeModal() {
    document.getElementById("template-preview-modal")?.close();
  },
});
