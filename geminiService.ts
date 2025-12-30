
import { GoogleGenAI, Type } from "@google/genai";
import { KingdomData } from "./types";

/**
 * Creates a GoogleGenAI instance using the current API_KEY.
 * Per instructions, instances should be created right before use for up-to-date configuration.
 */
const createAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateRandomEvent(kingdom: KingdomData) {
  const prompt = `Gere um evento aleatório para um reino de RPG (sistema Kingmaker). 
  O reino chama-se "${kingdom.stats.name}", está no nível ${kingdom.stats.level}. 
  Seu estado de Ruínas é: Corrupção(${kingdom.stats.ruins.corruption.value}), Crime(${kingdom.stats.ruins.crime.value}), Decadência(${kingdom.stats.ruins.decay.value}), Conflito(${kingdom.stats.ruins.strife.value}).
  
  Retorne um objeto JSON com: 
  - name: Nome criativo do evento
  - level: nível sugerido (próximo ao do reino)
  - skill: Perícia recomendada para resolver
  - dc: CD do teste
  - notes: Descrição breve das consequências.`;

  try {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            level: { type: Type.NUMBER },
            skill: { type: Type.STRING },
            dc: { type: Type.NUMBER },
            notes: { type: Type.STRING },
          },
          required: ["name", "level", "skill", "dc", "notes"]
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}

export async function getKingdomAdvice(kingdom: KingdomData) {
  const prompt = `Aja como o Conselheiro Real do reino "${kingdom.stats.name}". 
  Estado atual: Nível ${kingdom.stats.level}, XP ${kingdom.stats.xp}.
  Ruínas críticas: Corrupção ${kingdom.stats.ruins.corruption.value}, Crime ${kingdom.stats.ruins.crime.value}.
  Dê um conselho curto (máximo 2 frases) de como melhorar a situação do reino.`;

  try {
    const ai = createAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Mantenha a guarda alta, majestade.";
  } catch (error) {
    return "Mantenha a guarda alta, majestade.";
  }
}
