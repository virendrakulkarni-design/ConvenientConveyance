// ============================================================================
// CPMS Static Seed Data & Mock Storage
// Jurisdiction: South Australia Conveyancing Practice
// ============================================================================

function getInitialData() {
  return {
    persona: {
      firmName: "Aldgate Conveyancing",
      user: "Demo Conveyancer",
      role: "Senior Conveyancer",
      initials: "DC",
      email: "demo.conveyancer@aldgateconveyancing.com.au"
    },

    matters: [
      {
        id: "mt-1",
        reference: "2026-0184",
        transactionType: "purchase",
        property: "57 Prospect Road, Norwood SA 5067",
        title: "CT 5874/412",
        client: "Margaret Thi Nguyen",
        manager: "Demo Conveyancer",
        settlementDate: "26/11/2026",
        daysLeft: 3,
        stage: "Settlement booked",
        stageIndex: 3, // 0: Enquiry, 1: Contract, 2: Searches, 3: Settlement Booked, 4: Completed
        purchasePrice: "$1,250,000.00",
        depositHeld: "$125,000.00",
        balanceDue: "$1,125,226.25",
        voiStatus: "verified",
        contractDate: "24/10/2026",
        coolingOff: "Waived by Purchaser (Certificate s66W)",
        parties: [
          { name: "Margaret Thi Nguyen", role: "Purchaser", phone: "0412 884 207", email: "m.nguyen@example.com", voi: "verified" },
          { name: "David & Sarah Miller", role: "Vendors", phone: "0423 119 550", email: "d.miller@example.com", voi: "verified" },
          { name: "ANZ Banking Group", role: "Incoming Mortgagee", phone: "13 13 14", email: "settlements@anz.com", voi: "exempt" },
          { name: "Harris Real Estate", role: "Real Estate Agent", phone: "08 8202 3000", email: "agents@harrisre.com.au", voi: "exempt" }
        ],
        documents: [
          { id: "doc-1", name: "Contract of Sale, Residential", category: "Contract", status: "signed", version: "v1.2", updatedOn: "24/10/2026", size: "2.4 MB" },
          { id: "doc-2", name: "Form 1 Vendor Statement", category: "Disclosure", status: "signed", version: "v1.0", updatedOn: "25/10/2026", size: "14.8 MB" },
          { id: "doc-3", name: "Settlement Statement & Adjustments", category: "Settlement", status: "draft", version: "v2.1", updatedOn: "21/11/2026", size: "480 KB" },
          { id: "doc-4", name: "Client Authority and Costs Disclosure", category: "Authority", status: "signed", version: "v1.0", updatedOn: "18/10/2026", size: "1.1 MB" },
          { id: "doc-5", name: "PEXA Digital Settlement Schedule", category: "Settlement", status: "draft", version: "v1.0", updatedOn: "23/11/2026", size: "620 KB" }
        ],
        trustAllocations: [
          { date: "25/10/2026", type: "Deposit Receipt", ref: "TR-8941", description: "Deposit received from M. Nguyen", credit: "$125,000.00", debit: "-", balance: "$125,000.00" },
          { date: "02/11/2026", type: "Search Disbursement", ref: "TR-9022", description: "SAILIS Title & Encumbrance Searches", credit: "-", debit: "$385.00", balance: "$124,615.00" }
        ]
      },
      {
        id: "mt-2",
        reference: "2026-0192",
        transactionType: "sale",
        property: "12 Albert Street, Mitcham SA 5062",
        title: "CT 6102/89",
        client: "Dr. Arthur Pendelton",
        manager: "Tom Hargreaves",
        settlementDate: "04/12/2026",
        daysLeft: 11,
        stage: "Searches & Enquiries",
        stageIndex: 2,
        purchasePrice: "$890,000.00",
        depositHeld: "$89,000.00",
        balanceDue: "$801,000.00",
        voiStatus: "verified",
        contractDate: "05/11/2026",
        coolingOff: "Expired 08/11/2026",
        parties: [
          { name: "Dr. Arthur Pendelton", role: "Vendor", phone: "0401 552 114", email: "a.pendelton@adelaide.edu.au", voi: "verified" },
          { name: "Commonwealth Bank", role: "Discharging Mortgagee", phone: "13 22 21", email: "discharges@cba.com.au", voi: "exempt" }
        ],
        documents: [
          { id: "doc-21", name: "Form 1 Vendor Statement", category: "Disclosure", status: "signed", version: "v1.0", updatedOn: "12/10/2026", size: "8.2 MB" },
          { id: "doc-22", name: "Discharge of Mortgage Authority", category: "Authority", status: "sent", version: "v1.0", updatedOn: "19/11/2026", size: "910 KB" }
        ],
        trustAllocations: []
      },
      {
        id: "mt-3",
        reference: "2026-0201",
        transactionType: "purchase",
        property: "4/88 King William Road, Hyde Park SA 5061",
        title: "CT 5431/220",
        client: "Siddharth & Priya Mehta",
        manager: "Demo Conveyancer",
        settlementDate: "18/12/2026",
        daysLeft: 25,
        stage: "Contract Signed",
        stageIndex: 1,
        purchasePrice: "$740,000.00",
        depositHeld: "$0.00",
        balanceDue: "$740,000.00",
        voiStatus: "in_progress",
        contractDate: "19/11/2026",
        coolingOff: "Expires 25/11/2026 5:00 PM",
        parties: [
          { name: "Siddharth & Priya Mehta", role: "Purchasers", phone: "0433 990 120", email: "s.mehta@example.com", voi: "in_progress" },
          { name: "Westpac Banking Corp", role: "Incoming Mortgagee", phone: "13 20 32", email: "settlements@westpac.com", voi: "exempt" }
        ],
        documents: [
          { id: "doc-31", name: "Contract of Sale, Residential", category: "Contract", status: "draft", version: "v0.9", updatedOn: "20/11/2026", size: "3.1 MB" }
        ],
        trustAllocations: []
      },
      {
        id: "mt-4",
        reference: "2026-0167",
        transactionType: "sale",
        property: "104 The Parade, Norwood SA 5067",
        title: "CT 5991/14",
        client: "The Fairweather Family Trust",
        manager: "Rebecca Lindsay",
        settlementDate: "27/11/2026",
        daysLeft: 4,
        stage: "Settlement booked",
        stageIndex: 3,
        purchasePrice: "$2,100,000.00",
        depositHeld: "$210,000.00",
        balanceDue: "$1,890,000.00",
        voiStatus: "verified",
        contractDate: "02/10/2026",
        coolingOff: "Waived",
        parties: [
          { name: "The Fairweather Family Trust", role: "Vendor", phone: "0419 772 301", email: "trustees@fairweather.com", voi: "verified" },
          { name: "National Australia Bank", role: "Discharging Mortgagee", phone: "13 22 65", email: "discharges@nab.com.au", voi: "exempt" }
        ],
        documents: [
          { id: "doc-41", name: "Settlement Statement", category: "Settlement", status: "signed", version: "v1.4", updatedOn: "31/10/2026", size: "1.2 MB" }
        ],
        trustAllocations: [
          { date: "05/10/2026", type: "Deposit Receipt", ref: "TR-8810", description: "Deposit held in firm trust", credit: "$210,000.00", debit: "-", balance: "$210,000.00" }
        ]
      },
      {
        id: "mt-5",
        reference: "2026-0210",
        transactionType: "purchase",
        property: "22 Osmond Terrace, Norwood SA 5067",
        title: "CT 5210/44",
        client: "Chloe Jenkins",
        manager: "Demo Conveyancer",
        settlementDate: "15/01/2027",
        daysLeft: 53,
        stage: "Enquiry & Intake",
        stageIndex: 0,
        purchasePrice: "$680,000.00",
        depositHeld: "$0.00",
        balanceDue: "$680,000.00",
        voiStatus: "pending",
        contractDate: "Pending Auction",
        coolingOff: "N/A",
        parties: [
          { name: "Chloe Jenkins", role: "Purchaser", phone: "0422 660 882", email: "c.jenkins@example.com", voi: "pending" }
        ],
        documents: [],
        trustAllocations: []
      },
      {
        id: "mt-6",
        reference: "2026-0155",
        transactionType: "sale",
        property: "18 Colley Terrace, Glenelg SA 5045",
        title: "CT 5920/314",
        client: "Lachlan & Emily Murdoch",
        manager: "Rebecca Lindsay",
        settlementDate: "14/11/2026",
        daysLeft: -9,
        stage: "Completed",
        stageIndex: 4,
        purchasePrice: "$1,580,000.00",
        depositHeld: "$158,000.00",
        balanceDue: "$0.00",
        voiStatus: "verified",
        contractDate: "15/09/2026",
        coolingOff: "Expired",
        parties: [
          { name: "Lachlan & Emily Murdoch", role: "Vendors", phone: "0418 831 290", email: "l.murdoch@example.com", voi: "verified" },
          { name: "Macquarie Bank", role: "Discharging Mortgagee", phone: "1800 806 310", email: "settlements@macquarie.com", voi: "exempt" }
        ],
        documents: [
          { id: "doc-61", name: "PEXA Settlement Confirmation", category: "Settlement", status: "signed", version: "v1.0", updatedOn: "14/11/2026", size: "320 KB" }
        ],
        trustAllocations: []
      },
      {
        id: "mt-7",
        reference: "2026-0178",
        transactionType: "purchase",
        property: "92 O'Connell Street, North Adelaide SA 5006",
        title: "CT 6044/12",
        client: "Harrison Property Group Pty Ltd",
        manager: "Tom Hargreaves",
        settlementDate: "09/12/2026",
        daysLeft: 16,
        stage: "Searches & Enquiries",
        stageIndex: 2,
        purchasePrice: "$3,450,000.00",
        depositHeld: "$345,000.00",
        balanceDue: "$3,105,000.00",
        voiStatus: "verified",
        contractDate: "10/10/2026",
        coolingOff: "Commercial / Not Applicable",
        parties: [
          { name: "Harrison Property Group Pty Ltd", role: "Purchaser", phone: "08 8231 4400", email: "legal@harrisonprop.com.au", voi: "verified" },
          { name: "St George Bank", role: "Incoming Mortgagee", phone: "13 33 30", email: "settlements@stgeorge.com.au", voi: "exempt" }
        ],
        documents: [
          { id: "doc-71", name: "Commercial Property Contract", category: "Contract", status: "signed", version: "v1.0", updatedOn: "12/10/2026", size: "4.8 MB" },
          { id: "doc-72", name: "SA Water SMR Search Certificate", category: "Search", status: "signed", version: "v1.0", updatedOn: "18/11/2026", size: "1.1 MB" }
        ],
        trustAllocations: [
          { date: "15/10/2026", type: "Deposit Receipt", ref: "TR-8890", description: "10% Commercial Deposit", credit: "$345,000.00", debit: "-", balance: "$345,000.00" }
        ]
      },
      {
        id: "mt-8",
        reference: "2026-0205",
        transactionType: "purchase",
        property: "77 Unley Road, Unley SA 5061",
        title: "CT 5812/902",
        client: "Marcus & Elena Vance",
        manager: "Demo Conveyancer",
        settlementDate: "22/12/2026",
        daysLeft: 29,
        stage: "Contract Signed",
        stageIndex: 1,
        purchasePrice: "$950,000.00",
        depositHeld: "$95,000.00",
        balanceDue: "$855,000.00",
        voiStatus: "in_progress",
        contractDate: "21/11/2026",
        coolingOff: "Expires 27/11/2026",
        parties: [
          { name: "Marcus & Elena Vance", role: "Purchasers", phone: "0421 990 411", email: "m.vance@example.com", voi: "in_progress" },
          { name: "BankSA", role: "Incoming Mortgagee", phone: "13 13 76", email: "settlements@banksa.com.au", voi: "exempt" }
        ],
        documents: [
          { id: "doc-81", name: "Contract of Sale, Residential", category: "Contract", status: "signed", version: "v1.0", updatedOn: "21/11/2026", size: "2.8 MB" }
        ],
        trustAllocations: []
      },
      {
        id: "mt-9",
        reference: "2026-0212",
        transactionType: "sale",
        property: "105 Prospect Road, Prospect SA 5082",
        title: "CT 5339/45",
        client: "Grace Elizabeth Kelly",
        manager: "Demo Conveyancer",
        settlementDate: "08/01/2027",
        daysLeft: 46,
        stage: "Enquiry & Intake",
        stageIndex: 0,
        purchasePrice: "$715,000.00",
        depositHeld: "$0.00",
        balanceDue: "$715,000.00",
        voiStatus: "pending",
        contractDate: "Drafting Form 1",
        coolingOff: "Pending Execution",
        parties: [
          { name: "Grace Elizabeth Kelly", role: "Vendor", phone: "0402 771 904", email: "g.kelly@example.com", voi: "pending" }
        ],
        documents: [],
        trustAllocations: []
      }
    ],

    clients: [
      {
        id: "cl-1",
        name: "Margaret Thi Nguyen",
        type: "Individual",
        reference: "CL-5821",
        email: "m.nguyen@example.com",
        phone: "0412 884 207",
        voi: "Verified (Pass)",
        isKey: true,
        activeMatters: 1,
        address: "57 Prospect Road, Norwood SA 5067"
      },
      {
        id: "cl-2",
        name: "Dr. Arthur Pendelton",
        type: "Individual",
        reference: "CL-4419",
        email: "a.pendelton@adelaide.edu.au",
        phone: "0401 552 114",
        voi: "Verified (Pass)",
        isKey: false,
        activeMatters: 1,
        address: "12 Albert Street, Mitcham SA 5062"
      },
      {
        id: "cl-3",
        name: "Siddharth & Priya Mehta",
        type: "Joint Individuals",
        reference: "CL-7732",
        email: "s.mehta@example.com",
        phone: "0433 990 120",
        voi: "In Progress (Facial Match Pending)",
        isKey: false,
        activeMatters: 1,
        address: "4/88 King William Road, Hyde Park SA 5061"
      },
      {
        id: "cl-4",
        name: "The Fairweather Family Trust",
        type: "Discretionary Trust",
        reference: "CL-3104",
        email: "trustees@fairweather.com",
        phone: "0419 772 301",
        voi: "Verified (Pass)",
        isKey: true,
        activeMatters: 1,
        address: "104 The Parade, Norwood SA 5067"
      },
      {
        id: "cl-5",
        name: "Chloe Jenkins",
        type: "Individual",
        reference: "CL-9081",
        email: "c.jenkins@example.com",
        phone: "0422 660 882",
        voi: "Pending Intake",
        isKey: false,
        activeMatters: 1,
        address: "22 Osmond Terrace, Norwood SA 5067"
      },
      {
        id: "cl-6",
        name: "Lachlan & Emily Murdoch",
        type: "Joint Individuals",
        reference: "CL-2290",
        email: "l.murdoch@example.com",
        phone: "0418 831 290",
        voi: "Verified (Archived)",
        isKey: false,
        activeMatters: 0,
        address: "18 Colley Terrace, Glenelg SA 5045"
      },
      {
        id: "cl-7",
        name: "Harrison Property Group Pty Ltd",
        type: "Company (Corporate Trustee)",
        reference: "CL-1102",
        email: "legal@harrisonprop.com.au",
        phone: "08 8231 4400",
        voi: "Verified (Pass)",
        isKey: true,
        activeMatters: 1,
        address: "92 O'Connell Street, North Adelaide SA 5006"
      },
      {
        id: "cl-8",
        name: "Marcus & Elena Vance",
        type: "Joint Individuals",
        reference: "CL-6650",
        email: "m.vance@example.com",
        phone: "0421 990 411",
        voi: "In Progress",
        isKey: false,
        activeMatters: 1,
        address: "77 Unley Road, Unley SA 5061"
      },
      {
        id: "cl-9",
        name: "Grace Elizabeth Kelly",
        type: "Individual",
        reference: "CL-8843",
        email: "g.kelly@example.com",
        phone: "0402 771 904",
        voi: "Pending Intake",
        isKey: false,
        activeMatters: 1,
        address: "105 Prospect Road, Prospect SA 5082"
      }
    ],

    properties: [
      { 
        address: "57 Prospect Road, Norwood SA 5067", 
        title: "CT 5874/412", 
        plan: "Lot 14 in Deposited Plan 1234", 
        council: "City of Norwood Payneham & St Peters", 
        zoning: "Residential (Established)", 
        tenancy: "Vacant Possession", 
        matterRef: "2026-0184",
        capitalValue: "$1,250,000",
        siteValue: "$780,000",
        landArea: "680 m² (18.2m frontage)",
        lat: "-34.9192",
        lng: "138.6341",
        valuationNo: "1204/9912",
        saWaterZone: "Metropolitan Central (SMR active)"
      },
      { 
        address: "12 Albert Street, Mitcham SA 5062", 
        title: "CT 6102/89", 
        plan: "Allotment 8 in Filed Plan 4401", 
        council: "City of Mitcham", 
        zoning: "Hills Neighbourhood", 
        tenancy: "Owner Occupied", 
        matterRef: "2026-0192",
        capitalValue: "$920,000",
        siteValue: "$580,000",
        landArea: "820 m² (22.5m frontage)",
        lat: "-34.9812",
        lng: "138.6189",
        valuationNo: "3309/4401",
        saWaterZone: "Adelaide Hills Catchment"
      },
      { 
        address: "4/88 King William Road, Hyde Park SA 5061", 
        title: "CT 5431/220", 
        plan: "Unit 4 in Strata Plan 8920", 
        council: "City of Unley", 
        zoning: "Suburban Main Street", 
        tenancy: "Tenanted to Jan 2027", 
        matterRef: "2026-0201",
        capitalValue: "$640,000",
        siteValue: "$310,000",
        landArea: "185 m² Strata Unit",
        lat: "-34.9455",
        lng: "138.5982",
        valuationNo: "2401/8920",
        saWaterZone: "Metropolitan Inner South"
      },
      { 
        address: "104 The Parade, Norwood SA 5067", 
        title: "CT 5991/14", 
        plan: "Lot 2 in Deposited Plan 9912", 
        council: "City of Norwood Payneham & St Peters", 
        zoning: "Commercial / Mixed Use", 
        tenancy: "Vacant", 
        matterRef: "2026-0167",
        capitalValue: "$2,100,000",
        siteValue: "$1,450,000",
        landArea: "540 m² High Street Frontage",
        lat: "-34.9205",
        lng: "138.6380",
        valuationNo: "1204/0014",
        saWaterZone: "Metropolitan Commercial Corridor"
      },
      { 
        address: "22 Osmond Terrace, Norwood SA 5067", 
        title: "CT 5210/44", 
        plan: "Lot 18 in Filed Plan 2209", 
        council: "City of Norwood Payneham & St Peters", 
        zoning: "Residential Character", 
        tenancy: "Auction Condition", 
        matterRef: "2026-0210",
        capitalValue: "$1,680,000",
        siteValue: "$1,120,000",
        landArea: "790 m² Heritage Precinct",
        lat: "-34.9178",
        lng: "138.6305",
        valuationNo: "1204/2209",
        saWaterZone: "Metropolitan Central"
      },
      { 
        address: "18 Colley Terrace, Glenelg SA 5045", 
        title: "CT 5920/314", 
        plan: "Lot 7 in Deposited Plan 5519", 
        council: "City of Holdfast Bay", 
        zoning: "High Density Residential", 
        tenancy: "Settled / Handed Over", 
        matterRef: "2026-0155",
        capitalValue: "$1,450,000",
        siteValue: "$890,000",
        landArea: "420 m² Coastal Esplanade",
        lat: "-34.9818",
        lng: "138.5144",
        valuationNo: "5510/5519",
        saWaterZone: "Western Coastal District"
      },
      { 
        address: "92 O'Connell Street, North Adelaide SA 5006", 
        title: "CT 6044/12", 
        plan: "Lot 31 in Filed Plan 1022", 
        council: "City of Adelaide", 
        zoning: "City Main Street Commercial", 
        tenancy: "Tenanted Commercial", 
        matterRef: "2026-0178",
        capitalValue: "$3,450,000",
        siteValue: "$2,200,000",
        landArea: "610 m² Commercial Boulevard",
        lat: "-34.9082",
        lng: "138.5960",
        valuationNo: "0100/1022",
        saWaterZone: "Adelaide CBD & North Metro"
      },
      { 
        address: "77 Unley Road, Unley SA 5061", 
        title: "CT 5812/902", 
        plan: "Lot 9 in Deposited Plan 3410", 
        council: "City of Unley", 
        zoning: "Urban Corridor", 
        tenancy: "Owner Occupied", 
        matterRef: "2026-0205",
        capitalValue: "$1,350,000",
        siteValue: "$860,000",
        landArea: "580 m² Urban Main Road",
        lat: "-34.9421",
        lng: "138.6045",
        valuationNo: "2401/3410",
        saWaterZone: "Metropolitan Inner South"
      },
      { 
        address: "105 Prospect Road, Prospect SA 5082", 
        title: "CT 5339/45", 
        plan: "Lot 102 in Filed Plan 7701", 
        council: "City of Prospect", 
        zoning: "Urban Core", 
        tenancy: "Vacant Possession", 
        matterRef: "2026-0212",
        capitalValue: "$1,150,000",
        siteValue: "$740,000",
        landArea: "650 m² Activity Node",
        lat: "-34.8872",
        lng: "138.5955",
        valuationNo: "1805/7701",
        saWaterZone: "Northern Metropolitan"
      }
    ],

    templates: [
      { id: "tp-1", name: "Form 1 Vendor Statement", type: "Government Form", category: "Disclosure", fields: 48, status: "Active", updatedOn: "02/09/2026", description: "Statutory disclosure statement required under Section 7 of the Land and Business (Sale and Conveyancing) Act 1994." },
      { id: "tp-2", name: "Contract of Sale, Residential Land", type: "Government Form", category: "Contract", fields: 36, status: "Active", updatedOn: "02/09/2026", description: "Standard REISA-approved contract of sale for residential property in South Australia." },
      { id: "tp-3", name: "Client Authority and Costs Disclosure", type: "Firm Template", category: "Authority", fields: 14, status: "Active", updatedOn: "11/10/2026", description: "Formal client engagement agreement and fee estimate under Legal Practitioners Act." },
      { id: "tp-4", name: "Settlement Statement & Adjustments", type: "Firm Template", category: "Settlement", fields: 22, status: "Active", updatedOn: "18/10/2026", description: "Financial breakdown of purchase price, deposit, council/water rates adjustments, and balance required." },
      { id: "tp-5", name: "Discharge of Mortgage Authority", type: "Firm Template", category: "Authority", fields: 9, status: "Active", updatedOn: "04/08/2026", description: "Authority directed to discharging financial institution to prepare discharge and invite to PEXA." },
      { id: "tp-6", name: "Identity Verification Certificate", type: "Firm Template", category: "Identity", fields: 19, status: "Draft", updatedOn: "20/11/2026", description: "ARNECC Schedule 1 Verification of Identity face-to-face certification sheet." }
    ],

    trust: {
      ledgerBalance: "$845,865.00",
      bankBalance: "$845,480.00",
      reconciledDifference: "$385.00",
      differenceReason: "One unpresented cheque (Chq #004128 to SA Water) not yet debited by bank.",
      lastReconciliationDate: "31/10/2026 (Audited by PKF Adelaide)",
      accounts: [
        { matterRef: "2026-0184", client: "Margaret Thi Nguyen", property: "57 Prospect Road, Norwood", balance: "$124,615.00", lastMovement: "02/11/2026" },
        { matterRef: "2026-0167", client: "The Fairweather Family Trust", property: "104 The Parade, Norwood", balance: "$210,000.00", lastMovement: "05/10/2026" },
        { matterRef: "2026-0178", client: "Harrison Property Group Pty Ltd", property: "92 O'Connell Street, North Adelaide", balance: "$345,000.00", lastMovement: "15/10/2026" },
        { matterRef: "2026-0175", client: "Nicholas Ryan", property: "8 Fourth Ave, St Peters", balance: "$98,250.00", lastMovement: "14/10/2026" },
        { matterRef: "2026-0179", client: "Aiden & Zoe Wright", property: "15 Flinders St, Adelaide", balance: "$68,000.00", lastMovement: "28/10/2026" }
      ]
    },

    advisories: [
      {
        id: "adv-101",
        matterRef: "2026-0184",
        client: "Margaret Thi Nguyen",
        property: "57 Prospect Road, Norwood SA 5067",
        title: "SA Water Special Meter Reading (SMR) Priority Window",
        desc: "Section 7 SMR Certificate confirmed consumption adjustment. Standard tier 1 rate applied to settlement calculation.",
        agent: "Regulatory Intelligence Agent",
        status: "applied",
        appliedAt: "2026-11-20T14:32:00.000Z",
        dismissedAt: null,
        discardedAt: null,
        lastAction: "Applied to Checklist",
        actionBy: "Demo Conveyancer"
      },
      {
        id: "adv-102",
        matterRef: "2026-0192",
        client: "Dr. Arthur Pendelton",
        property: "12 Albert Street, Mitcham SA 5062",
        title: "Foreign Resident Capital Gains Withholding (FRCGW)",
        desc: "Vendor clearance certificate confirmed SA resident status. Nil withholding required by purchaser under ATO guidelines.",
        agent: "Tax Advisory Agent",
        status: "dismissed",
        appliedAt: null,
        dismissedAt: "2026-11-19T09:15:00.000Z",
        discardedAt: null,
        lastAction: "Dismissed by Practitioner",
        actionBy: "Tom Hargreaves"
      }
    ],

    auditLog: [
      {
        id: "AUD-2026-0045",
        timestamp: "2026-11-24T08:15:22.140Z",
        matterRef: "2026-0184",
        category: "PEXA_TRANSACTION",
        severity: "CRITICAL",
        action: "Authorised PEXA Financial Settlement Schedule Line",
        actor: {
          type: "USER",
          name: "Demo Conveyancer",
          role: "Senior Conveyancer",
          ip: "10.14.2.88",
          session: "sess_7f991c"
        },
        explainability: {
          rationale: "Practitioner inspected and verified financial destination line of $1,125,226.25 for incoming mortgagee ANZ Banking Group following rate adjustments balancing.",
          confidence: 1.0,
          governingRule: "PEXA Operating Conditions Clause 5.2 & ARNECC Model Participation Rules (MPR) v6",
          telemetry: {
            traceId: "tr-7f41a0e9b201",
            spanId: "sp-9902",
            durationMs: 420,
            model: "Manual Human Verification (HITL Hard Gate)"
          }
        },
        payload: {
          workspaceId: "PX-884102",
          settlementDate: "26/11/2026",
          purchasePrice: "$1,250,000.00",
          depositCredit: "$125,000.00",
          ratesAdjustment: "+$695.15",
          dischargeFee: "+$181.00",
          netPexaLine: "$1,125,226.25"
        },
        stateDiff: {
          field: "matter.stageIndex",
          before: 2,
          after: 3,
          beforeLabel: "Searches & Enquiries",
          afterLabel: "Settlement booked"
        },
        crypto: {
          prevHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          eventHash: "9a2f7c3905e1b626e2df4a9386d4e2840c884cbbe531f82e811776510a74d284",
          verified: true
        }
      },
      {
        id: "AUD-2026-0044",
        timestamp: "2026-11-23T19:22:15.820Z",
        matterRef: "2026-0201",
        category: "AI_INFERENCE",
        severity: "INFO",
        action: "Contract of Sale Parameter Extraction",
        actor: {
          type: "AGENT",
          name: "Document Intelligence Agent",
          role: "Contract Parser v2.4",
          ip: "10.14.99.12",
          session: "agent_runner_14"
        },
        explainability: {
          rationale: "Ingested signed Residential Contract of Sale (4/88 King William Rd). Extracted 14 statutory fields with multi-tier validation against Title CT 5219/84.",
          confidence: 0.984,
          governingRule: "Land and Business (Sale and Conveyancing) Act 1994 (SA) Section 7",
          telemetry: {
            traceId: "tr-6b12a801e744",
            spanId: "sp-8811",
            durationMs: 840,
            model: "claude-3-5-sonnet-20241022",
            promptTokens: 4120,
            completionTokens: 380,
            temperature: 0.1
          }
        },
        payload: {
          purchasePrice: "$740,000.00",
          deposit: "$74,000.00",
          coolingOffDays: "2 Business Days",
          specialConditionsCount: 2
        },
        stateDiff: {
          field: "matter.documents.doc-extract",
          before: null,
          after: "14 fields extracted pending HITL approval"
        },
        crypto: {
          prevHash: "7b4c92140a8315ea0112480a8bf72468d6174a810f27305d0458117a3a822001",
          eventHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          verified: true
        }
      },
      {
        id: "AUD-2026-0043",
        timestamp: "2026-11-23T18:10:05.105Z",
        matterRef: "2026-0210",
        category: "LEGAL_ADVISORY",
        severity: "WARNING",
        action: "Stamp Duty Exemption Advisory Generated",
        actor: {
          type: "AGENT",
          name: "Legal Advisory Agent (RAG)",
          role: "RevenueSA Regulatory Reasoner",
          ip: "10.14.99.15",
          session: "rag_engine_03"
        },
        explainability: {
          rationale: "Purchaser indicated first home purchase at $680,000.00. June 2024 SA Stamp Duties Act amendment grants tiered relief up to $700,000.00. Estimated statutory saving: $28,450.00.",
          confidence: 0.978,
          governingRule: "Stamp Duties (Relief Measures) Amendment Act 2024 (SA) s14B",
          telemetry: {
            traceId: "tr-5a9101ff8219",
            spanId: "sp-7704",
            durationMs: 620,
            model: "claude-3-5-sonnet-20241022 (RAG pgvector)",
            corpusSource: "RevenueSA Information Circular No. 2024/03",
            promptTokens: 2840,
            completionTokens: 210
          }
        },
        payload: {
          purchasePrice: "$680,000.00",
          calculatedStandardDuty: "$28,450.00",
          reliefAmount: "$28,450.00",
          netDutyPayable: "$0.00"
        },
        stateDiff: {
          field: "advisories.adv-2026-0210",
          before: null,
          after: "Proposed advisory awaiting practitioner review"
        },
        crypto: {
          prevHash: "3a8820c7412e0984a8619bc901a1820984bc19a01e0a98214fa817204918e901",
          eventHash: "7b4c92140a8315ea0112480a8bf72468d6174a810f27305d0458117a3a822001",
          verified: true
        }
      },
      {
        id: "AUD-2026-0042",
        timestamp: "2026-11-22T14:40:00.000Z",
        matterRef: "PRACTICE-GENERAL",
        category: "TRUST_RECONCILIATION",
        severity: "INFO",
        action: "Automated 3-Way Trust Reconciliation Executed",
        actor: {
          type: "SYSTEM",
          name: "Statutory Trust Engine",
          role: "Automated Reconciler",
          ip: "10.14.2.1",
          session: "cron_eod_rec"
        },
        explainability: {
          rationale: "Automated Law Society daily reconciliation run against NAB Direct Trust API. Reconciled cash book against bank statement. Identified single unpresented cheque #004128 to SA Water.",
          confidence: 1.0,
          governingRule: "Legal Practitioners Act 1981 (SA) Schedule 2 & Legal Practitioners Regulations 2014",
          telemetry: {
            traceId: "tr-490211ca9901",
            spanId: "sp-6101",
            durationMs: 310,
            model: "Deterministic Accounting Engine (Zero LLM)"
          }
        },
        payload: {
          bankBalance: "$845,480.00",
          cashBookBalance: "$845,865.00",
          clientSubLedgersTotal: "$845,865.00",
          unpresentedCheques: "$385.00",
          netVariance: "$0.00"
        },
        stateDiff: {
          field: "trust.lastReconciliationDate",
          before: "30/10/2026",
          after: "31/10/2026 (Audited by PKF Adelaide)"
        },
        crypto: {
          prevHash: "1198274091a09e09b1874102984a1029418bc019a82019481029481029481920",
          eventHash: "3a8820c7412e0984a8619bc901a1820984bc19a01e0a98214fa817204918e901",
          verified: true
        }
      }
    ]
  };
}

if (typeof window !== "undefined") {
  window.getInitialData = getInitialData;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { getInitialData };
}
