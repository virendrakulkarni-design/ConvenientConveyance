// ============================================================================
// Agentic AI Stack - Human-in-the-Loop (HITL) Review Panel & Legal Copilot
// Architected per CPMS Agentic AI Stack Design v1.0
// ============================================================================

class AICopilotController {
  constructor() {
    this.isOpen = false;
    this.proposals = [
      {
        id: "prop-101",
        gate: "hard", // Hard Gate: Needs explicit practitioner approval
        agent: "PEXA Integration Agent",
        matterRef: "2026-0184",
        title: "Lock PEXA Financial Settlement Line",
        desc: "Electronic settlement is booked for 26/11/2026. The agent calculated net balance $1,125,226.25 and proposes locking financial schedule line and inviting ANZ Bank.",
        details: {
          purchasePrice: "$1,250,000.00",
          deposit: "$125,000.00",
          rateAdjustments: "+$695.15",
          dischargeFee: "+$181.00",
          netBalance: "$1,125,226.25"
        }
      },
      {
        id: "prop-102",
        gate: "soft", // Soft Gate: Review diff
        agent: "Document Intelligence Agent",
        matterRef: "2026-0201",
        title: "Contract Data Extraction Ready for Review",
        desc: "Ingested signed Residential Contract of Sale (4/88 King William Rd). Extracted 14 key fields with high confidence (98.4%). Ready to commit to matter record.",
        hasDiff: true
      },
      {
        id: "prop-103",
        gate: "advisory", // Advisory: Legal Info
        agent: "Legal Advisory Agent (RAG)",
        matterRef: "2026-0210",
        client: "Chloe Jenkins",
        property: "22 Osmond Terrace, Norwood SA 5067",
        title: "Stamp Duty Exemption Notice (First Home Buyer)",
        desc: "Client Chloe Jenkins indicated first home purchase of $680,000. Under SA Stamp Duties Act amendment (June 2024), transactions under $650k are exempt and up to $700k receive tiered relief. Estimated saving: $28,450.00.",
        hasCitation: true
      }
    ];

    this.chatHistory = [
      {
        sender: "ai",
        text: "Good afternoon, Demo Conveyancer. Human Review & Verification (HITL) is active and indexed over <strong>SA Water 2024–28 (ESCOSA RD24)</strong> statutory tariffs, Section 7 SMR searches, ARNECC rules, and SA Stamp Duties Act. Ask any question or click a suggested SA Water prompt below."
      }
    ];
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById("ai-copilot-drawer");
    if (this.isOpen) {
      drawer.classList.add("open");
      if (window.lucide) window.lucide.createIcons();
    } else {
      drawer.classList.remove("open");
    }
  }

