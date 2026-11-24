# Governance Rule: Zero Unconfirmed Relationship Modifications

```yaml
rule:
  id: RULE-GOV-001
  name: Zero Unconfirmed Relationship Modifications
  enforcement: MANDATORY_STRICT
  scope: GLOBAL (ALL CONTACTS, PARTIES, TITLES & RELATIONSHIPS)
```

---

## Universal Mandate
**APPLIES TO ALL CONTACTS AND ALL RELATIONSHIP UPDATES WITHOUT EXCEPTION:**

1. **Zero Silent Modifications**: NEVER modify, create, infer, or delete any contact or party relationship in the database, storage, state, or code without explicit practitioner confirmation.
2. **Explicit User Approval for Inferred Relations**: Whenever inferring ANY relationship information across ANY contacts (e.g., spouse linking, parent-child couple linking, sibling deduction, reciprocal connections, or auto-healing), the agent MUST explicitly highlight the inferred change to the user and request confirmation first.
3. **Strict Prohibition**: Silent or unconfirmed relationship manipulation, hardcoded synthetic links, or background relationship mutations are strictly prohibited across all operations, present and future. Only on the user's explicit approval may any relationship be modified.
