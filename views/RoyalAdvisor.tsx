
import React, { useState, useRef, useEffect } from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard, BrutalButton, BrutalInput } from '../components/UI';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'advisor';
  content: string;
}

const RoyalAdvisor: React.FC = () => {
  const { activeKingdom: kingdom } = useKingdom();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!kingdom) return null;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'advisor',
        content: `Saudações, Majestade! Sou seu Conselheiro Real para o reino de ${kingdom.stats.name}. Recebi os novos manuais de governança e estou pronto para auxiliar na administração estratégica de suas terras.`
      }]);
    }
  }, [kingdom.stats.name, messages.length]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Você é o Conselheiro Real do reino de ${kingdom.stats.name}. Sua personalidade é formal, leal e sábia.
        REGRAS DE OURO QUE VOCÊ DEVE SEGUIR (BASEADO NO MANUAL DO REINO):
        
        1. TAMANHO E RECURSOS: 
           - Tamanho determina o Dado de Recursos (d4 em aldeias, d12 em impérios).
           - PR (Pontos de Recursos) são a base da economia. 1 PR não gasto = 1 XP no final do turno.
           - Se PR cair abaixo de 0, escolha uma Ruína para aumentar em 1 ponto.

        2. RUÍNAS (O contraste dos atributos):
           - Cultura vs Corrupção. Economia vs Crime. Estabilidade vs Deterioração. Lealdade vs Conflito.
           - Limiar de Ruína inicial é 10 + Nível. Se exceder, reseta e aumenta a Penalidade de Ruína em 1.
           - Penalidades de Ruína são aplicadas como penalidades de item nos testes de atributo.

        3. DESORDEM (Unrest):
           - É persistente. 1 pt = -1 penalidade; 5 pts = -2; 10 pts = -3; 15 pts = -4.
           - 20+ pts = Anarquia (ganha 1d10 Ruínas e bloqueia a maioria das ações).

        4. MATERIAIS E CONSUMO:
           - Tipos: Alimentos, Luxo, Madeira, Minério, Pedra.
           - Consumo: Baseado no tamanho e assentamentos. Deve ser pago com Alimentos ou 5 PR/unidade faltante.

        5. FAMA E INFÂMIA:
           - Máximo 3 pontos. Gastar 1 pt para rerolar teste (Fortuna).
           - Gastar TODOS os pontos para evitar Anarquia ou aumento de Penalidade de Ruína.

        Contexto Atual: Nível ${kingdom.stats.level}, PR: ${kingdom.stats.resources.rp}, Desordem: ${kingdom.stats.unrest}, Atributos: C:${kingdom.stats.attributes.culture.mod}, E:${kingdom.stats.attributes.economy.mod}, L:${kingdom.stats.attributes.loyalty.mod}, S:${kingdom.stats.attributes.stability.mod}.
        Responda sempre como "Majestade" ou "Soberano". Seja estratégico mas mantenha a imersão.
      `;

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction },
      });

      const responseStream = await chat.sendMessageStream({ message: userMessage });
      let advisorContent = "";
      setMessages(prev => [...prev, { role: 'advisor', content: "" }]);

      for await (const chunk of responseStream) {
        advisorContent += chunk.text;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: advisorContent }];
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'advisor', content: "Peço perdão, Majestade, mas os ventos do destino turvaram minha visão." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] gap-6">
      <div className="border-b-4 border-black dark:border-white pb-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Conselheiro Real</h1>
        <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Consultoria Estratégica & Auxílio Real</p>
      </div>
      <BrutalCard className="flex-grow flex flex-col p-0 overflow-hidden h-full">
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-black/20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 border-4 border-black shadow-brutal ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-white dark:bg-surface-dark text-black dark:text-white'}`}>
                <div className="text-[10px] font-black uppercase mb-1 opacity-50">{msg.role === 'user' ? 'Vossa Majestade' : 'Conselheiro Real'}</div>
                <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {isTyping && <div className="animate-pulse p-3 bg-white dark:bg-surface-dark border-4 border-black text-xs font-black uppercase">O conselheiro está refletindo...</div>}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-surface-dark border-t-4 border-black flex gap-4">
          <BrutalInput value={input} onChange={e => setInput(e.target.value)} placeholder="Pergunte sobre as regras do reino..." className="flex-grow text-sm" disabled={isTyping} />
          <BrutalButton type="submit" disabled={isTyping || !input.trim()}>Consultar</BrutalButton>
        </form>
      </BrutalCard>
    </div>
  );
};

export default RoyalAdvisor;
