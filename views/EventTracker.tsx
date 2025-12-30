
import React from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard, BrutalButton, SectionTitle } from '../components/UI';
import { KingdomEvent, ResolutionState } from '../types';

const EventTracker: React.FC = () => {
  const { activeKingdom: kingdom, addEvent, updateEvent, removeEvent } = useKingdom();

  if (!kingdom) return null;

  const addNewManual = () => {
    addEvent({
      id: Math.random().toString(36).substr(2, 9),
      name: "Novo Evento",
      level: kingdom.stats.level,
      skill: "Diplomacia",
      modifier: 0,
      dc: 15,
      notes: "Adicionar descrição...",
      state: ResolutionState.PENDENTE,
      turn: kingdom.stats.currentTurn,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b-4 border-black dark:border-white pb-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Eventos</h1>
          <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Gerenciamento de Reino • Turno {kingdom.stats.currentTurn}</p>
        </div>
        <div className="flex gap-4">
          <BrutalButton onClick={addNewManual}>
            <span className="material-icons text-sm mr-2">add</span> Novo Evento
          </BrutalButton>
        </div>
      </div>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {kingdom.events.map(event => (
          <EventCard key={event.id} event={event} onUpdate={updateEvent} onDelete={removeEvent} />
        ))}
        {kingdom.events.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-400 opacity-50 font-bold uppercase">
            Nenhum evento registrado.
          </div>
        )}
      </main>
    </div>
  );
};

const EventCard: React.FC<{
  event: KingdomEvent;
  onUpdate: (id: string, updates: Partial<KingdomEvent>) => void;
  onDelete: (id: string) => void;
}> = ({ event, onUpdate, onDelete }) => {
  const isResolved = event.state !== ResolutionState.PENDENTE;

  return (
    <BrutalCard 
      badge={isResolved ? "Resolvido" : "Ativo"} 
      badgeColor={isResolved ? (event.state === ResolutionState.FALHA ? 'bg-red-700' : 'bg-primary') : 'bg-black'}
    >
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <label className="block text-xs font-black uppercase mb-1">Nome do Evento</label>
          <input 
            className={`w-full bg-transparent border-b-2 border-black dark:border-white focus:border-primary focus:ring-0 px-0 py-1 text-xl font-bold font-display ${isResolved ? (event.state === ResolutionState.FALHA ? 'text-red-700' : 'text-primary') : ''}`}
            value={event.name}
            onChange={e => onUpdate(event.id, { name: e.target.value })}
          />
        </div>
        <div className="w-24 flex-shrink-0">
          <label className="block text-xs font-black uppercase mb-1">Nível</label>
          <input 
            className="w-full bg-background-light dark:bg-black border-2 border-black dark:border-white focus:ring-0 focus:border-primary text-center font-bold py-1"
            type="number"
            value={event.level}
            onChange={e => onUpdate(event.id, { level: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mb-6 items-end">
        <div className="col-span-8 md:col-span-7">
          <label className="block text-xs font-black uppercase mb-1">Perícia</label>
          <input 
            className="w-full bg-transparent border-b-2 border-black dark:border-white focus:ring-0 px-0 py-1 font-bold"
            value={event.skill}
            onChange={e => onUpdate(event.id, { skill: e.target.value })}
          />
        </div>
        <div className="col-span-4 md:col-span-2">
          <label className="block text-xs font-black uppercase mb-1">Mod.</label>
          <input 
            className="w-full bg-transparent border-b-2 border-black dark:border-white focus:ring-0 px-0 py-1 font-bold text-center"
            value={event.modifier >= 0 ? `+${event.modifier}` : event.modifier}
            onChange={e => onUpdate(event.id, { modifier: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <label className="block text-xs font-black uppercase mb-1">CD Alvo</label>
          <div className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 font-black text-center text-lg">
            {event.dc}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-black uppercase mb-2">Notas</label>
        <textarea 
          className="w-full bg-background-light dark:bg-black/30 border-2 border-black dark:border-white p-3 text-sm italic font-medium resize-none"
          rows={3}
          value={event.notes}
          onChange={e => onUpdate(event.id, { notes: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-black uppercase mb-2">Estado da Resolução</label>
        <select 
          className={`w-full bg-white dark:bg-surface-dark border-2 border-black dark:border-white font-bold py-3 px-4 ${isResolved ? (event.state === ResolutionState.FALHA ? 'bg-red-700 text-white' : 'bg-primary text-white') : ''}`}
          value={event.state}
          onChange={e => onUpdate(event.id, { state: e.target.value as ResolutionState })}
        >
          <option value={ResolutionState.PENDENTE}>Pendente</option>
          <option value={ResolutionState.SUCESSO}>Sucesso</option>
          <option value={ResolutionState.FALHA}>Falha</option>
          <option value={ResolutionState.CRITICO}>Crítico</option>
        </select>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300 flex justify-between">
        <button onClick={() => onDelete(event.id)} className="text-gray-400 hover:text-red-600 text-sm font-bold uppercase">Deletar</button>
        <span className="text-xs opacity-50 font-bold uppercase">Turno {event.turn}</span>
      </div>
    </BrutalCard>
  );
};

export default EventTracker;
