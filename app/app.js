// ============================================================================
// CPMS Core Application Engine & Reactive Store
// Jurisdiction: South Australia Conveyancing Practice
// Architecture: Modular Vanilla Architecture (Data, Themes, Views, Router)
// ============================================================================

// Initialize reactive state from modular data store (data.js)
let CPMS_STORE = typeof getInitialData === "function" 
  ? getInitialData() 
  : { persona: {}, matters: [], clients: [], properties: [], templates: [], trust: {} };

// ============================================================================
// Router and Navigation Management
// ============================================================================
class AppRouter {
  constructor() {
    this.currentRoute = "dashboard";
    this.activeMatterId = "mt-1";
    this.activeMatterTab = "parties";
    this.selectedUploadFile = null;
    this.privacyMode = localStorage.getItem("cpms_privacy_mode") === "true";

    this.currentTheme = localStorage.getItem("cpms_theme") || "nordic-slate";
    this.themes = {
      "agentic-teal": { name: "Agentic Amber & Teal", primary: "#c86518", accent: "#1a7a7a", desc: "CPMS Agentic Stack - Dominant Warm Copper Amber" },
      "sapphire": { name: "Royal Sapphire & Slate", primary: "#1e3a8a", accent: "#2563eb", desc: "Executive Adelaide Navy" },
      "nordic-slate": { name: "Nordic Arctic & Sky", primary: "#0f766e", accent: "#0284c7", desc: "Modern Clean Minimalist" },
      "burgundy": { name: "Burgundy & Antique Gold", primary: "#701a75", accent: "#d97706", desc: "Prestige Barrister & Solicitor" }
    };

    window.addEventListener("hashchange", () => this.handleHashChange());

    // Close global search & popovers on document click
    document.addEventListener("click", (e) => {
      const searchBox = document.querySelector(".search-box");
      const dropdown = document.getElementById("global-search-dropdown");
      if (dropdown && searchBox && !searchBox.contains(e.target)) {
        dropdown.classList.remove("open");
      }
      const notifWrap = document.querySelector(".notifications-wrap");
      const notifPopover = document.getElementById("notifications-popover");
      if (notifPopover && notifWrap && !notifWrap.contains(e.target)) {
        notifPopover.classList.remove("open");
      }
      const themeWrap = document.querySelector(".theme-switcher-wrap");
      const themeDropdown = document.getElementById("theme-dropdown");
      if (themeDropdown && themeWrap && !themeWrap.contains(e.target)) {
        themeDropdown.classList.remove("open");
      }
    });
  }

  init() {
    this.applyTheme(this.currentTheme, false);
    this.applyPrivacyMode(false);
    this.updateMattersBadge();
    if (!window.location.hash) {
      window.location.hash = "#/dashboard";
    } else {
      this.handleHashChange();
    }
  }

  toggleThemeMenu() {
    const dropdown = document.getElementById("theme-dropdown");
    if (dropdown) dropdown.classList.toggle("open");
  }

  setTheme(themeKey) {
    if (!this.themes[themeKey]) return;
    this.currentTheme = themeKey;
    localStorage.setItem("cpms_theme", themeKey);
    this.applyTheme(themeKey, true);
    const dropdown = document.getElementById("theme-dropdown");
    if (dropdown) dropdown.classList.remove("open");
  }

