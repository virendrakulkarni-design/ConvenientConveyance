// ============================================================================
// CPMS View: Properties Register & Spatial Maps
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

Object.assign(AppRouter.prototype, {
// ==========================================================================
  // Render Properties Register & Search
  // ==========================================================================
  renderProperties() {
    const container = document.getElementById("page-content");
    container.innerHTML = `
      <div class="page-header">
        <div>
          <h2>Properties & Title Register</h2>
          <p>Real property parcels, Certificate of Title records (SAILIS), Google Map locations, zoning, and encumbrances.</p>
        </div>
      </div>

      <div class="card" data-tour="properties-table">
        <div class="filter-bar">
          <div class="filter-group">
            <div class="filter-input">
              <i data-lucide="search"></i>
              <input type="text" placeholder="Search address, title, or council..." id="property-search" oninput="appRouter.filterProperties()">
            </div>
          </div>
          <span style="font-size: 0.8rem; color: #64748b;" id="properties-count-label">Showing <strong>${CPMS_STORE.properties.length}</strong> property parcels</span>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Property Address</th>
                <th style="text-align: center; width: 140px;">Location (Google Map)</th>
                <th>Certificate of Title</th>
                <th>Plan & Lot Details</th>
                <th>Local Council</th>
                <th>Zoning</th>
                <th>Tenancy</th>
                <th>Active File</th>
              </tr>
            </thead>
            <tbody id="properties-table-body">
              ${this.getPropertiesRowsHTML(CPMS_STORE.properties)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getPropertiesRowsHTML(propList) {
    if (propList.length === 0) {
      return `<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 2rem;">No property titles match your search.</td></tr>`;
    }

    return propList.map(p => `
      <tr>
        <td>
          <div style="display: flex; flex-direction: column;">
            <strong>${p.address}</strong>
            <small style="color: var(--text-muted);">${p.council}</small>
          </div>
        </td>
        <td class="map-location-cell" style="text-align: center;">
          <div class="map-hover-trigger" 
               style="display: inline-flex; justify-content: center;"
               onmouseenter="appRouter.showPropertyMapPopup(event, '${p.address.replace(/'/g, "\\'")}')" 
               onmouseleave="appRouter.scheduleHidePropertyMapPopup()">
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}" 
               target="_blank" 
               class="map-pin-btn map-pin-icon-only" 
               onclick="event.stopPropagation()"
               title="Hover for spatial info • Click to open in Google Maps">
              <i data-lucide="map-pin" class="map-icon"></i>
            </a>
          </div>
        </td>
        <td><strong style="color: var(--color-primary);">${p.title}</strong></td>
        <td><small>${p.plan}</small></td>
        <td>${p.council}</td>
        <td><span class="badge badge-gray">${p.zoning}</span></td>
        <td>${p.tenancy}</td>
        <td><span class="badge badge-blue" style="cursor: pointer;" onclick="appRouter.handleGlobalSearch('${p.matterRef}')">${p.matterRef}</span></td>
      </tr>
    `).join('');
  },

  showPropertyMapPopup(event, address) {
    if (this.mapPopupHideTimeout) {
      clearTimeout(this.mapPopupHideTimeout);
      this.mapPopupHideTimeout = null;
    }

    const p = CPMS_STORE.properties.find(item => item.address === address);
    if (!p) return;

    const popup = document.getElementById("property-map-hovercard");
    if (!popup) return;

    const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`;

    popup.innerHTML = `
      <div class="hovercard-map-header">
        <div class="hovercard-map-roads">
          <div class="road-h"></div>
          <div class="road-v"></div>
        </div>
        <div class="hovercard-map-canvas">
          <div class="hovercard-map-pin">
            <i data-lucide="map-pin" class="pin-icon"></i>
            <div class="pin-shadow"></div>
          </div>
        </div>
        <div class="hovercard-map-badge">
          <i data-lucide="map"></i>
          <span>Google Maps • South Australia</span>
        </div>
        <div class="hovercard-coords-badge">
          ${p.lat || '-34.9285'}°, ${p.lng || '138.6007'}°
        </div>
      </div>

      <div class="hovercard-body">
        <div class="hovercard-title">${p.address}</div>
        <div class="hovercard-subtitle">
          <span class="badge badge-blue" style="font-size: 0.68rem; padding: 0.1rem 0.4rem;">${p.title}</span>
          <span>•</span>
          <span>${p.council}</span>
        </div>

        <div class="hovercard-grid">
          <div class="hovercard-cell">
            <span class="hovercard-label">Valuer-General Value</span>
            <span class="hovercard-val" style="color: var(--color-trust-emerald);">${p.capitalValue || '$1,250,000'}</span>
          </div>
          <div class="hovercard-cell">
            <span class="hovercard-label">Site / Land Area</span>
            <span class="hovercard-val">${p.landArea || '680 m²'}</span>
          </div>
          <div class="hovercard-cell">
            <span class="hovercard-label">Zoning & Code</span>
            <span class="hovercard-val">${p.zoning}</span>
          </div>
          <div class="hovercard-cell">
            <span class="hovercard-label">Valuation Number</span>
            <span class="hovercard-val" style="font-family: monospace;">${p.valuationNo || '1204/9912'}</span>
          </div>
          <div class="hovercard-cell" style="grid-column: span 2;">
            <span class="hovercard-label">SA Water Requisition Zone</span>
            <span class="hovercard-val">${p.saWaterZone || 'Metropolitan Central (SMR active)'}</span>
          </div>
        </div>

        <div class="hovercard-footer">
          <span style="font-size: 0.72rem; color: var(--text-muted);">Matter Ref: <strong>${p.matterRef}</strong></span>
          <a href="${mapSearchUrl}" target="_blank" class="btn-primary" style="padding: 0.35rem 0.7rem; font-size: 0.74rem; text-decoration: none;" onclick="event.stopPropagation()">
            <i data-lucide="external-link"></i> Open Google Maps
          </a>
        </div>
      </div>
    `;

    // Position popup next to trigger
    const triggerRect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 375;
    const popupHeight = 350;

    let left = triggerRect.right + 12;
    if (left + popupWidth > window.innerWidth - 16) {
      left = triggerRect.left - popupWidth - 12;
    }
    if (left < 16) left = 16;

    let top = triggerRect.top - 40;
    if (top + popupHeight > window.innerHeight - 16) {
      top = window.innerHeight - popupHeight - 16;
    }
    if (top < 16) top = 16;

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.classList.add("visible");

    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  scheduleHidePropertyMapPopup() {
    this.mapPopupHideTimeout = setTimeout(() => {
      this.hidePropertyMapPopup();
    }, 280);
  },

  cancelHidePropertyMapPopup() {
    if (this.mapPopupHideTimeout) {
      clearTimeout(this.mapPopupHideTimeout);
      this.mapPopupHideTimeout = null;
    }
  },

  hidePropertyMapPopup() {
    const popup = document.getElementById("property-map-hovercard");
    if (popup) {
      popup.classList.remove("visible");
    }
  },

  filterProperties() {
    const query = (document.getElementById("property-search")?.value || "").toLowerCase().trim();
    const tbody = document.getElementById("properties-table-body");
    const countLabel = document.getElementById("properties-count-label");

    const filtered = CPMS_STORE.properties.filter(p =>
      !query ||
      p.address.toLowerCase().includes(query) ||
      p.title.toLowerCase().includes(query) ||
      p.council.toLowerCase().includes(query) ||
      p.zoning.toLowerCase().includes(query)
    );

    if (tbody) tbody.innerHTML = this.getPropertiesRowsHTML(filtered);
    if (countLabel) countLabel.innerHTML = `Showing <strong>${filtered.length}</strong> of ${CPMS_STORE.properties.length} parcels`;
    if (window.lucide) window.lucide.createIcons();
  },
});
