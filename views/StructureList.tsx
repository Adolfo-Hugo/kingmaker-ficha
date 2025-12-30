
import React, { useState } from 'react';
import { BrutalCard } from '../components/UI';
import { useKingdom } from '../KingdomContext';

interface StructureCosts {
  rp: number;
  wood?: number;
  luxury?: number;
  stone?: number;
  ore?: number;
  food?: number;
}

interface Structure {
  name: string;
  level: number;
  tags: string[];
  size: string;
  costs: StructureCosts;
  costLabel: string;
  construction: string;
  upgrade?: string;
  effects: string;
}

const structuresData: Structure[] = [
  // ACADÊMICAS
  { name: "Biblioteca", level: 2, tags: ["Acadêmico"], size: "1 lote", costs: { rp: 6, wood: 4, stone: 2 }, costLabel: "6 PR, 4 Madeira, 2 Pedra", construction: "Erudição (treinado) CD 16", upgrade: "Para academia", effects: "+1 em Descansar e Relaxar; +1 em Recordar Conhecimento." },
  { name: "Academia", level: 10, tags: ["Acadêmico"], size: "2 lotes", costs: { rp: 52, luxury: 12, wood: 12, stone: 12 }, costLabel: "52 PR, 12 Luxo, 12 Madeira, 12 Pedra", construction: "Erudição (especialista) CD 27", upgrade: "De biblioteca", effects: "+2 em Solução Criativa; +2 em Saber." },
  { name: "Universidade", level: 15, tags: ["Acadêmico", "Famoso"], size: "4 lotes", costs: { rp: 78, luxury: 18, wood: 18, stone: 18 }, costLabel: "78 PR, 18 Luxo, 18 Madeira, 18 Pedra", construction: "Erudição (mestre) CD 34", effects: "+3 em Solução Criativa; +3 em Saber." },
  // MÁGICAS
  { name: "Torre do Arcanista", level: 5, tags: ["Mágico"], size: "1 lote", costs: { rp: 30, stone: 6 }, costLabel: "30 PR, 6 Pedra", construction: "Magia (treinado) CD 20", effects: "+1 em Reprimir Desordem; +1 nível itens mágicos arcanos." },
  { name: "Loja de Magia", level: 8, tags: ["Mágico", "Comercial"], size: "1 lote", costs: { rp: 44, luxury: 6, wood: 8, stone: 6 }, costLabel: "44 PR, 6 Luxo, 8 Madeira, 6 Pedra", construction: "Magia (especialista) CD 24", effects: "+1 em Solução Sobrenatural." },
  // RELIGIOSAS
  { name: "Santuário", level: 1, tags: ["Religioso"], size: "1 lote", costs: { rp: 8, wood: 2, stone: 1 }, costLabel: "8 PR, 2 Madeira, 1 Pedra", construction: "Folclore CD 15", effects: "+1 em Comemorar Feriado." },
  { name: "Templo", level: 7, tags: ["Religioso", "Famoso"], size: "2 lotes", costs: { rp: 32, wood: 6, stone: 6 }, costLabel: "32 PR, 6 Madeira, 6 Pedra", construction: "Folclore CD 23", effects: "+1 Comemorar Feriado; Reduz Desordem em 2." },
  { name: "Catedral", level: 15, tags: ["Religioso", "Famoso"], size: "4 lotes", costs: { rp: 58, wood: 20, stone: 20 }, costLabel: "58 PR, 20 Madeira, 20 Pedra", construction: "Folclore CD 34", effects: "Reduz Desordem em 4; +3 Prestar Cuidados." },
  // MILITARES
  { name: "Quartel", level: 3, tags: ["Militar", "Residencial"], size: "1 lote", costs: { rp: 6, wood: 2, stone: 1 }, costLabel: "6 PR, 2 Madeira, 1 Pedra", construction: "Defesa CD 16", effects: "+1 Guarnecer, Recrutar." },
  { name: "Guarnição", level: 5, tags: ["Militar", "Residencial"], size: "2 lotes", costs: { rp: 28, wood: 6, stone: 3 }, costLabel: "28 PR, 6 Madeira, 3 Pedra", construction: "Artes Bélicas CD 20", effects: "+1 Equipar Exército." },
  { name: "Torreão", level: 3, tags: ["Militar"], size: "2 lotes", costs: { rp: 32, wood: 8, stone: 8 }, costLabel: "32 PR, 8 Madeira, 8 Pedra", construction: "Defesa CD 18", effects: "+1 Guarnecer, Deslocar." },
  { name: "Academia Militar", level: 12, tags: ["Militar", "Acadêmico"], size: "2 lotes", costs: { rp: 36, wood: 12, ore: 6, stone: 10 }, costLabel: "36 PR, 12 Madeira, 6 Minério, 10 Pedra", construction: "Artes Bélicas CD 30", effects: "+2 Juramento Fidelidade." },
  // GOVERNO
  { name: "Prefeitura", level: 2, tags: ["Governo"], size: "2 lotes", costs: { rp: 22, wood: 4, stone: 4 }, costLabel: "22 PR, 4 Madeira, 4 Pedra", construction: "CD 16", effects: "Permite 2 atividades Liderança." },
  { name: "Castelo", level: 9, tags: ["Governo", "Famoso"], size: "4 lotes", costs: { rp: 54, wood: 12, stone: 12 }, costLabel: "54 PR, 12 Madeira, 12 Pedra", construction: "CD 26", effects: "+2 Enviar Representante; 3 ações Liderança." },
  { name: "Palácio", level: 15, tags: ["Governo", "Famoso"], size: "4 lotes", costs: { rp: 108, luxury: 12, wood: 20, ore: 15, stone: 20 }, costLabel: "108 PR, 12 Luxo, 20 Madeira, 15 Minério, 20 Pedra", construction: "CD 34", effects: "+3 ações Liderança; Governante +3 nos testes." },
  // COMERCIAIS
  { name: "Loja", level: 1, tags: ["Comercial"], size: "1 lote", costs: { rp: 8, wood: 1 }, costLabel: "8 PR, 1 Madeira", construction: "Comércio CD 15", effects: "Essencial para nível de itens." },
  { name: "Mercado", level: 4, tags: ["Comercial", "Residencial"], size: "2 lotes", costs: { rp: 48, wood: 4 }, costLabel: "48 PR, 4 Madeira", construction: "Comércio CD 19", effects: "+1 Estabelecer Acordo Comercial." },
  { name: "Banco", level: 5, tags: ["Comercial"], size: "1 lote", costs: { rp: 28, ore: 4, stone: 6 }, costLabel: "28 PR, 4 Minério, 6 Pedra", construction: "Comércio CD 20", effects: "+1 Utilizar Tesouro Nacional." },
  { name: "Casa da Moeda", level: 15, tags: ["Comercial"], size: "1 lote", costs: { rp: 30, wood: 12, ore: 20, stone: 16 }, costLabel: "30 PR, 12 Madeira, 20 Minério, 16 Pedra", construction: "Comércio CD 34", effects: "+3 Coletar Impostos." },
  // RESIDENCIAIS
  { name: "Casas", level: 1, tags: ["Residencial"], size: "1 lote", costs: { rp: 3, wood: 1 }, costLabel: "3 PR, 1 Madeira", construction: "Indústria CD 15", effects: "Reduz Desordem em 1." },
  { name: "Mansão", level: 5, tags: ["Residencial"], size: "1 lote", costs: { rp: 10, luxury: 6, wood: 6, stone: 3 }, costLabel: "10 PR, 6 Luxo, 6 Madeira, 3 Pedra", construction: "Indústria CD 20", effects: "+1 Melhorar Estilo de Vida." },
  { name: "Vivenda Nobre", level: 9, tags: ["Residencial"], size: "2 lotes", costs: { rp: 24, luxury: 6, wood: 10, stone: 8 }, costLabel: "24 PR, 6 Luxo, 10 Madeira, 8 Pedra", construction: "Política CD 19", effects: "+1 Reprimir Desordem." },
  // ENTRETENIMENTO
  { name: "Taverna Popular", level: 3, tags: ["Entretenimento"], size: "1 lote", costs: { rp: 24, wood: 6, stone: 2 }, costLabel: "24 PR, 6 Madeira, 2 Pedra", construction: "Comércio CD 18", effects: "+1 Contratar Aventureiros; Desordem -2." },
  { name: "Teatro", level: 9, tags: ["Entretenimento"], size: "2 lotes", costs: { rp: 24, wood: 8, stone: 3 }, costLabel: "24 PR, 8 Madeira, 3 Pedra", construction: "Artes CD 26", effects: "+2 Comemorar Feriado." },
  { name: "Arena", level: 9, tags: ["Entretenimento", "Pátio"], size: "4 lotes", costs: { rp: 40, wood: 6, stone: 20 }, costLabel: "40 PR, 6 Madeira, 20 Pedra", construction: "Artes Bélicas CD 26", effects: "Retreinamento reduzido." },
  // INDUSTRIAIS
  { name: "Laboratório", level: 3, tags: ["Industrial"], size: "1 lote", costs: { rp: 18, ore: 2, stone: 5 }, costLabel: "18 PR, 2 Minério, 5 Pedra", construction: "Indústria CD 16", effects: "+1 Identificar Alquimia." },
  { name: "Forja", level: 3, tags: ["Industrial"], size: "1 lote", costs: { rp: 8, wood: 2, ore: 1, stone: 1 }, costLabel: "8 PR, 2 Madeira, 1 Minério, 1 Pedra", construction: "Indústria CD 18", effects: "+1 Manufaturar (metal)." },
  { name: "Fundição", level: 3, tags: ["Industrial"], size: "2 lotes", costs: { rp: 16, wood: 5, ore: 2, stone: 3 }, costLabel: "16 PR, 5 Madeira, 2 Minério, 3 Pedra", construction: "Indústria CD 18", effects: "Capacidade Minério +1." },
  { name: "Madeireira", level: 3, tags: ["Industrial", "Pátio"], size: "2 lotes", costs: { rp: 16, wood: 5, stone: 1 }, costLabel: "16 PR, 5 Madeira, 1 Pedra", construction: "Indústria CD 18", effects: "Capacidade Madeira +1." },
  // MÉDICAS
  { name: "Herbalista", level: 1, tags: ["Médico"], size: "1 lote", costs: { rp: 10, wood: 1 }, costLabel: "10 PR, 1 Madeira", construction: "Ecossistema CD 15", effects: "+1 Prestar Cuidados." },
  { name: "Hospital", level: 9, tags: ["Médico"], size: "2 lotes", costs: { rp: 30, wood: 10, stone: 6 }, costLabel: "30 PR, 10 Madeira, 6 Pedra", construction: "Defesa CD 26", effects: "+2 Medicina Tratar Doenças." },
  // ILÍCITAS
  { name: "Guilda Ladrões", level: 5, tags: ["Ilícito", "Infame"], size: "1 lote", costs: { rp: 25, wood: 4 }, costLabel: "25 PR, 4 Madeira", construction: "Intriga CD 20", effects: "+1 Infiltração; Crime +1." },
  { name: "Mercado Ilícito", level: 6, tags: ["Ilícito", "Infame"], size: "1 lote", costs: { rp: 50, wood: 5 }, costLabel: "50 PR, 5 Madeira", construction: "Intriga CD 22", effects: "+1 Negócios Clandestinos." }
];

