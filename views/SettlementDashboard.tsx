
import React, { useState } from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard, BrutalButton, BrutalInput } from '../components/UI';
import { Settlement } from '../types';

const SettlementDashboard: React.FC = () => {
  const { activeKingdom: kingdom, addSettlement, removeSettlement, updateSettlement } = useKingdom();
  const [searchTerm, setSearchTerm] = useState("");

  if (!kingdom) return null;

  const filteredSettlements = kingdom.settlements.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addNew = () => {
    const id = Math.random().toString(36).substr(2, 9);
    addSettlement({
      id,
      name: "Novo Assentamento",
      population: 0,
      loyalty: 0,
      primaryResource: "Nenhum",
      production: 0,
      stability: 50,
    });
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho seguindo o padrão da aba Eventos */}
      <div className="flex justify-between items-center border-b-4 border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display text-primary dark:text-accent">
            Assentamentos
          </h1>
          <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">
            Gestão Territorial • Turno {kingdom.stats.currentTurn}
          </p>
        </div>
        <div className="flex gap-4">
          <BrutalButton onClick={addNew}>
            <span className="material-icons text-sm mr-2">add</span> Novo Assentamento
          </BrutalButton>
        </div>
      </div>

      <BrutalCard className="mb-8">
        <div className="w-full md:w-1/2">
          <label className="block text-[10px] font-black uppercase mb-1 opacity-60">Buscar Assentamento</label>
          <BrutalInput 
            placeholder="Digite o nome..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-base"
          />
        </div>
      </BrutalCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filteredSettlements.map(s => (
          <SettlementCard key={s.id} settlement={s} onUpdate={updateSettlement} onDelete={removeSettlement} />
        ))}
        {filteredSettlements.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-400 opacity-50 font-black uppercase">
            Nenhum assentamento encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

const SettlementCard: React.FC<{ 
  settlement: Settlement; 
  onUpdate: (id: string, updates: Partial<Settlement>) => void;
  onDelete: (id: string) => void;
}> = ({ settlement: s, onUpdate, onDelete }) => {
  return (
    <BrutalCard className="hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
      <div className="flex items-start justify-between mb-4">
        <input 
          className="text-2xl font-black uppercase tracking-tight text-primary dark:text-accent bg-transparent border-none p-0 focus:ring-0 w-full"
          value={s.name}
          onChange={e => onUpdate(s.id, { name: e.target.value })}
        />
        <div className="flex gap-2">
          <button 
            onClick={() => confirm('Remover este assentamento?') && onDelete(s.id)} 
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <span className="material-icons text-lg">delete</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-y-4 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1">
            <span className="material-icons text-[12px]">groups</span> População
          </span>
          <input type="number" value={s.population} onChange={e => onUpdate(s.id, { population: parseInt(e.target.value) || 0 })} className="bg-transparent border-none p-0 text-lg font-black focus:ring-0" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1">
            <span className="material-icons text-[12px]">favorite</span> Lealdade
          </span>
          <input type="number" value={s.loyalty} onChange={e => onUpdate(s.id, { loyalty: parseInt(e.target.value) || 0 })} className={`bg-transparent border-none p-0 text-lg font-black focus:ring-0 ${s.loyalty >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1">
            <span className="material-icons text-[12px]">category</span> Recurso
          </span>
          <input type="text" value={s.primaryResource} onChange={e => onUpdate(s.id, { primaryResource: e.target.value })} className="bg-transparent border-none p-0 text-sm font-black focus:ring-0 uppercase" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase opacity-50 flex items-center gap-1">
            <span className="material-icons text-[12px]">insights</span> Produção
          </span>
          <input type="number" value={s.production} onChange={e => onUpdate(s.id, { production: parseInt(e.target.value) || 0 })} className="bg-transparent border-none p-0 text-lg font-black focus:ring-0" />
        </div>
      </div>

      <div className="pt-4 border-t-2 border-black dark:border-white">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-black uppercase opacity-60">Estabilidade</span>
          <span className="text-lg font-black">{s.stability}%</span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-black border-2 border-black relative mb-2">
          <div 
            className={`h-full transition-all duration-500 ${s.stability > 70 ? 'bg-primary' : s.stability > 40 ? 'bg-accent' : 'bg-red-700'}`} 
            style={{ width: `${s.stability}%` }}
          ></div>
        </div>
        <input type="range" value={s.stability} onChange={e => onUpdate(s.id, { stability: parseInt(e.target.value) })} className="w-full accent-primary" />
      </div>
    </BrutalCard>
  );
};

export default SettlementDashboard;
