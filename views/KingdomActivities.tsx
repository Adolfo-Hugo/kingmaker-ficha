
import React, { useState } from 'react';
import { BrutalCard } from '../components/UI';

interface Activity {
  name: string;
  tags: string[];
  requirements?: string;
  description: string;
  skills?: string;
  outcomes: {
    criticalSuccess?: string;
    success: string;
    failure: string;
    criticalFailure: string;
  };
  special?: string;
  penalty?: string;
}

const activitiesData: Activity[] = [
  // --- ATIVIDADES GERAIS (Anteriores) ---
  {
    name: "Abandonar Hexágono",
    tags: ["RECESSO", "REGIÃO"],
    requirements: "O hexágono deve estar controlado.",
    description: "Após análise cuidadosa, você renuncia reivindicação e retira colonos ou exploradores.",
    skills: "Exploração ou Ecossistema (Teste Básico)",
    outcomes: {
      criticalSuccess: "Abandona hexágono(s), diminui Tamanho em 1/hexágono. Colonos retornam e trazem recursos. Adquira 1 PR/hexágono.",
      success: "Como sucesso crítico, mas sem PR e aumenta Desordem em 1.",
      failure: "Abandona hexágono(s), diminui Tamanho em 1/hexágono. Aumenta Desordem em 2 e faça teste simples CD 6. Se falhar, refugiados viram bandidos.",
      criticalFailure: "Como falha, mas Desordem aumenta em 3 e passa por evento Bandidagem."
    },
    special: "Desordem dobrada se incluir assentamento."
  },
  {
    name: "Construir Estrutura",
    tags: ["CÍVICO", "RECESSO"],
    description: "Tenta construir estrutura em assentamento gastando PR e Material.",
    skills: "Perícia da estrutura",
    outcomes: {
      criticalSuccess: "Constrói/repara com eficiência. Recebe metade do Material gasto de volta.",
      success: "Constrói/repara. Efeitos imediatos.",
      failure: "Não constrói. Pode tentar completar no próximo turno sem custo extra.",
      criticalFailure: "Não constrói. Se reparando, vira Detrito."
    }
  },
  {
    name: "Reivindicar Hexágono",
    tags: ["RECESSO", "REGIÃO"],
    requirements: "Hexágono Reconhecido e adjacente. Perigos eliminados.",
    description: "Adiciona novo território ao reino. Gaste 1 PR.",
    skills: "Ecossistema, Exploração, Intriga ou Magia (Teste Básico)",
    outcomes: {
      criticalSuccess: "Reivindica imediatamente. Permite outra atividade de Região imediata.",
      success: "Reivindica e adiciona, aumenta Tamanho em 1.",
      failure: "Não reivindica.",
      criticalFailure: "Não reivindica e perde colonos. -1 Estabilidade por 1 turno."
    },
    special: "Concede 10 XP ao reino."
  },

  // --- AGRICULTURA ---
  {
    name: "Estabelecer Terra Agrícola",
    tags: ["RECESSO", "REGIÃO", "AGRICULTURA"],
    requirements: "Colinas ou planícies; sob influência de assentamento.",
    description: "Planta cultivos e cria gado permanente (Terra Agrícola). Custo: 1 PR (Planície) / 2 PR (Colinas).",
    skills: "Agricultura (CD Controle / CD+5 Colinas)",
    outcomes: {
      criticalSuccess: "Estabelece dois hexágonos de Terra Agrícola adjacentes.",
      success: "Estabelece um hexágono de Terra Agrícola.",
      failure: "Não estabelece.",
      criticalFailure: "Não estabelece e dissemina praga (Evento Perda de Colheita)."
    }
  },
  {
    name: "Colher Plantações",
    tags: ["RECESSO", "REGIÃO", "AGRICULTURA"],
    description: "Procurar alimentos silvestres ou colher excedentes.",
    skills: "Agricultura (Teste Básico)",
    outcomes: {
      criticalSuccess: "Adquire 1d4 Alimentos.",
      success: "Adquire 1 Alimento.",
      failure: "Não adquire Alimentos.",
      criticalFailure: "Perde 1d4 Alimentos estragados; se não tiver, Desordem +1."
    }
  },

  // --- ARTES ---
  {
    name: "Manufaturar Luxos",
    tags: ["LIDERANÇA", "RECESSO", "ARTES"],
    description: "Encoraja artesãos a produzirem bens de alto valor. Gaste PR igual a 1 Dado de Recursos.",
    skills: "Artes (Teste Básico)",
    outcomes: {
      criticalSuccess: "Recebe 1d4 Luxo.",
      success: "Recebe 1 Luxo.",
      failure: "Não produz nada notável.",
      criticalFailure: "Não produz e gera mercado clandestino. Ruína +1."
    }
  },
  {
    name: "Criar uma Obra-Prima",
    tags: ["LIDERANÇA", "RECESSO", "TREINADO", "ARTES"],
    description: "Criação de obra magistral para Fama/Infâmia. Limite: 1x/turno.",
    skills: "Artes (Teste Básico)",
    outcomes: {
      criticalSuccess: "Fama/Infâmia +1 imediato e +1 no próximo turno. Ganha PR (2 Dados Recursos).",
      success: "Fama/Infâmia +1 imediato.",
      failure: "Tentativa fracassa.",
      criticalFailure: "Perde 1 Fama/Infâmia; se não tiver, Desordem +1d4."
    }
  },

  // --- NÁUTICA ---
  {
    name: "Pescar",
    tags: ["RECESSO", "REGIÃO", "NÁUTICA"],
    requirements: "Pelo menos um hexágono com rio ou lago.",
    description: "Busca por subsistência aquática.",
    skills: "Náutica (Teste Básico)",
    outcomes: {
      criticalSuccess: "Adquire 1d4 Alimentos.",
      success: "Adquire 1 Alimento.",
      failure: "Não adquire Alimentos.",
      criticalFailure: "Tragédia nos rios; adquire 1 Desordem."
    }
  },

  // --- DEFESA ---
  {
    name: "Fortificar Hexágono",
    tags: ["RECESSO", "REGIÃO", "DEFESA"],
    requirements: "Hexágono reivindicado sem assentamento.",
    description: "Constrói forte ou barbacã defensivo. Gaste PR conforme terreno.",
    skills: "Engenharia / Defesa (Teste Básico)",
    outcomes: {
      criticalSuccess: "Estabelece fortificação. Recebe metade do PR e Desordem -1.",
      success: "Estabelece fortificação. Desordem -1.",
      failure: "Não consegue fortificar.",
      criticalFailure: "Desastre. Trabalhadores morrem. Desordem +1."
    }
  },
  {
    name: "Prestar Cuidados",
    tags: ["LIDERANÇA", "RECESSO", "DEFESA"],
    description: "Organiza curandeiros e médicos para apoiar a população.",
    skills: "Defesa (Teste Básico)",
    outcomes: {
      criticalSuccess: "Apoio solidário. Desordem -1 e Ruína -1.",
      success: "Acalma preocupações. Desordem -1.",
      failure: "Sem efeito notável.",
      criticalFailure: "Aumenta Desordem ou 1 Ruína em 1."
    }
  },

  // --- ENGENHARIA ---
  {
    name: "Construir Estradas",
    tags: ["RECESSO", "REGIÃO", "ENGENHARIA"],
    requirements: "Hexágono reivindicado.",
    description: "Melhora mobilidade no território. Custo em PR conforme terreno. Dobro para Pontes.",
    skills: "Engenharia (Teste Básico)",
    outcomes: {
      criticalSuccess: "Constrói estradas no alvo e em um adjacente apropriado.",
      success: "Constrói estradas no hexágono.",
      failure: "Não consegue construir.",
      criticalFailure: "Desastre. Desordem +1."
    }
  },
  {
    name: "Demolir",
    tags: ["CÍVICO", "RECESSO", "ENGENHARIA"],
    description: "Limpa lote em assentamento (Detrito).",
    skills: "Engenharia (Teste Básico)",
    outcomes: {
      criticalSuccess: "Limpa lote ou recupera 1d6 Materiais.",
      success: "Demole o lote.",
      failure: "Lote permanece como Detrito.",
      criticalFailure: "Acidentes fatais. Desordem +1."
    }
  },
  {
    name: "Estabelecer Local de Trabalho",
    tags: ["RECESSO", "REGIÃO", "ENGENHARIA"],
    description: "Cria acampamentos madeireiros, minas ou pedreiras.",
    skills: "Engenharia (Teste Básico)",
    outcomes: {
      criticalSuccess: "Estabelece e descobre abundância (Rendimento dobrado próximo turno).",
      success: "Estabelece Local de Trabalho.",
      failure: "Não estabelece.",
      criticalFailure: "Não estabelece. Desordem +1."
    }
  },
  {
    name: "Irrigação",
    tags: ["RECESSO", "REGIÃO", "TREINADO", "ENGENHARIA"],
    requirements: "Adj. a rio/lago. Custo em PR conforme terreno.",
    description: "Constrói hidrovias ou sistemas de drenagem.",
    skills: "Engenharia (Teste Básico)",
    outcomes: {
      criticalSuccess: "Ganha característica de rio/lago. Metade do PR de volta.",
      success: "Ganha característica de rio/lago.",
      failure: "Não constrói sistemas viáveis.",
      criticalFailure: "Foco de doenças. Desordem +1 e chance de Praga mensal."
    }
  },

  // --- EXPLORAÇÃO ---
  {
    name: "Contratar Aventureiros",
    tags: ["LIDERANÇA", "RECESSO", "EXPLORAÇÃO"],
    description: "Gaste PR (1 Dado de Recursos) para lidar com evento ativo.",
    skills: "Exploração (CD Evento)",
    outcomes: {
      criticalSuccess: "Encerra evento contínuo.",
      success: "+2 circunstância para resolver evento na próxima fase.",
      failure: "Não encerra. Custo aumenta para 2 Dados de Recursos.",
      criticalFailure: "Notícia se espalha. Bloqueado para este evento."
    }
  },

  // --- FOLCLORE ---
  {
    name: "Comemorar Feriado",
    tags: ["LIDERANÇA", "RECESSO", "FOLCLORE"],
    description: "Declara dia de festa nacional. Penalidade +4 CD se repetido.",
    skills: "Folclore (Teste Básico)",
    outcomes: {
      criticalSuccess: "Alegria e renda incidental. Lealdade +2 até próximo turno.",
      success: "Sucesso caro (Custo: 1 Dado Recursos). Lealdade +1.",
      failure: "Entusiasmo baixo e caro (Custo: 1 Dado Recursos).",
      criticalFailure: "Festividade mal organizada. Dados de Recursos -4 e Lealdade -1."
    }
  },

  // --- INDÚSTRIA ---
  {
    name: "Negociar Materiais",
    tags: ["MERCANTIL", "RECESSO", "INDÚSTRIA"],
    description: "Reduz estoque de Material (até 4) para ganhar recursos futuros.",
    skills: "Indústria (Teste Básico)",
    outcomes: {
      criticalSuccess: "Próximo turno: +2 Dados de Recursos por ponto gasto.",
      success: "Próximo turno: +1 Dado de Recursos por ponto gasto.",
      failure: "+1 Dado de Recursos no próximo turno total.",
      criticalFailure: "Material perdido. Desordem +1 se repetido."
    }
  },
  {
    name: "Realocar Capital",
    tags: ["LIDERANÇA", "RECESSO", "TREINADO", "INDÚSTRIA"],
    requirements: "Novo local deve ter Castelo, Palácio ou Prefeitura.",
    description: "Muda a sede do governo. Requer todos os líderes.",
    skills: "Indústria (CD Controle +5)",
    outcomes: {
      criticalSuccess: "Mudança esplêndida e popular.",
      success: "Mudança ocorre, mas Desordem +1.",
      failure: "Infelicidade. Desordem +1 e Duas Ruínas +1.",
      criticalFailure: "Povo rejeita. Permanece capital antiga. Desordem +1d4 e Três Ruínas +1."
    }
  },

  // --- INTRIGA ---
  {
    name: "Infiltração",
    tags: ["LIDERANÇA", "RECESSO", "INTRIGA"],
    description: "Espionagem externa ou investigação interna (Saúde do Reino).",
    skills: "Intriga (Teste Básico)",
    outcomes: {
      criticalSuccess: "Informação exata ou Reduz Desordem (1d4) ou Ruína (-1).",
      success: "Informação vaga ou Reduz Desordem (1).",
      failure: "Espiões falham sem serem notados.",
      criticalFailure: "Espiões perdidos. -2 em todos os testes por 1 turno."
    }
  },
  {
    name: "Negócios Clandestinos",
    tags: ["LIDERANÇA", "RECESSO", "TREINADO", "INTRIGA"],
    description: "Propina de criminosos. CD aumenta +2 a cada uso seguido.",
    skills: "Intriga (Teste Básico)",
    outcomes: {
      criticalSuccess: "Recursos (2 Dados) e 1d4 Luxo. Público não sabe.",
      success: "Recursos (2 Dados) OU 1d4 Luxo. Desordem +1.",
      failure: "Recursos (1 Dado). Desordem +1 e Corrupção +1.",
      criticalFailure: "Nada recebido. Desordem +1d6, Corrupção +2."
    }
  },

  // --- MAGIA ---
  {
    name: "Solução Sobrenatural",
    tags: ["LIDERANÇA", "FORTUNA", "RECESSO", "MAGIA"],
    description: "Conjuradores usam misticismo para testes de perícia.",
    skills: "Magia (Teste Básico)",
    outcomes: {
      criticalSuccess: "Auxílio em qualquer teste (rola 2 e escolhe) ou 10 XP.",
      success: "Como crítico, mas custa 1d4 PR pesquisa.",
      failure: "Custa 2d6 PR sem vantagem.",
      criticalFailure: "Custa 2d6 PR. Bloqueado por 2 turnos."
    }
  },
  {
    name: "Prognosticar",
    tags: ["LIDERANÇA", "RECESSO", "TREINADO", "MAGIA"],
    description: "Leitura de presságios para eventos futuros.",
    skills: "Magia (Teste Básico)",
    outcomes: {
      criticalSuccess: "Eventos: Rola 2 e escolhe + Bônus +2 no teste de decisão.",
      success: "Bônus +1 em testes para decidir eventos aleatórios.",
      failure: "Sem ajuda divinatória.",
      criticalFailure: "Leitura incorreta. Evento aleatório forçado (rolar 2, MJ escolhe)."
    }
  },

  // --- POLÍTICA ---
  {
    name: "Melhorar Estilo de Vida",
    tags: ["MERCANTIL", "RECESSO", "POLÍTICA"],
    description: "Usa tesouro para qualidade de vida. Apenas fase Mercantil.",
    skills: "Política (Teste Básico)",
    outcomes: {
      criticalSuccess: "Bônus +2 em testes de Cultura.",
      success: "Bônus +1 em testes de Cultura.",
      failure: "Tesouro esgotado. -1 em testes de Economia.",
      criticalFailure: "Abuso criminoso. Economia -1, Desordem +1, Ruína +1."
    }
  },

  // --- ERUDIÇÃO ---
  {
    name: "Solução Criativa",
    tags: ["LIDERANÇA", "FORTUNA", "RECESSO", "ERUDIÇÃO"],
    description: "Estudiosos pesquisam novas soluções.",
    skills: "Erudição (Teste Básico)",
    outcomes: {
      criticalSuccess: "Rerolar qualquer teste com +2 ou 10 XP.",
      success: "Como crítico, mas custa 1d4 PR.",
      failure: "Custa 2d6 PR sem vantagem.",
      criticalFailure: "Custa 2d6 PR. Cultura -1 por 1 turno."
    }
  },

  // --- GOVERNANÇA ---
  {
    name: "Utilizar Tesouro Nacional",
    tags: ["MERCANTIL", "RECESSO", "GOVERNANÇA"],
    description: "Saque de fundos para uso pessoal (PJs) ou emergências.",
    skills: "Governança (Teste Básico)",
    outcomes: {
      criticalSuccess: "Retira fundos (Nível) ou financia evento.",
      success: "Retira fundos. Economia -1 por 1 turno.",
      failure: "Não consegue. Rumores: Lealdade/Economia -1.",
      criticalFailure: "Não consegue. Desordem +1, Ruína +1."
    },
    special: "Penalidade cumulativa: Sucessos tornam testes futuros 2 graus piores até reembolso."
  },
  {
    name: "Requisitar Auxílio Estrangeiro",
    tags: ["LIDERANÇA", "RECESSO", "TREINADO", "GOVERNANÇA"],
    requirements: "Relações diplomáticas ativas.",
    description: "Pedido de ajuda a aliados. CD Negociação +2.",
    skills: "Governança (CD Negociação)",
    outcomes: {
      criticalSuccess: "Bônus +4 em teste OU Recursos (2 Dados).",
      success: "Recursos (1 Dado) OU Bônus +2 em um teste.",
      failure: "Ajuda atrasada. Próximo turno +1d4 PR.",
      criticalFailure: "Reino parece desesperado. Desordem +1d4."
    }
  },
  {
    name: "Enviar Representante Diplomático",
    tags: ["LIDERANÇA", "RECESSO", "TREINADO", "GOVERNANÇA"],
    description: "Promove relações. Concede 60 XP na 1ª vez.",
    skills: "Governança (CD Negociação)",
    outcomes: {
      criticalSuccess: "Estabelece relações e +2 em testes com o grupo.",
      success: "Estabelece relações diplomáticas.",
      failure: "Grupo não pronto. Próximo turno +2 bônus.",
      criticalFailure: "Desastre diplomático! Desordem +1d4 ou Ruína +1."
    }
  },

  // --- COMÉRCIO ---
  {
    name: "Investimento de Capital",
    tags: ["LIDERANÇA", "RECESSO", "COMÉRCIO"],
    requirements: "Assentamento com Banco.",
    description: "PJs doam riqueza pessoal para gerar PR.",
    skills: "Comércio (Teste Básico)",
    outcomes: {
      criticalSuccess: "Recursos (4 Dados de Recursos em PR).",
      success: "Recursos (2 Dados de Recursos em PR).",
      failure: "Adquira 1d4 PR.",
      criticalFailure: "Investimento desviado. Crime +1 ou Recursos (1 Dado) + Crime."
    }
  },
  {
    name: "Administrar Acordos Comerciais",
    tags: ["MERCANTIL", "RECESSO", "COMÉRCIO"],
    description: "Trata de acordos vigentes. Custo: 2 PR/acordo. CD +5 se repetido.",
    skills: "Comércio (Teste Básico)",
    outcomes: {
      criticalSuccess: "Recursos (+1 Dado por acordo) e 1 Material por acordo.",
      success: "Dados de Recursos OU Materiais.",
      failure: "Adquira 1 PR por acordo.",
      criticalFailure: "Sem benefícios. Bloqueado por 1 turno."
    }
  },
  {
    name: "Comprar Materiais",
    tags: ["LIDERANÇA", "RECESSO", "COMÉRCIO"],
    description: "Gasto direto de PR por Material (8 Luxo / 4 Outros).",
    skills: "Comércio (Teste Básico)",
    outcomes: {
      criticalSuccess: "Adquire 4 do tipo e 2 de qualquer outro.",
      success: "Adquire 2 do tipo.",
      failure: "Adquire 1 do tipo.",
      criticalFailure: "Não adquire Materiais."
    }
  },
  {
    name: "Coletar Impostos",
    tags: ["MERCANTIL", "RECESSO", "TREINADO", "COMÉRCIO"],
    description: "Arrecadação de fundos. Aumenta Desordem se repetido.",
    skills: "Comércio (Teste Básico)",
    outcomes: {
      criticalSuccess: "Bônus +2 em Economia por 1 turno.",
      success: "Bônus +1 em Economia. Desordem +1 se repetido.",
      failure: "Bônus +1 mas Desordem +1 (ou +2 se repetido).",
      criticalFailure: "Resistência popular. Desordem +2 e Ruína +1."
    }
  },

  // --- ECOSSISTEMA ---
  {
    name: "Juntar Gado",
    tags: ["RECESSO", "REGIÃO", "ECOSSISTEMA"],
    description: "Gera Alimentos a partir da vida selvagem e ranchos.",
    skills: "Ecossistema (Teste Básico)",
    outcomes: {
      criticalSuccess: "Adquire 1d4 Alimentos.",
      success: "Adquire 1 Alimento.",
      failure: "Não adquire Alimentos.",
      criticalFailure: "Estrago: perde 1d4 Alimentos ou Desordem +1."
    }
  },

  // --- LIDERANÇA / MANUTENÇÃO (Existentes) ---
  {
    name: "Nova Liderança",
    tags: ["MANUTENÇÃO", "RECESSO"],
    description: "Promoção de personagem para função de liderança.",
    skills: "Artes Bélicas (General/Prot), Intriga (Emis/Tes), Governança (Magis/Vice), Política (Cons/Gov)",
    outcomes: {
      criticalSuccess: "Povo ama novo líder. Benefícios imediatos e +1 circunstância.",
      success: "Povo aceita. Benefícios imediatos.",
      failure: "Povo incerto. Líder sofre -1 circunstância.",
      criticalFailure: "Povo rejeita. Função desocupada. Desordem +1."
    }
  },
  {
    name: "Reprimir Desordem",
    tags: ["LIDERANÇA", "RECESSO"],
    description: "Envia agentes para inibir dissidência.",
    skills: "Artes, Artes Bélicas, Folclore, Intriga, Magia ou Política",
    outcomes: {
      criticalSuccess: "Reduz Desordem em 1d6.",
      success: "Reduz Desordem em 1.",
      failure: "Não reduz Desordem.",
      criticalFailure: "Incita revolta. Desordem +1d4 ou Duas Ruínas +1."
    }
  },
  {
    name: "Descansar e Relaxar",
    tags: ["LIDERANÇA", "RECESSO"],
    description: "Reserva tempo para si e cidadãos espairecerem.",
    skills: "Artes, Náutica, Erudição, Comércio ou Ecossistema",
    outcomes: {
      criticalSuccess: "Desordem -1 e próxima atividade ganha +2.",
      success: "Reduz Desordem em 1.",
      failure: "Descanso bem-vindo, sem benefício.",
      criticalFailure: "Tempo perdido. -2 circunstância no próximo teste."
    }
  }
];

