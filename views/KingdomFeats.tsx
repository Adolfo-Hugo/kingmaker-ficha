
import React, { useState } from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard } from '../components/UI';

interface KingdomFeat {
  name: string;
  level: number;
  prerequisites: string;
  benefits: string;
}

const featsData: KingdomFeat[] = [
  {
    name: "Função Pública",
    level: 1,
    prerequisites: "–",
    benefits: "Cidadãos reforçam cargos de liderança vagos, mitigando penalidades de desocupação."
  },
  {
    name: "Liderança Cooperativa",
    level: 1,
    prerequisites: "–",
    benefits: "Líderes recebem bônus para auxiliar uns aos outros em atividades de Liderança."
  },
  {
    name: "Coibir Dissidência",
    level: 1,
    prerequisites: "Treinado em Artes Bélicas",
    benefits: "Reprime Desordem com mais eficiência, ganhando bônus nos testes relacionados."
  },
  {
    name: "Feudos Fortificados",
    level: 1,
    prerequisites: "Treinado em Defesa",
    benefits: "Bônus para Fortificar. Permite construir ou reconstruir estruturas defensivas com custo reduzido ou maior facilidade."
  },
  {
    name: "Comercialização Privilegiada",
    level: 1,
    prerequisites: "Treinado em Indústria",
    benefits: "+1 em atividades de Estabelecer Local de Trabalho, Acordo Comercial e Negociar Materiais."
  },
  {
    name: "Garantia do Reino",
    level: 1,
    prerequisites: "Treinado em no mínimo três perícias",
    benefits: "Recebe um resultado fixo (como se tivesse rolado um 10) em um teste de perícia por turno."
  },
  {
    name: "Dar um Jeito",
    level: 1,
    prerequisites: "Treinado em Ecossistema",
    benefits: "A Ruína é acumulada mais lentamente; bônus em testes para reduzir estados de Ruína."
  },
  {
    name: "Magia Pragmática",
    level: 1,
    prerequisites: "Treinado em Magia",
    benefits: "+1 em testes de Magia. Permite usar a perícia Magia em vez de Engenharia para certas construções."
  },
  {
    name: "Unir Esforços",
    level: 1,
    prerequisites: "Treinado em Política",
    benefits: "Cidadãos ajudam a atenuar falhas em testes de Liderança, transformando falhas críticas em falhas normais."
  },
  {
    name: "Treinar Perícia",
    level: 1,
    prerequisites: "–",
    benefits: "Torna-se treinado em uma perícia de Reino adicional à sua escolha."
  },
  {
    name: "Suportar Anarquia",
    level: 3,
    prerequisites: "Lealdade 14",
    benefits: "Recupera de Desordem mais rápido e reduz os efeitos negativos de altos níveis de Desordem."
  },
  {
    name: "Entretenimento Inspirador",
    level: 3,
    prerequisites: "Cultura 14",
    benefits: "Permite usar a perícia Cultura em testes para determinar e gerenciar a Desordem do reino."
  },
  {
    name: "Liquidar Recursos",
    level: 3,
    prerequisites: "Economia 14",
    benefits: "Usa fundos de reserva ou tesouro para evitar o aumento imediato de Ruína em situações críticas."
  },
  {
    name: "Recuperação Rápida",
    level: 3,
    prerequisites: "Estabilidade 14",
    benefits: "+2 em testes para encerrar eventos prejudiciais em andamento ou desastres naturais."
  },
  {
    name: "Livre e Justo",
    level: 7,
    prerequisites: "–",
    benefits: "Usa Nova Liderança e outras atividades de governança com maior eficiência e bônus de circunstância."
  },
  {
    name: "Qualidade de Vida",
    level: 7,
    prerequisites: "–",
    benefits: "Reduz as despesas mensais de custo de vida e o consumo geral do reino."
  },
  {
    name: "Fama e Fortuna",
    level: 11,
    prerequisites: "–",
    benefits: "Recebe Pontos de Recurso (RP) extras ao obter um sucesso crítico em qualquer teste de perícia de Reino."
  }
];

const KingdomFeats: React.FC = () => {
  const { activeKingdom: kingdom, toggleFeat } = useKingdom();
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<number | "TODOS">("TODOS");

  if (!kingdom) return null;

  const levels = Array.from(new Set(featsData.map(f => f.level))).sort((a, b) => a - b);

  const filtered = featsData.filter(feat => {
    const matchesLevel = levelFilter === "TODOS" || feat.level === levelFilter;
    const matchesSearch = feat.name.toLowerCase().includes(search.toLowerCase()) || 
                         feat.benefits.toLowerCase().includes(search.toLowerCase()) ||
                         feat.prerequisites.toLowerCase().includes(search.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black dark:border-white pb-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Talentos</h1>
          <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Habilidades Especiais do Domínio</p>
        </div>
        <div className="w-full md:w-64">
           <input 
              type="text" 
              placeholder="Buscar talento ou requisito..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-black border-4 border-black dark:border-white p-2 font-bold uppercase text-xs focus:ring-0"
           />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase block mb-2 opacity-50 tracking-widest">Filtrar por Nível</span>
          <div className="flex flex-wrap gap-1">
            <button 
              onClick={() => setLevelFilter("TODOS")}
              className={`w-14 py-1 text-[10px] font-black uppercase border-2 border-black dark:border-white transition-all ${levelFilter === "TODOS" ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark'}`}
            >
              Todos
            </button>
            {levels.map(lvl => (
              <button 
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`w-10 py-1 text-[10px] font-black uppercase border-2 border-black dark:border-white transition-all ${levelFilter === lvl ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark'}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.map((feat, idx) => {
          const isSelected = kingdom.stats.feats?.includes(feat.name);
          return (
            <BrutalCard key={idx} className={`flex flex-col transition-all ${isSelected ? 'ring-4 ring-primary bg-primary/5' : ''}`} badge={`NÍVEL ${feat.level}`} badgeColor="bg-accent">
              <div className="flex justify-between items-start mb-2 gap-4">
                <h3 className="text-2xl font-black font-display uppercase leading-tight text-primary dark:text-accent">
                  {feat.name}
                </h3>
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => toggleFeat(feat.name)}
                  className="w-8 h-8 border-4 border-black dark:border-white text-primary focus:ring-0 rounded-none bg-white dark:bg-gray-800 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              
              <div className="space-y-4 flex-grow">
                <div className="text-[10px] font-bold">
                  <span className="text-red-600 dark:text-red-400 uppercase">PRÉ-REQUISITO: </span>
                  {feat.prerequisites}
                </div>

                <div className="bg-gray-100 dark:bg-black/20 p-4 border-2 border-black/10 relative">
                  <span className="text-[9px] font-black uppercase block mb-1 opacity-50">Benefícios</span>
                  <p className="text-sm font-medium leading-snug">
                    {feat.benefits}
                  </p>
                </div>
              </div>
            </BrutalCard>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-400 opacity-50 font-black uppercase">
            Nenhum talento encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default KingdomFeats;
