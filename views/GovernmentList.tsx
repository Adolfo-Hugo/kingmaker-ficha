
import React from 'react';
import { GOVERNMENT_TYPES } from '../constants';
import { BrutalCard } from '../components/UI';
import { useKingdom } from '../KingdomContext';
import { KingdomAttributeKey } from '../types';

const GovernmentList: React.FC = () => {
  const { activeKingdom, setGovernment, setGovernmentFreeBoost } = useKingdom();

  const attrLabels: Record<KingdomAttributeKey, string> = {
    culture: 'Cultura',
    economy: 'Economia',
    loyalty: 'Lealdade',
    stability: 'Estabilidade'
  };

  return (
    <div className="space-y-8">
      <div className="border-b-4 border-black dark:border-white pb-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Tipos de Governo</h1>
        <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">A estrutura política do seu domínio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {GOVERNMENT_TYPES.map(gov => {
          const isActive = activeKingdom?.stats.governmentId === gov.id;
          return (
            <BrutalCard 
              key={gov.id} 
              className={`flex flex-col h-full transition-all ${isActive ? 'ring-4 ring-primary bg-primary/5' : 'hover:border-primary'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black font-display uppercase leading-tight text-primary dark:text-accent">
                  {gov.name}
                </h3>
                <div className="flex items-center gap-2">
                   <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={() => setGovernment(gov.id)}
                    className="w-8 h-8 border-4 border-black dark:border-white text-primary focus:ring-0 rounded-none bg-white dark:bg-gray-800 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="flex-grow space-y-4">
                <p className="text-sm italic opacity-80 border-l-4 border-primary pl-4">
                  {gov.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black dark:bg-white text-white dark:text-black p-3 shadow-brutal">
                    <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Melhorias</span>
                    <div className="text-xs font-black uppercase">
                      {gov.boosts.map(b => attrLabels[b]).join(', ')}
                    </div>
                    {gov.freeBoosts > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <span className="text-[9px] font-black uppercase block mb-1 opacity-40">+ {gov.freeBoosts} Livre</span>
                        {isActive ? (
                          <div className="space-y-2">
                            {new Array(gov.freeBoosts).fill(null).map((_, i) => (
                              <select
                                key={i}
                                value={activeKingdom.stats.governmentFreeBoosts[i] || ''}
                                onChange={(e) => setGovernmentFreeBoost(i, e.target.value as KingdomAttributeKey)}
                                className="w-full bg-white text-black text-[10px] font-black uppercase border-2 border-black p-1 focus:ring-0"
                              >
                                <option value="" disabled>Selecionar...</option>
                                {(Object.keys(attrLabels) as KingdomAttributeKey[]).map(attr => (
                                  <option key={attr} value={attr}>{attrLabels[attr]}</option>
                                ))}
                              </select>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[10px] italic opacity-40">Adote para configurar</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="bg-primary text-white p-3 shadow-brutal border-2 border-black">
                    <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Proficiências</span>
                    <div className="text-xs font-black uppercase">
                      {gov.skills.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="mt-6 pt-4 border-t-2 border-dashed border-primary text-[10px] font-black uppercase text-primary animate-pulse">
                  Governo Ativo • Instituições Sincronizadas
                </div>
              )}
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
};

export default GovernmentList;
