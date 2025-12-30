
import React, { useState } from 'react';
import { KingdomProvider, useKingdom } from './KingdomContext';
import KingdomSheet from './views/KingdomSheet';
import SettlementDashboard from './views/SettlementDashboard';
import EventTracker from './views/EventTracker';
import SkillSheet from './views/SkillSheet';
import KingdomActivities from './views/KingdomActivities';
import GovernmentList from './views/GovernmentList';
import CharterList from './views/CharterList';
import HeartlandList from './views/HeartlandList';
import StructureList from './views/StructureList';
import KingdomFeats from './views/KingdomFeats';
import KingdomTurn from './views/KingdomTurn';
import KingdomSelector from './views/KingdomSelector';
import KingdomEvolution from './views/KingdomEvolution';
import RoyalAdvisor from './views/RoyalAdvisor';
import { BrutalButton } from './components/UI';

const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<'sheet' | 'skills' | 'activities' | 'settlements' | 'events' | 'government' | 'charter' | 'heartland' | 'structures' | 'turn' | 'feats' | 'evolution' | 'advisor'>('sheet');
  const { activeKingdom: kingdom, selectKingdom, nextTurn, prevTurn } = useKingdom();

  if (!kingdom) {
    return <KingdomSelector />;
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <header className="mb-8 border-b-4 border-black dark:border-white pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-5xl md:text-7xl font-cinzel font-black uppercase tracking-tighter drop-shadow-md text-primary dark:text-accent">
              {kingdom.stats.name}
            </h1>
            <button 
              onClick={() => selectKingdom(null)}
              className="mt-4 bg-black text-white dark:bg-white dark:text-black px-2 py-1 text-[10px] font-bold uppercase hover:bg-primary transition-colors"
            >
              Trocar Reino
            </button>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest opacity-80 mt-2">
            Kingdom Management Dashboard • Nível {kingdom.stats.level} {kingdom.stats.unrest > 0 && <span className="text-red-600 dark:text-red-400 ml-4">• Desordem {kingdom.stats.unrest}</span>}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-end">
          <BrutalButton onClick={prevTurn} disabled={kingdom.stats.currentTurn <= 1}>
            Turno Anterior
          </BrutalButton>
          <div className="bg-white dark:bg-surface-dark border-2 border-black dark:border-white p-3 shadow-brutal dark:shadow-brutal-white min-w-[80px] text-center">
            <span className="block text-xs font-bold uppercase mb-1">Turno</span>
            <span className="text-3xl font-black">{kingdom.stats.currentTurn}</span>
          </div>
          <BrutalButton onClick={nextTurn}>
            Próximo Turno
          </BrutalButton>
        </div>
      </header>

      <nav className="mb-8 border-b-2 border-black dark:border-white overflow-x-auto">
        <ul className="flex flex-nowrap md:flex-wrap gap-4 md:gap-8 font-bold uppercase tracking-wider text-sm min-w-max pb-2">
          <li>
            <button 
              onClick={() => setActiveView('sheet')}
              className={`pb-2 transition-all ${activeView === 'sheet' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Atributos
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('advisor')}
              className={`pb-2 transition-all ${activeView === 'advisor' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Conselheiro
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('evolution')}
              className={`pb-2 transition-all ${activeView === 'evolution' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Evolução
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('turn')}
              className={`pb-2 transition-all ${activeView === 'turn' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Turno
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('government')}
              className={`pb-2 transition-all ${activeView === 'government' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Governo
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('charter')}
              className={`pb-2 transition-all ${activeView === 'charter' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Licenças
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('heartland')}
              className={`pb-2 transition-all ${activeView === 'heartland' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Região
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('skills')}
              className={`pb-2 transition-all ${activeView === 'skills' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Perícias
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('feats')}
              className={`pb-2 transition-all ${activeView === 'feats' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Talentos
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('activities')}
              className={`pb-2 transition-all ${activeView === 'activities' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Atividades
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('structures')}
              className={`pb-2 transition-all ${activeView === 'structures' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Estruturas
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('settlements')}
              className={`pb-2 transition-all ${activeView === 'settlements' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Assentamentos ({kingdom.settlements.length})
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveView('events')}
              className={`pb-2 transition-all ${activeView === 'events' ? 'border-b-4 border-primary text-primary dark:text-accent' : 'opacity-50 hover:opacity-100'}`}
            >
              Eventos ({kingdom.events.filter(e => e.state === 'Pendente').length})
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-grow">
        {activeView === 'sheet' && <KingdomSheet />}
        {activeView === 'evolution' && <KingdomEvolution />}
        {activeView === 'turn' && <KingdomTurn />}
        {activeView === 'government' && <GovernmentList />}
        {activeView === 'charter' && <CharterList />}
        {activeView === 'heartland' && <HeartlandList />}
        {activeView === 'skills' && <SkillSheet />}
        {activeView === 'feats' && <KingdomFeats />}
        {activeView === 'activities' && <KingdomActivities />}
        {activeView === 'structures' && <StructureList />}
        {activeView === 'settlements' && <SettlementDashboard />}
        {activeView === 'events' && <EventTracker />}
        {activeView === 'advisor' && <RoyalAdvisor />}
      </main>

      <footer className="mt-16 pt-8 border-t-4 border-black dark:border-white">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
          <div className="flex-grow text-center md:text-left">
            <div className="flex justify-center md:justify-start gap-8 text-xs font-bold uppercase opacity-50 mb-2">
              <span>REINO: {kingdom.stats.name}</span>
              <span>XP: {kingdom.stats.xp}</span>
              <span>FAMA: {kingdom.stats.fame}</span>
            </div>
            <p className="text-[10px] font-mono opacity-30">SISTEMA KINGMAKER RPG • GERENCIADOR DE REINO</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Criado por Mestre Hugo S.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => (
  <KingdomProvider>
    <MainApp />
  </KingdomProvider>
);

export default App;
