# Changelog - The Multiverse TTRPG Framework

All notable changes to The Multiverse TTRPG framework are documented in this file.

The versioning follows the [JLDN Generational Versioning Schema](https://github.com/JLDesignNetwork/Generational-Versioning-Schema) format (`[YYMM].[SUBVERSION].[REVISION]-[TAG]`).

---

### 2606.1.0-bs (2026-06-17) - Beta Supported Baseline (Dev Standards & Unified Governance)

**Initial Beta baseline release executing `PROJ-TODO-01` through `PROJ-TODO-04`. Formally established the JLDN Unified Developer Standards, Agent Governance architecture (`.agents/AGENTS.md`), Generational Hub (`.dev/2606/`), and automated GitHub Actions CI Quality & Link Validator (`.github/`).**

#### Added
- **`.agents/AGENTS.md`:** Codified authoritative 3-part agent governance configuration covering workspace execution rules, presentation layer protocols, and ruleset/web architecture protocols.
- **`.dev/` Generational Hub:** Established Generation 2606 hub containing master roadmap (`ROADMAP.md`), unified task registers (`backlog.json`), ideas registers (`ideas.json`), and chapter blueprints (`book-maps/`).
- **`.github/` CI/CD Pipeline:** Created GitHub Actions workflow (`.github/workflows/lint.yml`) and automated Python audit validator (`.github/scripts/validate_workspace.py`) to verify markdown links, micro-anchors, and backlog schemas.
- **Repository Governance:** Added standardized `.gitattributes` (LF line endings), `.gitignore` policies, `CONTRIBUTING.md`, `LICENSE.md`, and `CHANGELOG.md`.
- **Core Ruleset Baseline:** Stabilized Books I through IV and Appendices covering the math-less d10 resolution engine, Tag-Permission Framework, 12-Die Approach arrays, and the Infinite Archive cross-genre conversion matrices.
