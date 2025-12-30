
import React, { useState } from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard, BrutalInput, SectionTitle, BrutalButton } from '../components/UI';
import { GOVERNMENT_TYPES, CHARTER_TYPES, HEARTLAND_TYPES } from '../constants';

const KingdomSheet: React.FC = () => {
  const { activeKingdom: kingdom, updateStats, updateLeaders } = useKingdom();
  const [lastRPRoll, setLastRPRoll] = useState<{ total: number; dice: number[] } | null>(null);

  if (!kingdom) return null;

  const currentGov = GOVERNMENT_TYPES.find(g => g.id === kingdom.stats.governmentId);
  const currentCharter = CHARTER_TYPES.find(c => c.id === kingdom.stats.charterId);
  const currentHeartland = HEARTLAND_TYPES.find(h => h.id === kingdom.stats.heartlandId);

  const handleAttrChange = (key: string, val: string) => {
    const num = parseInt(val) || 0;
    const newAttrs = { ...kingdom.stats.attributes };
    (newAttrs as any)[key].value = num;
    updateStats({ attributes: newAttrs });
  };

  const handleRuinChange = (key: string, field: 'value' | 'pen', val: string) => {
    const num = parseInt(val) || 0;
    const newRuins = { ...kingdom.stats.ruins };
    (newRuins as any)[key][field] = num;
    updateStats({ ruins: newRuins });
  };

  const handleResourceChange = (category: 'materials' | 'workplaces', key: string, val: string) => {
    const num = parseInt(val) || 0;
    const newResources = { ...kingdom.stats.resources };
    (newResources as any)[category][key] = num;
    updateStats({ resources: newResources });
  };

  const adjustFame = (amount: number) => {
    const newVal = Math.max(0, kingdom.stats.fame + amount);
    updateStats({ fame: newVal });
  };

  const adjustInfamy = (amount: number) => {
    const newVal = Math.max(0, kingdom.stats.infamy + amount);
    updateStats({ infamy: newVal });
  };

  // Cálculo de Dados de Recursos
  const size = kingdom.stats.controlDC.size;
  const level = kingdom.stats.level;
  const bonusDice = kingdom.stats.resources.bonusDice || 0;
  const penaltyDice = kingdom.stats.resources.penaltyDice || 0;
  const totalDice = level + 4 + bonusDice - penaltyDice;

  let dieSides = 4;
  let dieType = "d4";
  if (size >= 100) { dieSides = 12; dieType = "d12"; }
  else if (size >= 50) { dieSides = 10; dieType = "d10"; }
  else if (size >= 25) { dieSides = 8; dieType = "d8"; }
  else if (size >= 10) { dieSides = 6; dieType = "d6"; }

  const handleRollResources = () => {
    const dice: number[] = [];
    let total = 0;
    for (let i = 0; i < Math.max(0, totalDice); i++) {
      const roll = Math.floor(Math.random() * dieSides) + 1;
      dice.push(roll);
      total += roll;
    }
    setLastRPRoll({ total, dice });
    updateStats({ resources: { ...kingdom.stats.resources, rp: kingdom.stats.resources.rp + total } });
  };

  const handleSizeChange = (val: string) => {
    const newSize = Math.min(100, Math.max(0, parseInt(val) || 0));
    updateStats({ controlDC: { ...kingdom.stats.controlDC, size: newSize } });
  };

  // Lógica de Consumo de Comida
  const getFoodConsumption = () => {
    if (size < 10) return 1;
    if (size < 25) return 2;
    if (size < 50) return 4;
    if (size < 100) return 6;
    return 8; // Império
  };

  const handleConsumeFood = () => {
    const cost = getFoodConsumption();
    const currentFood = kingdom.stats.resources.materials.food;
    if (currentFood < cost) {
      if (confirm(`Comida insuficiente (${currentFood}/${cost}). Deseja pagar a diferença com Pontos de Recurso (5 PR por ponto faltando)?`)) {
        const diff = cost - currentFood;
        const prCost = diff * 5;
        if (kingdom.stats.resources.rp >= prCost) {
           updateStats({
             resources: {
               ...kingdom.stats.resources,
               rp: kingdom.stats.resources.rp - prCost,
               materials: { ...kingdom.stats.resources.materials, food: 0 }
             }
           });
        } else {
          alert("Pontos de Recurso insuficientes para cobrir a falta de comida!");
        }
      }
    } else {
      updateStats({
        resources: {
          ...kingdom.stats.resources,
          materials: { ...kingdom.stats.resources.materials, food: currentFood - cost }
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* GRID MESTRE DE DUAS COLUNAS (5/7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* COLUNA DA ESQUERDA (SPAN 5) - MOTOR DO REINO */}
        <div className="lg:col-span-5 flex flex-col gap-10">
          
          {/* Governança */}
          <BrutalCard className="pt-12">
            <SectionTitle className="-mt-16 -ml-10 mb-6 block">Governança</SectionTitle>
            <div className="space-y-4">
              <div className="p-4 border-4 border-black dark:border-white bg-white dark:bg-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <label className="block text-[10px] font-black uppercase mb-1 opacity-50">Governo Ativo</label>
                <div className="text-xl font-black uppercase tracking-tighter text-primary dark:text-accent">
                  {currentGov ? currentGov.name : "Nenhum Selecionado"}
                </div>
              </div>
              {currentGov && (
                <div className="p-4 border-2 border-black dark:border-white bg-primary/5 space-y-2">
                  <p className="text-xs italic leading-tight">{currentGov.description}</p>
                  <div className="text-[10px] font-black uppercase space-y-1">
                    <div className="text-primary">Bônus: {currentGov.boosts.join(', ')} + {currentGov.freeBoosts} Livre</div>
                    <div className="text-accent">Perícias Base: {currentGov.skills.join(', ')}</div>
                  </div>
                </div>
              )}
            </div>
          </BrutalCard>

          {/* Valores de Atributo */}
          <BrutalCard className="pt-12">
            <SectionTitle className="-mt-16 -ml-10 mb-6 block">Valores de Atributo</SectionTitle>
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-[10px] font-black uppercase w-20 text-center">Modificador</span>
                <span className="text-[10px] font-black uppercase flex-grow text-center px-4">Atributo</span>
                <span className="text-[10px] font-black uppercase w-20 text-center">Valor Total</span>
              </div>
              {(Object.entries(kingdom.stats.attributes) as [string, { value: number; mod: number }][]).map(([key, attr]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-20 h-16 border-4 border-black dark:border-white flex items-center justify-center font-black text-xl bg-gray-100 dark:bg-gray-800 shadow-brutal">
                    {attr.mod >= 0 ? `+${attr.mod}` : attr.mod}
                  </div>
                  <div className="flex-grow bg-primary text-white font-display font-black text-center py-3 border-4 border-black dark:border-white uppercase tracking-tighter text-xs shadow-brutal flex items-center justify-center min-h-[4rem]">
                    {key === 'culture' ? 'Cultura' : key === 'economy' ? 'Economia' : key === 'loyalty' ? 'Lealdade' : 'Estabilidade'}
                  </div>
                  <input 
                    type="number" 
                    value={attr.value}
                    onChange={(e) => handleAttrChange(key, e.target.value)}
                    className="w-20 h-16 border-4 border-black dark:border-white text-center font-black text-xl bg-white dark:bg-surface-dark focus:ring-4 focus:ring-primary outline-none transition-all shadow-brutal" 
                  />
                </div>
              ))}
            </div>
          </BrutalCard>

          {/* CD de Controle */}
          <BrutalCard className="relative py-8">
            <div className="absolute -top-4 left-6 bg-black dark:bg-white text-white dark:text-black px-3 py-1 font-black text-xs uppercase border-2 border-black shadow-brutal">CD de Controle</div>
            <div className="flex items-center justify-around gap-2 mt-2">
              <div className="flex flex-col items-center">
                <div className="w-24 h-16 border-4 border-black dark:border-white flex items-center justify-center text-3xl font-black bg-gray-100 dark:bg-gray-800 shadow-brutal">
                  {kingdom.stats.controlDC.base + kingdom.stats.controlDC.size}
                </div>
                <span className="text-[10px] font-black uppercase mt-2">Total</span>
              </div>
              <span className="text-2xl font-black">=</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  value={kingdom.stats.controlDC.base}
                  onChange={(e) => updateStats({ controlDC: { ...kingdom.stats.controlDC, base: parseInt(e.target.value) || 0 } })}
                  className="w-20 border-b-4 border-black dark:border-white bg-transparent text-center font-black text-2xl focus:ring-0 outline-none pb-1"
                />
                <span className="text-[10px] uppercase font-bold mt-1">Base</span>
              </div>
              <span className="text-xl font-black">+</span>
              <div className="flex flex-col items-center">
                <div className="w-20 border-b-4 border-black dark:border-white bg-transparent text-center font-black text-2xl pb-1">
                  {size}
                </div>
                <span className="text-[10px] uppercase font-bold mt-1">Tam</span>
              </div>
            </div>
          </BrutalCard>

          {/* Dados de Recursos (ESQUERDA) */}
          <BrutalCard className="relative py-8">
            <div className="absolute -top-4 left-6 bg-primary text-white px-3 py-1 font-black text-xs uppercase border-2 border-black shadow-brutal">Dados de Recursos</div>
            <div className="space-y-6 mt-2">
              <div className="flex items-center justify-around gap-2">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-14 border-4 border-black dark:border-white flex flex-col items-center justify-center bg-accent text-white shadow-brutal">
                    <span className="text-xl font-black">{totalDice}</span>
                    <span className="text-[10px] font-black">{dieType}</span>
                  </div>
                  <span className="text-[8px] font-black uppercase mt-1">Total</span>
                </div>
                <span className="text-xl font-black">=</span>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center font-black text-lg border-b-4 border-black dark:border-white">{level}</div>
                  <span className="text-[8px] uppercase font-bold mt-1">Nvl</span>
                </div>
                <span className="text-lg font-black">+</span>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center font-black text-lg border-b-4 border-black dark:border-white">4</div>
                  <span className="text-[8px] uppercase font-bold mt-1">Base</span>
                </div>
              </div>
              <BrutalButton onClick={handleRollResources} className="w-full text-[10px] py-2 flex items-center justify-center gap-1">
                <span className="material-icons text-xs">casino</span> Rolar Mensal
              </BrutalButton>
              {lastRPRoll && (
                <div className="p-2 border-2 border-black bg-yellow-400 text-black font-black uppercase text-[10px] text-center">
                  +{lastRPRoll.total} PR ({lastRPRoll.dice.join('+')})
                </div>
              )}
            </div>
          </BrutalCard>

          {/* Materiais (ESQUERDA) */}
          <BrutalCard className="relative pt-10 pb-6">
            <div className="absolute -top-4 left-6 bg-primary text-white border-2 border-black px-3 py-1 font-black uppercase text-xs z-10 shadow-brutal">
              MATERIAIS
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-5 gap-1">
                {[
                  { label: 'COM', key: 'food' },
                  { label: 'LEN', key: 'wood' },
                  { label: 'LUX', key: 'luxury' },
                  { label: 'MIN', key: 'ore' },
                  { label: 'PED', key: 'stone' }
                ].map(item => (
                  <div key={item.key} className="flex flex-col items-center">
                    <span className="text-[8px] font-black uppercase mb-1 tracking-tighter opacity-70">{item.label}</span>
                    <input 
                      type="number" 
                      value={(kingdom.stats.resources.materials as any)[item.key]}
                      onChange={e => handleResourceChange('materials', item.key, e.target.value)}
                      className="w-full h-10 border-2 border-black dark:border-white bg-white dark:bg-black text-center font-black text-lg focus:ring-0 outline-none"
                    />
                  </div>
                ))}
              </div>
              <BrutalButton 
                onClick={handleConsumeFood} 
                variant="outline" 
                className="w-full text-[9px] py-1.5 bg-secondary text-white hover:bg-black flex items-center justify-center gap-2"
              >
                <span className="material-icons text-xs">restaurant</span>
                Consumir ({getFoodConsumption()})
              </BrutalButton>
            </div>
          </BrutalCard>

          {/* Pontos de Recurso (ESQUERDA) */}
          <BrutalCard className="flex flex-col items-center justify-center py-6 bg-[#e5e7eb] dark:bg-zinc-800 border-4 border-black">
             <span className="text-[10px] font-black uppercase mb-2 tracking-wider">PONTOS DE RECURSO (PR)</span>
             <input 
               type="number" 
               value={kingdom.stats.resources.rp}
               onChange={e => updateStats({ resources: { ...kingdom.stats.resources, rp: parseInt(e.target.value) || 0 }})}
               className="w-full bg-transparent border-none text-center font-black text-6xl text-primary focus:ring-0"
             />
             <div className="text-[9px] font-black uppercase mt-2 opacity-60">ACORDOS COMERCIAIS: {kingdom.stats.resources.tradeAgreements}</div>
          </BrutalCard>
        </div>

        {/* COLUNA DA DIREITA (SPAN 7) - STATUS E ESTRUTURA */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Resumo de Status */}
          <BrutalCard className="bg-primary/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase mb-1 tracking-widest opacity-60">Experiência (XP)</label>
                  <BrutalInput 
                    type="number" 
                    value={kingdom.stats.xp} 
                    onChange={(e) => updateStats({ xp: parseInt(e.target.value) || 0 })}
                    className="text-3xl"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-black uppercase mb-1 tracking-widest opacity-60">Nível</label>
                    <BrutalInput 
                      type="number" 
                      value={kingdom.stats.level} 
                      onChange={(e) => updateStats({ level: parseInt(e.target.value) || 0 })}
                      className="text-3xl"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-black uppercase mb-1 tracking-widest opacity-60 text-red-600">Desordem</label>
                    <BrutalInput 
                      type="number" 
                      value={kingdom.stats.unrest} 
                      onChange={(e) => updateStats({ unrest: parseInt(e.target.value) || 0 })}
                      className="text-3xl text-red-600"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-black uppercase mb-1 tracking-widest opacity-60">Fama</label>
                      <div className="flex items-end gap-2">
                        <BrutalInput type="number" value={kingdom.stats.fame} onChange={e => updateStats({fame: parseInt(e.target.value) || 0})} className="text-3xl flex-grow" />
                        <button onClick={() => adjustFame(-1)} className="mb-2 w-10 h-10 border-2 border-black bg-red-600 text-white font-black text-xl shadow-brutal">-</button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-black uppercase mb-1 tracking-widest opacity-60">Infâmia</label>
                      <div className="flex items-end gap-2">
                        <BrutalInput type="number" value={kingdom.stats.infamy} onChange={e => updateStats({infamy: parseInt(e.target.value) || 0})} className="text-3xl flex-grow" />
                        <button onClick={() => adjustInfamy(-1)} className="mb-2 w-10 h-10 border-2 border-black bg-red-600 text-white font-black text-xl shadow-brutal">-</button>
                      </div>
                    </div>
                 </div>
                 <div className="p-3 border-2 border-black bg-accent/20 text-[10px] font-black uppercase text-center">
                   {currentCharter?.name || "Nenhuma Licença"} • {currentHeartland?.name || "Nenhuma Região"}
                 </div>
              </div>
            </div>
          </BrutalCard>

          {/* Cúpula de Liderança */}
          <BrutalCard className="relative overflow-visible pt-14">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary text-white px-8 py-2 font-display font-black text-lg uppercase border-4 border-black shadow-brutal whitespace-nowrap z-10">
              Cúpula de Liderança
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {Object.entries(kingdom.leaders).map(([role, name]) => (
                <div key={role} className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-6 h-6 border-4 border-black dark:border-white text-primary focus:ring-0 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                  <div className="flex-grow">
                    <div className="font-display font-black text-[10px] uppercase leading-none text-primary mb-1">
                      {role.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <input 
                      type="text"
                      placeholder="..."
                      value={name}
                      onChange={(e) => updateLeaders({ [role]: e.target.value })}
                      className="w-full border-b-2 border-black dark:border-white bg-transparent text-sm font-bold focus:ring-0 p-0" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </BrutalCard>

          {/* Estado de Ruína */}
          <BrutalCard className="pt-12">
            <SectionTitle className="-mt-16 -ml-10 mb-6 block">Estado de Ruína</SectionTitle>
            <div className="space-y-3">
              <div className="flex justify-end gap-3 text-[9px] font-black uppercase px-1">
                <span className="w-20 text-center">Pontos</span>
                <span className="w-20 text-center">Penalidade</span>
                <span className="w-20 text-center">Limiar</span>
              </div>
              {(Object.entries(kingdom.stats.ruins) as [string, { value: number; pen: number; threshold: number }][]).map(([key, ruin]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex-grow bg-black dark:bg-white text-white dark:text-black font-display font-black px-3 py-2 border-2 border-black uppercase text-[10px] shadow-brutal min-h-[3rem] flex items-center">
                    {key === 'corruption' ? 'Corrupção' : key === 'crime' ? 'Crime' : key === 'decay' ? 'Deterioração' : 'Conflito'}
                  </div>
                  <input 
                    type="number" 
                    value={ruin.value}
                    onChange={(e) => handleRuinChange(key, 'value', e.target.value)}
                    className="w-20 h-12 border-4 border-black dark:border-white text-center font-black text-lg bg-white dark:bg-surface-dark shadow-brutal" 
                  />
                  <input 
                    type="number" 
                    value={ruin.pen}
                    onChange={(e) => handleRuinChange(key, 'pen', e.target.value)}
                    className="w-20 h-12 border-4 border-black dark:border-white text-center font-black text-lg bg-white dark:bg-surface-dark shadow-brutal" 
                  />
                  <div className="w-20 h-12 border-4 border-black dark:border-white flex items-center justify-center font-black text-lg bg-gray-200 dark:bg-gray-800 shadow-brutal">
                    {9 + kingdom.stats.level}
                  </div>
                </div>
              ))}
            </div>
          </BrutalCard>

          {/* Tamanho do Reino (DIREITA) */}
          <BrutalCard className="relative py-8">
            <div className="absolute -top-4 left-6 bg-accent text-white px-3 py-1 font-black text-xs uppercase border-2 border-black shadow-brutal">Tamanho do Reino</div>
            <div className="flex flex-col items-center justify-between space-y-4">
              <div className="flex items-center gap-4">
                <input 
                  type="number" 
                  min="0" max="100" value={size}
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="w-28 h-14 border-4 border-black dark:border-white text-center font-black text-3xl bg-white dark:bg-surface-dark shadow-brutal"
                />
                <div className="text-[10px] font-black uppercase opacity-50">HEXÁGONOS</div>
              </div>
              <div className="w-full px-4">
                <input 
                  type="range" min="0" max="100" step="1" value={size} 
                  onChange={(e) => handleSizeChange(e.target.value)}
                  className="w-full accent-primary h-2 bg-gray-200 border-2 border-black appearance-none"
                />
              </div>
              <div className="text-[10px] font-black uppercase text-center text-primary bg-gray-100 p-2 border-2 border-black w-full">
                {size < 10 ? 'Aldeia' : size < 25 ? 'Vila' : size < 50 ? 'Cidade' : size < 100 ? 'Metrópole' : 'Império'}
              </div>
            </div>
          </BrutalCard>

          {/* Locais de Trabalho (DIREITA) */}
          <BrutalCard className="relative pt-10 pb-6 bg-[#e5e7eb] dark:bg-zinc-800">
            <div className="absolute -top-4 left-6 bg-primary text-white border-2 border-black px-3 py-1 font-black uppercase text-xs z-10 shadow-brutal">
              LOCAIS DE TRABALHO
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'TER', key: 'lands' },
                { label: 'MAD', key: 'wood' },
                { label: 'MIN', key: 'mines' },
                { label: 'PED', key: 'quarries' }
              ].map(item => (
                <div key={item.key} className="flex flex-col items-center">
                  <span className="text-[8px] font-black uppercase mb-1 opacity-70">{item.label}</span>
                  <input 
                    type="number" 
                    value={(kingdom.stats.resources.workplaces as any)[item.key]}
                    onChange={e => handleResourceChange('workplaces', item.key, e.target.value)}
                    className="w-full h-10 border-2 border-black dark:border-white bg-white dark:bg-black text-center font-black text-lg focus:ring-0 outline-none"
                  />
                </div>
              ))}
            </div>
          </BrutalCard>

          {/* CD Teste de Evento (DIREITA) */}
          <BrutalCard className="flex flex-col items-center justify-center py-6 bg-[#e5e7eb] dark:bg-zinc-800 border-4 border-black">
            <span className="text-[10px] font-black uppercase mb-2 tracking-wider">CD DE TESTE DE EVENTO</span>
            <input 
              type="number" 
              value={kingdom.stats.resources.eventDC}
              onChange={e => updateStats({ resources: { ...kingdom.stats.resources, eventDC: parseInt(e.target.value) || 0 }})}
              className="w-full bg-transparent border-none text-center font-black text-6xl text-accent focus:ring-0"
            />
            <div className="text-[9px] font-black uppercase mt-2 opacity-60">FALHA AUTOMÁTICA EM 20+</div>
          </BrutalCard>

        </div>
      </div>
    </div>
  );
};

export default KingdomSheet;
