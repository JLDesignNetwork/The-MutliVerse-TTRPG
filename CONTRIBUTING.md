# Contributing to The Multiverse TTRPG Framework

Thank you for your interest in contributing to **The Multiverse TTRPG Framework**! We welcome community contributions, balance stress-testing, cross-system conversion matrices, bug reports, and new lore archives.

This document outlines the architecture, standards, and submission guidelines for contributing to this repository.

---

## 1. Guiding Philosophy & Architecture

The Multiverse TTRPG Framework is engineered around core non-negotiable principles:

1. **Math-less Core Resolution:** Success is determined by rolling 7+ on a d10 pool. Difficulty is physically represented by stripping dice from the pool or invoking tags.
2. **Unified Tag System:** All mechanical interactions (origins, traits, gear, domains, power scales) are expressed via standardized tags (e.g. `[Origin: Synthetic]`, `[Trait: Defense Ablative 3]`, `[Domain: Kinetic]`, `[Scale: 2]`).
3. **Separation of Concerns (SoC):**
   * **Core Documentation & Ruleset (`docs/2606/`):** The authoritative Source of Truth for base math, approaches, threat mechanics, and conversion baselines. Pure Markdown.
   * **Presentation Layer (`.books/2606/` &rarr; `books/2606/`):** Book compilation, print layout, CSS Paged Media themes, and PDF compilation.
   * **Web Application (`.web/`):** Next.js viewer, dynamic rules renderer, and JSON system libraries (`.web/config/systems/`).

---

## 2. Contribution Pathways

We accept four primary types of contributions via GitHub:

### Pathway A: Mechanical Bug & Contradiction Reports
* **How to Submit:** Open a [GitHub Issue](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/issues).
* **Scope:** Action economy loopholes, tag permission conflicts, mathematical contradictions, or broken cross-references.
* **Format:** Clearly cite the document path, section header, the specific mechanical loophole, and a proposed fix.

### Pathway B: Ruleset Balance & Clarification Fixes
* **How to Submit:** Open a [Pull Request (PR)](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/pulls).
* **Scope:** Typo corrections, clarity refactors, and minor balance adjustments to `docs/2606/` or supplements.
* **Requirement:** Must preserve the 7+ d10 resolution threshold and tag permission standards.

### Pathway C: New System Conversion Archives
* **How to Submit:** Open a [Pull Request (PR)](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/pulls) adding a new conversion archive to `docs/2606/supplements/` and corresponding JSON system library in `.web/config/systems/`.
* **Requirements:**
  * Must map classes, roles, or archetypes cleanly into the Tag-Permission framework.
  * Must conform to the `SystemLibrary.ts` schema if contributing web configuration.

### Pathway D: Print Themes & Layout Enhancements
* **How to Submit:** Open a [Pull Request (PR)](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/pulls) targeting `.books/2606/` (or `books/2606/`).
* **Requirement:** Must validate on both US Letter and A4 formats.

---

## 3. Mandatory Editorial & Formatting Standards

All pull requests must adhere to the following technical formatting rules:

### A. Markdown Standards
* Use standard **GitHub Flavored Markdown (GFM)**.
* Format data tables cleanly using standard markdown table syntax (`| Header | Header |`).
* Ensure all files use **LF (Unix)** line endings (enforced by `.gitattributes`).

### B. Micro-Anchoring & Direct Linking
* Power, tag, condition, approach, or archive entries should include line-level micro-anchors (`<a id="slug"></a>`) to enable direct cross-referencing without polluting table of contents headers.

---

## 4. Git Commit & PR Workflow

* Keep commits atomic and descriptive:
  * `Fix [DOMAIN]-TODO-XX: [Description of change]`
  * `[DOCS-TODO-XX] Red Team Audit: [Document Name] — [N] findings registered`
* Ensure all CI quality checks pass (`python3 .github/scripts/validate_workspace.py`) before requesting review.

---

*Last Updated: 2026-06-17 | Ruleset Version: 2606.1.0-bs*
