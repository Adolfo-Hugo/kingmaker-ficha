
import React, { useState } from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard } from '../components/UI';
import { KingdomSkill } from '../types';

const SkillSheet: React.FC = () => {
  const { activeKingdom: kingdom, updateSkill, updateStats } = useKingdom();

  if (!kingdom) return null;

  const handleApplyCrit = (type: 'fame' | 'infamy') => {
    if (type === 'fame') {
      updateStats({ fame: kingdom.stats.fame + 1 });
    } else {
      updateStats({ infamy: kingdom.stats.infamy + 1 });
    }
  };

  return (
    <div className="overflow-x-auto pb-4">
      <BrutalCard className="min-w-[1250px] p-0 overflow-hidden">
        {/* Header da Tabela - Ajustado para incluir coluna CD e Rolagem */}
        <div className="grid grid-cols-[180px_70px_20px_110px_50px_130px_70px_70px_70px_70px_80px_130px] gap-2 p-4 bg-gray-50 dark:bg-black/40 border-b-4 border-black dark:border-white font-black text-[10px] uppercase tracking-tighter">
          <div>Perícia</div>
          <div className="text-center">Mod</div>
          <div></div>
          <div className="text-center">Atributo</div>
          <div className="text-center">Prof</div>
          <div className="flex justify-between px-2">
            <span>T</span><span>E</span><span>M</span><span>L</span>
          </div>
          <div className="text-center">Estado</div>
          <div className="text-center">Circ</div>
          <div className="text-center">Item</div>
          <div className="text-center">Outros</div>
          <div className="text-center bg-primary/20">CD</div>
          <div className="text-center bg-accent/20">Rolagem</div>
        </div>

        {/* Linhas de Perícias */}
        <div className="divide-y-2 divide-gray-200 dark:divide-gray-800">
          {kingdom.stats.skills.map((skill) => (
            <SkillRow 
              key={skill.name} 
              skill={skill} 
              kingdomLevel={kingdom.stats.level} 
              attributeMod={kingdom.stats.attributes[skill.linkedAttribute].mod} 
              onUpdate={updateSkill}
              onApplyCrit={handleApplyCrit}
            />
          ))}
        </div>
      </BrutalCard>
    </div>
  );
};

