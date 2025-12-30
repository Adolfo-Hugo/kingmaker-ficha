
import React from 'react';
import { CHARTER_TYPES } from '../constants';
import { BrutalCard } from '../components/UI';
import { useKingdom } from '../KingdomContext';
import { KingdomAttributeKey } from '../types';

const CharterList: React.FC = () => {
  const { activeKingdom, setCharter, setCharterFreeBoost } = useKingdom();

  const attrLabels: Record<KingdomAttributeKey, string> = {
    culture: 'Cultura',
    economy: 'Economia',
    loyalty: 'Lealdade',
    stability: 'Estabilidade'
  };

  return (
    <div className="space-y-8">
      <div className="border-b-4 border-black dark:border-white pb-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Licenças Reais</h1>
        <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">O documento que autoriza a fundação do seu reino</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {CHARTER_TYPES.map(charter => {
          const isActive = activeKingdom?.stats.charterId === charter.id;
          return (
            <BrutalCard 
              key={charter.id} 
              className={`flex flex-col h-full transition-all ${isActive ? 'ring-4 ring-primary bg-primary/5' : 'hover:border-primary'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black font-display uppercase leading-tight text-primary dark:text-accent">
                  {charter.name}
                </h3>
                <div className="flex items-center gap-2">
                   <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={() => setCharter(charter.id)}
                    className="w-8 h-8 border-4 border-black dark:border-white text-primary focus:ring-0 rounded-none bg-white dark:bg-gray-800 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="flex-grow space-y-4">
                <p className="text-sm italic opacity-80 border-l-4 border-primary pl-4">
                  {charter.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black dark:bg-white text-white dark:text-black p-3">
                    <span className="text-[10px] font-black uppercase block mb-1 opacity-60 tracking-tighter">Melhorias</span>
                    <div className="text-[11px] font-black uppercase">
                      {charter.boosts.length > 0 
                        ? charter.boosts.map(b => attrLabels[b]).join(', ')
                        : 'Nenhuma fixa'}
                    </div>
                    {charter.freeBoosts > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <span className="text-[9px] font-black uppercase block mb-1 opacity-40">+ {charter.freeBoosts} Livre(s)</span>
                        {isActive ? (
                          <div className="space-y-2">
                            {new Array(charter.freeBoosts).fill(null).map((_, i) => (
                              <select
                                key={i}
                                value={activeKingdom.stats.charterFreeBoosts[i] || ''}
                                onChange={(e) => setCharterFreeBoost(i, e.target.value as KingdomAttributeKey)}
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
                          <div className="text-[10px] italic opacity-40">Selecione para configurar</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`p-3 border-2 border-black ${charter.flaw ? 'bg-red-700 text-white' : 'bg-gray-200 dark:bg-gray-800 opacity-30'}`}>
                    <span className="text-[10px] font-black uppercase block mb-1 opacity-60 tracking-tighter">Defeito</span>
                    <div className="text-[11px] font-black uppercase">
                      {charter.flaw ? attrLabels[charter.flaw] : 'Nenhum'}
                    </div>
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-primary text-[10px] font-black uppercase text-primary animate-pulse">
                  Licença Ativa • Atributos Sincronizados
                </div>
              )}
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
};

export default CharterList;
