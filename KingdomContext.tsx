
import React, { createContext, useContext, useState, useEffect } from 'react';
import { KingdomData, Settlement, KingdomEvent, KingdomSkill, KingdomAttributeKey } from './types';
import { INITIAL_KINGDOM_DATA, GOVERNMENT_TYPES, CHARTER_TYPES, HEARTLAND_TYPES } from './constants';

interface KingdomContextType {
  kingdoms: KingdomData[];
  activeKingdom: KingdomData | null;
  selectKingdom: (id: string | null) => void;
  createNewKingdom: (name: string) => void;
  deleteKingdom: (id: string) => void;
  updateStats: (updates: Partial<KingdomData['stats']>) => void;
  updateLeaders: (leaders: Record<string, string>) => void;
  updateSkill: (skillName: string, updates: Partial<KingdomSkill>) => void;
  toggleFeat: (featName: string) => void;
  toggleStructure: (name: string, costs: { rp: number; wood?: number; luxury?: number; stone?: number; ore?: number; food?: number }, levelReq: number) => boolean;
  setGovernment: (govId: string) => void;
  setGovernmentFreeBoost: (index: number, attr: KingdomAttributeKey) => void;
  setCharter: (charterId: string) => void;
  setCharterFreeBoost: (index: number, attr: KingdomAttributeKey) => void;
  setHeartland: (heartlandId: string) => void;
  addSettlement: (s: Settlement) => void;
  removeSettlement: (id: string) => void;
  updateSettlement: (id: string, updates: Partial<Settlement>) => void;
  addEvent: (e: KingdomEvent) => void;
  updateEvent: (id: string, updates: Partial<KingdomEvent>) => void;
  removeEvent: (id: string) => void;
  nextTurn: () => void;
  prevTurn: () => void;
}

const KingdomContext = createContext<KingdomContextType | undefined>(undefined);

