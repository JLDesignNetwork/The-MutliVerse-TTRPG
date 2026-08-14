# 02 - The Action Economy

> "A bullet travels faster than a spell. A thought travels faster than both. Act first or don't act at all."
> — Intercepted Transmission, Wayfarer Designation: 'Vagabond'

Combat and high-stakes encounters are structured around Actions Points (AP) and fluid initiative.

## Initiative & Turn Order

### The Engagement
Combat begins with a defining action. If there is a neutral standoff, the first actor is determined by the following hierarchy:
1. **Scale Dominance:** The entity with the highest Power Scale acts first.
2. **Sensory & Spatial Permissions:** Environmental tags dictate advantage (e.g., an entity with [Trait: Darkvision] in pitch black acts before a blinded enemy).
3. **The Vector Clash:** If all else is equal, compare the base Vector approaches.

### The Handoff (Popcorn Initiative)
Once a character finishes their turn, they choose who acts next—an ally or an enemy—among those who haven't acted yet this round. The last character to act in a round chooses who begins the next round.

### Interrupts & Reactions
* You may spend a [System: Momentum Token] to steal the turn and act immediately.
* Characters may hold up to 1 AP from their turn to be used as a Reaction during the following round.

## Action Points (AP)

Every entity operates on a baseline of **3 Action Points (AP)** per turn.

### 2 AP Costs
* **1 AP:** Move, standard attack, swap weapon, or basic maneuver.
* **2 AP:** Channel a stable spell, Buddy-Aid, or fire an unbraced heavy weapon.
* **3 AP:** Critical Triage, cast a massive spell, or execute an extreme sprint.

#### The Recoil Rule (Multi-Attacks)
To prevent rapid suppression without consequence, every attack action beyond the first in a single turn gains the [System: Recoil] tag.
*   The first attack roll of a turn is normal.
*   The second attack roll of the turn suffers [System: Disadvantage 1].
*   The third attack roll suffers [System: Disadvantage 2].
This exponentially increases the difficulty of unloading a full magazine or multi-swinging in a single turn.

### Trauma Penalties
Injuries strictly impact your capability without requiring mathematical calculations.
* Severe Trauma applies binary qualitative tags to body parts (e.g., [Status: Maimed], [Status: Hobbled], [Status: Disoriented], [Status: Staggered]).
* These tags enforce narrative limitations rather than AP math. For instance, [Status: Hobbled] means you cannot execute sprint actions; [Status: Staggered] means you cannot hold AP for Reactions. 
* *See [The Status Manifest](./03-The-Status-Manifest.md) for the full Trauma rules.*

### Expanding the AP Pool
An entity may not exceed a maximum of 5 AP in a single turn.
* **[Status: Overclocked]:** Artificial acceleration grants +1 to +2 AP, but risks system shock.
* **Scale Dominance:** [System: Power Scale 3] and [System: Power Scale 4] entities inherently possess 4 or 5 base AP, respectively.
* **[Status: Adrenaline]:** A consumable surge that grants +1 AP when taking a Severe Major Wound.

## Volatile Synchronization (The "Called Combo")
Players can execute combined maneuvers to bridge Power Scale gaps or unleash devastating elemental combinations. This requires strict coordination and carries massive risk.

*   **The Declaration:** To initiate a Sync, Player A must declare it on their turn. They spend their Action Points (AP) to "prep" the combo and must explicitly designate Player B as their partner.
*   **The GM Audit:** The GM briefly audits the board state. Are the players in optimal range? Do their intended actions logically interact? If the GM approves, Player A's action is held in stasis.
*   **The Execution:** When Player B's turn arrives, they spend their AP to complete the Sync. Both players roll their respective Approach pools simultaneously.
*   **The Interruption & Abort Clause:** If Player A suffers Trauma before Player B executes the Sync, Player A must pass a [Approach: Endurance] Test or the Sync collapses (wasting Player A's AP, but not Player B's). If the target moves out of range or the tactical state changes, Player B can choose to Abort the Sync on their turn, peacefully refunding Player A's AP.
*   **The Risk (Volatile):** Because the players are pushing their limits to combine forces (and potentially bypassing Scale Friction), the entire combined maneuver automatically gains the [System: Volatile] tag.
*   **The Consequence:** If *either* player fails to generate at least 1 success on their roll, the synchronization collapses catastrophically. The attack fails, both players lose their spent AP for the round, and the **Threat Track immediately escalates by +1**.

### The Synergy Matrix (GM RefeResonance)
When players successfully execute a Volatile Synchronization, the combination of their attack domains generates a new, unified Tag with a devastating mechanical effect. This matrix provides the GM with immediate, math-less rulings.

| Primary Domain | Secondary Domain | Synergy Tag Generated | Mechanical Effect (Upon Success) |
| :--- | :--- | :--- | :--- |
| [Domain: Thermal] (Fire/Plasma) | [Domain: Kinetic] (Bullets/Force) | [Path Feature: Shattering] | Rapid heating followed by blunt force destroys molecular bonds. **Bypasses Power Scale Friction for this strike.** |
| [Domain: Cryo] (Ice/Stasis) | [Domain: Kinetic] (Bullets/Force) | [Path Feature: Fracturing] | Freezes the target solid before shattering the ice. **Reduces the target's Passive Defense to 0 until the start of Player A's next turn.** |
| [Domain: Disruptive] (EMP/Shock) | [Domain: Digital] (Hacking/Code) | [Path Feature: Overload] | A physical shockwave that violently opens a system backdoor. **Instantly inflicts [Status: System Shutdown] on a Synthetic or Bionic target.** |
| [Domain: Radiant] (Light/Holy) | [Origin: Biotic] (Organic/Toxin) | [Path Feature: Purifying] | Cleanses corruption at a cellular level. **Instantly heals 1 Severe Trauma stage for an ally, or inflicts double successes on [Path Feature: Eldritch] targets.** |
| [Domain: Chemical] (Acid/Gas) | [Domain: Thermal] (Fire/Plasma) | [Path Feature: Combustion] | Ignites a localized vapor cloud. **Converts the single-target attack into an Area of Effect (Zone). All targets within Close Range must immediately Test to resist suffering Trauma and Status tags.** |

## Movement & Distance Scale

* **[Metric: Distance Point-Blank] (0-5 ft):** Free shifting. Retreating from engagement requires 1 AP.
* **[Metric: Distance Close Range] (10-30 ft):** 1 AP movement cost. Optimal for pistols and shotguns.
* **[Metric: Distance Tactical Range] (30-100 ft):** 2 AP sprint cost. Optimal for assault rifles.
* **[Metric: Distance Long Range] (100-300 ft):** 3 AP desperate run cost.
* **[Metric: Distance Extended Range] (300-800 ft):** Requires specialized [Metric: Distance Long Range] optics or scope tags. Optimal for sniper rifles.
* **[Metric: Distance Extreme Range] (800-1,500+ ft):** Impossible on foot in a 6-second round. Requires vehicles, magic, or specialized transport.
* **Closing Distance:** Moving from Extreme Range to Long Range requires 2 full turns of dedicated movement (spending 3 AP each turn) unless the character utilizes [Domain: Metaphysical] or [Domain: Digital] teleportation/translocation tags.
