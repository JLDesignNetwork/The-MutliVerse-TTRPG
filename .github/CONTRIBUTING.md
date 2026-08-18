# Contributing to The MultiVerse TTRPG

Thank you for contributing to **The MultiVerse TTRPG**! Please review the guidelines below.

---

## 1. Ruleset & Code Invariants

1. **Source of Truth:** `docs/2606/` contains the authoritative SRD mechanics. Code in `.web/` must conform to the rules defined in `docs/`.
2. **Generational Task Tracking:** All work items are tracked in `.dev/2606/backlog.json` adhering to the `DOCS-TODO-XX`, `WEB-TODO-XX`, and `PROJ-TODO-XX` taxonomy.
3. **Monorepo Workflow:** Use `pnpm` exclusively across all workspace packages.
4. **GVS Versioning:** All releases adhere to GVS format (`[YYMM].[SUBVERSION].[REVISION]-[TAG]`).