const StructureList: React.FC = () => {
  const { activeKingdom: kingdom, toggleStructure } = useKingdom();
  const [filter, setFilter] = useState("TODOS");
  const [search, setSearch] = useState("");

  if (!kingdom) return null;

  const filtered = structuresData.filter(s => (filter === "TODOS" || s.tags.includes(filter)) && s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black dark:border-white pb-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Estruturas</h1>
          <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Infraestrutura de Assentamento</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="bg-primary text-white px-4 py-2 border-2 border-black shadow-brutal font-black uppercase text-sm">Tesouro PR: {kingdom.stats.resources.rp}</div>
           <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="w-64 bg-white dark:bg-black border-4 border-black p-2 font-bold uppercase text-xs" />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filtered.map(s => {
          const isBuilt = kingdom.stats.builtStructures.includes(s.name);
          return (
            <BrutalCard key={s.name} badge={`NÍVEL ${s.level}`} badgeColor={isBuilt ? "bg-primary" : "bg-accent"}>
              <div className="flex justify-between">
                <h3 className="text-2xl font-black uppercase text-primary dark:text-accent">{s.name}</h3>
                <input type="checkbox" checked={isBuilt} onChange={() => toggleStructure(s.name, s.costs, s.level)} className="w-8 h-8 border-4 border-black text-primary shadow-brutal cursor-pointer" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-bold opacity-60 uppercase">{s.costLabel}</div>
                <p className="text-xs font-medium border-l-4 border-primary pl-3">{s.effects}</p>
              </div>
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
};
export default StructureList;