const KingdomActivities: React.FC = () => {
  const [filter, setFilter] = useState<string>("TODOS");
  const [search, setSearch] = useState<string>("");

  const categories = ["TODOS", "LIDERANÇA", "REGIÃO", "CÍVICO", "MANUTENÇÃO", "MERCANTIL"];

  const filtered = activitiesData.filter(act => {
    const matchesFilter = filter === "TODOS" || act.tags.includes(filter);
    const matchesSearch = act.name.toLowerCase().includes(search.toLowerCase()) || 
                         act.description.toLowerCase().includes(search.toLowerCase()) ||
                         act.skills?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-black dark:border-white pb-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-display">Atividades</h1>
          <p className="text-sm opacity-80 mt-2 font-bold uppercase tracking-widest">Ações de Liderança e Gestão Territorial</p>
        </div>
        <div className="w-full md:w-64">
           <input 
              type="text" 
              placeholder="Buscar ação ou perícia..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-black border-4 border-black dark:border-white p-2 font-bold uppercase text-xs focus:ring-0"
           />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1 text-[10px] font-black uppercase border-2 border-black dark:border-white transition-all ${filter === cat ? 'bg-primary text-white' : 'bg-white dark:bg-surface-dark'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filtered.map((activity, idx) => (
          <BrutalCard key={idx} className="flex flex-col">
            <div className="flex justify-between items-start mb-4 gap-4">
              <h3 className="text-2xl font-black font-display uppercase leading-tight text-primary dark:text-accent">
                {activity.name}
              </h3>
              <div className="flex flex-wrap gap-1 justify-end">
                {activity.tags.map(tag => (
                  <span key={tag} className="bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 text-[8px] font-black uppercase whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <p className="text-sm font-medium italic opacity-80 border-l-4 border-primary pl-4">
                {activity.description}
              </p>

              {activity.requirements && (
                <div className="text-[10px] font-bold">
                  <span className="text-red-600 dark:text-red-400">REQUISITOS: </span>
                  {activity.requirements}
                </div>
              )}

              {activity.skills && (
                <div className="bg-primary/10 dark:bg-primary/20 p-2 border-2 border-primary/30">
                  <span className="text-[10px] font-black uppercase block mb-1 opacity-60">Perícias Aplicáveis</span>
                  <div className="text-xs font-black uppercase tracking-tight">{activity.skills}</div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {activity.outcomes.criticalSuccess && (
                  <div className="border-2 border-green-600 p-3 bg-green-50 dark:bg-green-900/10">
                    <span className="text-[9px] font-black uppercase text-green-700 dark:text-green-400 block mb-1">Sucesso Crítico</span>
                    <p className="text-[10px] leading-tight font-bold">{activity.outcomes.criticalSuccess}</p>
                  </div>
                )}
                <div className="border-2 border-primary p-3 bg-primary/5">
                  <span className="text-[9px] font-black uppercase text-primary block mb-1">Sucesso</span>
                  <p className="text-[10px] leading-tight font-bold">{activity.outcomes.success}</p>
                </div>
                <div className="border-2 border-orange-600 p-3 bg-orange-50 dark:bg-orange-900/10">
                  <span className="text-[9px] font-black uppercase text-orange-700 dark:text-orange-400 block mb-1">Falha</span>
                  <p className="text-[10px] leading-tight font-bold">{activity.outcomes.failure}</p>
                </div>
                <div className="border-2 border-red-700 p-3 bg-red-50 dark:bg-red-900/10">
                  <span className="text-[9px] font-black uppercase text-red-700 block mb-1">Falha Crítica</span>
                  <p className="text-[10px] leading-tight font-bold">{activity.outcomes.criticalFailure}</p>
                </div>
              </div>

              {(activity.special || activity.penalty) && (
                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-300 dark:border-gray-700 text-[10px]">
                  {activity.special && <div><span className="font-black uppercase">Especial:</span> {activity.special}</div>}
                  {activity.penalty && <div className="mt-1 text-red-600 dark:text-red-400"><span className="font-black uppercase">Penalidade:</span> {activity.penalty}</div>}
                </div>
              )}
            </div>
          </BrutalCard>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-gray-400 opacity-50 font-black uppercase">
            Nenhuma atividade encontrada para os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
};

export default KingdomActivities;