  applyTheme(themeKey, showToastNotification = true) {
    const theme = this.themes[themeKey] || this.themes["agentic-teal"];
    document.documentElement.setAttribute("data-theme", themeKey);

    const label = document.getElementById("current-theme-name");
    if (label) label.innerText = theme.name.split(" & ")[0];

    const dot = document.getElementById("topbar-theme-dot");
    if (dot) dot.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`;

    document.querySelectorAll(".theme-option").forEach(opt => {
      opt.classList.toggle("active", opt.id === `theme-opt-${themeKey}`);
    });

    if (showToastNotification) {
      this.showToast(`Switched theme to: ${theme.name}`, "info");
    }

    if (this.currentRoute === "settings") {
      this.renderSettings();
    }
  }

  updateMattersBadge() {
    const badge = document.getElementById("sidebar-matters-badge");
    if (badge) {
      badge.innerText = CPMS_STORE.matters.length;
    }
    const partiesBadge = document.getElementById("sidebar-parties-badge");
    if (partiesBadge) {
      const totalParties = (CPMS_STORE.matters || []).reduce((acc, m) => acc + (m.parties ? m.parties.length : 0), 0);
      partiesBadge.innerText = totalParties;
    }
  }

  toggleMobileSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.toggle("mobile-open");
    if (backdrop) backdrop.classList.toggle("active");
  }

  closeMobileSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (backdrop) backdrop.classList.remove("active");
  }

  togglePrivacyMode() {
    this.privacyMode = !this.privacyMode;
    localStorage.setItem("cpms_privacy_mode", this.privacyMode ? "true" : "false");
    this.applyPrivacyMode(true);
    if (this.privacyMode) {
      this.showToast("Privacy Mode Activated: Client PII (names, contacts, accounts) redacted for audit demonstration.", "info");
    } else {
      this.showToast("Privacy Mode Deactivated: Displaying complete practitioner records.", "info");
    }
  }

  applyPrivacyMode(rerender = true) {
    const btn = document.getElementById("privacy-toggle-btn");
    if (this.privacyMode) {
      document.body.classList.add("privacy-mode");
      if (btn) {
        btn.classList.add("active-privacy");
        btn.innerHTML = `<i data-lucide="eye-off"></i> <span id="privacy-mode-label" style="font-weight: 700; color: #7c3aed;">PII Redacted</span>`;
      }
    } else {
      document.body.classList.remove("privacy-mode");
      if (btn) {
        btn.classList.remove("active-privacy");
        btn.innerHTML = `<i data-lucide="eye"></i> <span id="privacy-mode-label">Privacy Mode</span>`;
      }
    }
    if (window.lucide) window.lucide.createIcons();
    if (rerender && this.currentRoute) {
      this.renderRoute(this.currentRoute);
    }
    if (window.aiCopilot && typeof window.aiCopilot.renderProposals === "function") {
      window.aiCopilot.renderProposals();
    }
  }

  maskPII(str, type = "name") {
    if (!this.privacyMode || !str || typeof str !== "string") return str;
    if (type === "name") {
      const parts = str.trim().split(/\s+/);
      return parts.map(p => {
        if (p === "&" || p === "and" || p === "Pty" || p === "Ltd" || p === "(Dec'd)") return p;
        if (p.length <= 2) return p[0] + "•";
        return p[0] + "•".repeat(Math.max(1, p.length - 2)) + p[p.length - 1];
      }).join(" ");
    }
    if (type === "phone") {
      const clean = str.replace(/[^\d+]/g, '');
      if (clean.length > 6) {
        return str.slice(0, 4) + " ••• ••• " + str.slice(-3);
      }
      return str.slice(0, 4) + " ••• •••";
    }
    if (type === "email") {
      const parts = str.split("@");
      if (parts.length === 2) {
        const u = parts[0];
        const maskedU = u.length <= 2 ? u[0] + "•" : u[0] + "•".repeat(Math.max(1, u.length - 2)) + u[u.length - 1];
        return maskedU + "@" + parts[1];
      }
      return str;
    }
    if (type === "address") {
      return str.replace(/(\d+\s+)([A-Za-z]+)(\s+Street|\s+Road|\s+Avenue|\s+Terrace|\s+Crescent|\s+Way|\s+Boulevard|\s+Drive)/i, (match, num, street, suffix) => {
        return num + street[0] + "•".repeat(Math.max(2, street.length - 1)) + suffix;
      });
    }
    if (type === "account") {
      return "••••" + str.slice(-4);
    }
    return str;
  }

  navigate(route) {
    this.closeMobileSidebar();
    window.location.hash = `#/${route}`;
  }

  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    // Clear previous toasts so they don't pile up into an ugly stack
    container.innerHTML = "";

