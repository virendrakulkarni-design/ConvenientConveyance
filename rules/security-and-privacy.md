# Governance Rule: Security, Privacy & PII Masking

```yaml
rule:
  id: RULE-SEC-001
  name: Security, Privacy & PII Masking
  enforcement: MANDATORY_STRICT
  compliance: Privacy Act 1988 (Cth), Australian Privacy Principles (APPs)
```

---

## 1. Personally Identifiable Information (PII) Protection
Conveyancing files contain highly sensitive personal and financial data. All agents, logging pipelines, and telemetry handlers must observe strict masking:

1. **Tax File Numbers (TFN)**: Strict redaction. TFNs must NEVER appear in prompt histories, vector store embeddings, or client logs.
2. **Identity Verification Documents (Passports, Driver Licences)**:
   - Document numbers are masked in UI and logs (e.g., `PA*****409`, `S1****8B`).
   - Facial biometric match scores are stored as mathematical floats, never raw image vectors in relational tables.
3. **Bank Account Details**:
   - Client BSB and Account numbers must be displayed masked (e.g., `BSB 085-*** Acc ****4128`) except during authenticated 2FA practitioner signoff.

---

## 2. Credential Vault & Third-Party APIs
* No API keys or tokens (PEXA, SAILIS, SA Water, Stripe) may be hardcoded or logged.
* All integrations must resolve secrets from environment vaults with per-tenant encryption.
