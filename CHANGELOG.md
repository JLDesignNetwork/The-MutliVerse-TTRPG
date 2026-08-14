# Changelog - The Multiverse TTRPG Framework

All notable changes to The Multiverse TTRPG framework are documented in this file.

The versioning follows the [JLDN Generational Versioning Schema](https://github.com/JLDesignNetwork/Generational-Versioning-Schema) format (`[YYMM].[SUBVERSION].[REVISION]-[TAG]`).

---

### 2606.1.0-bs (2026-08-14) - Beta Supported Baseline (Modular SRD Architecture & Unified Governance)

**Official Beta baseline release executing `DOCS-TODO-01` through `DOCS-TODO-13` and `PROJ-TODO-01` through `PROJ-TODO-08`. Formally established the JLDN Unified Developer Standards, Agent Governance architecture, modular `docs/2606/` SRD ruleset, 14 Infinite Archive conversion matrices, and automated CI Quality & Link Validator.**

#### Added
- **Modular `docs/2606/` SRD Architecture (`DOCS-TODO-06`):** Modularized Books I through V (Setting, Laws of Reality, Wayfarer's Path, Adversaries, Appendices) into dedicated directories with `multiverse.md` master entry point and navigation matrix.
- **The Infinite Archive Supplements (`DOCS-TODO-03`, `DOCS-TODO-07`):** Codified 14 unabridged cross-system conversion supplements under `docs/2606/supplements/` with standardized JLDN JSON frontmatter metadata.
- **Micro-Anchoring & Deep Red Team Audits (`DOCS-TODO-08`–`DOCS-TODO-13`):** Added 226+ HTML line-level micro-anchors across all markdown files and executed stress-test audits across all 5 books.
- **`.agents/AGENTS.md` & Governance (`PROJ-TODO-01`, `PROJ-TODO-03`):** Codified authoritative 3-part agent governance configuration, `CONTRIBUTING.md`, `LICENSE.md`, and unified `[DOMAIN]-[TYPE]-[NN]` taxonomy.
- **`.dev/` Generational Hub (`PROJ-TODO-04`, `PROJ-TODO-06`, `PROJ-TODO-07`):** Established Generation 2606 hub containing master roadmap, unified backlogs, ideas register, and chapter blueprint maps.
- **`.github/` CI/CD Pipeline (`PROJ-TODO-02`, `PROJ-TODO-08`):** Implemented automated Python validator (`validate_workspace.py`) auditing JSON schemas, frontmatter linkages, micro-anchors, and markdown links.
- **Monorepo Package Configuration (`PROJ-TODO-05`):** Standardized `pnpm-workspace.yaml` with internal web toolchain package configuration.
