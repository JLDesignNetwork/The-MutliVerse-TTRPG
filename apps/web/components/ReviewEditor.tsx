'use client';

import React, { useState } from 'react';
import type { MultiverseCharacter } from '../types/character';
import { downloadMarkdown, downloadPDF } from '../services/ExportService';
import RealityText from './RealityText';

interface ReviewEditorProps {
  initialData: MultiverseCharacter;
  onComplete: () => void;
  onCancel: () => void;
}

const STEPS = [
  'Identity & Approaches',
  'Identity & Paths',
  'Inventory & Loadout',
  'Bespoke Upgrades',
  'Export & Complete'
];

export default function ReviewEditor({ initialData, onComplete, onCancel }: ReviewEditorProps) {
  const [character, setCharacter] = useState<MultiverseCharacter>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [newItemName, setNewItemName] = useState('');
  const [newItemSlots, setNewItemSlots] = useState(1);

  const recalculateBudget = (
    prev: MultiverseCharacter, 
    newInventory: any[] = prev.inventory || [],
    newTags: any = prev.tags,
    newUpgradeOptions: any[] = prev.upgradeOptions || []
  ) => {
    const investedSlots = newInventory.reduce((sum, item) => sum + (item.isEquipped !== false ? item.slotsUsed : 0), 0);
    const maxSlots = prev.resources?.maxSlots || 5;
    const extraSlots = Math.max(0, investedSlots - maxSlots);
    const expSpentOnSlots = extraSlots * 4;
    
    // Calculate Bracket Economy for Tags
    let expSpentOnPaths = 0; 
    let allUpgradeCosts: number[] = [];
    let baseTiersCost = 0;
    
    const categories = ['race', 'background', 'path', 'general'] as const;
    categories.forEach(cat => {
      const categoryData = newTags[cat];
      if (!categoryData) return;
      
      const selectedCount = categoryData.selected?.length || 0;
      const extraCount = Math.max(0, selectedCount - (categoryData.freeAllotment || 0));
      
      let categoryBracketCost = 0;
      if (extraCount > 0) {
        if (extraCount <= 2) categoryBracketCost = extraCount * 2;
        else if (extraCount <= 4) categoryBracketCost = extraCount * 3;
        else categoryBracketCost = extraCount * 4;
      }
      expSpentOnPaths += categoryBracketCost;
      
      (categoryData.selected || []).forEach((tag: any) => {
        const tier = tag.tier || 1;
        if (tag.name.toLowerCase() === 'skill versatility') {
          for(let i = 2; i <= tier; i++) {
            baseTiersCost += i * 5;
          }
        } else {
          for(let i = 2; i <= tier; i++) {
            allUpgradeCosts.push(i * 5);
          }
        }
      });
    });

    allUpgradeCosts.sort((a, b) => b - a);
    const svTag = newTags.race?.selected?.find((t: any) => t.name.toLowerCase() === 'skill versatility');
    const earnedTokens = svTag ? svTag.tier : 0;
    const remainingUpgrades = allUpgradeCosts.slice(earnedTokens);
    const tiersCost = baseTiersCost + remainingUpgrades.reduce((sum, cost) => sum + cost, 0);

    const upgradesCost = newUpgradeOptions.filter(u => u.isPurchased).reduce((sum, u) => sum + u.expCost, 0) || 0;
    const remainingExp = (prev.translationBudget?.totalImportedExp || 0) - (upgradesCost + expSpentOnSlots + expSpentOnPaths + tiersCost);

    return { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp };
  };

  const handleAddInventory = () => {
    if (!newItemName.trim()) return;
    setCharacter(prev => {
      const newInventory = [...(prev.inventory || []), {
        name: newItemName.trim(),
        slotsUsed: newItemSlots,
        domainTags: [],
        isEquipped: true
      }];
      const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, newInventory);
      
      return {
        ...prev,
        inventory: newInventory,
        resources: { ...prev.resources!, investedSlots, availableSlots: Math.max(0, (prev.resources?.maxSlots || 5) - investedSlots) },
        translationBudget: { ...prev.translationBudget!, expSpentOnSlots, expSpentOnPaths, remainingExp }
      };
    });
    setNewItemName('');
    setNewItemSlots(1);
  };

  const handleToggleInventory = (idx: number) => {
    setCharacter(prev => {
      const newInventory = [...(prev.inventory || [])];
      newInventory[idx] = { 
        ...newInventory[idx], 
        isEquipped: newInventory[idx].isEquipped === false ? true : false 
      };
      const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, newInventory);
      
      return {
        ...prev,
        inventory: newInventory,
        resources: { ...prev.resources!, investedSlots, availableSlots: Math.max(0, (prev.resources?.maxSlots || 5) - investedSlots) },
        translationBudget: { ...prev.translationBudget!, expSpentOnSlots, expSpentOnPaths, remainingExp }
      };
    });
  };

  const handleRemoveInventory = (idx: number) => {
    setCharacter(prev => {
      const newInventory = [...(prev.inventory || [])];
      newInventory.splice(idx, 1);
      const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, newInventory);
      
      return {
        ...prev,
        inventory: newInventory,
        resources: { ...prev.resources!, investedSlots, availableSlots: Math.max(0, (prev.resources?.maxSlots || 5) - investedSlots) },
        translationBudget: { ...prev.translationBudget!, expSpentOnSlots, expSpentOnPaths, remainingExp }
      };
    });
  };

  const resetForm = () => {
    if (confirm("Are you sure you want to reset all choices and start over?")) {
      setCharacter(initialData);
      setCurrentStep(0);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1));
  const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleIdentityChange = (field: keyof MultiverseCharacter, value: string) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  const handleApproachChange = (field: keyof MultiverseCharacter['approaches'], value: number) => {
    setCharacter(prev => {
      const nextApproaches = { ...prev.approaches, [field]: value };
      const sum = Object.values(nextApproaches).reduce((a, b) => a + b, 0);
      return {
        ...prev,
        approaches: nextApproaches,
        unassignedCorePoints: sum >= 12 ? 0 : Math.max(0, 12 - sum)
      };
    });
  };

  const handleAssignCorePoint = (field: keyof MultiverseCharacter['approaches']) => {
    setCharacter(prev => {
      if ((prev.unassignedCorePoints || 0) <= 0) return prev;
      if (prev.approaches[field] >= 5) return prev;

      const nextApproaches = { ...prev.approaches, [field]: prev.approaches[field] + 1 };
      const sum = Object.values(nextApproaches).reduce((a, b) => a + b, 0);

      return {
        ...prev,
        unassignedCorePoints: sum >= 12 ? 0 : (prev.unassignedCorePoints || 0) - 1,
        approaches: nextApproaches
      };
    });
  };

  const handleOriginTagChange = (value: string) => {
    setCharacter(prev => ({
      ...prev,
      tags: { ...prev.tags, originTag: value }
    }));
  };

  const handleCuratedTagChange = (field: 'classTag' | 'backgroundTag', value: string) => {
    setCharacter(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [field]: {
          ...prev.tags[field],
          selected: value
        }
      }
    }));
  };

  const handleTagToggle = (category: string, tagObj: any) => {
    setCharacter(prev => {
      const catData = prev.tags[category as keyof MultiverseCharacter['tags']] as any;
      const currentSelected = catData?.selected || [];
      const isSelected = currentSelected.some((t: any) => t.name === tagObj.name);
      
      const newSelected = isSelected 
        ? currentSelected.filter((t: any) => t.name !== tagObj.name)
        : [...currentSelected, { ...tagObj, tier: 1, maxTier: 4 }];

      const newTags = {
        ...prev.tags,
        [category]: {
          ...catData,
          selected: newSelected
        }
      };

      const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, prev.inventory, newTags);

      return {
        ...prev,
        tags: newTags,
        resources: { ...prev.resources!, investedSlots, availableSlots: Math.max(0, (prev.resources?.maxSlots || 5) - investedSlots) },
        translationBudget: { ...prev.translationBudget!, expSpentOnSlots, expSpentOnPaths, remainingExp }
      };
    });
  };

  const handleTierUp = (e: React.MouseEvent, category: string, tagObj: any) => {
    e.stopPropagation();
    setCharacter(prev => {
      const catData = prev.tags[category as keyof MultiverseCharacter['tags']] as any;
      const selectedTags = [...(catData?.selected || [])];
      const tagIndex = selectedTags.findIndex((t: any) => t.name === tagObj.name);
      if (tagIndex === -1) return prev;
      
      const targetTag = selectedTags[tagIndex];
      const currentTier = targetTag.tier || 1;
      const maxTier = targetTag.maxTier || 4;

      if (currentTier >= maxTier) return prev;
      
      const cost = (currentTier + 1) * 5;
      if (prev.translationBudget!.remainingExp < cost) return prev;

      selectedTags[tagIndex] = {
        ...targetTag,
        tier: currentTier + 1
      };

      const newTags = {
        ...prev.tags,
        [category]: {
          ...catData,
          selected: selectedTags
        }
      };

      const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, prev.inventory, newTags, prev.upgradeOptions);

      return {
        ...prev,
        tags: newTags,
        translationBudget: { ...prev.translationBudget!, expSpentOnSlots, expSpentOnPaths, remainingExp }
      };
    });
  };

  const handleTierDown = (e: React.MouseEvent, category: string, tagObj: any) => {
    e.stopPropagation();
    setCharacter(prev => {
      const catData = prev.tags[category as keyof MultiverseCharacter['tags']] as any;
      const selectedTags = [...(catData?.selected || [])];
      const tagIndex = selectedTags.findIndex((t: any) => t.name === tagObj.name);
      if (tagIndex === -1) return prev;
      
      const targetTag = selectedTags[tagIndex];
      const currentTier = targetTag.tier || 1;

      if (currentTier <= 1) return prev;

      selectedTags[tagIndex] = {
        ...targetTag,
        tier: currentTier - 1
      };

      const newTags = {
        ...prev.tags,
        [category]: {
          ...catData,
          selected: selectedTags
        }
      };

      const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, prev.inventory, newTags, prev.upgradeOptions);

      return {
        ...prev,
        tags: newTags,
        translationBudget: { ...prev.translationBudget!, expSpentOnSlots, expSpentOnPaths, remainingExp }
      };
    });
  };

  const handleUpgradeToggle = (upgradeId: string) => {
    setCharacter(prev => {
      const upgrade = prev.upgradeOptions?.find(u => u.id === upgradeId);
      if (!upgrade) return prev;

      const isCurrentlyPurchased = upgrade.isPurchased;
      const budget = prev.translationBudget;

      // Purchasing
      if (!isCurrentlyPurchased) {
        if (budget.remainingExp < upgrade.expCost) return prev; // Not enough EXP
        
        let newTags = { ...prev.tags };
        let newApproaches = { ...prev.approaches };
        let newUpgradeOptions = [...prev.upgradeOptions];

        if (upgrade.type === 'MASTERY_TAG' || upgrade.type === 'PATH_TAG') {
          newTags.path.selected = [...(newTags.path.selected || []), {
            name: upgrade.name,
            benefit: upgrade.description,
            playstyle: 'Dynamic'
          }];
        } else if (upgrade.type === 'APPROACH_BUMP' && upgrade.targetApproach) {
          if (newApproaches[upgrade.targetApproach] >= 5) return prev; // Maxed out
          newApproaches[upgrade.targetApproach] += 1;
          
          const nextLevel = newApproaches[upgrade.targetApproach];
          if (nextLevel < 5) {
             const newId = `bump-${upgrade.targetApproach}-${nextLevel}-${nextLevel + 1}`;
             if (!newUpgradeOptions.some(u => u.id === newId)) {
                newUpgradeOptions.push({
                   id: newId,
                   type: 'APPROACH_BUMP',
                   targetApproach: upgrade.targetApproach,
                   name: `${upgrade.targetApproach.charAt(0).toUpperCase() + upgrade.targetApproach.slice(1)} ${nextLevel} -> ${nextLevel + 1}`,
                   description: `Increase your ${upgrade.targetApproach} approach from ${nextLevel} to ${nextLevel + 1}.`,
                   expCost: (nextLevel + 1) * 2,
                   isPurchased: false
                });
             }
          }
        }

        const finalUpgradeOptions = newUpgradeOptions.map(u => u.id === upgradeId ? { ...u, isPurchased: true } : u);
        const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, prev.inventory, newTags, finalUpgradeOptions);

        return {
          ...prev,
          tags: newTags,
          approaches: newApproaches,
          upgradeOptions: finalUpgradeOptions,
          resources: { ...prev.resources!, investedSlots, availableSlots: Math.max(0, (prev.resources?.maxSlots || 5) - investedSlots) },
          translationBudget: {
            ...budget,
            expSpentOnSlots,
            expSpentOnPaths,
            remainingExp
          }
        };
      } else {
        // Refunding
        let newTags = { ...prev.tags };
        let newApproaches = { ...prev.approaches };
        let newUpgradeOptions = [...prev.upgradeOptions];

        if (upgrade.type === 'MASTERY_TAG' || upgrade.type === 'PATH_TAG') {
          newTags.path.selected = (newTags.path.selected || []).filter((t: any) => t.name !== upgrade.name);
        } else if (upgrade.type === 'APPROACH_BUMP' && upgrade.targetApproach) {
          newApproaches[upgrade.targetApproach] = Math.max(0, newApproaches[upgrade.targetApproach] - 1);
          
          const currentLevel = newApproaches[upgrade.targetApproach];
          
          // Remove higher tier bumps that were auto-generated but not purchased
          newUpgradeOptions = newUpgradeOptions.filter(u => {
            if (u.type === 'APPROACH_BUMP' && u.targetApproach === upgrade.targetApproach && !u.isPurchased) {
               const match = u.name.match(/\d+ -> (\d+)/);
               if (match && parseInt(match[1]) > currentLevel + 1) {
                  return false; // remove it
               }
            }
            return true;
          });
        }

        const finalUpgradeOptions = newUpgradeOptions.map(u => u.id === upgradeId ? { ...u, isPurchased: false } : u);
        const { investedSlots, expSpentOnSlots, expSpentOnPaths, remainingExp } = recalculateBudget(prev, prev.inventory, newTags, finalUpgradeOptions);

        return {
          ...prev,
          tags: newTags,
          approaches: newApproaches,
          upgradeOptions: finalUpgradeOptions,
          resources: { ...prev.resources!, investedSlots, availableSlots: Math.max(0, (prev.resources?.maxSlots || 5) - investedSlots) },
          translationBudget: {
            ...budget,
            expSpentOnSlots,
            expSpentOnPaths,
            remainingExp
          }
        };
      }
    });
  };

  const approachSum = Object.values(character.approaches || {}).reduce((a, b) => a + b, 0);
  const isNextDisabled = 
    (currentStep === 0 && (approachSum < 12 || (character.unassignedCorePoints || 0) > 0)) ||
    (character.translationBudget && character.translationBudget.remainingExp < 0);
  // 1. Calculate Earned Tokens
  const svTagRender = character.tags?.race?.selected?.find((t: any) => t.name.toLowerCase() === 'skill versatility');
  const earnedTokens = svTagRender ? svTagRender.tier : 0;
  
  // 2. Calculate Used Tokens
  let usedUpgrades = 0;
  (['race', 'background', 'path', 'general'] as const).forEach(cat => {
    (character.tags[cat]?.selected || []).forEach((tag: any) => {
      if (tag.tier > 1 && tag.name.toLowerCase() !== 'skill versatility') {
        usedUpgrades += (tag.tier - 1);
      }
    });
  });

  // 3. Calculate Remaining Tokens
  const availableTokens = Math.max(0, earnedTokens - usedUpgrades);

  return (
    <div className="editor-container">
      {/* PERSISTENT WALLET */}
      {character.translationBudget && (
        <div style={{ position: 'sticky', top: 0, background: '#111', padding: '15px', zIndex: 10, borderBottom: '2px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Step {currentStep + 1}: {STEPS[currentStep]}</h2>
            <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>Multiverse Translation Wizard</div>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {character.translationBudget.remainingExp < 0 && (
              <div style={{ color: '#f87171', fontSize: '0.9rem', fontWeight: 'bold' }}>
                ⚠️ Insufficient EXP!
              </div>
            )}
            <button onClick={resetForm} style={{ background: 'transparent', border: '1px solid #555', color: '#ccc', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
              Reset Form
            </button>
            <div style={{ background: '#222', padding: '10px 20px', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              EXP Wallet: <span style={{ color: character.translationBudget.remainingExp >= 0 ? '#4ade80' : '#f87171' }}>{character.translationBudget.remainingExp}</span> / {character.translationBudget.totalImportedExp}
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '20px 0', minHeight: '50vh' }}>
        {/* STEP 1: IDENTITY & APPROACHES */}
        {currentStep === 0 && (
          <div>
            <div className="editor-section">
              <h3>Identity & Allegiance</h3>
              <div className="input-group">
                <label>Name: <input value={character.name || ''} onChange={e => handleIdentityChange('name', e.target.value)} /></label>
                <label>Pronouns: <input value={character.pronouns || ''} onChange={e => handleIdentityChange('pronouns', e.target.value)} /></label>
                <label>Race: <input value={character.nativeRace || ''} onChange={e => handleIdentityChange('nativeRace', e.target.value)} /></label>
                <label>Class: <input value={character.nativeClass || ''} onChange={e => handleIdentityChange('nativeClass', e.target.value)} /></label>
                <label>Subclass: <input value={character.nativeSubclass || ''} onChange={e => handleIdentityChange('nativeSubclass', e.target.value)} /></label>
              </div>
            </div>

            <div className="editor-section">
              <h3>12-Die Array (Approaches)</h3>
              <p style={{ color: '#888', marginBottom: '15px' }}>These base stats were calculated from your imported sheet. You will have a chance to upgrade these later with EXP.</p>
              
              {approachSum < 12 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>Approaches Array Error (Total: {approachSum} / 12)</h4>
                  <p style={{ color: '#fca5a5', margin: 0, fontSize: '0.9rem' }}>
                    The 12-Die Array must contain at least 12 total points distributed across the 5 approaches. Please adjust your approaches until the total is 12 or more.
                  </p>
                </div>
              )}

              {approachSum >= 12 && (character.unassignedCorePoints || 0) > 0 && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>Core Point Tie! ({character.unassignedCorePoints} Unassigned)</h4>
                  <p style={{ color: '#fca5a5', margin: 0, fontSize: '0.9rem' }}>
                    Your imported stats resulted in a mathematical tie. Please assign your remaining floating core points manually by clicking the [+] button next to your desired approach.
                  </p>
                </div>
              )}

              <div className="input-group approaches-group" style={{ display: 'grid', gap: '10px' }}>
                {Object.entries(character.approaches).map(([key, val]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                    <span className="capitalize" style={{ width: '100px', fontWeight: 'bold' }}>{key}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <input 
                        type="number" 
                        min="0" 
                        max="5" 
                        value={val} 
                        onChange={e => handleApproachChange(key as keyof MultiverseCharacter['approaches'], parseInt(e.target.value) || 0)} 
                        style={{ width: '60px', padding: '5px' }}
                      />
                      {(character.unassignedCorePoints || 0) > 0 && val < 5 && (
                        <button 
                          onClick={() => handleAssignCorePoint(key as keyof MultiverseCharacter['approaches'])}
                          style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 15px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          [ + ]
                        </button>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: IDENTITY & PATHS */}
        {currentStep === 1 && (
          <div className="editor-section">
            <h3>Identity & Tags</h3>
            <p style={{ color: '#888', marginBottom: '15px' }}>Your narrative footprint across the Multiverse. Each category has a free allotment. Extra tags cost exponentially more EXP based on bracket pricing.</p>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
               <h4 style={{ margin: '0 0 10px 0' }}>Core Identity</h4>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: '#ccc' }}>
                 <div><strong>Name:</strong> {character.name || 'Unknown'}</div>
                 <div><strong>Race:</strong> {character.nativeRace || 'Unknown'}</div>
                 <div><strong>Class:</strong> {character.nativeClass || 'Unknown'}</div>
                 <div><strong>System:</strong> {character.nativeSystem || 'Unknown'}</div>
               </div>
            </div>

            {(['race', 'background', 'path', 'general'] as const).map(category => {
              const catData = character.tags[category] as any;
              if (!catData) return null;
              
              const allCategoryTags = Array.from(new Map([...(catData.selected || []), ...(catData.extracted || [])].filter(Boolean).map(item => [item.name, item])).values());

              const titleMap: Record<string, string> = {
                 race: 'Racial Traits',
                 background: 'Background Features',
                 path: 'Path & Class Features',
                 general: 'General Proficiencies'
              };

              const selectedCount = catData.selected?.length || 0;
              const extraCount = Math.max(0, selectedCount - (catData.freeAllotment || 0));
              let bracketCost = 0;
              if (extraCount > 0) {
                 if (extraCount <= 2) bracketCost = extraCount * 2;
                 else if (extraCount <= 4) bracketCost = extraCount * 3;
                 else bracketCost = extraCount * 4;
              }

              return (
                <div key={category} className="path-tags-group" style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h4 style={{ margin: 0, textTransform: 'capitalize' }}>{titleMap[category]}</h4>
                    <div style={{ fontSize: '0.9rem', background: '#222', padding: '4px 8px', borderRadius: '4px' }}>
                      Free: {catData.freeAllotment} | Selected: {selectedCount} | <span style={{ color: extraCount > 0 ? '#f87171' : '#4ade80' }}>Cost: {bracketCost} EXP</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                    {allCategoryTags.length === 0 ? (
                      <div style={{ padding: '20px', color: '#666', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', gridColumn: '1 / -1' }}>
                        No features extracted for this category.
                      </div>
                    ) : allCategoryTags.map((tagObj: any, idx) => {
                      const selectedTag = catData.selected?.find((t: any) => t.name === tagObj.name);
                      const isSelected = !!selectedTag;
                      const tier = selectedTag?.tier || 1;
                      const maxTier = selectedTag?.maxTier || 4;
                      const isMastery = tier === maxTier;
                      
                      const getPlaystyleColor = (playstyle: string) => {
                        switch (playstyle?.toLowerCase()) {
                          case 'aggressive': return '#ef4444'; // Red
                          case 'defensive': return '#3b82f6'; // Blue
                          case 'support': return '#22c55e'; // Green
                          case 'utility': return '#eab308'; // Yellow
                          case 'dynamic': 
                          case 'general':
                          default: return '#6b7280'; // Grey
                        }
                      };

                      let displayTitle = tagObj.name;
                      if (isSelected) {
                        if (tier === 2) displayTitle = `[Expert: ${tagObj.name}]`;
                        if (tier === 3) displayTitle = `[Elite: ${tagObj.name}]`;
                        if (tier === 4) displayTitle = `[Master: ${tagObj.name}]`;
                      } else {
                        displayTitle = `[${tagObj.name}]`;
                      }

                      return (
                        <div 
                          key={idx} 
                          onClick={() => !isSelected && handleTagToggle(category, tagObj)}
                          style={{ 
                            background: isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', 
                            padding: '12px', 
                            borderRadius: '6px', 
                            cursor: isSelected ? 'default' : 'pointer',
                            borderLeft: `4px solid ${getPlaystyleColor(tagObj.playstyle)}`,
                            borderTop: isMastery ? '1px solid #f59e0b' : (tier > 1 ? '1px solid rgba(96, 165, 250, 0.5)' : (isSelected ? `1px solid ${getPlaystyleColor(tagObj.playstyle)}` : '1px solid #333')),
                            borderRight: isMastery ? '1px solid #f59e0b' : (tier > 1 ? '1px solid rgba(96, 165, 250, 0.5)' : (isSelected ? `1px solid ${getPlaystyleColor(tagObj.playstyle)}` : '1px solid #333')),
                            borderBottom: isMastery ? '1px solid #f59e0b' : (tier > 1 ? '1px solid rgba(96, 165, 250, 0.5)' : (isSelected ? `1px solid ${getPlaystyleColor(tagObj.playstyle)}` : '1px solid #333')),
                            boxShadow: isMastery ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            position: 'relative'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ fontWeight: 'bold', color: isMastery ? '#f59e0b' : 'inherit' }}>{displayTitle}</div>
                            {isSelected && (
                               <div style={{ display: 'flex', gap: '2px' }}>
                                 {Array.from({ length: maxTier }).map((_, i) => (
                                   <div key={i} style={{
                                     width: '8px', height: '8px',
                                     background: i < tier ? (isMastery ? '#f59e0b' : '#3b82f6') : 'transparent',
                                     border: `1px solid ${isMastery ? '#f59e0b' : '#3b82f6'}`,
                                     transform: 'rotate(45deg)'
                                   }} />
                                 ))}
                               </div>
                            )}
                          </div>
                          
                          <div style={{ fontStyle: 'italic', fontSize: '0.85rem', color: '#999' }} title={tagObj.benefit}>
                            <RealityText 
                              text={tagObj.benefit}
                              reality={character.currentReality}
                            />
                          </div>

                          {isSelected && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                              {!isMastery && (
                                <button 
                                  onClick={(e) => handleTierUp(e, category, tagObj)}
                                  disabled={(availableTokens === 0 || tagObj.name.toLowerCase() === 'skill versatility') && character.translationBudget!.remainingExp < (tier + 1) * 5}
                                  style={{ 
                                    background: '#4ade80', color: 'black', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: ((availableTokens > 0 && tagObj.name.toLowerCase() !== 'skill versatility') || character.translationBudget!.remainingExp >= (tier + 1) * 5) ? 'pointer' : 'not-allowed', fontSize: '0.8rem', opacity: ((availableTokens > 0 && tagObj.name.toLowerCase() !== 'skill versatility') || character.translationBudget!.remainingExp >= (tier + 1) * 5) ? 1 : 0.5
                                  }}
                                >
                                  {(availableTokens > 0 && tagObj.name.toLowerCase() !== 'skill versatility') ? "Tier Up (Free)" : `Tier Up (-${(tier + 1) * 5} EXP)`}
                                </button>
                              )}
                              {isMastery && (
                                <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 'bold' }}>Max Tier Reached</span>
                              )}
                              <button 
                                onClick={(e) => tier > 1 ? handleTierDown(e, category, tagObj) : handleTagToggle(category, tagObj)}
                                style={{ 
                                  background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                }}
                              >
                                {tier > 1 ? `Tier Down (+${tier * 5} EXP)` : 'Remove'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STEP 3: INVENTORY & LOADOUT */}
        {currentStep === 2 && (
          <div className="editor-section">
            <h3>Inventory & Loadout</h3>
            <p style={{ color: '#888', marginBottom: '15px' }}>
              Every significant item occupies 1 slot. 
              Your Base Slots: <strong>{character.resources?.maxSlots || 5}</strong>
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {character.inventory?.map((item, idx) => {
                const isEquipped = item.isEquipped !== false;
                return (
                <div key={idx} style={{ padding: '10px', background: isEquipped ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.4)', opacity: isEquipped ? 1 : 0.6, borderRadius: '4px', border: isEquipped ? '1px solid #555' : '1px dashed #333', position: 'relative', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ flex: 1, paddingRight: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong style={{ textDecoration: isEquipped ? 'none' : 'line-through' }}>{item.name}</strong>
                      <span style={{ color: item.slotsUsed > 0 && isEquipped ? '#f87171' : '#888' }}>[{item.slotsUsed} Slot]</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{item.domainTags?.join(', ')}</div>
                  </div>
                  <button 
                    onClick={() => handleToggleInventory(idx)}
                    style={{ background: isEquipped ? '#333' : '#4ade80', color: isEquipped ? '#ccc' : 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px 12px', fontSize: '0.8rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                    title={isEquipped ? "Unequip Item to save slots" : "Equip Item"}
                  >
                    {isEquipped ? 'Stash' : 'Equip'}
                  </button>
                  <button 
                    onClick={() => handleRemoveInventory(idx)}
                    style={{ background: 'transparent', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px', fontSize: '1rem' }}
                    title="Remove Item"
                  >
                    🗑️
                  </button>
                </div>
              )})}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="New Item Name..." 
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
                onKeyDown={e => e.key === 'Enter' && handleAddInventory()}
              />
              <input 
                type="number" 
                min="0"
                value={newItemSlots}
                onChange={e => setNewItemSlots(parseInt(e.target.value) || 0)}
                style={{ width: '80px', padding: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid #555', borderRadius: '4px' }}
              />
              <button onClick={handleAddInventory} style={{ padding: '10px 20px', background: '#4ade80', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Add Item
              </button>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: (character.resources?.investedSlots || 0) > 13 ? '2px solid #ef4444' : '1px solid #333' }}>
              <h4>Slot Summary</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: (character.resources?.investedSlots || 0) > 13 ? '#fca5a5' : '#e5e7eb' }}>
                <li>Max Base Slots Allowed: {character.resources?.maxSlots}</li>
                <li>Invested Slots: {character.resources?.investedSlots} {(character.resources?.investedSlots || 0) > 13 && "(WARNING: Exceeds absolute physical limit of 13!)"}</li>
                <li>Extra Slots Penalty: {character.translationBudget?.expSpentOnSlots} EXP</li>
              </ul>
              {/* Visual Indicator Bar */}
              <div style={{ marginTop: '15px', width: '100%', height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  background: (character.resources?.investedSlots || 0) > 13 ? '#ef4444' : ((character.resources?.investedSlots || 0) > (character.resources?.maxSlots || 5) ? '#fbbf24' : '#4ade80'),
                  width: `${Math.min(100, ((character.resources?.investedSlots || 0) / 13) * 100)}%`,
                  transition: 'width 0.3s ease-in-out, background 0.3s ease-in-out'
                }} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BESPOKE UPGRADES */}
        {currentStep === 3 && (
          <div className="editor-section">
            <h3>Bespoke Upgrades Store</h3>
            <p style={{ color: '#888', marginBottom: '15px' }}>Spend your converted EXP on narrative upgrades tailored to your character.</p>
            {character.upgradeOptions && character.upgradeOptions.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                {character.upgradeOptions.map(upgrade => {
                  const canAfford = character.translationBudget.remainingExp >= upgrade.expCost;
                  const isPurchased = upgrade.isPurchased;
                  const disabled = !isPurchased && !canAfford;
                  
                  return (
                    <div 
                      key={upgrade.id}
                      onClick={() => !disabled && handleUpgradeToggle(upgrade.id)}
                      style={{
                        background: isPurchased ? 'rgba(74, 222, 128, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isPurchased ? '#4ade80' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '8px',
                        padding: '15px',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.5 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, color: isPurchased ? '#4ade80' : 'white' }}>{upgrade.name}</h4>
                        <span style={{ background: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>
                          {upgrade.expCost} EXP
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '8px', textTransform: 'uppercase' }}>
                        {upgrade.type.replace('_', ' ')} {upgrade.targetApproach ? `(${upgrade.targetApproach})` : ''}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>{upgrade.description}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No bespoke upgrades generated for this character.</p>
            )}

          </div>
        )}

        {/* STEP 5: EXPORT & COMPLETE */}
        {currentStep === 4 && (
          <div className="editor-section" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <h2 style={{ color: '#4ade80' }}>Ready for the Multiverse!</h2>
            <p style={{ color: '#888', marginBottom: '30px', fontSize: '1.1rem' }}>
              Your character has been successfully translated and leveled up. 
              Choose how you want to save your sheet.
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
              <button 
                onClick={() => downloadMarkdown(character)}
                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Markdown (.md)
              </button>
              
              <button 
                onClick={() => downloadPDF(character)}
                style={{ background: '#ef4444', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                Download PDF (.pdf)
              </button>
            </div>

            <button 
              onClick={onComplete}
              disabled={character.translationBudget && character.translationBudget.remainingExp < 0}
              style={{ 
                background: '#22c55e', 
                color: 'black', 
                border: 'none', 
                padding: '15px 40px', 
                borderRadius: '8px', 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                cursor: (character.translationBudget && character.translationBudget.remainingExp < 0) ? 'not-allowed' : 'pointer',
                opacity: (character.translationBudget && character.translationBudget.remainingExp < 0) ? 0.5 : 1
              }}
            >
              Finish & Return Home
            </button>
          </div>
        )}
      </div>

      {/* STEP NAVIGATION FOOTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #333' }}>
        {currentStep > 0 ? (
          <button className="btn-secondary" onClick={prevStep}>&larr; Back</button>
        ) : (
          <button className="btn-secondary" onClick={onCancel}>Cancel Upload</button>
        )}

        {currentStep < STEPS.length - 1 && (
          <button 
            className="btn-primary" 
            onClick={nextStep}
            disabled={isNextDisabled}
            style={{ 
              opacity: isNextDisabled ? 0.5 : 1, 
              cursor: isNextDisabled ? 'not-allowed' : 'pointer' 
            }}
          >
            Next: {STEPS[currentStep + 1]} &rarr;
          </button>
        )}
      </div>
    </div>
  );
}
