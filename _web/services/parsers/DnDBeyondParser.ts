import * as fs from 'fs';
import * as path from 'path';
import upgradesLibrary from '../../config/systems/upgradesLibrary.json';

export class DnDBeyondParser {
  private config: any;

  constructor() {
    const configPath = path.join(process.cwd(), 'config', 'systems', 'dnd5e.json');
    const fileContent = fs.readFileSync(configPath, 'utf-8');
    this.config = JSON.parse(fileContent);
  }

  public generateUpgrades(character: any): void {
    const library = upgradesLibrary.upgrades || [];
    const categories = ['race', 'background', 'path', 'general'] as const;
    let allTags: any[] = [];
    categories.forEach(cat => {
      const c = character.tags?.[cat];
      if (c) {
         allTags = [...allTags, ...(c.extracted || []), ...(c.selected || [])];
      }
    });
    
    // Create a combined list of unique tags to check against the library
    const uniqueTags = allTags.filter((tag, index, self) => 
      index === self.findIndex((t) => t.name === tag.name)
    );

    uniqueTags.forEach(tag => {
      const match = library.find((u: any) => u.triggerTag.toLowerCase() === tag.name.toLowerCase());
      if (match) {
        // Prevent duplicates
        const upgradeId = `upgrade-${match.name.replace(/\s+/g, '-').toLowerCase()}`;
        if (!character.upgradeOptions?.some((u: any) => u.id === upgradeId)) {
          character.upgradeOptions = character.upgradeOptions || [];
          character.upgradeOptions.push({
            id: upgradeId,
            type: 'MASTERY_TAG', // Treat path tag upgrades as mastery tags or custom
            name: match.name,
            description: match.benefit,
            expCost: match.cost,
            isPurchased: false
          });
        }
      }
    });

    // Add initial approach bumps
    const approaches: string[] = ['force', 'precision', 'fortitude', 'insight', 'presence'];
    approaches.forEach(app => {
      const currentLevel = character.approaches[app];
      if (currentLevel < 5) {
        character.upgradeOptions = character.upgradeOptions || [];
        character.upgradeOptions.push({
          id: `bump-${app}-${currentLevel}-${currentLevel + 1}`,
          type: 'APPROACH_BUMP',
          targetApproach: app,
          name: `${app.charAt(0).toUpperCase() + app.slice(1)} ${currentLevel} -> ${currentLevel + 1}`,
          description: `Increase your ${app} approach from ${currentLevel} to ${currentLevel + 1}.`,
          expCost: (currentLevel + 1) * 2,
          isPurchased: false
        });
      }
    });
  }

  private sanitizeDescription(text: string): string {
    if (!text) return text;
    // Strip all HTML tags immediately
    let clean = text.replace(/<[^>]+>/g, '');
    clean = clean.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&times;/g, 'x');

    const mapAttr = (p1: string) => {
        const attrMap: Record<string, string> = {
            'strength': 'Force',
            'dexterity': 'Precision',
            'constitution': 'Fortitude',
            'intelligence': 'Insight',
            'wisdom': 'Insight',
            'charisma': 'Presence'
        };
        return attrMap[p1.toLowerCase()] || p1;
    };

    // A. Creature vs. Object HP (Subject-Aware Abstraction)
    clean = clean.replace(/(creature|character|target)([^.]*)(?:has|drops? to|reduced to) 0 (?:hit points|hp)/gi, '$1$2falls into [Critical Condition]');
    clean = clean.replace(/have at least 1 (?:hit point|hp)/gi, 'are alive and conscious');
    
    clean = clean.replace(/(?:if it drops|reduced) to 0 (?:hit points|hp)/gi, 'if its integrity is compromised');
    clean = clean.replace(/has \d+ (?:hit points|hp)/gi, 'has [Fragile Integrity]');

