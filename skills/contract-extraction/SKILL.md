---
name: contract-extraction
description: Ingestion and extraction rules for South Australian REISA Contracts of Sale and Form 1 disclosure statements.
---

# Contract Extraction Skill

## Instructions
1. Parse the uploaded residential or commercial property contract PDF.
2. Extract the 14 mandatory statutory parameters:
   - Certificate of Title Reference (CT Volume/Folio)
   - Vendor(s) and Purchaser(s) Full Names
   - Property Parcel Description (Lot / Plan / Hundred)
   - Purchase Price & Deposit Amount
   - Deposit Holder (Statutory Trust / Stakeholder)
   - Settlement Date & Cooling-Off Period Expiry
   - Special Conditions (Subject to Finance, Building & Pest, Encumbrances)
3. Calculate confidence weights across each extracted token.
4. Prepare the Visual Diff payload for practitioner review.
