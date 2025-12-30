
import React from 'react';
import { BrutalCard, SectionTitle } from '../components/UI';

interface EvolutionRow {
  level: number;
  dc: number;
  features: string;
}

const evolutionTable: EvolutionRow[] = [
  { level: 1, dc: 14, features: "Construção de assentamento (aldeia), governo, licença, proficiências iniciais, região central, região predileta" },
  { level: 2, dc: 15, features: "Talento de Reino" },
  { level: 3, dc: 16, features: "Construção de assentamento (vila), incremento de perícia" },
  { level: 4, dc: 18, features: "Especialista em expansão, talento de Reino, viver bem" },
  { level: 5, dc: 20, features: "Incremento de perícia, melhorias de atributo, resistência a ruína" },
  { level: 6, dc: 22, features: "Talento de Reino" },
  { level: 7, dc: 23, features: "Incremento de perícia" },
  { level: 8, dc: 24, features: "Liderança experiente +2, resistência a ruína, talento de Reino" },
  { level: 9, dc: 26, features: "Construção de assentamento (cidade), especialista em expansão (Reivindica Hexágonos 3 vezes/turno), incremento de perícia" },
  { level: 10, dc: 27, features: "Melhorias de atributo, talento de Reino, vida de luxo" },
  { level: 11, dc: 28, features: "Incremento de perícia, resistência a ruína" },
  { level: 12, dc: 30, features: "Planejamento cívico, talento de Reino" },
  { level: 13, dc: 31, features: "Incremento de perícia" },
  { level: 14, dc: 32, features: "Construção de assentamento (metrópole), incremento de perícia, melhorias de atributo" },
  { level: 15, dc: 34, features: "Liderança experiente +3, talento de Reino" },
  { level: 16, dc: 35, features: "Liderança experiente +3, talento de Reino" },
  { level: 17, dc: 36, features: "Incremento de perícia, resistência a ruína" },
  { level: 18, dc: 38, features: "Talento de Reino" },
  { level: 19, dc: 39, features: "Incremento de perícia" },
  { level: 20, dc: 40, features: "Inveja do mundo, melhorias de atributo, resistência a ruína, talento de Reino" },
];

const KingdomEvolution: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <div className="border-b-4 border-black dark:border-white pb-6">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Evolução do Reino</h1>
        <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Progressão de Poder e Capacidade</p>
      </div>

      <BrutalCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary text-white font-black uppercase text-xs border-b-4 border-black dark:border-white">
                <th className="p-4 w-20 text-center">Nível</th>
                <th className="p-4 w-32 text-center">CD Controle</th>
                <th className="p-4">Características do Reino</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-gray-200 dark:divide-gray-800">
              {evolutionTable.map((row) => (
                <tr key={row.level} className="hover:bg-primary/5 transition-colors">
                  <td className="p-4 text-center font-black text-lg">{row.level}</td>
                  <td className="p-4 text-center font-bold text-lg bg-gray-50 dark:bg-black/20">{row.dc}</td>
                  <td className="p-4 text-sm font-medium">{row.features}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BrutalCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FeatureBlock 
          title="Talentos de Reino (2º)"
          text="No 2º nível e a cada 2 níveis subsequentes, o reino recebe um talento de Reino."
        />
        <FeatureBlock 
          title="Incremento de Perícia (3º)"
          text="No 3º nível e a cada 2 níveis subsequentes, seu reino recebe um incremento de perícia. Você pode usar este incremento para aumentar sua graduação de proficiência para treinado em uma perícia na qual seu reino seja destreinado ou para aumentar sua graduação de proficiência para especialista em uma perícia na qual o seu reino já seja treinado. No 7º nível, você pode usar incrementos de perícia para aumentar a graduação de proficiência do seu reino para mestre em uma perícia na qual o seu reino já seja especialista. No 15º nível, você pode usá-los para aumentar sua proficiência para lendário em uma perícia na qual o seu reino já seja mestre."
        />
        <FeatureBlock 
          title="Especialista em Expansão (4º)"
          text="Seu reino fica melhor em expandir território. Você recebe +2 de bônus de circunstância em testes de perícias feitos para Reivindicar Hexágono e pode tentar Reivindicar Hexágono até duas vezes durante um turno de Reino. No 9º nível, você pode tentar Reivindicar Hexágono até três vezes durante um turno de Reino."
        />
        <FeatureBlock 
          title="Viver Bem (4º)"
          text="O povo celebra a sua liderança o satisfazendo com banquetes e requintes. Todos os PJs associados ao reino desfrutam de um padrão de vida Bom sem custos sempre que estiverem no reino. Você recebe +1 de bônus de circunstância em todos os testes feitos para Manufaturar ou Ganhar Proventos enquanto estiver no seu reino."
        />
        <FeatureBlock 
          title="Melhorias de Atributo (5º)"
          text="No 5º nível e a cada 5 níveis subsequentes, você incrementa os valores de dois atributos diferentes. Incrementar um atributo aumenta o valor dele em 2 pontos, se ele for menor que 18 ou em 1 ponto se ele já for 18 ou maior."
        />
        <FeatureBlock 
          title="Resistência a Ruína (5º)"
          text="No 5º nível e a cada 3 níveis subsequentes, seu reino fica mais resistente a Ruína. Escolha uma das quatro categorias de Ruína e aumente o limiar dela em 2 pontos. Ao fazer isso, redefina a penalidade da respectiva Ruína para 0."
        />
        <FeatureBlock 
          title="Liderança Experiente (8º)"
          text="Funções de liderança investidas no seu reino concedem +2 de bônus de estado em testes de reino associados ao atributo chave da função de liderança. No 16º nível, aumenta para +3 de bônus de estado."
        />
        <FeatureBlock 
          title="Vida de Luxo (10º)"
          text="O povo o presenteia com todo o conforto. Isto é idêntico a Viver Bem, mas todos os líderes PJs desfrutam de um padrão de vida Extravagante sem custos sempre que estiverem no reino. Você recebe +2 de bônus de circunstância em todos os testes feitos para Manufaturar ou Ganhar Proventos enquanto estiver no seu reino."
        />
        <FeatureBlock 
          title="Planejamento Cívico (12º)"
          text="Durante a etapa de Atividades Cívicas da fase de Atividades do turno de um Reino, um assentamento que o grupo escolher pode fazer duas atividades Cívica em vez de uma."
        />
        <FeatureBlock 
          title="Inveja do Mundo (20º)"
          text="Seu reino é uma das nações proeminentes do mundo. Ignore o aumento na primeira vez em um turno de Reino que o seu reino receberia Desordem ou Ruína. Você pode ignorar aumentos adicionais gastando um ponto de Fama ou Infâmia. O seu total máximo de pontos de Fama ou Infâmia aumenta em 1."
        />
      </div>
    </div>
  );
};

const FeatureBlock: React.FC<{ title: string, text: string }> = ({ title, text }) => (
  <BrutalCard className="h-full">
    <h3 className="text-xl font-black uppercase text-primary dark:text-accent mb-4 border-b-2 border-black dark:border-white pb-2">
      {title}
    </h3>
    <p className="text-sm font-medium leading-relaxed opacity-90">{text}</p>
  </BrutalCard>
);

export default KingdomEvolution;