    const toast = document.createElement("div");
    toast.className = `app-toast ${type}`;

    let iconName = "check-circle";
    if (type === "info") iconName = "info";
    if (type === "warning") iconName = "alert-triangle";
    if (type === "error") iconName = "x-circle";

    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.transition = "opacity 0.25s, transform 0.25s";
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // ==========================================================================
  // Data Backup, Export, Import & Safe Reset
  // ==========================================================================
  buildExportPayload() {
    return {
      schemaVersion: "1.0.0",
      app: "ConvenientConveyance CPMS",
      exportedAt: new Date().toISOString(),
      data: {
        persona: JSON.parse(JSON.stringify(CPMS_STORE.persona || {})),
        matters: JSON.parse(JSON.stringify(CPMS_STORE.matters || [])),
        clients: JSON.parse(JSON.stringify(CPMS_STORE.clients || [])),
        properties: JSON.parse(JSON.stringify(CPMS_STORE.properties || [])),
        templates: JSON.parse(JSON.stringify(CPMS_STORE.templates || [])),
        trust: JSON.parse(JSON.stringify(CPMS_STORE.trust || {})),
        advisories: JSON.parse(JSON.stringify(CPMS_STORE.advisories || [])),
        auditLog: JSON.parse(JSON.stringify(CPMS_STORE.auditLog || []))
      },
      uiState: {
        activeMatterId: this.activeMatterId,
        currentTheme: this.currentTheme
      }
    };
  }

