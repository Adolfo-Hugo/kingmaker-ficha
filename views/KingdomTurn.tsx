
import React from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard, SectionTitle } from '../components/UI';

const KingdomTurn: React.FC = () => {
  const { activeKingdom: kingdom } = useKingdom();

  if (!kingdom) return null;

  // Cálculos Automáticos para Ajuda na Fase
  const resourceDiceCount = kingdom.stats.level + 4;
  const consumptionBase = kingdom.settlements.length;

  return (
    <div className="space-y-12 pb-20">
      <div className="border-b-4 border-black dark:border-white pb-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Turno do Reino</h1>
        <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Guia de Execução de Fases Mensais</p>
      </div>

      {/* LEMBRETES DE INÍCIO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary text-white p-4 border-4 border-black font-black uppercase text-xs shadow-brutal">
          Início do Turno: +1 Fama ou Infâmia
        </div>
        <div className="bg-accent text-white p-4 border-4 border-black font-black uppercase text-xs shadow-brutal">
          PR não gasto vira XP (Máx 120/turno)
        </div>
        <div className="bg-black text-white p-4 border-4 border-white font-black uppercase text-xs shadow-brutal">
          Materiais excedentes são perdidos
        </div>
      </div>

      {/* FASE 1: MANUTENÇÃO */}
      <section>
        <SectionTitle>1. Fase de Manutenção</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <BrutalCard badge="Etapa 1 & 2">
            <h3 className="font-black uppercase text-lg mb-4 underline">Liderança e Desordem</h3>
            <ul className="space-y-3 text-xs font-bold leading-tight">
              <li className="flex gap-2">
                <span className="text-primary">●</span>
                <span>Designar Funções: Use "Nova Liderança". Novo Governante causa -4 em testes e +1 Ruína.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">●</span>
                <span>Penalidade: Líderes sem recesso sofrem -1 atividade ou penalidade de desocupação.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600">●</span>
                <span>Ajuste Desordem: +1 por assentamento Superlotado ou em Guerra.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-600">●</span>
                <span>Anarquia (10+): Ganha 1d10 Ruínas. Desordem 20+ impede quase todas as ações.</span>
              </li>
            </ul>
          </BrutalCard>

          <BrutalCard badge="Etapa 3 & 4" badgeColor="bg-primary">
            <h3 className="font-black uppercase text-lg mb-4 underline">Recursos e Consumo</h3>
            <div className="space-y-4">
              <div className="p-3 border-2 border-black bg-gray-50 dark:bg-black/20">
                <span className="text-[10px] font-black uppercase block opacity-60">Cálculo de PR (Nível + 4)</span>
                <div className="text-xl font-black">Role {resourceDiceCount} Dados de Recursos</div>
                <p className="text-[10px] italic mt-1">+ Bônus/Penalidades de habilidades específicas.</p>
              </div>
              
              <div className="p-3 border-2 border-black bg-gray-50 dark:bg-black/20">
                <span className="text-[10px] font-black uppercase block opacity-60">Consumo Mensal</span>
                <div className="text-xl font-black">Total: {consumptionBase} + Exércitos - Fazendas</div>
                <p className="text-[10px] mt-1 font-bold">Pague com ALIMENTOS ou 5 PR/ponto. Falha = +1d4 Desordem.</p>
              </div>

              <div className="text-[10px] font-bold bg-accent/20 p-2">
                Materiais: Ganhe 1 por Local de Trabalho (2 se em hexágono de Recurso).
              </div>
            </div>
          </BrutalCard>
        </div>
      </section>

      {/* FASE 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* FASE 2: MERCANTIL */}
        <section>
          <SectionTitle className="bg-accent">2. Fase Mercantil</SectionTitle>
          <BrutalCard className="mt-4">
            <ul className="space-y-4 text-xs font-bold uppercase tracking-tight">
              <li className="border-b-2 border-black pb-2">
                <span className="block text-primary">Coletar Impostos</span>
                Melhora Economia OU Teste CD 11 para -1 Desordem (se não coletar).
              </li>
              <li className="border-b-2 border-black pb-2">
                <span className="block text-primary">Aprovar Gastos</span>
                Melhorar estilo de vida ou usar tesouro nacional (PJs).
              </li>
              <li className="border-b-2 border-black pb-2">
                <span className="block text-primary">Comércio</span>
                Negociar Materiais por PR ou administrar Acordos Comerciais.
              </li>
            </ul>
          </BrutalCard>
        </section>

        {/* FASE 3: ATIVIDADE */}
        <section>
          <SectionTitle className="bg-secondary">3. Fase de Atividade</SectionTitle>
          <BrutalCard className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="border-l-4 border-black pl-4">
                <span className="font-black text-sm block">Liderança</span>
                <p className="text-[10px]">3/líder (com Castelo/Prefeitura) ou 2/líder (sem). Sem repetir atividade.</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <span className="font-black text-sm block">Região</span>
                <p className="text-[10px]">Até 3 atividades coletivamente para todo o reino.</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <span className="font-black text-sm block">Cívica</span>
                <p className="text-[10px]">1 atividade por assentamento (Construir, Demolir, etc).</p>
              </div>
            </div>
          </BrutalCard>
        </section>
      </div>

      {/* FASE 4: EVENTO */}
      <section>
        <SectionTitle className="bg-black">4. Fase de Evento</SectionTitle>
        <BrutalCard className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-black text-sm uppercase">1. Ocorrência</h4>
              <div className="bg-gray-100 dark:bg-white/10 p-4 border-2 border-black text-center">
                <div className="text-xs font-bold mb-1">Teste CD 16</div>
                <div className="text-[10px] opacity-60">(CD 11 se não houve evento no anterior)</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-black text-sm uppercase">2. Resolução</h4>
              <p className="text-[10px] font-medium leading-relaxed">
                Resolva eventos ativos e novos. Eventos resolvidos concedem <span className="font-black">30 XP</span>.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-black text-sm uppercase">3. XP e Nível</h4>
              <ul className="text-[10px] font-bold space-y-1">
                <li>• 80 XP: 1ª vez que gasta 100 RP.</li>
                <li>• PR p/ XP: Máx 120 XP/turno.</li>
                <li className="text-primary underline">● NÍVEL UP: 1.000 XP.</li>
              </ul>
            </div>
          </div>
        </BrutalCard>
      </section>
    </div>
  );
};

export default KingdomTurn;