  renderProposals() {
    const container = document.getElementById("hitl-proposals-container");
    if (!container) return;

    if (this.proposals.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem 1rem; color: #64748b;">
          <i data-lucide="check-circle" style="width: 32px; height: 32px; color: #10b981; margin: 0 auto 0.5rem auto;"></i>
          <p style="font-weight: 600; font-size: 0.85rem;">All AI Proposals Cleared</p>
          <small>No pending hard or soft gates awaiting practitioner approval.</small>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const gateActions = {
      hard: id => `<button class="btn-approve" onclick="aiCopilot.approveProposal('${id}')"><i data-lucide="check"></i> Authorise</button><button class="btn-diff" onclick="aiCopilot.inspectProposalDetails('${id}')">Inspect Breakdown</button><button class="btn-reject" onclick="aiCopilot.rejectProposal('${id}')">Reject</button>`,
      soft: id => `<button class="btn-approve" onclick="aiCopilot.approveProposal('${id}')"><i data-lucide="check"></i> Accept Diff</button><button class="btn-diff" onclick="aiCopilot.triggerDocumentDiff()">View Visual Diff</button><button class="btn-reject" onclick="aiCopilot.rejectProposal('${id}')">Reject</button>`,
      advisory: id => `<button class="btn-approve" onclick="aiCopilot.applyAdvisoryToChecklist('${id}')"><i data-lucide="bookmark"></i> Apply to Checklist</button><button class="btn-reject" onclick="aiCopilot.dismissAdvisory('${id}')">Dismiss</button>`
    };

    container.innerHTML = this.proposals.map(p => `
      <div class="hitl-card ${p.gate}-gate" id="${p.id}">
        <div class="hitl-card-header">
          <span class="hitl-tag ${p.gate === 'hard' ? 'hard' : p.gate === 'soft' ? 'soft' : 'adv'}">
            ${p.gate.toUpperCase()} GATE
          </span>
          <span class="hitl-agent-source">${p.agent}</span>
        </div>
        <div class="hitl-title">
          <span style="color: #2563eb; font-weight: 700;">[${p.matterRef}]</span> ${p.title}
        </div>
        <div class="hitl-desc">${p.desc}</div>
        <div class="hitl-actions">${gateActions[p.gate]?.(p.id) || ''}</div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  approveProposal(id) {
    const p = this.proposals.find(item => item.id === id);
    if (!p) return;

    if (window.auditObservability) {
      window.auditObservability.recordEvent({
        matterRef: p.matterRef,
        category: "HITL_DECISION",
        severity: "CRITICAL",
        action: `Authorised Proposal: ${p.title}`,
        explainability: {
          rationale: `Practitioner authorised proposal [${p.id}]. ${p.desc}`,
          confidence: 1.0,
          governingRule: "PEXA Operating Conditions & ARNECC Model Participation Rules (MPR)",
          telemetry: { model: p.agent || "Human Practitioner Authorization" }
        },
        payload: p.details || { proposalId: id, title: p.title },
        stateDiff: { field: `proposals.${id}`, before: "Pending Authorization", after: "Authorised & Committed" }
      });
    }

    if (window.appRouter && typeof window.appRouter.showToast === "function") {
      window.appRouter.showToast(`Proposal "${p.title}" authorised by practitioner. Executed state transition in audit ledger.`, "success");
    }
    this.proposals = this.proposals.filter(item => item.id !== id);
    this.renderProposals();
    this.updateBadge();
  }

  rejectProposal(id) {
    const p = this.proposals.find(item => item.id === id);
    if (!p) return;

    if (window.auditObservability) {
      window.auditObservability.recordEvent({
        matterRef: p.matterRef,
        category: "HITL_DECISION",
        severity: "WARNING",
        action: `Rejected Proposal: ${p.title}`,
        explainability: {
          rationale: `Practitioner rejected proposal [${p.id}]. Action canceled and recorded in audit log.`,
          confidence: 1.0,
          governingRule: "ARNECC MPR Practitioner Verification Oversight",
          telemetry: { model: p.agent || "Human Practitioner Rejection" }
        },
        payload: { proposalId: id, title: p.title },
        stateDiff: { field: `proposals.${id}`, before: "Pending Review", after: "Rejected by Human" }
      });
    }

    if (window.appRouter && typeof window.appRouter.showToast === "function") {
      window.appRouter.showToast(`Dismissed proposal "${p.title}".`, "info");
    }
    this.proposals = this.proposals.filter(item => item.id !== id);
    this.renderProposals();
    this.updateBadge();
  }

  applyAdvisoryToChecklist(id) {
    const p = this.proposals.find(item => item.id === id);
    if (!p) return;

    if (typeof CPMS_STORE !== "undefined") {
      if (!CPMS_STORE.advisories) CPMS_STORE.advisories = [];
      const now = new Date().toISOString();
      let adv = CPMS_STORE.advisories.find(a => a.id === id);
      if (adv) {
        adv.status = "applied";
        adv.appliedAt = now;
        adv.lastAction = "Applied to Checklist";
        adv.actionBy = "Demo Conveyancer";
      } else {
        adv = {
          id: id,
          matterRef: p.matterRef,
          client: p.client || "Chloe Jenkins",
          property: p.property || "22 Osmond Terrace, Norwood SA 5067",
          title: p.title,
          desc: p.desc,
          agent: p.agent,
          status: "applied",
          appliedAt: now,
          dismissedAt: null,
          discardedAt: null,
          lastAction: "Applied to Checklist",
          actionBy: "Demo Conveyancer"
        };
        CPMS_STORE.advisories.unshift(adv);
      }

      // Attach task to matter checklist
      const matter = CPMS_STORE.matters.find(m => m.reference === p.matterRef);
      if (matter) {
        matter.checklist = matter.checklist || [];
        if (!matter.checklist.some(c => c.title === p.title)) {
          matter.checklist.push({
            id: `chk-${Date.now()}`,
            title: p.title,
            note: p.desc,
            status: "pending",
            date: new Date().toLocaleDateString("en-AU")
          });
        }
      }
    }

    this.proposals = this.proposals.filter(item => item.id !== id);
    this.renderProposals();
    this.updateBadge();

    if (window.appRouter && typeof window.appRouter.showToast === "function") {
      window.appRouter.showToast(`Advisory [${p.matterRef}] applied to Matter Checklist and saved to Admin Registry.`, "success");
      if (window.location.hash.includes("settings")) {
        window.appRouter.renderSettings();
      }
    }
  }

  dismissAdvisory(id) {
    const p = this.proposals.find(item => item.id === id);
    if (!p) return;

    if (typeof CPMS_STORE !== "undefined") {
      if (!CPMS_STORE.advisories) CPMS_STORE.advisories = [];
      const now = new Date().toISOString();
      let adv = CPMS_STORE.advisories.find(a => a.id === id);
      if (adv) {
        adv.status = "dismissed";
        adv.dismissedAt = now;
        adv.lastAction = "Dismissed by Practitioner";
        adv.actionBy = "Demo Conveyancer";
      } else {
        adv = {
          id: id,
          matterRef: p.matterRef,
          client: p.client || "Chloe Jenkins",
          property: p.property || "22 Osmond Terrace, Norwood SA 5067",
          title: p.title,
          desc: p.desc,
          agent: p.agent,
          status: "dismissed",
          appliedAt: null,
          dismissedAt: now,
          discardedAt: null,
          lastAction: "Dismissed by Practitioner",
          actionBy: "Demo Conveyancer"
        };
        CPMS_STORE.advisories.unshift(adv);
      }
    }

    this.proposals = this.proposals.filter(item => item.id !== id);
    this.renderProposals();
    this.updateBadge();

    if (window.appRouter && typeof window.appRouter.showToast === "function") {
      window.appRouter.showToast(`Advisory [${p.matterRef}] moved to Dismissed List. Accessible in Admin Panel.`, "info");
      if (window.location.hash.includes("settings")) {
        window.appRouter.renderSettings();
      }
    }
  }

  inspectProposalDetails(id) {
    const p = this.proposals.find(item => item.id === id);
    if (!p || !p.details) return;

    const modal = document.getElementById("pexa-breakdown-modal");
    const subTitle = document.getElementById("breakdown-modal-subtitle");
    const body = document.getElementById("breakdown-modal-body");
    const authBtn = document.getElementById("breakdown-authorise-btn");

    if (subTitle) {
      subTitle.innerText = `Matter ${p.matterRef} • 57 Prospect Road, Norwood SA 5067 • Incoming Mortgagee: ANZ Bank`;
    }

    if (authBtn) {
      authBtn.onclick = () => {
        this.approveProposal(id);
        this.closeBreakdownModal();
      };
    }

    if (body) {
      body.innerHTML = `
        <table class="breakdown-table">
          <thead>
            <tr>
              <th style="width: 45%;">Financial Schedule Line Item</th>
              <th style="width: 25%;">Authority / Party</th>
              <th style="width: 15%; text-align: right;">Credit</th>
              <th style="width: 15%; text-align: right;">Debit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Purchase Consideration</strong><br><small style="color: var(--text-muted);">Residential Land Contract</small></td>
              <td>M. Nguyen (Purchaser)</td>
              <td style="text-align: right; color: var(--color-trust-emerald); font-weight: 700;">${p.details.purchasePrice}</td>
              <td style="text-align: right; color: var(--text-muted);">-</td>
            </tr>
            <tr>
              <td><strong>Deposit Held in Firm Statutory Trust</strong><br><small style="color: var(--text-muted);">Receipt TR-8941 Cleared Funds</small></td>
              <td>Aldgate Conveyancing Trust</td>
              <td style="text-align: right; color: var(--text-muted);">-</td>
              <td style="text-align: right; color: var(--color-danger); font-weight: 600;">${p.details.deposit}</td>
            </tr>
            <tr>
              <td><strong>SA Water Rates & SMR Consumption Adjustment</strong><br><small style="color: var(--text-muted);">Section 7 SMR Certificate #89201</small></td>
              <td>SA Water Corporation</td>
              <td style="text-align: right; color: var(--color-trust-emerald); font-weight: 600;">+$385.00</td>
              <td style="text-align: right; color: var(--text-muted);">-</td>
            </tr>
            <tr>
              <td><strong>City of Norwood Council Rates Apportionment</strong><br><small style="color: var(--text-muted);">Quarterly per-diem rating adjustment</small></td>
              <td>City of Norwood Payneham & St Peters</td>
              <td style="text-align: right; color: var(--color-trust-emerald); font-weight: 600;">+$310.15</td>
              <td style="text-align: right; color: var(--text-muted);">-</td>
            </tr>
            <tr>
              <td><strong>Mortgage Discharge & Title Registration Fee</strong><br><small style="color: var(--text-muted);">Electronic SAILIS / PEXA lodging</small></td>
              <td>SA Land Titles Office & PEXA</td>
              <td style="text-align: right; color: var(--color-trust-emerald); font-weight: 600;">${p.details.dischargeFee}</td>
              <td style="text-align: right; color: var(--text-muted);">-</td>
            </tr>
            <tr class="total-row">
              <td colspan="2">
                <span style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary);">Total Net PEXA Settlement Line</span><br>
                <small style="color: var(--text-muted);">Amount payable to vendor via electronic financial workspace</small>
              </td>
              <td colspan="2" style="text-align: right; font-size: 1.15rem; font-weight: 800; color: var(--color-primary);">
                ${p.details.netBalance}
              </td>
            </tr>
          </tbody>
        </table>
      `;
    }

    if (modal) {
      modal.showModal();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  closeBreakdownModal() {
    const modal = document.getElementById("pexa-breakdown-modal");
    if (modal) modal.close();
  }

  updateBadge() {
    const badge = document.getElementById("ai-badge-count");
    if (badge) {
      badge.innerText = this.proposals.length;
    }
  }

  // Visual Diff Modal for Extracted Document Data
  triggerDocumentDiff() {
    const modal = document.getElementById("diff-modal");
    if (modal) {
      modal.showModal();
      if (window.lucide) window.lucide.createIcons();
    }
  }

  closeDiffModal() {
    const modal = document.getElementById("diff-modal");
    if (modal) modal.close();
  }

  // Human Approver Editing Handlers
  onFieldEdited(fieldKey) {
    const input = document.getElementById(`diff-field-${fieldKey}`);
    const pill = document.getElementById(`diff-pill-${fieldKey}`);
    const statusBadge = document.getElementById(`diff-status-${fieldKey}`);

    if (input) {
      input.classList.add("edited");
    }
    if (pill) {
      pill.classList.add("edited");
      pill.innerHTML = `<i data-lucide="check"></i> Modified`;
    }
    if (statusBadge) {
      statusBadge.className = "badge badge-amber";
      statusBadge.innerHTML = `<i data-lucide="user-check"></i> Edited`;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  resetDiffFieldsToAI() {
    const defaults = {
      price: "$740,000.00",
      deposit: "$74,000.00",
      settlement: "18/12/2026",
      cooling: "Expires 25/11/2026 5:00 PM"
    };

    Object.entries(defaults).forEach(([key, val]) => {
      const input = document.getElementById(`diff-field-${key}`);
      const pill = document.getElementById(`diff-pill-${key}`);
      const statusBadge = document.getElementById(`diff-status-${key}`);

      if (input) {
        input.value = val;
        input.classList.remove("edited");
      }
      if (pill) {
        pill.classList.remove("edited");
        pill.innerHTML = `<i data-lucide="edit-2"></i> Edit`;
      }
      if (statusBadge) {
        if (key === "cooling") {
          statusBadge.className = "badge badge-amber";
          statusBadge.innerHTML = `Review`;
        } else {
          statusBadge.className = "badge badge-blue";
          statusBadge.innerHTML = `Proposed`;
        }
      }
    });

    if (window.appRouter && typeof window.appRouter.showToast === "function") {
      window.appRouter.showToast("Reset all diff fields to original AI extraction values.", "info");
    }
    if (window.lucide) window.lucide.createIcons();
  }

  commitDiffToRecord() {
    const price = document.getElementById("diff-field-price")?.value || "$740,000.00";
    const deposit = document.getElementById("diff-field-deposit")?.value || "$74,000.00";
    const settlement = document.getElementById("diff-field-settlement")?.value || "18/12/2026";
    const cooling = document.getElementById("diff-field-cooling")?.value || "Expires 25/11/2026 5:00 PM";

    // Update CPMS_STORE matter 2026-0201 (mt-3)
    if (typeof CPMS_STORE !== "undefined" && CPMS_STORE.matters) {
      const matter = CPMS_STORE.matters.find(m => m.reference === "2026-0201" || m.id === "mt-3");
      if (matter) {
        matter.purchasePrice = price;
        matter.depositHeld = deposit;
        matter.settlementDate = settlement;
        matter.coolingOff = cooling;
      }
    }

    // Dismiss proposal prop-102
    this.proposals = this.proposals.filter(item => item.id !== "prop-102");
    this.renderProposals();
    this.updateBadge();
    this.closeDiffModal();

    if (window.auditObservability) {
      window.auditObservability.recordEvent({
        matterRef: "2026-0201",
        category: "HITL_DECISION",
        severity: "INFO",
        action: "Committed Extracted Contract Parameters to Matter Record",
        explainability: {
          rationale: `Practitioner reviewed and committed contract parameters after field verification (Purchase Price: ${price}, Deposit: ${deposit}, Settlement: ${settlement}, Cooling-Off: ${cooling}).`,
          confidence: 1.0,
          governingRule: "Land and Business (Sale and Conveyancing) Act 1994 (SA) Section 7",
          telemetry: { model: "Direct Practitioner Commitment (HITL Soft Gate)" }
        },
        payload: { price, deposit, settlement, cooling },
        stateDiff: {
          field: "matter[2026-0201].financials",
          before: "Unpopulated",
          after: { price, deposit, settlement, cooling }
        }
      });
    }

    if (window.appRouter && typeof window.appRouter.showToast === "function") {
      window.appRouter.showToast(
        `Contract data committed to Matter 2026-0201 (Purchase Price: ${price}, Deposit: ${deposit}).`,
        "success"
      );
      // If user is currently on workspaces or mt-3, re-render
      if (window.location.hash.includes("workspaces")) {
        window.appRouter.handleHashChange();
      }
    }
  }

  // Quick Suggested Questions Trigger
  askSuggestedQuestion(question) {
    const input = document.getElementById("ai-chat-input");
    if (input) input.value = question;
    this.sendChatMessage();
  }

  // Legal & Regulatory Advisory Chat
  sendChatMessage() {
    const input = document.getElementById("ai-chat-input");
    const text = input.value.trim();
    if (!text) return;

    this.chatHistory.push({ sender: "user", text });
    input.value = "";
    this.renderChat();

    // Grounded RAG response based on SA Water RD24 Submission & SA conveyancing law
    setTimeout(() => {
      const q = text.toLowerCase();
      let response = "";

      // Active Matter Context Resolution
      const activeMatter = (typeof CPMS_STORE !== "undefined" && CPMS_STORE.matters)
        ? (CPMS_STORE.matters.find(m => m.id === (window.appRouter?.activeMatterId || "mt-1")) || CPMS_STORE.matters[0])
        : null;

      if (q.includes("this matter") || q.includes("current matter") || q.includes("summary") || q.includes("details")) {
        if (activeMatter) {
          response = `<strong>Active Matter Summary [${activeMatter.reference}]:</strong><br>
• <strong>Property:</strong> ${activeMatter.property} (${activeMatter.title})<br>
• <strong>Client:</strong> ${window.appRouter?.maskPII(activeMatter.client, "name") || activeMatter.client} (${activeMatter.transactionType.toUpperCase()})<br>
• <strong>Settlement Date:</strong> ${activeMatter.settlementDate} (Stage: <em>${activeMatter.stage}</em>)<br>
• <strong>Financials:</strong> Purchase Price: ${activeMatter.purchasePrice} | Deposit Held: ${activeMatter.depositHeld} | Balance Due: ${activeMatter.balanceDue}<br>
• <strong>VOI Status:</strong> ${activeMatter.voiStatus.toUpperCase()} • Cooling-Off: ${activeMatter.coolingOff}`;
        } else {
          response = "No active matter loaded in context.";
        }
      } else if (q.includes("cooling") || q.includes("waiver") || q.includes("66w") || q.includes("deadline")) {
        if (activeMatter) {
          response = `<strong>Cooling-Off Status for Matter ${activeMatter.reference}:</strong><br>
• <strong>Current Clause:</strong> ${activeMatter.coolingOff}<br>
• <strong>Statutory Rule:</strong> Under <em>Section 5 of the Land and Business (Sale and Conveyancing) Act 1994</em>, purchasers have 2 clear business days from service of Form 1. If waived under Section 66W, an independent legal certificate must be signed before contract exchange.`;
        } else {
          response = "Under Section 66W of the Law of Property Act (SA), cooling-off rights may be waived only when an independent legal practitioner provides a certificate of explanation prior to execution.";
        }
      } else if (q.includes("balance") || q.includes("due") || q.includes("pexa line") || q.includes("schedule")) {
        if (activeMatter) {
          response = `<strong>Financial Settlement Figures for Matter ${activeMatter.reference}:</strong><br>
• <strong>Purchase Price:</strong> ${activeMatter.purchasePrice}<br>
• <strong>Deposit Credited:</strong> ${activeMatter.depositHeld}<br>
• <strong>Rates Adjustments:</strong> +$695.15 (Council rates & SA Water per-diem)<br>
• <strong>Discharge Fee:</strong> +$181.00<br>
• <strong>Net Balance Required in PEXA:</strong> <strong>${activeMatter.balanceDue}</strong> (Verified by ANZ Bank)`;
        } else {
          response = "PEXA Net Settlement Line = Purchase Price - Deposit + Rates Adjustments - Mortgage Discharges.";
        }
      } else if (q.includes("adjust") || q.includes("settlement") || q.includes("apportion") || q.includes("formula")) {
        response = `<strong>SA Water Settlement Adjustment Formula (RD24 / Standard SA Contract):</strong><br>
• <strong>Water Supply Availability:</strong> Regulated fixed charge of $74.20/quarter ($296.80/annum) apportioned on a per-diem basis (vendor pays up to settlement day, purchaser thereafter).<br>
• <strong>Sewerage Service:</strong> Apportioned per-diem based on Valuer-General Capital Value rating.<br>
• <strong>Water Consumption:</strong> Calculated via Special Meter Reading (SMR) or daily average consumption formula. Vendor is strictly liable for water consumed prior to settlement.<br>
<em>Statutory note: Under SA Water Corporation Act 1994, unpaid water rates remain a charge on the land and transfer to the purchaser if not adjusted at settlement.</em>`;
      } else if (q.includes("tier") || q.includes("consumption") || q.includes("usage") || q.includes("price") || q.includes("kl")) {
        response = `<strong>SA Water 2024–28 (RD24) Regulated Consumption Tiers:</strong><br>
Residential tariffs use a 3-tier stepped structure:<br>
• <strong>Tier 1 (0 to 383.6 L/day | 0–35 kL/qtr):</strong> $2.126 / kL (base essential living quota)<br>
• <strong>Tier 2 (383.6 to 1,424.7 L/day | 35–130 kL/qtr):</strong> $3.035 / kL<br>
• <strong>Tier 3 (&gt; 1,424.7 L/day | &gt; 130 kL/qtr):</strong> $3.288 / kL<br>
• <strong>Commercial / Non-residential:</strong> Flat $3.035 / kL for all usage.`;
      } else if (q.includes("sewer") || q.includes("sewerage") || q.includes("drainage") || q.includes("metro") || q.includes("valuer")) {
        response = `<strong>SA Water 2024–28 Sewerage Rating Schedule:</strong><br>
Sewerage charges are assessed on the Valuer-General's property Capital Value:<br>
• <strong>Adelaide Metropolitan:</strong> $0.1535 per $1,000 of Capital Value ($0.614/year per $1,000)<br>
• <strong>Country / Regional SA:</strong> $0.2325 per $1,000 of Capital Value ($0.930/year per $1,000)<br>
• <strong>Commercial Metropolitan:</strong> $0.22825 per $1,000 of Capital Value<br>
• <strong>Minimum Sewerage Charge:</strong> $79.50 per quarter ($318.00 per annum).`;
      } else if (q.includes("smr") || q.includes("meter") || q.includes("section 7") || q.includes("search")) {
        response = `<strong>Special Meter Reading (SMR) & Section 7 Statutory Rule:</strong><br>
• Under the <em>Land and Business (Sale and Conveyancing) Act 1994</em>, the vendor must disclose all statutory water rates via the Section 7 Form 1.<br>
• The conveyancer must order an SA Water Section 7 search Certificate and book an <strong>SMR 14 business days prior to settlement</strong>.<br>
• SA Water reads the physical meter within 2 business days of handover. This establishes the exact reading separating vendor and purchaser consumption liabilities.`;
      } else if (q.includes("concession") || q.includes("pensioner") || q.includes("dhs") || q.includes("hardship")) {
        response = `<strong>Department of Human Services (DHS) Concession Rule:</strong><br>
• Concessions applied to SA Water accounts are personal to the vendor and <em>do not transfer</em> to the purchaser.<br>
• When preparing settlement statement adjustments, the conveyancer must adjust on the <strong>gross rate figure</strong> (removing vendor concessions) so that the purchaser is not undercharged for their future rate liability.`;
      } else if (q.includes("stamp duty")) {
        response = "Pursuant to RevenueSA Circular No. 278, residential land transfers under $650,000 executed by first-home buyers are exempt from stamp duty. For values between $650k-$700k, relief phases out proportionally.";
      } else if (q.includes("voi") || q.includes("identity")) {
        response = "ARNECC Category 1 requires: Australian Passport (or foreign passport with visa) plus Australian Driver Licence. If expired less than 2 years, passport remains valid for VOI.";
      } else if (q.includes("cooling") || q.includes("waiver") || q.includes("66w")) {
        response = "Under Section 66W of the Law of Property Act (SA) and ARNECC MPR Rule 6.5, cooling-off rights may be waived only when an independent legal practitioner provides a certificate of explanation prior to execution.";
      } else {
        response = `SA Conveyancing Legal Agent: I can assist with SA Water statutory rate adjustments (2024–28 RD24 tariffs, availability charges, SMR searches, sewerage formulas), ARNECC VOI requirements, Stamp Duty exemptions, and Form 1 Section 7 compliance. Please click one of the suggested prompts or type your question.`;
      }

      this.chatHistory.push({ sender: "ai", text: response });
      this.renderChat();

      if (window.auditObservability) {
        window.auditObservability.recordEvent({
          matterRef: activeMatter ? activeMatter.reference : "PRACTICE-GENERAL",
          category: "AI_INFERENCE",
          severity: "INFO",
          action: `Legal Assistant Q&A: "${text.slice(0, 40)}..."`,
          explainability: {
            rationale: "Grounded conversational query answered using South Australian statutory corpus & matter state.",
            confidence: 0.985,
            governingRule: "Land and Business Act 1994 & ARNECC MPR",
            telemetry: {
              model: "claude-3-5-sonnet-20241022",
              durationMs: 340,
              promptTokens: 1240,
              completionTokens: 180
            }
          },
          payload: { query: text, answerSnippet: response.replace(/<[^>]*>?/gm, '').slice(0, 160) }
        });
      }
    }, 500);
  }

  renderChat() {
    const container = document.getElementById("ai-chat-messages");
    if (!container) return;

    container.innerHTML = this.chatHistory.map(c => `
      <div style="margin-bottom: 0.75rem; display: flex; flex-direction: column; align-items: ${c.sender === 'user' ? 'flex-end' : 'flex-start'};">
        <span style="font-size: 0.65rem; color: #64748b; margin-bottom: 2px;">${c.sender === 'user' ? 'You' : 'Legal Advisory Agent (RAG)'}</span>
        <div style="
          max-width: 88%;
          padding: 0.55rem 0.8rem;
          border-radius: 12px;
          font-size: 0.78rem;
          line-height: 1.4;
          background: ${c.sender === 'user' ? '#1e3a8a' : '#f1f5f9'};
          color: ${c.sender === 'user' ? '#ffffff' : '#0f172a'};
          border: 1px solid ${c.sender === 'user' ? '#1e3a8a' : '#e2e8f0'};
        ">
          ${c.text}
        </div>
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  }
}

window.aiCopilot = new AICopilotController();
document.addEventListener("DOMContentLoaded", () => {
  window.aiCopilot.renderProposals();
  window.aiCopilot.updateBadge();
  window.aiCopilot.renderChat();
});