    // B. Grammar Fixes & Damage
    clean = clean.replace(/(?:a\s*)?\+(\d+)(?:\s*bonus)?\s*to\s*(?:Armor Class|AC)/gi, 'a [Protection: Tier $1] tag');
    clean = clean.replace(/(?:a\s*)?\+(\d+)(?:\s*bonus)?\s*to\s*attack\s*and\s*damage\s*rolls(?:\s*made)?/gi, 'a [Potency: Tier $1] tag');
    clean = clean.replace(/(?:,\s*)?\+(\d+)\s*(weapon|shield|armor|ammunition)/gi, '[Tier $1] $2');

    clean = clean.replace(/(?:takes?|deals?|suffers?|inflicts?)?\s*(?:an?|some)?\s*(?:extra\s*)?\d+d\d+(?:\s*\+\s*\d+)?\s*([a-zA-Z]+)?\s*damage/gi, 'suffers a [$1 Impact]');
    clean = clean.replace(/(?:regains?|heals?)\s+\d+d\d+(?:\s*\+\s*\d+)?\s*(?:hit points|hp)/gi, 'gain a [Restoration Tag]');

    // C. Economy, Time Dice, & Generic Saves
    clean = clean.replace(/\d+d\d+(?:\s*\+\s*\d+)?\s*(days|hours|minutes|rounds|turns)/gi, 'a narrative duration');
    clean = clean.replace(/(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s*\([A-Za-z\s]+\)\s*(check|roll)/gi, (m, p1) => `[${mapAttr(p1)}] check`);
    clean = clean.replace(/(?:DC\s*\d+\s*)?(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s*(check|saving throw)/gi, (m, p1) => `[${mapAttr(p1)}] check`);
    clean = clean.replace(/saving throws?/gi, 'Defensive Checks');
    clean = clean.replace(/roll a 20/gi, 'score a Critical Success');
    clean = clean.replace(/\d+(?:st|nd|rd|th)-level spell slot/gi, '[Minor Magical Exertion]');
    clean = clean.replace(/\d+\s*(?:gp|sp|cp|gold|silver|copper)/gi, '[Valuable Materials]');

    // Straggler D&D Mechanics
    clean = clean.replace(/add your proficiency bonus to any ability checks/gi, 'gain a narrative advantage on Approach checks');
    clean = clean.replace(/add their carrying capacity together/gi, 'combine their hauling power');
    clean = clean.replace(/\b(?:bonus\s+to\s+)?(?:Armor\s+Class|AC)\b/gi, 'Defense');

    // D. Stat Bumps & Carrying Capacity
    clean = clean.replace(/(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma) increases by \d+(?:, to a maximum of \d+)?/gi, (m, p1) => `[${mapAttr(p1)}] Approach increases permanently`);
    clean = clean.replace(/move weight up to \w+ times its base carrying capacity(?:, including the weight of the vehicle)?/gi, 'transport massive cargo without Inventory Slot penalties');
    clean = clean.replace(/\d+\s*or more levels in the [a-zA-Z]+ class/gi, 'reached a higher Power Rank');

    // 5. Old Level/Stat increases
    clean = clean.replace(/(Starting at|At|When you reach|Beginning at)\s+(the\s+)?(\d+(st|nd|rd|th)?|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth)\s+level,?\s*/gi, '');
    clean = clean.replace(/Increase your [a-zA-Z, ]+ score by \d+(, to a maximum of \d+)?\.?,?\s*(and\s+)?/gi, '');
    clean = clean.replace(/Increase one ability score of your choice by \d+, or two ability scores of your choice by \d+\.?\s*/gi, '');

    // 6. A/An Grammar Cleanup Pass
    clean = clean.replace(/\ba\s+\[(Insight)\]/gi, 'an [$1]');

    // 7. Resolve Placeholder Variables
    clean = clean.replace(/\{\{MAGIC_REF\}\}/g, '[Magical Effect]');
    clean = clean.replace(/\{\{IMPACT_REF\}\}/g, '[Impact]');
    clean = clean.replace(/\{\{FORTITUDE_REF\}\}/g, '[Approach: Fortitude]');
    clean = clean.replace(/\{\{DEFENSE_REF\}\}/g, 'Defense');
    clean = clean.replace(/\{\{HEALTH_REF\}\}/g, '[Health]');
    clean = clean.replace(/\{\{TIER_REF\}\}/g, '[Tier]');
    clean = clean.replace(/\{\{PATHOGEN_REF\}\}/g, '[Pathogen]');

    return clean;
  }

  private abstractSnippet(text: string): string {
    const logic = this.config.mappings.pathTagDefinitions?.logic;
    const abstractedVocabulary = logic?.abstractedVocabulary || {};

    let result = text;
    for (const [key, token] of Object.entries(abstractedVocabulary)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      result = result.replace(regex, token as string);
    }
    return result;
  }

  public parse(data: any): any {
    const char = data.data || data.character || data;

    const name = char.name || "Unknown Adventurer";
    const pronouns = ""; 
    const nativeRace = char.race?.fullName || char.race?.baseName || "Unknown Race";
    
    let nativeClass = "Unknown Class";
    let nativeSubclass = "Unknown Subclass";
    let primaryAbilities: number[] = [];
    
    if (char.classes && char.classes.length > 0) {
      nativeClass = char.classes.map((c: any) => c.definition?.name).join(" / ");
      nativeSubclass = char.classes.map((c: any) => c.subclassDefinition?.name).filter(Boolean).join(" / ");
      
      // Collect primary abilities
      char.classes.forEach((c: any) => {
        if (c.definition?.primaryAbilities) {
          primaryAbilities.push(...c.definition.primaryAbilities);
        }
      });
    }

    const { approaches, unassignedCorePoints } = this.calculateApproaches(char, primaryAbilities);
    const { resources, translationBudget } = this.calculatePowerAndExp(char.classes);
    
    const { inventory, extraSlotsPurchased } = this.parseInventory(char.inventory, resources.maxSlots);
    
    resources.investedSlots = extraSlotsPurchased + inventory.reduce((sum: number, item: any) => sum + item.slotsUsed, 0);
    resources.availableSlots = resources.maxSlots - resources.investedSlots;
    if(resources.availableSlots < 0) resources.availableSlots = 0;

    const slotsCost = extraSlotsPurchased * 4;
    translationBudget.expSpentOnSlots = slotsCost;
    translationBudget.remainingExp = translationBudget.totalImportedExp - slotsCost;

    let bgName = "Unknown Background";
    let bgDescription = "";
    
    if (char.background) {
      bgName = char.background.definition?.name || char.background.customBackground?.name || "Unknown Background";

      if (char.background.hasCustomBackground && char.background.customBackground) {
        bgDescription = char.background.customBackground.description || "";
        const fName = char.background.customBackground.featuresBackground?.featureName;
        const fDesc = char.background.customBackground.featuresBackground?.featureDescription;
        if (fName || fDesc) {
           bgDescription += `\n\nFeature: ${fName || 'Custom Feature'}\n${fDesc || ''}`;
        }
      } else if (char.background.definition) {
        bgDescription = char.background.definition.description || "";
        const fName = char.background.definition.featureName;
        const fDesc = char.background.definition.featureDescription;
        if (fName || fDesc) {
           bgDescription += `\n\nFeature: ${fName || 'Background Feature'}\n${fDesc || ''}`;
        }
      }
    }

    const logic = this.config.mappings.pathTagDefinitions?.logic;
    const manifest = logic?.manifest || {};

    const racePaths = [manifest.raceTraits, manifest.raceModifiers].filter(Boolean) as string[];
    const bgPaths = [manifest.backgroundFeature, manifest.standardBackgroundFeature, manifest.backgroundModifiers].filter(Boolean) as string[];
    const pathPaths = [manifest.classFeatures, manifest.subclass, manifest.classModifiers].filter(Boolean) as string[];
    const generalPaths = [manifest.feats, manifest.featModifiers, manifest.customProficiencies].filter(Boolean) as string[];

    let allRawTraits: any[] = [];

    // 1. Gather traits safely
    if (char.race?.racialTraits && Array.isArray(char.race.racialTraits)) {
      allRawTraits = [...allRawTraits, ...char.race.racialTraits];
    }
    if (char.race?.baseRace?.racialTraits && Array.isArray(char.race.baseRace?.racialTraits)) {
      allRawTraits = [...allRawTraits, ...char.race.baseRace.racialTraits];
    }

    // 2. Map and Filter
    const ignoredTraits = [
      "age", 
      "size", 
      "speed", 
      "languages", 
      "ability score increase", 
      "ability score improvement",
      "alignment"
    ];

    const extractedRaceTags = allRawTraits
      .map(trait => {
        const def = trait.definition || trait; // Fallback in case it's flat
        let name = def.name || "Unknown Trait";
        let benefit = this.sanitizeDescription(def.description || def.snippet || "");

        if (name.toLowerCase() === "skill versatility") {
          benefit = "Grants 1 Free Upgrade Token, allowing you to advance a Path Tag's Mastery Tier by one level without spending EXP.";
        }

        return {
          name,
          benefit,
          playstyle: "General",
          tier: 1,
          maxTier: 4
        };
      })
      .filter(tag => {
        const lowerName = tag.name.toLowerCase().trim();
        return (
          tag.name !== "Unknown Trait" && 
          tag.benefit !== "" && 
          !ignoredTraits.includes(lowerName)
        );
      });

    const result = {
      name,
      pronouns,
      nativeRace,
      nativeClass,
      nativeSubclass,
      nativeSystem: this.config.systemName,
      faction: "Unaligned",
      description: this.sanitizeDescription(bgDescription.trim()),
      unassignedCorePoints,
      approaches,
      tags: {
        race: { freeAllotment: 1, extracted: extractedRaceTags, selected: [] },
        background: { freeAllotment: 1, extracted: this.extractTags(char, bgPaths), selected: [] },
        path: { freeAllotment: 2, extracted: this.extractTags(char, pathPaths), selected: [] },
        general: { freeAllotment: 0, extracted: this.extractTags(char, generalPaths), selected: [] }
      },
      resources,
      inventory,
      translationBudget,
      upgradeOptions: [],
      currentReality: 'Fantasy'
    };

    this.generateUpgrades(result);
    return result;
  }

  private normalizeTag(tag: string): string {
    let normalized = tag.toLowerCase().trim();
    
    // Replace plural "attacks" with singular "attack"
    normalized = normalized.replace(/\battacks\b/g, 'attack');
    // Replace "aura improvements" with "aura"
    normalized = normalized.replace(/\baura improvements?\b/g, 'aura');
    // Remove trailing "s" if it's clearly a plural of a feature
    normalized = normalized.replace(/\bshields\b/g, 'shield');
    
    return normalized;
  }

  private extractTags(char: any, pathList: string[]): any[] {
    const rawTagObjects: any[] = [];
    const logic = this.config.mappings.pathTagDefinitions?.logic;
    const forbiddenTags = (logic?.forbiddenTags || []).map((t: string) => t.toLowerCase());

    if (!pathList || pathList.length === 0) {
      return [];
    }

    pathList.forEach(path => {      // Parent Object Slicing: drop the final property to get the object itself
      const parts = path.split('.');
      const finalProp = parts.pop()!;
      const parentPath = parts.join('.');
      
      const parentObjects = parentPath ? this.resolveDotNotation(char, parentPath) : [char];
      
      parentObjects.forEach(parent => {
        if (parent && typeof parent === 'object') {
          // Check for the final property we sliced off (usually 'name' or 'friendlySubtypeName')
          const rawName = parent[finalProp] || parent.name || parent.friendlySubtypeName;
          if (typeof rawName === 'string') {
            rawTagObjects.push({
              name: rawName,
              snippet: parent.snippet || parent.description || '' // Grab the sibling property
            });
          }
        }
      });
    });

    const normalizedMap = new Map<string, any>();

    rawTagObjects.forEach(obj => {
      const normalizedName = this.normalizeTag(obj.name);
      if (!normalizedName || forbiddenTags.includes(normalizedName)) return;

      if (!normalizedMap.has(normalizedName)) {
        normalizedMap.set(normalizedName, {
          name: normalizedName,
          originalName: obj.name,
          snippet: obj.snippet
        });
      }
    });

    const summaryMap = logic?.summaryMap || {};
    const finalTags: any[] = [];

    normalizedMap.forEach((data, normalizedName) => {
      const summaryString = summaryMap[normalizedName];
      let benefit = "";
      let playstyle = "Dynamic";

      if (summaryString) {
        const parts = summaryString.split(':');
        if (parts.length > 1) {
          playstyle = parts[0].trim();
          let rawBenefit = parts.slice(1).join(':').trim();
          rawBenefit = this.sanitizeDescription(rawBenefit);
          benefit = this.abstractSnippet(rawBenefit);
        } else {
          let rawBenefit = summaryString;
          rawBenefit = this.sanitizeDescription(rawBenefit);
          benefit = this.abstractSnippet(rawBenefit);
          playstyle = "General";
        }
      } else {
        return; 
      }

      finalTags.push({
        name: data.originalName,
        benefit,
        playstyle,
        tier: 1,
        maxTier: 4
      });
    });

    return finalTags;
  }

  private resolveDotNotation(obj: any, path: string): any[] {
    const parts = path.split('.');
    let current: any[] = [obj];

    for (const part of parts) {
      let nextLevel: any[] = [];
      for (const item of current) {
        if (!item) continue;
        if (Array.isArray(item)) {
          item.forEach(subItem => {
            if (subItem && subItem[part] !== undefined && subItem[part] !== null) {
               nextLevel.push(subItem[part]);
            }
          });
        } else {
          if (item[part] !== undefined && item[part] !== null) {
             nextLevel.push(item[part]);
          }
        }
      }
      current = nextLevel.flat(Infinity);
      if (current.length === 0) break;
    }
    return current;
  }

  private calculateTotalScore(char: any, statId: number): number {
    const baseStat = char.stats?.find((s: any) => s.id === statId)?.value || 10;
    const bonusStat = char.bonusStats?.find((s: any) => s.id === statId)?.value || 0;
    
    let modifierTotal = 0;
    if (char.modifiers) {
      Object.values(char.modifiers).forEach((modGroup: any) => {
        if (Array.isArray(modGroup)) {
          modGroup.forEach((mod: any) => {
            if (mod.type === 'bonus' || mod.type === 'penalty') {
              const subTypeStr = this.getSubTypeForStat(statId);
              if (mod.subType === subTypeStr) {
                modifierTotal += (mod.value || mod.fixedValue || 0);
              }
            }
          });
        }
      });
    }
    
    return baseStat + bonusStat + modifierTotal;
  }

  private getSubTypeForStat(id: number): string {
    const map: Record<number, string> = {
      1: "strength-score",
      2: "dexterity-score",
      3: "constitution-score",
      4: "intelligence-score",
      5: "wisdom-score",
      6: "charisma-score"
    };
    return map[id] || "";
  }

  private calculateApproaches(char: any, primaryAbilityIds: number[]): { approaches: Record<string, number>, unassignedCorePoints: number } {
    const statMap: Record<number, string> = {
      1: "force",        // Strength
      2: "precision",    // Dexterity
      3: "fortitude",    // Constitution
      4: "insight",      // Intelligence
      5: "insight",      // Wisdom
      6: "presence"      // Charisma
    };
    
    const approachScores: Record<string, number> = {
      force: 0, precision: 0, fortitude: 0, insight: 0, presence: 0
    };

    // Calculate initial Approach values based on D&D stats using static ID mapping
    for (let i = 1; i <= 6; i++) {
      const totalScore = this.calculateTotalScore(char, i);
      const mappedApproach = statMap[i];
      if (mappedApproach) {
        let val = Math.floor((totalScore - 10) / 2);
        val = Math.max(0, Math.min(5, val));
        
        if (mappedApproach === "insight") {
          approachScores.insight = Math.max(approachScores.insight, val);
        } else {
          approachScores[mappedApproach] = val;
        }
      }
    }

    // Sum the total dice
    let sum = Object.values(approachScores).reduce((a, b) => a + b, 0);

    // 2. Force Data Integrity
    // Only trigger "priority routing" if level 1 (XP < 300) and stats are at base defaults (sum === 0).
    const currentXp = char.currentXp || 0;
    if (sum === 0 && currentXp < 300) {
      const classPriorities: Record<string, string[]> = {
        "Paladin": ["force", "presence", "fortitude", "precision", "insight"],
        "Barbarian": ["force", "fortitude", "precision", "insight", "presence"],
        "Rogue": ["precision", "insight", "force", "presence", "fortitude"],
        "Wizard": ["insight", "precision", "fortitude", "presence", "force"],
        "Fighter": ["force", "precision", "fortitude", "insight", "presence"],
        "Cleric": ["insight", "fortitude", "force", "presence", "precision"]
      };

      const nativeClass = char.classes?.[0]?.definition?.name || "";
      const priorityList = classPriorities[nativeClass] || ["force", "precision", "fortitude", "insight", "presence"];

      let remaining = 12;
      for (const approach of priorityList) {
        if (remaining <= 0) break;
        const toAdd = Math.min(5, remaining);
        approachScoresApproach = toAdd;
        remaining -= toAdd;
      }
      sum = 12;
    }

    const unassignedCorePoints = sum < 12 ? (12 - sum) : 0;
    
    return { approaches: approachScores, unassignedCorePoints };
  }

  private calculatePowerAndExp(classes: any[]): { resources: any, translationBudget: any } {
    let totalLevel = 0;
    if (classes && classes.length > 0) {
      totalLevel = classes.reduce((sum: number, c: any) => sum + (c.level || 0), 0);
    } else {
      totalLevel = 1;
    }

    let scale = 1;
    let expFormula = "0";

    for (const tier of this.config.mappings.powerScale.logic.tiers) {
      if (totalLevel <= tier.maxLevel) {
        scale = tier.scale;
        expFormula = tier.expFormula;
        break;
      }
    }

    // Evaluate simple exp formula
    const level = totalLevel;
    let totalExp = 0;
    try {
      // safe eval equivalent for the simple math expressions provided
      const parsedFormula = expFormula.replace(/level/g, level.toString());
      totalExp = Math.round(new Function(`return ${parsedFormula}`)());
    } catch (e) {
      totalExp = 0;
    }

    return {
      resources: {
        currentPowerScale: scale,
        maxSlots: 5 + (scale * 2),
        investedSlots: 0,
        availableSlots: 0
      },
      translationBudget: {
        totalImportedExp: totalExp,
        expSpentOnSlots: 0,
        remainingExp: totalExp
      }
    };
  }

  private parseInventory(rawInventory: any[], baseMaxSlots: number): { inventory: any[], extraSlotsPurchased: number } {
    const inventory: any[] = [];
    const taxRules = this.config.mappings.slotTaxes.logic;
    
    let totalSlotsUsed = 0;

    if (rawInventory && Array.isArray(rawInventory)) {
      rawInventory.forEach(itemContainer => {
        const itemDef = itemContainer.definition;
        if (!itemDef) return;

        let slotsUsed = 0;
        if (taxRules.taxableTypes.includes(itemDef.type) || taxRules.taxableTypes.includes(itemDef.filterType)) {
          slotsUsed = taxRules.defaultCost;
        }

        let rawName = itemDef.name || "Unknown Item";
        
        // Convert +1, +2, +3 mechanical modifiers into narrative prefixes
        if (rawName.includes("+1")) {
          rawName = "Masterwork " + rawName.replace(/,\s*\+1|\+1/g, "").trim();
        } else if (rawName.includes("+2")) {
          rawName = "Exquisite " + rawName.replace(/,\s*\+2|\+2/g, "").trim();
        } else if (rawName.includes("+3")) {
          rawName = "Legendary " + rawName.replace(/,\s*\+3|\+3/g, "").trim();
        }

        inventory.push({
          name: rawName,
          domainTags: [],
          slotsUsed: slotsUsed,
          notes: itemDef.description ? this.sanitizeDescription(itemDef.description) : ""
        });
        
        totalSlotsUsed += slotsUsed;
      });
    }

    let extraSlotsPurchased = 0;
    if (totalSlotsUsed > baseMaxSlots) {
      extraSlotsPurchased = totalSlotsUsed - baseMaxSlots;
    }

    return { inventory, extraSlotsPurchased };
  }
}
