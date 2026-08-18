# MultiVerse TTRPG — Architecture & Systems Topology

> **Document:** `docs/architecture.md`  
> **Author:** Jeff Langdon (JL Design Network)  
> **Generation:** `2606`  

---

## 1. The 4-Book System Architecture

The MultiVerse TTRPG is organized into a modular four-book structure within `docs/2606/`:

1. **Book I: The Shattered Cosmos (`01-Book-I-The-Shattered-Cosmos/`)**
   - Planar geography, the Great Weave, the Void, and Shard cosmology.
   - Dimensional turbulence, environmental hazard tiers, and reality tears.
2. **Book II: The Laws of Reality (`02-Book-II-The-Laws-of-Reality/`)**
   - Core d20/dice-pool resolution engine, attribute ratings, and skill trees.
   - Dynamic action economy (Standard, Movement, Reaction, Upkeep).
   - Combat physics, damage types (Kinetic, Aetheric, Void, Chrono), and trauma states.
3. **Book III: The Wayfarer's Path (`03-Book-III-The-Wayfarers-Path/`)**
   - Ancestries, cosmic backgrounds, and class paths.
   - Tiered abilities, spellcasting circles, and dimensional artifacts.
4. **Book IV: Adversaries & Entities (`04-Book-IV-Adversaries/`)**
   - Threat rating scales, adversary stat blocks, and legendary encounter mechanics.

---

## 2. Next.js Web Companion Monorepo (`apps/web/`)

The repository operates as a PNPM monorepo hosting both documentation and the digital companion:
- **Framework:** Next.js 15 (React 19 + TypeScript)
- **Engine:** Google GenAI integration for dynamic shard/character generation
- **Compilation:** `html2pdf.js` for exporting character sheets and ruleset excerpts
- **Root Scripts:** `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`