const SkillRow: React.FC<{ 
  skill: KingdomSkill; 
  kingdomLevel: number; 
  attributeMod: number;
  onUpdate: (name: string, updates: Partial<KingdomSkill>) => void;
  onApplyCrit: (type: 'fame' | 'infamy') => void;
}> = ({ skill, kingdomLevel, attributeMod, onUpdate, onApplyCrit }) => {
  
  const [lastRoll, setLastRoll] = useState<{ d20: number; total: number; isCrit: boolean; isSuccess: boolean } | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showCritChoice, setShowCritChoice] = useState(false);

  const profValue = (skill.rank > 0 ? kingdomLevel : 0) + skill.rank;
  const totalMod = attributeMod + profValue + skill.statusBonus + skill.circumstanceBonus + skill.itemBonus + skill.otherBonus;
  const currentDC = skill.targetDC || 0;

  const handleRoll = () => {
    setIsRolling(true);
    setShowCritChoice(false);
    setTimeout(() => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const total = d20 + totalMod;
      const isCrit = d20 === 20 || (currentDC > 0 && total >= currentDC + 10);
      const isSuccess = currentDC > 0 ? total >= currentDC : true;
      
      setLastRoll({ d20, total, isCrit, isSuccess });
      setIsRolling(false);
      
      if (isCrit) {
        setShowCritChoice(true);
      }
    }, 150);
  };

  const applyCritResult = (type: 'fame' | 'infamy') => {
    onApplyCrit(type);
    setShowCritChoice(false);
  };

  const handleRankToggle = (targetRank: 2 | 4 | 6 | 8) => {
    onUpdate(skill.name, { rank: skill.rank === targetRank ? 0 : targetRank });
  };

  const handleNumChange = (field: keyof KingdomSkill, val: string) => {
    onUpdate(skill.name, { [field]: parseInt(val) || 0 });
  };

  const attrLabel = skill.linkedAttribute === 'culture' ? 'CULTURA' : 
                   skill.linkedAttribute === 'economy' ? 'ECONOMIA' : 
                   skill.linkedAttribute === 'loyalty' ? 'LEALDADE' : 'ESTABILIDADE';

  return (
    <div className="grid grid-cols-[180px_70px_20px_110px_50px_130px_70px_70px_70px_70px_80px_130px] gap-2 p-2 items-center hover:bg-primary/5 transition-colors group relative">
      <div className="font-display font-black text-sm text-primary dark:text-accent uppercase truncate">
        {skill.name}
      </div>
      
      {/* MOD Total */}
      <div className="flex justify-center">
        <div className="w-12 h-12 border-4 border-black dark:border-white flex items-center justify-center font-black text-lg bg-white dark:bg-surface-dark shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {totalMod >= 0 ? `+${totalMod}` : totalMod}
        </div>
      </div>

      <div className="text-xl font-black text-center">=</div>

      {/* Atributo Vinculado */}
      <div className="px-1">
        <div className="bg-primary/90 text-white text-[9px] font-black text-center py-2 border-2 border-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
          {attrLabel}
        </div>
      </div>

      {/* Valor Proficiência (Lvl + Rank) */}
      <div className="flex justify-center">
        <div className="w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center font-bold text-sm bg-gray-100 dark:bg-gray-800">
          {profValue}
        </div>
      </div>

      {/* Ranks T E M L */}
      <div className="flex justify-between items-center px-2 gap-1">
        {[2, 4, 6, 8].map((r) => (
          <button
            key={r}
            onClick={() => handleRankToggle(r as 2 | 4 | 6 | 8)}
            className={`w-6 h-6 border-2 border-black dark:border-white transition-all ${skill.rank >= r ? 'bg-primary shadow-inner' : 'bg-white dark:bg-gray-900'}`}
          />
        ))}
      </div>

      {/* Bônus Adicionais */}
      <div className="px-1">
        <input 
          type="number" 
          value={skill.statusBonus} 
          onChange={e => handleNumChange('statusBonus', e.target.value)}
          className="w-full h-10 border-2 border-black dark:border-white bg-transparent text-center font-bold focus:ring-primary focus:border-primary" 
        />
      </div>
      <div className="px-1">
        <input 
          type="number" 
          value={skill.circumstanceBonus} 
          onChange={e => handleNumChange('circumstanceBonus', e.target.value)}
          className="w-full h-10 border-2 border-black dark:border-white bg-transparent text-center font-bold focus:ring-primary focus:border-primary" 
        />
      </div>
      <div className="px-1">
        <input 
          type="number" 
          value={skill.itemBonus} 
          onChange={e => handleNumChange('itemBonus', e.target.value)}
          className="w-full h-10 border-2 border-black dark:border-white bg-transparent text-center font-bold focus:ring-primary focus:border-primary" 
        />
      </div>
      <div className="px-1">
        <input 
          type="number" 
          value={skill.otherBonus} 
          onChange={e => handleNumChange('otherBonus', e.target.value)}
          className="w-full h-10 border-2 border-black dark:border-white bg-transparent text-center font-bold focus:ring-primary focus:border-primary" 
        />
      </div>

      {/* Coluna CD */}
      <div className="px-1">
        <input 
          type="number" 
          value={skill.targetDC || ''} 
          placeholder="CD"
          onChange={e => handleNumChange('targetDC', e.target.value)}
          className="w-full h-10 border-2 border-black dark:border-primary bg-primary/5 text-center font-black text-sm focus:ring-primary focus:border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]" 
        />
      </div>

      {/* Coluna de Rolagem */}
      <div className="flex items-center gap-2 pl-2">
        <button 
          onClick={handleRoll}
          disabled={isRolling}
          className={`w-10 h-10 border-2 border-black dark:border-white flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-primary dark:hover:bg-primary hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] ${isRolling ? 'animate-pulse' : ''}`}
        >
          <span className="material-icons text-sm">casino</span>
        </button>
        <div className={`flex-grow h-10 border-2 border-dashed border-black dark:border-white flex items-center justify-center font-black text-sm relative overflow-hidden transition-colors ${lastRoll ? (lastRoll.isCrit ? 'bg-yellow-400 dark:bg-yellow-600' : (lastRoll.isSuccess ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40')) : 'opacity-30'}`}>
          {lastRoll ? (
            <div className="flex flex-col items-center leading-none">
              <span className="text-[9px] opacity-60">D20:{lastRoll.d20}</span>
              <span className="text-lg">{lastRoll.total}</span>
            </div>
          ) : (
            '--'
          )}
        </div>
      </div>

      {/* Overlay de Sucesso Crítico */}
      {showCritChoice && (
        <div className="absolute inset-0 bg-yellow-400/95 flex items-center justify-center z-20 border-2 border-black animate-in fade-in zoom-in duration-200">
          <span className="font-black text-xs uppercase mr-4 text-black">Sucesso Crítico! Aumentar:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => applyCritResult('fame')}
              className="bg-primary text-white px-3 py-1 font-black text-[10px] uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Fama +1
            </button>
            <button 
              onClick={() => applyCritResult('infamy')}
              className="bg-red-700 text-white px-3 py-1 font-black text-[10px] uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              Infâmia +1
            </button>
            <button 
              onClick={() => setShowCritChoice(false)}
              className="bg-black text-white px-2 py-1 font-black text-[10px] uppercase border-2 border-white"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSheet;
