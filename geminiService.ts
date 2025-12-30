
import { KingdomData } from "./types";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(messages: any[], jsonMode: boolean = false) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("GROQ_API_KEY ausente.");
    return null;
  }

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.7,
        response_format: jsonMode ? { type: "json_object" } : undefined
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro na chamada ao Groq:", error);
    return null;
  }
}

export async function generateRandomEvent(kingdom: KingdomData) {
  const prompt = `Você é um mestre de RPG gerando eventos para o sistema Kingmaker. 
  O reino chama-se "${kingdom.stats.name}", nível ${kingdom.stats.level}. 
  Status de Ruínas: Corrupção(${kingdom.stats.ruins.corruption.value}), Crime(${kingdom.stats.ruins.crime.value}), Decadência(${kingdom.stats.ruins.decay.value}), Conflito(${kingdom.stats.ruins.strife.value}).
  
  Retorne um JSON estrito com os campos: 
  - name (string)
  - level (number)
  - skill (string, ex: 'Diplomacia', 'Artes Bélicas')
  - dc (number, entre 14 e 35)
  - notes (string, descrição das consequências).
  Responda APENAS o JSON.`;

  const result = await callGroq([
    { role: "system", content: "Você é um gerador de eventos JSON para RPG." },
    { role: "user", content: prompt }
  ], true);

  return result ? JSON.parse(result) : null;
}

export async function getKingdomAdvice(kingdom: KingdomData) {
  const prompt = `Aja como o Conselheiro Real de "${kingdom.stats.name}". 
  Nível ${kingdom.stats.level}, XP ${kingdom.stats.xp}.
  Ruínas: Corrupção ${kingdom.stats.ruins.corruption.value}, Crime ${kingdom.stats.ruins.crime.value}.
  Dê um conselho curto (máximo 2 frases) sobre como melhorar o reino.`;

  const result = await callGroq([
    { role: "system", content: "Você é um sábio conselheiro medieval." },
    { role: "user", content: prompt }
  ]);
  
  return result || "Mantenha a guarda alta, majestade.";
}
