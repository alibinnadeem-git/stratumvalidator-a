# STRATUM PoVI compatibility production activation — 2026-09-20

This release marker requests production deployment of the current reviewed main branch.

Production acceptance target:
- PROPOSE → VERIFY → LOCK → COMMIT → FINALIZE compatibility flow
- 3 active validators with required quorum 3
- PLC/PFC evidence
- peer-only Validator B/C signing endpoints
- Validator A public PoVI anchor
- no claim that cryptographic finality independently establishes physical truth

No consensus semantics are changed by this marker.
