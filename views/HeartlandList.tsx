
import React from 'react';
import { HEARTLAND_TYPES } from '../constants';
import { BrutalCard } from '../components/UI';
import { useKingdom } from '../KingdomContext';

const HeartlandList: React.FC = () => {
  const { activeKingdom, setHeartland } = useKingdom();

  return (
    <div className="space-y-8">
      <div className="border-b-4 border-black dark:border-white pb-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Regiões Centrais</h1>
        <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">A geografia que define o temperamento do seu povo</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {HEARTLAND_TYPES.map(heart => {
          const isActive = activeKingdom?.stats.heartlandId === heart.id;
          return (
            <BrutalCard 
              key={heart.id} 
              className={`flex flex-col h-full transition-all ${isActive ? 'ring-4 ring-primary bg-primary/5' : 'hover:border-primary'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-black font-display uppercase leading-tight text-primary dark:text-accent">
                  {heart.name}
                </h3>
                <div className="flex items-center gap-2">
                   <input 
                    type="checkbox" 
                    checked={isActive} 
                    onChange={() => setHeartland(heart.id)}
                    className="w-8 h-8 border-4 border-black dark:border-white text-primary focus:ring-0 rounded-none bg-white dark:bg-gray-800 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="flex-grow space-y-4">
                <p className="text-sm italic opacity-80 border-l-4 border-primary pl-4">
                  {heart.description}
                </p>

                <div className="bg-accent text-white p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                  <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Melhoria de Atributo</span>
                  <div className="text-lg font-black uppercase">
                    {heart.boost === 'culture' ? 'Cultura' : heart.boost === 'economy' ? 'Economia' : heart.boost === 'loyalty' ? 'Lealdade' : 'Estabilidade'} +2
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-primary text-[10px] font-black uppercase text-primary animate-pulse">
                  Território Consolidado
                </div>
              )}
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
};

export default HeartlandList;
