# The Multiverse TTRPG Framework

[![Framework Version](https://img.shields.io/badge/Ruleset_Version-2606.1.0--bs-8b5cf6.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/License-JLDN_Proprietary-blue.svg)](LICENSE.md)
[![CI Pipeline](https://img.shields.io/badge/CI-Passing-emerald.svg)](.github/workflows/lint.yml)

Welcome to the **System Reference Document (SRD) & Core Framework for The Multiverse TTRPG**.

The Multiverse is a math-less, tag-based d10 dice pool engine designed specifically for seamless cross-genre compatibility. Whether running high fantasy, gritty cyberpunk, cosmic space-opera, or mashing them all together in dimensional rifts, the Unified Tag-Permission System ensures seamless integration of conflicting realities.

---

## Core Design Philosophy

* **Math-Less Mechanics:** Success is never about calculating floating numerical modifiers. A **7+ on a d10 is a Success**. Difficulty is represented physically on the front end by stripping dice from the pool (Disadvantage) or granting tactical bonus dice (Advantage).
* **The Unified Tag System:** Everything from armor and damage domains to biological composition and magic is handled through standardized tags (`[Origin:]`, `[Trait:]`, `[Gear:]`, `[Domain:]`, `[Scale:]`).
* **Scale Dominance & Friction:** Power scaling is handled vertically via Power Scales (Scale 1 to 4), dictating exactly what happens when a medieval knight attacks a main battle tank or a cosmic godhead.
* **Dual-Track Harm:** Replaces arbitrary hit points with the **9-Stage Trauma Track** (biotic biological harm) and **9-Stage Stability Track** (synthetic software/stress degradation).
* **The 1+1+1+2+1 Character Baseline:** Structured modular character creation providing 1 Origin + 1 Race + 1 Class + 2 Path + 1 Background tag permissions.

---

## Authoritative Documentation & Ruleset (`docs/2606/`)

### 📖 Master Core Ruleset
* **[The Multiverse Master Ruleset (docs/2606/multiverse.md)](docs/2606/multiverse.md)**
  * **Chapter 1: The Shattered Cosmos** ([The Shattering](docs/2606/multiverse.md#the-shattering) • [Zero-Point Station](docs/2606/multiverse.md#zero-point-station) • [Factions & The Rift-Guard](docs/2606/multiverse.md#factions-and-the-rift-guard) • [The Grand Purpose](docs/2606/multiverse.md#the-grand-purpose))
  * **Chapter 2: The Laws of Reality** ([Core Resolution](docs/2606/multiverse.md#core-resolution) • [The Action Economy](docs/2606/multiverse.md#the-action-economy) • [The Status Manifest & Body Map](docs/2606/multiverse.md#the-status-manifest) • [The Threat System](docs/2606/multiverse.md#the-threat-system) • [Power Scales & Friction](docs/2606/multiverse.md#the-scale-of-reality))
  * **Chapter 3: The Wayfarer’s Path** ([Identity & Origins](docs/2606/multiverse.md#identity-and-origins) • [Tag-Permission Registry](docs/2606/multiverse.md#the-tag-permission-registry) • [Approaches & 12-Die Array](docs/2606/multiverse.md#approaches-and-arrays) • [Advancement & EXP](docs/2606/multiverse.md#advancement-and-exp) • [Equipment & Slots](docs/2606/multiverse.md#equipment-and-slots))
  * **Chapter 4: Adversaries & Threat Profiles** ([Running Adversaries](docs/2606/multiverse.md#running-adversaries) • [Adversary Hierarchy & Morale](docs/2606/multiverse.md#running-adversaries))
  * **Chapter 5: Appendices & Mechanics** ([Character Sheet Template](docs/2606/multiverse.md#character-sheet-template) • [Governance & Factions](docs/2606/multiverse.md#governance-and-factions) • [Damage Domains](docs/2606/multiverse.md#interaction-and-damage) • [Cross-Universe Physics](docs/2606/multiverse.md#cross-universe-physics) • [The Economy](docs/2606/multiverse.md#the-economy) • [Integration Tiers](docs/2606/multiverse.md#integration-tiers))
* **[Official Terminology & Taxonomy Glossary (docs/2606/terminology.md)](docs/2606/terminology.md)**

---

### 🌌 The Infinite Archive (Conversion Supplements)

Modular downstream conversion matrices mapping foreign TTRPG rulesets into the math-less Tag Engine:

* **[Infinite Archive Overview](docs/2606/supplements/archive_overview.md)**
* **[Dungeons & Dragons 5e](docs/2606/supplements/archive_dnd_5e.md)**
  * [Conditions & Backgrounds](docs/2606/supplements/archive_dnd_conditions_backgrounds.md)
  * [Feats & Skills](docs/2606/supplements/archive_dnd_feats_skills.md)
  * [Racial Features](docs/2606/supplements/archive_dnd_racial_features.md)
  * [Class Features](docs/2606/supplements/archive_dnd_class_features.md)
* **[Cyberpunk RED](docs/2606/supplements/archive_cyberpunk_red.md)**
* **[Rifts](docs/2606/supplements/archive_rifts.md)**
* **[Warhammer 40,000](docs/2606/supplements/archive_warhammer_40k.md)**
* **[Vampire: The Masquerade](docs/2606/supplements/archive_vtm.md)**
* **[Pathfinder 2e](docs/2606/supplements/archive_pathfinder_2e.md)**
* **[Starfinder](docs/2606/supplements/archive_starfinder.md)**
* **[Call of Cthulhu](docs/2606/supplements/archive_call_of_cthulhu.md)**
* **[Shadowrun](docs/2606/supplements/archive_shadowrun.md)**

---

## Presentation & Publishing Layer

* **CSS Paged Media & PDF Staging:** Internal book layouts, HTML sources, and PDF rendering reside under `.books/2606/` transitioning to `books/2606/` upon public release.
* **Web Documentation Viewer & Character Tools:** Dynamic Next.js documentation viewer and character sheet parser engine located in `_web/`.

---

## Developer Governance & Contributing

* **[Unified Agent Governance (.agents/AGENTS.md)](.agents/AGENTS.md)**
* **[Generation 2606 Strategic Roadmap (.dev/ROADMAP.md)](.dev/ROADMAP.md)**
* **[Master Backlog Dataset (.dev/2606/backlog.json)](.dev/2606/backlog.json)**
* **[Contributor Guidelines (CONTRIBUTING.md)](CONTRIBUTING.md)**
* **[Changelog (CHANGELOG.md)](CHANGELOG.md)**

---

*Author: Jeff Langdon | The Multiverse TTRPG Framework © JLDN*