  exportAppData() {
    const payload = this.buildExportPayload();
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `convenient-conveyance-backup-${ts}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.auditObservability) {
      window.auditObservability.recordEvent({
        matterRef: "PRACTICE-GENERAL",
        category: "SYSTEM_BACKUP",
        severity: "INFO",
        action: `Exported Practice Data Backup (${filename})`,
        explainability: {
          rationale: `Practitioner exported full application state (${payload.data.matters.length} matters, ${payload.data.clients.length} clients) prior to maintenance or reset.`,
          confidence: 1.0,
          governingRule: "Law Society SA Practice Data Retention & Portability",
          telemetry: { model: "Deterministic JSON Serializer" }
        },
        payload: { filename, mattersCount: payload.data.matters.length, clientsCount: payload.data.clients.length }
      });
    }

    this.showToast(`Backup exported: ${filename} (${payload.data.matters.length} matters, ${payload.data.clients.length} clients).`, "success");
    return payload;
  }

  triggerImportData() {
    const input = document.getElementById("cpms-import-file-input");
    if (input) {
      input.value = "";
      input.click();
    }
  }

  handleImportFile(event) {
    const file = event?.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const result = this.restoreAppData(parsed);
        if (result.ok) {
          this.closeResetDataModal();
          this.showToast(`Data restored: ${result.mattersCount} matters, ${result.clientsCount} clients, ${result.partiesCount} parties.`, "success");
        } else {
          this.showToast(`Import failed: ${result.error}`, "error");
        }
      } catch (err) {
        this.showToast("Invalid JSON backup file. Please select a valid ConvenientConveyance export.", "error");
      }
    };
    reader.readAsText(file);
  }

  restoreAppData(payload) {
    if (!payload || typeof payload !== "object" || !payload.data || typeof payload.data !== "object") {
      return { ok: false, error: "Missing 'data' object in backup file." };
    }
    const d = payload.data;
    if (!Array.isArray(d.matters) || !Array.isArray(d.clients) || !Array.isArray(d.properties)) {
      return { ok: false, error: "Backup file is missing required matters, clients, or properties arrays." };
    }

    CPMS_STORE.persona = d.persona || CPMS_STORE.persona;
    CPMS_STORE.matters = JSON.parse(JSON.stringify(d.matters));
    CPMS_STORE.clients = JSON.parse(JSON.stringify(d.clients));
    CPMS_STORE.properties = JSON.parse(JSON.stringify(d.properties));
    CPMS_STORE.templates = Array.isArray(d.templates) ? JSON.parse(JSON.stringify(d.templates)) : [];
    CPMS_STORE.trust = d.trust ? JSON.parse(JSON.stringify(d.trust)) : { ledgerBalance: "$0.00", bankBalance: "$0.00", reconciledDifference: "$0.00", accounts: [] };
    CPMS_STORE.advisories = Array.isArray(d.advisories) ? JSON.parse(JSON.stringify(d.advisories)) : [];
    CPMS_STORE.auditLog = Array.isArray(d.auditLog) ? JSON.parse(JSON.stringify(d.auditLog)) : [];

    if (payload.uiState && payload.uiState.activeMatterId) {
      const exists = CPMS_STORE.matters.some(m => m.id === payload.uiState.activeMatterId);
      if (exists) this.activeMatterId = payload.uiState.activeMatterId;
    }

    if (window.auditObservability) {
      window.auditObservability.recordEvent({
        matterRef: "PRACTICE-GENERAL",
        category: "SYSTEM_RESTORE",
        severity: "INFO",
        action: "Restored Practice Data from Exported Backup",
        explainability: {
          rationale: `Practitioner imported backup exported at ${payload.exportedAt || 'unknown'}. Restored ${CPMS_STORE.matters.length} matters and ${CPMS_STORE.clients.length} clients.`,
          confidence: 1.0,
          governingRule: "Law Society SA Practice Continuity & Audit Trail",
          telemetry: { model: "Deterministic JSON Deserializer" }
        },
        payload: { exportedAt: payload.exportedAt, mattersCount: CPMS_STORE.matters.length }
      });
    }

    this.updateMattersBadge();
    this.handleHashChange();
    if (window.aiCopilot && typeof window.aiCopilot.updateGroundingIndicator === "function") {
      window.aiCopilot.updateGroundingIndicator();
    }

    const partiesCount = CPMS_STORE.matters.reduce((acc, m) => acc + (m.parties ? m.parties.length : 0), 0);
    return {
      ok: true,
      mattersCount: CPMS_STORE.matters.length,
      clientsCount: CPMS_STORE.clients.length,
      partiesCount
    };
  }

  resetSyntheticData() {
    const modal = document.getElementById("reset-data-modal");
    if (modal && typeof modal.showModal === "function") {
      const statsEl = document.getElementById("reset-modal-stats");
      if (statsEl) {
        const partiesCount = (CPMS_STORE.matters || []).reduce((acc, m) => acc + (m.parties ? m.parties.length : 0), 0);
        statsEl.innerHTML = `<strong>Current Active Store:</strong> ${CPMS_STORE.matters.length} matters • ${CPMS_STORE.clients.length} clients • ${partiesCount} parties • ${(CPMS_STORE.auditLog || []).length} audit events`;
      }
      modal.showModal();
      if (window.lucide) window.lucide.createIcons();
      return;
    }
    if (!confirm("Are you sure you want to reset all matters, clients, properties, templates, and trust ledgers back to clean initial demo data?")) {
      return;
    }
    this.confirmResetSyntheticData();
  }

  closeResetDataModal() {
    const modal = document.getElementById("reset-data-modal");
    if (modal && typeof modal.close === "function") {
      modal.close();
    }
  }

  openEndToEndVideoModal() {
    const modal = document.getElementById("end-to-end-video-modal");
    const video = document.getElementById("e2e-demo-video");
    if (modal && typeof modal.showModal === "function") {
      modal.showModal();
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      if (window.lucide) window.lucide.createIcons();
    }
  }

  closeEndToEndVideoModal() {
    const modal = document.getElementById("end-to-end-video-modal");
    const video = document.getElementById("e2e-demo-video");
    if (video) {
      video.pause();
    }
    if (modal && typeof modal.close === "function") {
      modal.close();
    }
  }

  confirmResetSyntheticData() {
    CPMS_STORE.matters = [];
    CPMS_STORE.clients = [];
    CPMS_STORE.properties = [];
    CPMS_STORE.templates = [];
    CPMS_STORE.trust = {
      ledgerBalance: "$0.00",
      bankBalance: "$0.00",
      reconciledDifference: "$0.00",
      differenceReason: "No trust transactions recorded.",
      accounts: []
    };
    CPMS_STORE.advisories = [];
    CPMS_STORE.auditLog = [];
    this.activeMatterId = null;

    if (window.aiCopilot) {
      window.aiCopilot.proposals = [];
      if (typeof window.aiCopilot.renderProposals === "function") window.aiCopilot.renderProposals();
      if (typeof window.aiCopilot.updateBadge === "function") window.aiCopilot.updateBadge();
      if (typeof window.aiCopilot.updateGroundingIndicator === "function") window.aiCopilot.updateGroundingIndicator();
    }

    this.closeResetDataModal();
    this.updateMattersBadge();
    this.showToast("All practice data cleaned up and cleared. You can import a backup or load demo data anytime.", "success");
    this.handleHashChange();
  }

  loadDemoData() {
    const fresh = getInitialData();
    CPMS_STORE.matters = fresh.matters;
    CPMS_STORE.clients = fresh.clients;
    CPMS_STORE.properties = fresh.properties;
    CPMS_STORE.templates = fresh.templates;
    CPMS_STORE.trust = fresh.trust;
    CPMS_STORE.advisories = fresh.advisories || [];
    CPMS_STORE.auditLog = fresh.auditLog || [];
    this.activeMatterId = fresh.matters[0] ? fresh.matters[0].id : null;

    this.closeResetDataModal();
    this.updateMattersBadge();
    if (window.aiCopilot && typeof window.aiCopilot.updateGroundingIndicator === "function") {
      window.aiCopilot.updateGroundingIndicator();
    }
    this.showToast("Synthetic South Australia demo dataset loaded.", "success");
    this.handleHashChange();
  }

  handleHashChange() {
    this.closeMobileSidebar();
    const hash = window.location.hash.replace("#/", "") || "dashboard";
    const parts = hash.split("/");
    const primaryRoute = parts[0];

    // Update active state in sidebar
    document.querySelectorAll(".nav-item").forEach(el => {
      el.classList.toggle("active", el.dataset.route === primaryRoute);
    });

    const topbarTitle = document.getElementById("topbar-current-page");
    if (topbarTitle) {
      const titles = {
        dashboard: "Dashboard",
        workspaces: "Workspaces",
        clients: "Clients Registry",
        parties: "Parties Register",
        properties: "Properties Register",
        documents: "Document Templates",
        trust: "Statutory Trust",
        settings: "Administration"
      };
      topbarTitle.innerText = titles[primaryRoute] || "Workspace";
    }

    this.currentRoute = primaryRoute;

    if (primaryRoute === "workspaces" && parts[1]) {
      this.activeMatterId = parts[1];
      this.renderMatterDetail(parts[1]);
      if (window.aiCopilot && typeof window.aiCopilot.updateGroundingIndicator === "function") {
        window.aiCopilot.updateGroundingIndicator();
      }
    } else {
      switch (primaryRoute) {
        case "dashboard":
          this.renderDashboard();
          break;
        case "workspaces":
          this.renderWorkspaces();
          break;
        case "clients":
          this.renderClients();
          break;
        case "parties":
          this.renderParties();
          break;
        case "properties":
          this.renderProperties();
          break;
        case "documents":
          this.renderDocuments();
          break;
        case "trust":
          this.renderTrust();
          break;
        case "settings":
          this.renderSettings();
          break;
        default:
          this.renderDashboard();
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ==========================================================================
  // Global Predictive Search (Top Bar)
  // ==========================================================================
  handleGlobalSearch(query) {
    const dropdown = document.getElementById("global-search-dropdown");
    if (!dropdown) return;

    const q = (query || "").trim().toLowerCase();
    if (!q) {
      dropdown.classList.remove("open");
      dropdown.innerHTML = "";
      return;
    }

    const matchedMatters = CPMS_STORE.matters.filter(m =>
      m.reference.toLowerCase().includes(q) ||
      m.property.toLowerCase().includes(q) ||
      m.client.toLowerCase().includes(q) ||
      m.title.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedClients = CPMS_STORE.clients.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.reference.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedProperties = CPMS_STORE.properties.filter(p =>
      p.address.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.council.toLowerCase().includes(q)
    ).slice(0, 3);

    if (matchedMatters.length === 0 && matchedClients.length === 0 && matchedProperties.length === 0) {
      dropdown.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: #64748b; font-size: 0.8rem;">
          No matching matters, clients, or properties found for "<strong>${query}</strong>"
        </div>
      `;
      dropdown.classList.add("open");
      return;
    }

