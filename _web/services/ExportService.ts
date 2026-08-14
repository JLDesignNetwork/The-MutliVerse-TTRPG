import type { MultiverseCharacter } from '../types/character';

const renderTags = (categoryName: string, title: string, desc: string, char: any) => {
  const catData = char.tags?.[categoryName];
  if (!catData || !catData.selected || catData.selected.length === 0) {
      return `* **${title} (${desc}):**\n    * None`;
  }
  
  const rendered = catData.selected.map((tag: any, idx: number) => {
      let prefix = '';
      if (tag.tier === 2) prefix = 'Expert: ';
      if (tag.tier === 3) prefix = 'Elite: ';
      if (tag.tier === 4) prefix = 'Master: ';
      return `    ${idx + 1}. **[${prefix}${tag.name}]:** ${tag.benefit || 'No description'}`;
  }).join('\n');
  
  return `* **${title} (${desc}):**\n${rendered}`;
};

export function generateMarkdown(char: MultiverseCharacter): string {
  const md = `---
# Character Sheet Template
---

## Identity & Allegiance
* **Name:** ${char.name || 'Unknown'}
* **Pronouns:** ${char.pronouns || 'Not specified'}
* **Race:** ${char.nativeRace || 'Unknown'}
* **Class:** ${char.nativeClass || 'Unknown'}
* **Subclass:** ${char.nativeSubclass || 'N/A'} (Origin System: ${char.nativeSystem || 'Unknown'})
* **Faction:** ${char.faction || 'Unaligned'}
* **EXP:** ${char.translationBudget?.remainingExp || 0}/${char.translationBudget?.totalImportedExp || 0}
* **Description/Appearance:** ${char.description || ''}

---

## The Tag Framework
Your Tags dictate your narrative permissions. You may only attempt actions or use gear that align with your Tags.

${renderTags('origin', 'Origin Tag', 'Physiological Baseline', char)}
${renderTags('race', 'Race Tag', 'Species Traits', char)}
${renderTags('class', 'Class Tag', 'Primary Archetype', char)}
${renderTags('path', 'Path Tags', 'Technical Expertise', char)}
${renderTags('background', 'Background Tag', 'Social Leverage', char)}

---

## The 12-Die Array
Distribute 12 \`d10\`s across the following five approaches. No approach can have more than 5 dice or less than 0 dice.

| Approach | Description | Pool (d10s) |
| :--- | :--- | :--- |
| **Force** | Raw physical power, lifting, striking, or applying structural pressure. | [ ${char.approaches?.force ?? 0} ] |
| **Precision** | Agility, speed, precision, and physical coordination. | [ ${char.approaches?.precision ?? 0} ] |
| **Fortitude** | Stamina, resilience, and resisting physical or biological trauma. | [ ${char.approaches?.fortitude ?? 0} ] |
| **Insight** | Logic, intellect, memory, and technological interface. | [ ${char.approaches?.insight ?? 0} ] |
| **Presence** | Empathy, willpower, social manipulation, and metaphysical attunement. | [ ${char.approaches?.presence ?? 0} ] |

---

## Tracks, Status & Body Map

### Status Manifest
  * **Head:** [ ] [ ] [ ] (Sensory/Logic Status)
  * **Torso:** [ ] [ ] [ ] (Life Support Status)
  * **Left Arm:** [ ] [ ] [ ]
  * **Right Arm:** [ ] [ ] [ ] (AP/Weapon Penalty)
  * **Left Leg:** [ ] [ ] [ ] 
  * **Right Leg:** [ ] [ ] [ ] (Movement Penalty)

### Stability Track (Bionic/Synthetic Stress)
  * [ ] **Stage 1 (Minor):** Glitching / Sparks.
  * [ ] **Stage 2 (Minor):** Subroutine lag / Sensors impaired.
  * [ ] **Stage 3 (Minor):** Minor short-circuiting / Actuator stiffness.
  * [ ] **Stage 4 (Severe):** *Status Effect Triggered:* [System: Disadvantage 1] on all physical and computational actions.
  * [ ] **Stage 5 (Severe):** Overheating / System shock.
  * [ ] **Stage 6 (Severe):** Component failure / Cascade error. Requires maintenance or a reboot to stabilize.
  * [ ] **Stage 7 (Critical):** Massive chassis/hardware damage.
  * [ ] **Stage 8 (Critical):** Barely operational / Stuck in logic loops.
  * [ ] **Stage 9 (Incapacitated):** *Status Effect Triggered:* [Status: System Shutdown] (Paralyzed and offline until stabilized by an ally utilizing [Path Feature: Technician] or engineering tools).

### Trauma Track
  * \`[ ]\` **Stage 1 (Minor):** Superficial.
  * \`[ ]\` **Stage 2 (Minor):** Painful.
  * \`[ ]\` **Stage 3 (Minor):** Impeding.
  * \`[ ]\` **Stage 4 (Severe):** *Status Effect Triggered:* \`[Disadvantage: 1]\` on all physical actions.
  * \`[ ]\` **Stage 5 (Severe):** System shock.
  * \`[ ]\` **Stage 6 (Severe):** Bleeding out/System failure. Requires triage to stabilize.
  * \`[ ]\` **Stage 7 (Critical):** Massive structural damage.
  * \`[ ]\` **Stage 8 (Critical):** Barely conscious.
  * \`[ ]\` **Stage 9 (Incapacitated):** *Death Timer started.* (Your Fortitude rating in rounds without medical/engineering intervention results in permanent death).

### The Warrant Track
(If applicable. Represents heat/bounty from The Authority or other factions).

* \`[ ]\` **Stage 1 (Caution):** Monitored. Patrols might ask questions.
* \`[ ]\` **Stage 2 (Active Hunt):** Pursued. Standard authorities will engage on sight.
* \`[ ]\` **Stage 3 (Lethal Force):** Burn Notice. Elite hunter-killer units dispatched.

## Power & Resources
* **Current Power Scale:** ${char.resources?.currentPowerScale || 1}

### 1. Equipment Slots (Physical Capacity)
*Tracks physical gear, heavy weapons, cybernetics.*
* **Max Slots:** ${char.resources?.maxSlots || 5}
* **Invested Slots:** ${char.resources?.investedSlots || 0}
* **Available Slots:** ${Math.max(0, (char.resources?.maxSlots || 5) - (char.resources?.investedSlots || 0))}

### 2. Spell Slots (Mental Capacity)
*The cognitive limit for preparing and holding complex spells. Capacity scales exponentially with the caster's Mental Approach (Score 1 = 2 Slots, Score 2 = 3 Slots, Score 3 = 5 Slots, Score 4 = 8 Slots, Score 5 = 12 Slots). Preparing a spell uses slots equal to its Mastery Tier.*
* **Max Slots:** ${ (() => {
  const mentalScore = Math.max(char.approaches?.insight || 0, char.approaches?.presence || 0);
  if (mentalScore >= 5) return 12;
  if (mentalScore === 4) return 8;
  if (mentalScore === 3) return 5;
  if (mentalScore === 2) return 3;
  if (mentalScore === 1) return 2;
  return 0;
})() }
* **Invested Slots (Prepared Spells):** [ ]
* **Available Slots:** [ ]

| Spell Name | Mastery Tier (Slots Occupied) | AP Cost / Range | Effect / Notes |
| :--- | :--- | :--- | :--- |
${char.spells && char.spells.length > 0 ? char.spells.map(s => `| *${s.name}* | *${s.slotsOccupied}* | *${s.apCostRange}* | *${s.effectNotes}* |`).join('\n') : '| | | | |\n| | | | |'}

### 3. Cantrip Slots (Minor Memory)
*Minor instinctual spells. Capacity is exactly equal to your Mental Approach score. Each Cantrip occupies 1 slot.*
* **Max Slots:** ${ Math.max(char.approaches?.insight || 0, char.approaches?.presence || 0) }
* **Invested Slots (Prepared Cantrips):** [ ]
* **Available Slots:** [ ]

| Cantrip Name | Slots Occupied | AP Cost / Range | Effect / Notes |
| :--- | :--- | :--- | :--- |
${char.cantrips && char.cantrips.length > 0 ? char.cantrips.map(c => `| *${c.name}* | *${c.slotsOccupied}* | *${c.apCostRange}* | *${c.effectNotes}* |`).join('\n') : '| | | | |\n| | | | |'}

---

## Inventory & Loadout
Every significant item occupies 1 \`[Slot]\`. If you exceed your Max Slots, you suffer \`[Disadvantage: 1]\` on all agility/movement checks.

| Item / Asset Name | Domain / Tags | Slots Used | Notes |
| :--- | :--- | :--- | :--- |
${char.inventory?.map(item => {
    const safeNotes = (item.notes || '').replace(/(\r\n|\n|\r)/gm, ' ');
    return `| *${item.name}* | *[${item.domainTags?.join('], [') || ''}]* | *${item.slotsUsed}* | *${safeNotes}* |`;
  }).join('\n') || '| | | | |'}

---

## Session Log & Advancement
* **Total EXP Earned:** [${char.translationBudget?.totalImportedExp || 0}] | **EXP Spent:** [${(char.translationBudget?.totalImportedExp || 0) - (char.translationBudget?.remainingExp || 0)}] | **Current EXP:** [${char.translationBudget?.remainingExp || 0}]

| Session # | Date | Key Events / Lore Notes | EXP Gained |
| :--- | :--- | :--- | :--- |
| | | | |

### Progression Track
* **Power Scale Ascensions:** [List narrative trigger here]

### Debts, Bounties & Ongoing Factions
* **Active Warrant Status:** [Stage 0-3]
* **NPC Relations / Debts:** 
    * [Name]: [Status/Debt]

---

## Character Notes / Lore
[Keep track of NPC relationships, debts owed, and story progress here]

> Auto-converted from ${char.nativeSystem || 'Unknown'} via Multiverse Converter
`;
  return md;
}

export async function downloadMarkdown(char: MultiverseCharacter) {
  const mdContent = generateMarkdown(char);
  const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${char.name.replace(/\s+/g, '_')}_Sheet.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadPDF(char: MultiverseCharacter) {
  // Use dynamic import to avoid SSR issues if this service is ever imported server-side
  // @ts-ignore - html2pdf.js does not have native types
  const html2pdf = (await import('html2pdf.js')).default;

  const mdContent = generateMarkdown(char);

  // Create a temporary container for the markdown content
  const element = document.createElement('div');
  element.style.padding = '20px';
  element.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  element.style.lineHeight = '1.6';
  element.style.color = '#000'; // Force black text for PDF
  element.style.background = '#fff';

  // Basic markdown to HTML conversion for the PDF
  let htmlContent = mdContent
    .replace(/\\n/g, '<br/>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
    .replace(/---/g, '<hr style="margin: 20px 0; border: 1px solid #ccc;"/>');

  element.innerHTML = htmlContent;

  const opt = {
    margin: 1,
    filename: `${char.name.replace(/\s+/g, '_')}_Sheet.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
  };

  html2pdf().set(opt).from(element).save();
}
