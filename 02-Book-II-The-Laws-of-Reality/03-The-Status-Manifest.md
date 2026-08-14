# 03 - The Status Manifest

> "A stim-pack might keep your heart beating, but it won’t reattach your arm. Know your limits before someone else tests them for you."
> — Intercepted Transmission, Wayfarer Designation: 'Bones'

The Multiverse TTRPG tracks health, damage, and stability through state-of-being tracks rather than numerical hit points.

## The 9-Stage Trauma Track (Non-Synthetic)
Non-synthetic (biotic) Player Characters and Major Adversaries utilize a 9-Stage Trauma Track to measure physical harm.
*   **Minor Trauma ([Status: Trauma Stage 1] - [Status: Trauma Stage 3]):** Flesh wounds and superficial damage. No immediate mechanical penalty.
*   **Severe Trauma ([Status: Trauma Stage 4] - [Status: Trauma Stage 6]):** Deep structural damage. Imposes specific localized limb penalties (see [The Body Map](#the-body-map) below).
*   **Critical Trauma ([Status: Trauma Stage 7] - [Status: Trauma Stage 9]):** Lethal or incapacitating damage.

### Incapacitation & The Death Timer
When a character reaches [Status: Trauma Stage 9] on the Trauma Track, they gain the [Status: Clinical Death] tag and begin bleeding out.
*   **The Timer:** Upon reaching [Status: Trauma Stage 9], a character begins a death timer equal to their **Endurance Approach rating (in rounds)**. For example, a character with 3 Endurance dice has 3 rounds to be resuscitated before they perish.
*   **Resuscitation:** Any ally can spend 3 AP and utilize [Path Feature: Medical] or magical healing to resuscitate the character, stabilizing them for the duration of the encounter.

## The 9-Stage Stability Track (Synthetic)
Synthetic entities (e.g., [Origin: Synthetic] or full cybernetic conversions) utilize a 9-Stage Stability Track instead of a Trauma Track to measure system stress, electrical disruption, and software corruption.
*   **Tracking:** Stability behaves like the Trauma Track, progressing from [Status: Stability Stage 1] to [Status: Stability Stage 9]. It is specifically targeted by [Domain: Digital], [Domain: Disruptive], or EMP damage profiles.
*   **Shutdown:** Reaching [Status: Stability Stage 9] on the Stability Track does not trigger a Death Timer. Instead, the entity suffers an immediate [Status: System Shutdown], rendering them paralyzed and offline until an ally spends 3 AP and utilizes [Path Feature: Technician] or [Path Feature: Engineering] to reboot their systems.

<a id="the-body-map"></a>
## The Body Map & Localized Trauma

When an entity suffers Severe ([Status: Trauma Stage 4] - [Status: Trauma Stage 6]) or Critical Trauma ([Status: Trauma Stage 7] - [Status: Trauma Stage 8]), the damage is localized to a specific zone on the Body Map (Head, Torso, Arms, Legs).

### 3-Step Assignment Hierarchy
To determine *where* an attack lands without requiring tedious dice charts, use this rapid narrative hierarchy:
1. **Narrative Circumstance:** If the scenario dictates a hit location (e.g., stepping on a landmine automatically hits the legs), the damage is applied there.
2. **The Called Shot:** If the attacker explicitly declares a target location *before* rolling, and subsequently succeeds, the damage is applied to that location.
3. **Defender's Choice:** If neither of the above apply, the *defender* chooses where they take the hit. They must pick a location that makes narrative sense.

### Qualitative Penalties (The "No-Math" Rule)
Severe Trauma applies binary qualitative tags rather than requiring AP math.
* **[Status: Maimed] (Arms):** You suffer [System: Disadvantage 2] on manual tasks and cannot use two-handed items or heavy weaponry.
* **[Status: Hobbled] (Legs):** You cannot execute sprint actions; closing distance beyond Close Range requires two full turns of movement, or ally assistance.
* **[Status: Disoriented] (Head):** You lose environmental awareness, cannot use the Cognition approach, and lose any sensory advantages.
* **[Status: Staggered] (Torso):** You cannot hold AP for Reactions or utilize [Status: Overclocked] abilities due to systemic shock.

## Triage & Recovery

### Mid-Combat Triage
Combat healing is defined as stabilization, not total recovery. An entity's physical body can only endure mundane triage **once per combat encounter**.

*   **Quick Patch (1 AP):** Heals/suppresses 1 stage of minor trauma (No tools required).
*   **Field Surgery (2 AP):** Heals 2 stages of trauma (Requires `[Path Feature: Medical]` or `[Path Feature: Technician]`).
*   **Critical Triage (3 AP):** Heals 3 stages of trauma and stabilizes a dying entity (Requires `[Path Feature: Medical]` or `[Path Feature: Technician]`).

### Magical Healing
*   **The Physics:** Magical healing (e.g., Divine magic, Biotic weaving) literally stitches flesh and reality, completely bypassing the "once per combat" limitation of mundane triage. 
*   **The Mechanics:** Each healing spell or magical feature operates differently. The specific AP cost, scaling, slot usage, and frequency limits will be detailed strictly within the spell's description. You must read the specific spell or feature to understand how its healing mechanics work.

### Recovery Timelines
* **Minor Grade (Stages 1-3):** 24–72 hours. Characters with the [Origin: Biotic] Origin heal in 12–36 hours due to the [Trait: Rapid Healing] tag.
* **Severe Grade (Stages 4-6):** 3 to 6 weeks. Requires a [Path Feature: Sterile] environment and the correct **Tag-Permission** (e.g., [Path Feature: Medical] for organics) granted by an Origin or Path.
* **Critical Grade (Stages 7-9):** Do not heal naturally. Require surgical reconstruction, cybernetic replacement, or [Domain: Metaphysical] miracles.

### Recovery Stages & Relapse
Active trauma converts into [Status: Recovery] tags over time. Pushing physical limits while recovering requires a Endurance check. Failure triggers a Relapse, reverting the recovery back to a live trauma tag. Recovering characters can safely perform non-physical "Desk Duty" actions without risking a Relapse.

## The Conditions Registry

Status tags carry strict, backend-trackable mechanical consequences rather than relying solely on narrative fiat.

### Tense-Based Condition Matrix

*   **Present-Tense (Active/Volatile):** An ongoing chemical, thermal, or physical reaction. It damages the target over time and turns them into an active environmental hazard to those around them.
*   **Past-Tense (Resolved/Lingering):** The reaction has neutralized, but the structural or biological damage remains, applying static mechanical penalties.

| Domain | Present-Tense (Active Hazard) | Past-Tense (Resolved Debuff) |
| :--- | :--- | :--- |
| **Chemical** | [Status: Corroding]: Item degrades per turn. Using the item forces a splash hazard (all entities in Close Range must Test [Approach: Vector] or suffer Chemical Trauma) and makes the action [System: Volatile]. | [Status: Corroded]: Reaction neutralizes. Gear is ruined. The target suffers the [System: Disadvantage 1] state on any Test relying on that equipment until repaired in a Safe Zone. |
| **Thermal** | [Status: Ablaze]: Inflicts 1 stage of Thermal Trauma at the end of the entity's turn. A character can spend 1 AP to Test [Approach: Endurance] or [Approach: Vector] to extinguish the flames. | [Status: Scorched]: Fire is out, but armor/flesh is compromised. The target's Passive Defense is reduced until repaired/healed. |
| **Disruptive** | [Status: Overloading]: Electricity violently arcs. If the target spends AP, they must Test [Approach: Endurance] or the AP is lost to muscle spasms, arcing shock Trauma to adjacent allies. | [Status: Short-Circuited]: Power is dead. A cybernetic, weapon, or tech item consumes an [System: Invested] slot but provides zero benefit until rebooted. |
| **Cryo** | [Status: Freezing]: Target's molecular movement slows. All movement costs +1 AP, and joints lock up. | [Status: Brittle]: The freeze sets deep. The very next instance of Kinetic Trauma the target takes is doubled (shattering effect), removing the tag. |
| **Biotic** | [Status: Infected]: Pathogen is multiplying. Target suffers Biotic Trauma per turn and spreads the pathogen to anyone they touch/grapple. | [Status: Atrophied]: Disease has run its course, leaving tissue damage. [Approach: Force] Approach Tests suffer the [System: Disadvantage 1] state. |

> *(Note: The Tense-Based Condition Matrix is a living framework designed to be expandable. New domains, magic types, and tech effects will be added as the system grows.)*

### General Physical Conditions

*   [Status: Restrained]: The entity cannot spend AP on movement actions and suffers the [System: Disadvantage 1] state on all Tests using [Approach: Force] or [Approach: Vector].

*   **[Status: Asleep]:** The entity is in a state of deep, inactive rest. Their AP is reduced to 0, they drop prone, and they automatically fail [Approach: Insight] or [Approach: Cognition] tests to detect subtle environmental changes. The status ends immediately if the entity suffers Trauma, or if an ally spends 1 AP to physically rouse them.
*   **[Status: Overclocked]:** The entity gains 1 additional AP on their turn, but automatically suffers 1 Stage of Trauma or Stability loss at the end of their turn. Lasts until the end of the scene or until the entity spends 1 AP to power down.
