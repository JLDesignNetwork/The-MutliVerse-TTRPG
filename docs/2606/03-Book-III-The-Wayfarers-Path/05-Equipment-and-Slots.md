# 05 - Equipment, Slots, & Loadout

> "A plasma rifle is just a very expensive club if you don't have the juice to power it. Always check your battery before you open the airlock."
> — Wayfarer's Journal, Entry 31

Weapons, gear, magic, and tech hacking all function as tools that dictate *how* an action is made, its optimal range, and the specific mechanical consequences (via Tags) that apply upon success.

## Weapon & Equipment Profiles

Equipment does not have static numerical damage dice. Instead, a weapon or tool provides a profile consisting of four primary elements:

1.  **The Approach:** The attribute used to wield the weapon effectively.
    *   *Melee Weapons:* Rely on [Approach: Force] or [Approach: Vector].
    *   *Firearms and Ranged Weapons:* Rely strictly on [Approach: Vector].
2.  **The Range:** Every weapon operates within an optimal distance (e.g., Point-Blank, Close, Tactical, Extreme). Firing outside of this optimal range applies [System: Disadvantage].
3.  **The Domain:** The type of damage or influence the weapon inflicts (e.g., [Domain: Kinetic], [Domain: Thermal], [Domain: Disruptive], [Domain: Radiant]). This interacts directly with the target's Material tag.
4.  **The Tags:** Tags dictate the special rules or conditions a weapon imposes on a successful hit (e.g., a [Domain: Cryo] weapon inflicts the [Status: Brittle] condition; [Status: Flatline] bypasses armor).

## Slot Management & Loadouts

The game utilizes a static slot-based capacity system (acting like RAM) to track how much physical gear, cybernetics, and magical knowledge a character can equip or maintain at any given time. There is no "spending" or "burning" slots to power actions during combat.

### The 3 Slot Types

#### 1. Equipment Slots (Physical Capacity)

Tracks carried gear, heavy weapons, and cybernetics.

- **Investment:** Active persistent tech (like stealth cloaks) Invests (locks) a slot until deactivated.
- **Capacity:**

| Physical Approach Rating | Available Inventory Slots |
| :---: | :---: |
| 0 | 5 Slots |
| 1 | 7 Slots |
| 2 | 9 Slots |
| 3 | 11 Slots |
| 4 | 13 Slots |
| 5 | 15 Slots |

#### 2. Spell Slots (Mental Capacity)

The cognitive limit for preparing and holding complex spells in memory.

- **Investment:** Preparing a spell occupies slots equal to its `{{MASTERY_TIER}}`.
- **Capacity:** Scales exponentially with the caster's Mental Approach ([Approach: Cognition] or [Approach: Resonance], depending on the discipline).

| Mental Approach Rating | Available Spell Slots |
| :---: | :---: |
| 1 | 2 Slots |
| 2 | 3 Slots |
| 3 | 5 Slots |
| 4 | 8 Slots |
| 5 | 13 Slots |

#### 3. Cantrip Slots (Minor Memory)

Minor, instinctual spells.

- **Investment:** Each Cantrip occupies 1 slot.
- **Capacity:** The caster gains a capacity equal to their Mental Approach score.

| Mental Approach Rating | Available Cantrip Slots |
| :---: | :---: |
| 1 | 1 Slot |
| 2 | 2 Slots |
| 3 | 3 Slots |
| 4 | 4 Slots |
| 5 | 5 Slots |

### Pushing the Limit (Threat Escalation)

If a character attempts to utilize tech or cast spells that vastly exceed their safe operational threshold, the action automatically gains the [System: Volatile] tag. 

If the player fails a [System: Volatile] roll for any reason (triggering on **any failure result**, not just a critical 1), it immediately escalates the **Threat Track** in the sector. Pushing the limits bends reality until it snaps back at you in the form of dimensional anomalies, system glitches, or a rapid response from the Architects.
