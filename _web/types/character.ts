export interface Approaches {
  force: number;
  precision: number;
  fortitude: number;
  insight: number;
  presence: number;
}

export interface TagObject {
  name: string;
  benefit: string;
  playstyle: string;
  tier?: number;
  maxTier?: number;
}

export interface TagCategory {
  freeAllotment: number;
  extracted: TagObject[];
  selected: TagObject[];
}

export interface TagFramework {
  origin: TagCategory;
  race: TagCategory;
  class: TagCategory;
  path: TagCategory;
  background: TagCategory;
  masteryTags?: any[];
}

export interface ResourcePool {
  currentPowerScale: number;
  maxSlots: number;
  investedSlots: number;
  availableSlots: number;
}

export interface GearItem {
  name: string;
  domainTags: string[];
  slotsUsed: number;
  notes?: string;
  isEquipped?: boolean;
}

export interface SpellItem {
  name: string;
  slotsOccupied: string;
  apCostRange: string;
  effectNotes: string;
}

export interface TranslationBudget {
  totalImportedExp: number;
  expSpentOnSlots: number;
  expSpentOnPaths?: number;
  remainingExp: number;
}

export interface UpgradeOption {
  id: string;
  type: 'MASTERY_TAG' | 'PATH_TAG' | 'APPROACH_BUMP';
  targetApproach?: keyof Approaches;
  name: string;
  description: string;
  expCost: number;
  isPurchased?: boolean;
}

export interface MultiverseCharacter {
  name: string;
  pronouns: string;
  nativeRace: string;
  nativeClass: string;
  nativeSubclass?: string;
  nativeSystem: string;
  faction: string;
  description: string;
  unassignedCorePoints?: number;
  approaches: Approaches;
  tags: TagFramework;
  resources: ResourcePool;
  inventory: GearItem[];
  translationBudget: TranslationBudget;
  upgradeOptions: UpgradeOption[];
  currentReality: string;
  spells?: SpellItem[];
  cantrips?: SpellItem[];
}
