---
name: stamp-duty-calculation
description: Computes South Australian statutory stamp duty, first home buyer exemptions, and tiered relief under Section 14B.
---

# Stamp Duty Calculation Skill

## Statutory Rules (South Australia)
Under the *Stamp Duties Act 1923 (SA)* and the *Stamp Duties (Relief Measures) Amendment Act 2024 (SA)* (effective June 2024):

### Formula:
* **First Home Buyer Exemption**: Properties with purchase price up to **$650,000.00** receive a **100% full exemption** ($0.00 stamp duty payable).
* **Tiered Relief Window**: Properties between **$650,001.00 and $700,000.00** receive phased fractional relief:
  $$\text{Relief Amount} = \text{Standard Duty} \times \left(1 - \frac{\text{Purchase Price} - \$650,000}{\$50,000}\right)$$
* **Over $700,000.00**: Standard full ad valorem statutory duty rates apply.

### Example:
* Purchase Price: **$680,000.00**
* Standard Duty: **$28,450.00**
* Tiered Relief Applied: Tiered relief factor $\frac{700,000 - 680,000}{50,000} = 40\%$
* Estimated Practitioner Advisory: Identifies eligible relief and prompts practitioner to lodge Form FHB with RevenueSA.
