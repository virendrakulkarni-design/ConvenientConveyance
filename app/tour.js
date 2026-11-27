// ============================================================================
// Next-Generation Interactive Spotlight Tour Engine
// Cross-route navigation, auto-tab activation, keyboard shortcuts, and smooth viewport tracking
// ============================================================================

class TourEngine {
  constructor() {
    this.steps = [
      {
        route: "dashboard",
        selector: '[data-tour="tiles"]',
        title: "Where Your Day Starts",
        badge: "Practice Overview",
        description: "Your practice at a glance: active conveyancing matters, upcoming settlements, pending ARNECC VOI checks, and reconciled trust funds."
      },
      {
        route: "dashboard",
        selector: '[data-tour="settling"]',
        title: "Settlements in Priority Order",
        badge: "Timeline Tracking",
        description: "Files ordered by upcoming settlement deadlines. Click any row to jump straight into the full electronic workspace."
      },
      {
        route: "clients",
        selector: '[data-tour="clients-table"]',
        title: "One Central Record Per Client",
        badge: "Client CRM & VOI",
        description: "Individuals, companies, and trusts. ARNECC Category 1 VOI and PEP/sanctions screening travel with the client, avoiding repeated verification."
      },
      {
        route: "workspaces",
        selector: '[data-tour="workspaces-table"]',
        title: "Conveyancing Workspaces",
        badge: "Matter Management",
        description: "Sales and purchases in one master view with file handlers, contract purchase prices, and automated life cycle stages."
      },
      {
        route: "workspaces/mt-1",
        selector: '[data-tour="matter-stages"]',
        title: "Progress You Can See",
        badge: "5-Stage Pipeline",
        description: "Each workspace visually tracks milestone progress from Enquiry to Completed settlement without manual spreadsheet updates."
      },
      {
        route: "workspaces/mt-1",
        tab: "parties",
        selector: '[data-tour="matter-parties"]',
        title: "Parties on Title & Identity",
        badge: "ARNECC Compliance",
        description: "Purchasers, vendors, and mortgagees on the file. Verification statuses (LiveSign/EasyAML) surface early to avoid settlement week delays."
      },
      {
        route: "trust",
        selector: '[data-tour="trust-ledger"]',
        title: "Audit-Locked Trust Accounting",
        badge: "Law Society Compliance",
        description: "Real-time 3-way reconciliation: client ledger balance vs bank statement balance with instant discrepancy identification."
      },
      {
        route: "documents",
        selector: '[data-tour="templates-table"]',
        title: "Templates, Not Retyping",
        badge: "Document Library",
        description: "Government forms (Form 1) and firm templates with mapped merge fields that automatically populate from workspace data."
      },
      {
        selector: '#ai-chat-toggle-btn',
        title: "AI Conveyancing Assistant",
        badge: "Legal RAG Copilot",
        description: "Engage in conversational Q&A grounded in your active matter and indexed over SA Water 2024–28 (RD24) tariffs, Section 7 SMR searches, and RevenueSA stamp duty relief. Click the (?) Help icon anytime for tips."
      },
      {
        selector: '#ai-toggle-btn',
        title: "Human Review & Verification Gateway",
        badge: "Human-in-the-Loop",
        description: "Specialized AI agents draft contract extraction, PEXA line items, and stamp duty checks while you retain full human review and sign-off."
      }
    ];

    this.defaultSteps = this.steps;
    this.endToEndSteps = [
      {
        route: "dashboard",
        selector: '[data-tour="header"]',
        title: "Welcome New Conveyancer! (Use Case: Sarah Connor)",
        badge: "Step 1 • Onboarding",
        description: "Let's walk through 1 complete end-to-end residential purchase: Sarah Connor buying 14 Beulah Rd, Norwood SA 5067 for $620,000 (First Home Buyer). Click 'Next' to start!"
      },
      {
        route: "workspaces",
        selector: '[data-tour="workspaces-table"]',
        title: "Create & Manage Sarah's Matter File",
        badge: "Step 2 • Matter Intake",
        description: "In Workspaces, click '+ Create New File' to open a file. We've pre-staged Sarah's $620,000 purchase (CT 6210/118, $62,000 deposit) for this walkthrough."
      },
      {
        route: "parties",
        selector: '.page-header',
        title: "Inspect All Buyers, Sellers & Mortgagees",
        badge: "Step 3 • Parties Register",
        description: "The dedicated Parties menu lists every Buyer, Seller, Mortgagee, and Agent across all files. Filter by role or inspect ARNECC VOI compliance here."
      },
      {
        route: "workspaces/mt-demo-sarah",
        selector: '#ai-chat-toggle-btn',
        title: "Ask the AI Assistant & Check Help (?)",
        badge: "Step 4 • AI Legal RAG",
        description: "Open 'AI Assistant' (cyan button) to ask about Sarah's $620k First Home Buyer exemption ($0 stamp duty under SA Sec 14B) or click the (?) Help icon for prompt tips."
      },
      {
        route: "workspaces/mt-demo-sarah",
        selector: '.matter-header-actions',
        title: "SAILIS Search, Client Portal & PEXA Sync",
        badge: "Step 5 • Searches & Portal",
        description: "Use 'Ingest SAILIS Search' to detect easements automatically, 'Client Portal Preview' for the mobile Pizza Tracker, and 'Sync PEXA' when ready to settle."
      },
      {
        route: "trust",
        selector: '[data-tour="trust-ledger"]',
        title: "Trust Deposit & 3-Way Reconciliation",
        badge: "Step 6 • Trust Accounting",
        description: "Post Sarah's $62,000 (10%) deposit via 'New Trust Receipt' and click 'Reconcile Now' to verify Bank Statement = Cash Book = Client Sub-Ledgers."
      },
      {
        route: "settings",
        selector: '#privacy-toggle-btn',
        title: "Human Review, Privacy Mode & Export Backup",
        badge: "Step 7 • Governance & Backup",
        description: "Authorise financial lines in 'Human Review', blur client PII with 'Privacy Mode', and always use 'Export Data (.json)' before cleaning up with Reset!"
      }
    ];

    this.currentIndex = 0;
    this.isActive = false;
    this.audioEnabled = true;

    // Keyboard bindings
    window.addEventListener("keydown", (e) => {
      if (!this.isActive) return;
      if (e.key === "ArrowRight") this.next();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "Escape") this.stop();
    });

