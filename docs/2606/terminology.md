---
{
  "metadata": {
    "author": "Jeff Langdon",
    "documentName": "The Multiverse Framework Terminology & Taxonomy",
    "targetRuleset": "The Multiverse TTRPG Framework",
    "version": "2606.1.0-bs",
    "parent_ruleset_file": "multiverse.md"
  }
}
---

# The Multiverse Framework Official Terminology & Taxonomy v2606.1.0-bs

This document outlines the official, normalized terminology standard for **The Multiverse TTRPG Framework v2606**. All core rulesets, supplements, web system libraries, and audit workflows MUST adhere strictly to the definitions, units, and conventions codified herein.

---

## 1. Action Economy & Temporal Units

| Standard Term | Definition & Scope | Canonical Usage Rules | Disallowed Variant(s) |
| :--- | :--- | :--- | :--- |
| **Combat Action** | A single proactive effort executed during an initiative turn (e.g. Strike, Hack, Channel, Triage). | Use when referring to turn choices. | *"turn action"*, *"standard action"* |
| **Movement Action** | Repositioning across tactical range bands (Close, Near, Far, Distant). | Dedicated repositioning step. | *"move"*, *"stride"* |
| **Reaction** | Triggered tactical response executed outside one's active turn. | Limit 1 per combat round. | *"interrupt"*, *"counter"* |
| **Combat Round** | Standard tactical time unit (~6 seconds) in which all participants act once. | Use in combat duration headers: `Duration: 1 Combat Round`. | *"round"*, *"battle turn"* |
| **Scene** | Narrative encounter duration (~10–15 minutes) covering a single location or continuous challenge. | Use in narrative duration headers: `Duration: 1 Scene`. | *"encounter"*, *"event"* |
| **Downtime** | Extended recovery and crafting interval at Zero-Point Station or a secured Haven. | Used for EXP expenditure and Trauma clearing. | *"rest"*, *"long rest"* |

---

## 2. Math-Less Resolution Engine

| Standard Term | Definition & Scope | Canonical Usage Rules | Disallowed Variant(s) |
| :--- | :--- | :--- | :--- |
| **Dice Pool** | Array of standard ten-sided dice (d10) formed by Approach allocation + relevant Tags. | Evaluated without arithmetic addition. | *"dice roll"*, *"stat check"* |
| **Success Threshold** | Any die landing on **7, 8, 9, or 10** represents exactly **1 Success**. | Dice landing on 1–6 are failures. | *"DC"*, *"target number"* |
| **Threat Rating** | The fixed number of Successes required to overcome an obstacle or adversary (Rating 1 to 5). | GM sets Threat before dice roll. | *"difficulty class"*, *"armor class"* |
| **Die Stripping** | Tactical penalty mechanism removing the highest rolled die (or dice) from a pool before counting successes. | Used for Disadvantage, cover, and suppressive fire. | *"negative modifier"*, *"penalty"* |
| **Advantage** | Tactical bonus adding +1d10 (or granting a bonus permission) to the active dice pool. | Awarded for superior positioning or narrative leverage. | *"bonus"*, *"plus"* |

---

## 3. The Scale of Reality

| Standard Term | Scale Level | Definition & Scope | Mechanical Impact |
| :--- | :--- | :--- | :--- |
| **Mortal / Baseline** | **Scale 1** | Standard humans, mundane animals, standard kinetic weapons. | Standard 1-to-1 dice resolution. |
| **Enhanced / Cybernetic** | **Scale 2** | Street samurai, mutated supers, tactical power armor. | Strips 1 die from Scale 1 attacks; +1 auto-success vs Scale 1. |
| **Metahuman / Demigod** | **Scale 3** | Elder sorcerers, battle tanks, city-level meta-beings. | Immune to non-piercing Scale 1 attacks; +2 auto-successes vs Scale 1. |
| **Cosmic / Mythic** | **Scale 4** | Star dreadnoughts, lesser deities, planetary leviathans. | Scale 1–2 attacks deal 0 Trauma without specialized Scale Piercing tags. |
| **Conceptual / Absolute** | **Scale 5** | Reality architects, living paradoxes, Void singularities. | Operates outside standard physics; overrides narrative reality. |

---

## 4. Dual-Track Harm System

| Standard Term | Definition & Scope | Canonical Usage Rules | Disallowed Variant(s) |
| :--- | :--- | :--- | :--- |
| **Trauma Track** | 9-stage physical injury and biological/chassis degradation gauge. | Marked 1 to 9. Stage 9 triggers the Death Timer. | *"HP"*, *"hit points"*, *"wounds"* |
| **Stability Track** | 9-stage psychological, cybernetic cohesion, and existential anchoring gauge. | Marked 1 to 9. Stage 9 triggers Catatonia or Paradox Dissolution. | *"sanity"*, *"stress"*, *"morale"* |
| **Death Timer** | Active countdown (usually 3 rounds) initiated when Trauma reaches Stage 9 before permanent death. | Requires Mid-Combat Triage or stabilization. | *"bleedout"*, *"death saves"* |
| **Mid-Combat Triage** | Emergency field action (once per encounter) to arrest the Death Timer and downgrade Trauma to Stage 8. | Restores conscious functioning with Severe penalties. | *"healing"*, *"revive"* |

---

## 5. Universal Tag-Permission Taxonomy

All mechanics in The Multiverse operate via structured tags enclosed in square brackets:

| Tag Prefix | Scope & Description | Example |
| :--- | :--- | :--- |
| **`[Origin: ...]`** | Character's native home reality and cosmological physics laws. | `[Origin: Cyber-Earth 2099]`, `[Origin: Forgotten Realms]` |
| **`[Trait: ...]`** | Innate biological, psychic, or cybernetic faculties. | `[Trait: Darkvision]`, `[Trait: Sub-Dermal Armor]` |
| **`[Gear: ...]`** | Physical equipment, weapons, armor, and gadgets. | `[Gear: Plasma Carbine]`, `[Gear: Void-Suit]` |
| **`[Domain: ...]`** | Conceptual or magical mastery over an element or reality facet. | `[Domain: Pyromancy]`, `[Domain: Chronomancy]` |
| **`[Scale: ...]`** | Explicit reality scale tier granted to a weapon, power, or armor. | `[Scale: Enhanced]`, `[Scale: Metahuman]` |

---

*Last Updated: 2026-08-14 | Framework Version: 2606.1.0-bs*