export const KingdomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kingdoms, setKingdoms] = useState<KingdomData[]>(() => {
    const saved = localStorage.getItem('kingdom_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeKingdomId, setActiveKingdomId] = useState<string | null>(() => {
    return localStorage.getItem('active_kingdom_id');
  });

  const activeKingdom = kingdoms.find(k => k.id === activeKingdomId) || null;

  useEffect(() => {
    localStorage.setItem('kingdom_list', JSON.stringify(kingdoms));
  }, [kingdoms]);

  useEffect(() => {
    if (activeKingdomId) {
      localStorage.setItem('active_kingdom_id', activeKingdomId);
    } else {
      localStorage.removeItem('active_kingdom_id');
    }
  }, [activeKingdomId]);

  const selectKingdom = (id: string | null) => setActiveKingdomId(id);

  const createNewKingdom = (name: string) => {
    const newKingdom: KingdomData = {
      ...INITIAL_KINGDOM_DATA,
      id: Math.random().toString(36).substr(2, 9),
      stats: { ...INITIAL_KINGDOM_DATA.stats, name }
    };
    setKingdoms(prev => [...prev, newKingdom]);
    setActiveKingdomId(newKingdom.id);
  };

  const deleteKingdom = (id: string) => {
    setKingdoms(prev => prev.filter(k => k.id !== id));
    if (activeKingdomId === id) setActiveKingdomId(null);
  };

  const updateActiveKingdom = (updater: (prev: KingdomData) => KingdomData) => {
    if (!activeKingdomId) return;
    setKingdoms(prev => {
      const kingdom = prev.find(k => k.id === activeKingdomId);
      if (!kingdom) return prev;
      
      const updated = updater(kingdom);
      const stats = updated.stats;
      
      (Object.keys(stats.attributes) as KingdomAttributeKey[]).forEach(key => {
        const attr = stats.attributes[key];
        attr.mod = Math.floor((attr.value - 10) / 2);
      });

      const currentLevel = stats.level;
      const dynamicThreshold = 9 + currentLevel;
      const processedRuins = { ...stats.ruins };
      let hasRuinOverflow = false;

      (Object.keys(processedRuins) as Array<keyof typeof processedRuins>).forEach(key => {
        const ruin = processedRuins[key];
        ruin.threshold = dynamicThreshold;
        while (ruin.value >= dynamicThreshold && dynamicThreshold > 0) {
          ruin.value -= dynamicThreshold;
          ruin.pen += 1;
          hasRuinOverflow = true;
        }
      });

      if (hasRuinOverflow) {
        stats.ruins = processedRuins;
      }

      return prev.map(k => k.id === activeKingdomId ? updated : k);
    });
  };

  const updateStats = (updates: Partial<KingdomData['stats']>) => {
    updateActiveKingdom(prev => ({ ...prev, stats: { ...prev.stats, ...updates } }));
  };

  const updateLeaders = (leaders: Record<string, string>) => {
    updateActiveKingdom(prev => ({ ...prev, leaders: { ...prev.leaders, ...leaders } }));
  };

  const toggleFeat = (featName: string) => {
    updateActiveKingdom(prev => {
      const currentFeats = prev.stats.feats || [];
      const newFeats = currentFeats.includes(featName)
        ? currentFeats.filter(f => f !== featName)
        : [...currentFeats, featName];
      return { ...prev, stats: { ...prev.stats, feats: newFeats } };
    });
  };

  const toggleStructure = (name: string, costs: { rp: number; wood?: number; luxury?: number; stone?: number; ore?: number; food?: number }, levelReq: number) => {
    let success = false;
    updateActiveKingdom(prev => {
      const currentBuilt = prev.stats.builtStructures || [];
      const isBuilt = currentBuilt.includes(name);

      if (isBuilt) {
        success = true;
        return { ...prev, stats: { ...prev.stats, builtStructures: currentBuilt.filter(n => n !== name) } };
      } else {
        const s = prev.stats;
        const canAfford = 
          s.level >= levelReq &&
          s.resources.rp >= costs.rp &&
          s.resources.materials.wood >= (costs.wood || 0) &&
          s.resources.materials.luxury >= (costs.luxury || 0) &&
          s.resources.materials.stone >= (costs.stone || 0) &&
          s.resources.materials.ore >= (costs.ore || 0) &&
          s.resources.materials.food >= (costs.food || 0);

        if (canAfford) {
          success = true;
          const newStats = { ...s };
          newStats.resources.rp -= costs.rp;
          newStats.resources.materials.wood -= (costs.wood || 0);
          newStats.resources.materials.luxury -= (costs.luxury || 0);
          newStats.resources.materials.stone -= (costs.stone || 0);
          newStats.resources.materials.ore -= (costs.ore || 0);
          newStats.resources.materials.food -= (costs.food || 0);
          newStats.builtStructures = [...currentBuilt, name];
          return { ...prev, stats: newStats };
        } else {
          alert(`Recursos Insuficientes ou Nível inadequado!`);
          success = false;
          return prev;
        }
      }
    });
    return success;
  };

  const setGovernment = (govId: string) => {
    updateActiveKingdom(prev => {
      const isDeselecting = prev.stats.governmentId === govId;
      const oldGov = GOVERNMENT_TYPES.find(g => g.id === prev.stats.governmentId);
      const newAttrs = { ...prev.stats.attributes };

      if (oldGov) {
        oldGov.boosts.forEach(b => newAttrs[b].value -= 2);
        prev.stats.governmentFreeBoosts.forEach(b => { if (b) newAttrs[b].value -= 2; });
      }

      if (isDeselecting) {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            governmentId: undefined,
            governmentFreeBoosts: [],
            attributes: newAttrs,
            skills: prev.stats.skills.map(skill => {
              if (oldGov?.skills.includes(skill.name)) return { ...skill, rank: 0 };
              return skill;
            })
          }
        };
      }

      const newGov = GOVERNMENT_TYPES.find(g => g.id === govId);
      if (!newGov) return prev;
      newGov.boosts.forEach(b => newAttrs[b].value += 2);
      return { 
        ...prev, 
        stats: { 
          ...prev.stats, 
          governmentId: govId,
          governmentFreeBoosts: new Array(newGov.freeBoosts).fill(null),
          attributes: newAttrs,
          skills: prev.stats.skills.map(skill => {
            if (newGov.skills.includes(skill.name)) return { ...skill, rank: 2 };
            return skill;
          })
        } 
      };
    });
  };

  const setGovernmentFreeBoost = (index: number, attr: KingdomAttributeKey) => {
    updateActiveKingdom(prev => {
      const newStats = { ...prev.stats };
      const newAttrs = { ...newStats.attributes };
      const newChoices = [...newStats.governmentFreeBoosts];
      const oldChoice = newChoices[index];
      if (oldChoice === attr) return prev;
      if (oldChoice) newAttrs[oldChoice].value -= 2;
      newAttrs[attr].value += 2;
      newChoices[index] = attr;
      return { ...prev, stats: { ...newStats, governmentFreeBoosts: newChoices, attributes: newAttrs } };
    });
  };

  const setCharter = (charterId: string) => {
    updateActiveKingdom(prev => {
      const isDeselecting = prev.stats.charterId === charterId;
      const currentCharter = CHARTER_TYPES.find(c => c.id === prev.stats.charterId);
      const newAttrs = { ...prev.stats.attributes };

      if (currentCharter) {
        currentCharter.boosts.forEach(b => newAttrs[b].value -= 2);
        if (currentCharter.flaw) newAttrs[currentCharter.flaw].value += 2;
        prev.stats.charterFreeBoosts.forEach(b => { if (b) newAttrs[b].value -= 2; });
      }

      if (isDeselecting) {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            charterId: undefined,
            charterFreeBoosts: [],
            attributes: newAttrs
          }
        };
      }

      const nextCharter = CHARTER_TYPES.find(c => c.id === charterId);
      if (!nextCharter) return prev;
      nextCharter.boosts.forEach(b => newAttrs[b].value += 2);
      if (nextCharter.flaw) newAttrs[nextCharter.flaw].value -= 2;
      return { 
        ...prev, 
        stats: { 
          ...prev.stats, 
          charterId, 
          charterFreeBoosts: new Array(nextCharter.freeBoosts).fill(null),
          attributes: newAttrs 
        } 
      };
    });
  };

  const setCharterFreeBoost = (index: number, attr: KingdomAttributeKey) => {
    updateActiveKingdom(prev => {
      const newStats = { ...prev.stats };
      const newAttrs = { ...newStats.attributes };
      const newChoices = [...newStats.charterFreeBoosts];
      const oldChoice = newChoices[index];
      if (oldChoice === attr) return prev;
      if (oldChoice) newAttrs[oldChoice].value -= 2;
      newAttrs[attr].value += 2;
      newChoices[index] = attr;
      return { ...prev, stats: { ...newStats, charterFreeBoosts: newChoices, attributes: newAttrs } };
    });
  };

  const setHeartland = (heartlandId: string) => {
    updateActiveKingdom(prev => {
      const isDeselecting = prev.stats.heartlandId === heartlandId;
      const currentHeart = HEARTLAND_TYPES.find(h => h.id === prev.stats.heartlandId);
      const newAttrs = { ...prev.stats.attributes };

      if (currentHeart) newAttrs[currentHeart.boost].value -= 2;
      if (isDeselecting) return { ...prev, stats: { ...prev.stats, heartlandId: undefined, attributes: newAttrs } };

      const nextHeart = HEARTLAND_TYPES.find(h => h.id === heartlandId);
      if (!nextHeart) return prev;
      newAttrs[nextHeart.boost].value += 2;
      return { ...prev, stats: { ...prev.stats, heartlandId, attributes: newAttrs } };
    });
  };

  const updateSkill = (skillName: string, updates: Partial<KingdomSkill>) => {
    updateActiveKingdom(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        skills: prev.stats.skills.map(s => s.name === skillName ? { ...s, ...updates } : s)
      }
    }));
  };

  const addSettlement = (s: Settlement) => {
    updateActiveKingdom(prev => ({ ...prev, settlements: [...prev.settlements, s] }));
  };

  const removeSettlement = (id: string) => {
    updateActiveKingdom(prev => ({ ...prev, settlements: prev.settlements.filter(s => s.id !== id) }));
  };

  const updateSettlement = (id: string, updates: Partial<Settlement>) => {
    updateActiveKingdom(prev => ({
      ...prev,
      settlements: prev.settlements.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const addEvent = (e: KingdomEvent) => {
    updateActiveKingdom(prev => ({ ...prev, events: [e, ...prev.events] }));
  };

  const updateEvent = (id: string, updates: Partial<KingdomEvent>) => {
    updateActiveKingdom(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const removeEvent = (id: string) => {
    updateActiveKingdom(prev => ({ ...prev, events: prev.events.filter(e => e.id !== id) }));
  };

  const nextTurn = () => {
    updateActiveKingdom(prev => ({
      ...prev,
      stats: { ...prev.stats, currentTurn: prev.stats.currentTurn + 1 }
    }));
  };

  const prevTurn = () => {
    updateActiveKingdom(prev => ({
      ...prev,
      stats: { ...prev.stats, currentTurn: Math.max(1, prev.stats.currentTurn - 1) }
    }));
  };

  return (
    <KingdomContext.Provider value={{ 
      kingdoms, activeKingdom, selectKingdom, createNewKingdom, deleteKingdom,
      updateStats, updateLeaders, updateSkill, toggleFeat, toggleStructure, setGovernment, setGovernmentFreeBoost, setCharter, setCharterFreeBoost, setHeartland,
      addSettlement, removeSettlement, updateSettlement,
      addEvent, updateEvent, removeEvent,
      nextTurn, prevTurn
    }}>
      {children}
    </KingdomContext.Provider>
  );
};

export const useKingdom = () => {
  const context = useContext(KingdomContext);
  if (!context) throw new Error("useKingdom must be used within KingdomProvider");
  return context;
};