    window.addEventListener("resize", () => {
      if (this.isActive) this.positionSpotlight();
    });
  }

  start() {
    this.steps = this.defaultSteps;
    this.currentIndex = 0;
    this.isActive = true;
    document.getElementById("tour-overlay").style.display = "block";
    this.executeStep(this.currentIndex);
  }

  startEndToEndDemo() {
    // Ensure Sarah Connor's simple demo use case exists in CPMS_STORE
    if (typeof CPMS_STORE !== "undefined" && !CPMS_STORE.matters.some(m => m.id === "mt-demo-sarah")) {
      CPMS_STORE.matters.unshift({
        id: "mt-demo-sarah",
        reference: "2026-0215",
        transactionType: "purchase",
        property: "14 Beulah Road, Norwood SA 5067",
        title: "CT 6210/118",
        client: "Sarah Connor",
        manager: "Demo Conveyancer",
        settlementDate: "15/01/2027",
        daysLeft: 50,
        stage: "Contract signed",
        stageIndex: 1,
        voiStatus: "verified",
        purchasePrice: "$620,000.00",
        depositHeld: "$62,000.00",
        balanceDue: "$558,000.00",
        contractDate: "26/11/2026",
        coolingOff: "Expires 28/11/2026 5:00 PM (Active)",
        parties: [
          { name: "Sarah Connor", role: "Purchaser", phone: "0411 222 333", email: "sarah.connor@example.com", voi: "verified" },
          { name: "Robert & Claire Vance", role: "Vendors", phone: "0422 444 555", email: "r.vance@example.com", voi: "verified" },
          { name: "ANZ Banking Group", role: "Incoming Mortgagee", phone: "13 13 14", email: "settlements@anz.com", voi: "exempt" }
        ],
        documents: [],
        trustAllocations: []
      });
      if (typeof appRouter !== "undefined" && typeof appRouter.updateMattersBadge === "function") {
        appRouter.updateMattersBadge();
      }
    }
    this.steps = this.endToEndSteps;
    this.currentIndex = 0;
    this.isActive = true;
    document.getElementById("tour-overlay").style.display = "block";
    this.executeStep(this.currentIndex);
  }

  stop() {
    this.isActive = false;
    this.stopSpeech();
    document.getElementById("tour-overlay").style.display = "none";
    localStorage.setItem("cpms_tour_completed", "true");
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;
    const btn = document.getElementById("tour-audio-btn");
    if (btn) {
      btn.innerHTML = this.audioEnabled
        ? `<i data-lucide="volume-2" style="width: 13px; height: 13px;"></i><span>Audio On</span>`
        : `<i data-lucide="volume-x" style="width: 13px; height: 13px;"></i><span>Muted</span>`;
      if (window.lucide) window.lucide.createIcons();
    }
    if (!this.audioEnabled) {
      this.stopSpeech();
    } else if (this.isActive && this.steps[this.currentIndex]) {
      const s = this.steps[this.currentIndex];
      this.speak(`${s.title}. ${s.description}`);
    }
  }

  stopSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  speak(text) {
    if (!this.audioEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices() || [];
    // Prefer Australian young female voice (e.g., Natasha, Catherine, Hayley, Karen, or en-AU female)
    const auFemale = voices.find(v => /en[-_]AU/i.test(v.lang) && /natasha|catherine|hayley|karen|female|zira|hazel/i.test(v.name))
      || voices.find(v => /en[-_]AU/i.test(v.lang))
      || voices.find(v => /natasha|zira|hazel|samantha|female/i.test(v.name));
    if (auFemale) utter.voice = auFemale;
    utter.lang = "en-AU";
    utter.rate = 1.03;
    utter.pitch = 1.08;
    window.speechSynthesis.speak(utter);
  }

  next() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      this.executeStep(this.currentIndex);
    } else {
      this.stop();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.executeStep(this.currentIndex);
    }
  }

  executeStep(index) {
    const step = this.steps[index];

    if (step.route && appRouter.currentRoute !== step.route) {
      appRouter.navigate(step.route);
    }

    if (step.tab && appRouter.activeMatterId) {
      appRouter.switchMatterTab(step.tab, appRouter.activeMatterId);
    }

    const el = document.querySelector(step.selector) || document.body;
    this.positionSpotlight(el, step);
    this.speak(`${step.title}. ${step.description}`);
  }

  positionSpotlight(element, step) {
    const el = element || document.querySelector(this.steps[this.currentIndex].selector);
    if (!el) return;

    const spotlight = document.getElementById("tour-spotlight");
    const popover = document.getElementById("tour-popover");
    const currentStepData = step || this.steps[this.currentIndex];

    // Scroll element into view smoothly
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const padding = 8;

      // Position spotlight box
      spotlight.style.top = `${Math.max(0, rect.top - padding)}px`;
      spotlight.style.left = `${Math.max(0, rect.left - padding)}px`;
      spotlight.style.width = `${rect.width + padding * 2}px`;
      spotlight.style.height = `${rect.height + padding * 2}px`;

      // Update popover content
      document.getElementById("tour-popover-badge").innerText = `${currentStepData.badge} • Step ${this.currentIndex + 1} of ${this.steps.length}`;
      document.getElementById("tour-popover-title").innerText = currentStepData.title;
      document.getElementById("tour-popover-desc").innerText = currentStepData.description;

      const nextBtn = document.getElementById("tour-next-btn");
      const prevBtn = document.getElementById("tour-prev-btn");

      prevBtn.style.display = this.currentIndex === 0 ? "none" : "inline-block";
      nextBtn.innerText = this.currentIndex === this.steps.length - 1 ? "Finish Tour" : "Next →";

      // Calculate popover positioning
      let popoverTop = rect.bottom + 16;
      let popoverLeft = Math.min(window.innerWidth - 380, Math.max(20, rect.left));

      if (popoverTop + 220 > window.innerHeight) {
        popoverTop = Math.max(20, rect.top - 240);
      }

      popover.style.top = `${popoverTop}px`;
      popover.style.left = `${popoverLeft}px`;
    }, 150);
  }
}

window.tourEngine = new TourEngine();
