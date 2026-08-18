# The Multiverse TTRPG Framework (v2606.1.0-bs)

[![CI Status](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/actions/workflows/ci.yml/badge.svg)](https://github.com/JLDesignNetwork/The-MutliVerse-TTRPG/actions/workflows/ci.yml)
[![GVS Version](https://img.shields.io/badge/GVS-2606.1.0--bs-8b5cf6.svg)](CHANGELOG.md)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/jldesignnetwork)
[![License](https://img.shields.io/badge/License-JLDN_Proprietary-blue.svg)](LICENSE.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)

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

### 📚 Documentation & Quick Links
- 📖 **[Knowledge Base Wiki Index](docs/index.md):** Complete documentation navigator and mechanics overview.
- 🏗️ **[Ruleset & Web Architecture](docs/architecture.md):** Cosmology topology, 4-Book system, and Next.js web application.
- 🛠️ **[Game Master & Developer Guide](docs/usage.md):** Campaign running rules and Next.js local development workflows.
- 🗺️ **[Strategic Roadmap](.dev/ROADMAP.md):** Multi-generational development horizons.

---

## Repository Workspace Layout

### 📖 Core Ruleset Books (`docs/2606/`)
* 📄 **[Master Ruleset Reference & Navigation Matrix](docs/2606/multiverse.md):** `docs/2606/multiverse.md`
* 🪐 **Book I: The Shattered Cosmos** (`docs/2606/01-Book-I-The-Shattered-Cosmos/`)
  * [01 - The Shattering](docs/2606/01-Book-I-The-Shattered-Cosmos/01-The-Shattering.md) • [02 - Zero-Point Station](docs/2606/01-Book-I-The-Shattered-Cosmos/02-Zero-Point-Station.md) • [03 - Factions & The Rift-Guard](docs/2606/01-Book-I-The-Shattered-Cosmos/03-Factions-and-The-Rift-Guard.md) • [04 - The Grand Purpose](docs/2606/01-Book-I-The-Shattered-Cosmos/04-The-Grand-Purpose.md)
* ⚖️ **Book II: The Laws of Reality** (`docs/2606/02-Book-II-The-Laws-of-Reality/`)
  * [01 - Core Resolution](docs/2606/02-Book-II-The-Laws-of-Reality/01-Core-Resolution.md) • [02 - The Action Economy](docs/2606/02-Book-II-The-Laws-of-Reality/02-The-Action-Economy.md) • [03 - The Status Manifest](docs/2606/02-Book-II-The-Laws-of-Reality/03-The-Status-Manifest.md) • [04 - The Threat System](docs/2606/02-Book-II-The-Laws-of-Reality/04-The-Threat-System.md) • [05 - The Scale of Reality](docs/2606/02-Book-II-The-Laws-of-Reality/05-The-Scale-of-Reality.md)
* 🧭 **Book III: The Wayfarer's Path** (`docs/2606/03-Book-III-The-Wayfarers-Path/`)
  * [01 - Identity & Origins](docs/2606/03-Book-III-The-Wayfarers-Path/01-Identity-and-Origins.md) • [02 - The Tag-Permission Registry](docs/2606/03-Book-III-The-Wayfarers-Path/02-The-Tag-Permission-Registry.md) • [03 - Approaches & Arrays](docs/2606/03-Book-III-The-Wayfarers-Path/03-Approaches-and-Arrays.md) • [04 - Advancement & EXP](docs/2606/03-Book-III-The-Wayfarers-Path/04-Advancement-EXP.md) • [05 - Equipment & Slots](docs/2606/03-Book-III-The-Wayfarers-Path/05-Equipment-and-Slots.md)
* 👾 **Book IV: Adversaries** (`docs/2606/04-Book-IV-Adversaries/`)
  * [01 - Running Adversaries](docs/2606/04-Book-IV-Adversaries/01-Adversaries.md)
* 📑 **Book V: Appendices** (`docs/2606/05-Appendices/`)
  * [01 - Character Sheet Template](docs/2606/05-Appendices/01-Character-Sheet-Template.md) • [02 - Governance & Factions](docs/2606/05-Appendices/02-Governance.md) • [03 - Interaction & Damage](docs/2606/05-Appendices/03-Interaction-and-Damage.md) • [04 - Cross-Universe Physics](docs/2606/05-Appendices/04-Cross-Universe-Physics.md) • [05 - The Economy](docs/2606/05-Appendices/05-The-Economy.md) • [06 - Integration Tiers](docs/2606/05-Appendices/06-Integration-Tiers.md)
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

### 📦 Published Books & Web Layer (`books/2606/` & `apps/web/`)
* 📕 **Compiled Rulebooks & HTML/PDF Publications:** `books/2606/` (Staged internally in `.books/2606/` during development; published upon official release).
* 💻 **Web Application & Character Parser:** Next.js dynamic doc viewer and JSON system library toolchain (`apps/web/`).

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

We welcome community feedback, balance errata, and new modular conversion supplement submissions! Please review our **[Contribution Guidelines (.github/CONTRIBUTING.md)](.github/CONTRIBUTING.md)** for details on submission pathways, Markdown formatting standards, and pull request workflows.

---

## License & Attribution

Designed and maintained by Jeff Langdon / JL Design Network. See [LICENSE.md](LICENSE.md) for licensing terms. All rights reserved.
