# The Multiverse TTRPG Framework (v2606.1.0-bs)

[![CI Status](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/actions/workflows/lint.yml/badge.svg)](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/actions/workflows/lint.yml)
[![GVS Version](https://img.shields.io/badge/GVS-2606.1.0--bs-8b5cf6.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/License-JLDN_Proprietary-blue.svg)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

![System Agnostic](https://img.shields.io/badge/System-Agnostic-2d132c.svg)
![Science Fiction](https://img.shields.io/badge/Genre-Sci--Fi-0f3460.svg)
![High Fantasy](https://img.shields.io/badge/Genre-High%20Fantasy-1a1a2e.svg)
![Cyberpunk](https://img.shields.io/badge/Genre-Cyberpunk-4a0e17.svg)
![Cosmic Horror](https://img.shields.io/badge/Genre-Cosmic%20Horror-53354a.svg)

Welcome to the **System Reference Document (SRD) & Core Framework for The Multiverse TTRPG** (JLDN Generational Versioning Schema: `2606.1.0-bs`).

---

## Overview

The Multiverse TTRPG is a math-less, tag-based d10 dice pool engine designed specifically for seamless cross-genre compatibility. Whether running high fantasy, gritty cyberpunk, cosmic space-opera, or mashing them all together in dimensional rifts, the Unified Tag-Permission System ensures seamless integration of conflicting realities.

* **Author:** Jeff Langdon (JL Design Network)
* **Ruleset Version:** `2606.1.0-bs` (Official Beta Supported)

---

## Repository Workspace Layout

### 📖 Source Documents (`docs/2606/`)
* 📄 **[The Multiverse Master Ruleset](docs/2606/multiverse.md):** `docs/2606/multiverse.md`
  * **Chapter 1: The Shattered Cosmos** ([The Shattering](docs/2606/multiverse.md#the-shattering) • [Zero-Point Station](docs/2606/multiverse.md#zero-point-station) • [Factions & The Rift-Guard](docs/2606/multiverse.md#factions-and-the-rift-guard) • [The Grand Purpose](docs/2606/multiverse.md#the-grand-purpose))
  * **Chapter 2: The Laws of Reality** ([Core Resolution](docs/2606/multiverse.md#core-resolution) • [The Action Economy](docs/2606/multiverse.md#the-action-economy) • [The Status Manifest & Body Map](docs/2606/multiverse.md#the-status-manifest) • [The Threat System](docs/2606/multiverse.md#the-threat-system) • [Power Scales & Friction](docs/2606/multiverse.md#the-scale-of-reality))
  * **Chapter 3: The Wayfarer’s Path** ([Identity & Origins](docs/2606/multiverse.md#identity-and-origins) • [Tag-Permission Registry](docs/2606/multiverse.md#the-tag-permission-registry) • [Approaches & 12-Die Array](docs/2606/multiverse.md#approaches-and-arrays) • [Advancement & EXP](docs/2606/multiverse.md#advancement-and-exp) • [Equipment & Slots](docs/2606/multiverse.md#equipment-and-slots))
  * **Chapter 4: Adversaries & Threat Profiles** ([Running Adversaries](docs/2606/multiverse.md#running-adversaries) • [Adversary Hierarchy & Morale](docs/2606/multiverse.md#running-adversaries))
  * **Chapter 5: Appendices & Mechanics** ([Character Sheet Template](docs/2606/multiverse.md#character-sheet-template) • [Governance & Factions](docs/2606/multiverse.md#governance-and-factions) • [Damage Domains](docs/2606/multiverse.md#interaction-and-damage) • [Cross-Universe Physics](docs/2606/multiverse.md#cross-universe-physics) • [The Economy](docs/2606/multiverse.md#the-economy) • [Integration Tiers](docs/2606/multiverse.md#integration-tiers))
* 📚 **[Terminology & Glossary](docs/2606/terminology.md):** `docs/2606/terminology.md`
* 📝 **[Master Framework Changelog](CHANGELOG.md):** `CHANGELOG.md`

### 🌌 The Infinite Archive (Conversion Supplements) (`docs/2606/supplements/`)
* 🌌 **[Infinite Archive Overview](docs/2606/supplements/archive_overview.md):** Rift-beasts, universal tags, and cross-contamination hazards.
* 🐉 **[Dungeons & Dragons 5e Matrix](docs/2606/supplements/archive_dnd_5e.md):** Core races, classes, and spellbook mechanics.
  * [Conditions & Backgrounds](docs/2606/supplements/archive_dnd_conditions_backgrounds.md)
  * [Feats & Skills](docs/2606/supplements/archive_dnd_feats_skills.md)
  * [Racial Features](docs/2606/supplements/archive_dnd_racial_features.md)
  * [Class Features](docs/2606/supplements/archive_dnd_class_features.md)
* 🦾 **[Cyberpunk RED Matrix](docs/2606/supplements/archive_cyberpunk_red.md):** Cyberware installation, Humanity loss, and Netrunning subroutines.
* ⚡ **[Rifts Matrix](docs/2606/supplements/archive_rifts.md):** Mega-Damage (M.D.C.) to Power Scale 3 conversion and Ley Line magic.
* ⚔️ **[Warhammer 40,000 Matrix](docs/2606/supplements/archive_warhammer_40k.md):** Power armor, Warp perils, and Grimdark archetypes.
* 🩸 **[Vampire: The Masquerade Matrix](docs/2606/supplements/archive_vtm.md):** Clan Disciplines, Blood Hunger, and Torpor mechanics.
* 🏹 **[Pathfinder 2e Matrix](docs/2606/supplements/archive_pathfinder_2e.md):** Ancestries, Class feats, and 3-action economy alignment.
* 🚀 **[Starfinder Matrix](docs/2606/supplements/archive_starfinder.md):** Alien species, stellar magic, and starship scales.
* 🐙 **[Call of Cthulhu Matrix](docs/2606/supplements/archive_call_of_cthulhu.md):** Sanity, psychological status manifestations, and cosmic dread.
* 💻 **[Shadowrun Matrix](docs/2606/supplements/archive_shadowrun.md):** Awakened magic, Matrix decking, and cybernetic rigging.

### 📦 Published Books & Presentation Layer (`books/2606/`)
* 📕 **Compiled Rulebooks & HTML/PDF Publications:** `books/2606/` (Staged internally in `.books/2606/` during development; published upon official release).
* 💻 **Web Application & Character Parser:** Next.js dynamic doc viewer and JSON system library toolchain (staged internally in `.web/`).

---

## Core Features & Design Philosophy

* **Math-Less Mechanics:** Success is never about calculating floating numerical modifiers. A **7+ on a d10 is a Success**. Difficulty is represented physically on the front end by stripping dice from the pool (Disadvantage) or granting tactical bonus dice (Advantage).
* **The Unified Tag System:** Everything from armor and damage domains to biological composition and magic is handled through standardized tags (`[Origin:]`, `[Trait:]`, `[Gear:]`, `[Domain:]`, `[Scale:]`).
* **Scale Dominance & Friction:** Power scaling is handled vertically via Power Scales (Scale 1 to 4), dictating exactly what happens when a medieval knight attacks a main battle tank or a cosmic godhead.
* **Dual-Track Harm:** Replaces arbitrary hit points with the **9-Stage Trauma Track** (biotic biological harm) and **9-Stage Stability Track** (synthetic software/stress degradation).
* **The 1+1+1+2+1 Character Baseline:** Structured modular character creation providing 1 Origin + 1 Race + 1 Class + 2 Path + 1 Background tag permissions.

---

## 📜 Recent Release History (GVS)

| Version | Release Date | Lifecycle Stage | Key Milestone / Mechanical Scope |
| :--- | :---: | :---: | :--- |
| **`2606.1.0-bs`** | 2026-08-14 | `Beta Supported` | Canonical `docs/2606/` SRD restructure, 14 Infinite Archive supplements, micro-anchoring, and Red Team audits |

👉 *For full historical release notes across all versions, see the complete **[CHANGELOG.md](CHANGELOG.md)**.*

---

## Contributing & Community Guidelines

We welcome community feedback, balance errata, and new modular conversion supplement submissions! Please review our **[Contribution Guidelines (CONTRIBUTING.md)](CONTRIBUTING.md)** for details on submission pathways, Markdown formatting standards, and pull request workflows.

---

## License & Attribution

Designed and maintained by Jeff Langdon / JL Design Network. See [LICENSE.md](LICENSE.md) for licensing terms. All rights reserved.