    let html = "";

    if (matchedMatters.length > 0) {
      html += `<div class="search-res-group-title">Matters (${matchedMatters.length})</div>`;
      matchedMatters.forEach(m => {
        html += `
          <div class="search-res-item" onclick="appRouter.selectSearchResult('workspaces/${m.id}')">
            <div class="search-res-main">
              <span class="search-res-title">[${m.reference}] ${m.property}</span>
              <span class="search-res-sub">Client: <span class="pii-sensitive">${this.maskPII(m.client, "name")}</span> • Settlement: ${m.settlementDate}</span>
            </div>
            <span class="badge ${m.transactionType === 'purchase' ? 'badge-blue' : 'badge-green'}">${m.transactionType.toUpperCase()}</span>
          </div>
        `;
      });
    }

    if (matchedClients.length > 0) {
      html += `<div class="search-res-group-title">Clients (${matchedClients.length})</div>`;
      matchedClients.forEach(c => {
        html += `
          <div class="search-res-item" onclick="appRouter.selectSearchResult('clients')">
            <div class="search-res-main">
              <span class="search-res-title"><strong class="pii-sensitive">${this.maskPII(c.name, "name")}</strong> (${c.reference})</span>
              <span class="search-res-sub"><span class="pii-sensitive">${this.maskPII(c.email, "email")} • ${this.maskPII(c.phone, "phone")}</span></span>
            </div>
            <span class="badge badge-gray">${c.type}</span>
          </div>
        `;
      });
    }

    if (matchedProperties.length > 0) {
      html += `<div class="search-res-group-title">Properties (${matchedProperties.length})</div>`;
      matchedProperties.forEach(p => {
        html += `
          <div class="search-res-item" onclick="appRouter.selectSearchResult('properties')">
            <div class="search-res-main">
              <span class="search-res-title">${p.address}</span>
              <span class="search-res-sub">${p.title} • ${p.council}</span>
            </div>
            <span class="badge badge-blue">${p.matterRef}</span>
          </div>
        `;
      });
    }

    dropdown.innerHTML = html;
    dropdown.classList.add("open");
  }

  selectSearchResult(route) {
    const dropdown = document.getElementById("global-search-dropdown");
    if (dropdown) dropdown.classList.remove("open");
    const input = document.getElementById("global-search");
    if (input) input.value = "";
    this.navigate(route);
  }

  toggleNotifications() {
    const popover = document.getElementById("notifications-popover");
    if (popover) {
      popover.classList.toggle("open");
    }
  }

}

// Expose router globally
window.AppRouter = AppRouter;
window.appRouter = new AppRouter();

document.addEventListener("DOMContentLoaded", () => {
  window.appRouter.init();
});
