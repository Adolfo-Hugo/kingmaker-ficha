
import React, { useState } from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard, BrutalButton, BrutalInput, SectionTitle } from '../components/UI';

const KingdomSelector: React.FC = () => {
  const { kingdoms, createNewKingdom, selectKingdom, deleteKingdom } = useKingdom();
  const [newName, setNewName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      createNewKingdom(newName.trim());
      setNewName("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 flex flex-col min-h-screen">
      <header className="mb-12 text-center">
        <h1 className="text-6xl md:text-8xl font-cinzel font-black uppercase tracking-tighter text-primary dark:text-accent mb-4">
          Arquivos Reais
        </h1>
        <p className="text-lg font-bold uppercase tracking-widest opacity-70">
          Selecione uma linhagem ou inicie uma nova era
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 flex-grow">
        <BrutalCard className="md:col-span-2 bg-primary/5">
          <SectionTitle className="-mt-10 -ml-10">Crie um novo reino</SectionTitle>
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-grow w-full">
              <label className="block text-xs font-black uppercase mb-2">Nome do Reino</label>
              <BrutalInput 
                placeholder="Ex: Alerion, Valenwood..." 
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </div>
            <BrutalButton type="submit" className="whitespace-nowrap w-full md:w-auto">
              Forjar Coroa
            </BrutalButton>
          </form>
        </BrutalCard>

        {kingdoms.map(k => (
          <BrutalCard key={k.id} className="group hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-3xl font-black uppercase font-display leading-none">{k.stats.name}</h3>
              <button 
                onClick={() => deleteKingdom(k.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity"
              >
                <span className="material-icons">delete_forever</span>
              </button>
            </div>
            
            <div className="flex gap-4 mb-6 text-xs font-bold uppercase opacity-60">
              <span>Nível {k.stats.level}</span>
              <span>Turno {k.stats.currentTurn}</span>
              <span>{k.settlements.length} Assentamentos</span>
            </div>

            <BrutalButton 
              variant="outline" 
              className="w-full"
              onClick={() => selectKingdom(k.id)}
            >
              Assumir Trono
            </BrutalButton>
          </BrutalCard>
        ))}

        {kingdoms.length === 0 && (
          <div className="md:col-span-2 py-20 text-center border-4 border-dashed border-gray-300 dark:border-gray-700">
            <span className="material-icons text-6xl opacity-20 mb-4 text-primary">fort</span>
            <p className="text-xl font-bold uppercase opacity-30">Nenhum reino registrado</p>
          </div>
        )}
      </div>

      <footer className="mt-auto pt-8 border-t-2 border-black/10 dark:border-white/10 text-right">
        <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Criado por Mestre Hugo S.</p>
      </footer>
    </div>
  );
};

export default KingdomSelector;
