
import React, { useState, useRef, useEffect } from 'react';
import { useKingdom } from '../KingdomContext';
import { BrutalCard, BrutalButton, BrutalInput } from '../components/UI';

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
        content: `Saudações, Majestade! Sou seu Conselheiro Real em Groq AI para o reino de ${kingdom.stats.name}. Como posso auxiliar na vossa soberania hoje?`
      }]);
    }
  }, [kingdom.stats.name, messages.length]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }, { role: 'advisor', content: "Perdão, Majestade, mas a 'GROQ_API_KEY' não foi encontrada nos registros do reino. Sem ela, minhas profecias estão seladas." }]);
      setInput('');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const systemInstruction = `
        Você é o Conselheiro Real do reino de ${kingdom.stats.name}. Sua personalidade é formal, leal e sábia.
        REGRAS DE OURO (SISTEMA KINGMAKER):
        1. TAMANHO E RECURSOS: Tamanho determina o Dado de Recursos (d4 aldeia até d12 império). PR (Pontos de Recurso) são a base.
        2. RUÍNAS: Corrupção, Crime, Deterioração, Conflito. Limiar = 10 + Nível. Exceder aumenta Penalidade de Ruína.
        3. DESORDEM (Unrest): 1-4 pts = -1; 5-9 = -2; 10-14 = -3; 15-19 = -4. 20+ = Anarquia.
        4. CONSUMO: Pago com Alimentos ou 5 PR/unidade.
        Contexto: Nível ${kingdom.stats.level}, PR: ${kingdom.stats.resources.rp}, Desordem: ${kingdom.stats.unrest}.
        Responda como "Majestade" ou "Soberano". Seja breve e estratégico.
      `;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstruction },
            ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content })),
            { role: "user", content: userMessage }
          ],
          stream: true
        })
      });

      if (!response.ok) throw new Error("Falha na conexão com Groq");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let advisorContent = "";
      
      setMessages(prev => [...prev, { role: 'advisor', content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          const message = line.replace(/^data: /, "");
          if (message === "[DONE]") break;

          try {
            const parsed = JSON.parse(message);
            const content = parsed.choices[0].delta.content;
            if (content) {
              advisorContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...last, content: advisorContent }];
              });
            }
          } catch (e) {
            // Ignorar erros de parse parciais
          }
        }
      }
    } catch (error) {
      console.error("Erro no Groq Advisor:", error);
      setMessages(prev => [...prev, { role: 'advisor', content: "Majestade, houve uma interrupção mágica na minha conexão com o Oráculo de Groq. Por favor, verifique se vossa chave está ativa." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] gap-6">
      <div className="border-b-4 border-black dark:border-white pb-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Conselheiro Groq AI</h1>
        <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Consultoria Ultrarrápida de Reino</p>
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
          {isTyping && <div className="animate-pulse p-3 bg-white dark:bg-surface-dark border-4 border-black text-xs font-black uppercase">O conselheiro está processando em alta velocidade...</div>}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-surface-dark border-t-4 border-black flex gap-4">
          <BrutalInput value={input} onChange={e => setInput(e.target.value)} placeholder="Pergunte ao Groq sobre o reino..." className="flex-grow text-sm" disabled={isTyping} />
          <BrutalButton type="submit" disabled={isTyping || !input.trim()}>Consultar</BrutalButton>
        </form>
      </BrutalCard>
    </div>
  );
};

export default RoyalAdvisor;
