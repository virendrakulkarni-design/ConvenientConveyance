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
        selector: '#ai-toggle-btn',
        title: "Human Review & Verification Gateway",
        badge: "Human-in-the-Loop",
        description: "Specialized AI agents draft contract extraction, PEXA line items, and stamp duty checks while you retain full human review and sign-off."
      }
    ];

    this.currentIndex = 0;
    this.isActive = false;

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
    this.currentIndex = 0;
    this.isActive = true;
    document.getElementById("tour-overlay").style.display = "block";
    this.executeStep(this.currentIndex);
  }

  stop() {
    this.isActive = false;
    document.getElementById("tour-overlay").style.display = "none";
    localStorage.setItem("cpms_tour_completed", "true");
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
