
import { KingdomData, ResolutionState, KingdomSkill, GovernmentType, CharterType, HeartlandType } from './types';

export const GOVERNMENT_TYPES: GovernmentType[] = [
  {
    id: 'despotism',
    name: 'Despotismo',
    description: 'O governo é centralizado em um único indivíduo com poder absoluto.',
    boosts: ['economy', 'stability'],
    freeBoosts: 1,
    skills: ['INTRIGA', 'ARTES BÉLICAS']
  },
  {
    id: 'oligarchy',
    name: 'Oligarquia',
    description: 'O poder é exercido por um pequeno grupo de elite ou famílias influentes.',
    boosts: ['economy', 'loyalty'],
    freeBoosts: 1,
    skills: ['INDÚSTRIA', 'POLÍTICA']
  },
  {
    id: 'republic',
    name: 'República',
    description: 'O governo é gerido por representantes eleitos pelos cidadãos.',
    boosts: ['culture', 'stability'],
    freeBoosts: 1,
    skills: ['ARTES', 'ERUDIÇÃO']
  },
  {
    id: 'thaumocracy',
    name: 'Teocracia Mística',
    description: 'As leis e o governo são baseados em princípios mágicos ou divinos.',
    boosts: ['culture', 'economy'],
    freeBoosts: 1,
    skills: ['MAGIA', 'ERUDIÇÃO']
  },
  {
    id: 'monarchy',
    name: 'Monarquia',
    description: 'A soberania é exercida por um monarca hereditário ou eleito.',
    boosts: ['loyalty', 'stability'],
    freeBoosts: 1,
    skills: ['GOVERNANÇA', 'POLÍTICA']
  },
  {
    id: 'confederacy',
    name: 'Confederação / Conselho Popular',
    description: 'Uma união de grupos ou tribos com forte foco em lealdade e tradições locais.',
    boosts: ['loyalty', 'culture'],
    freeBoosts: 1,
    skills: ['AGRICULTURA', 'ECOSSISTEMA']
  }
];

export const CHARTER_TYPES: CharterType[] = [
  {
    id: 'open',
    name: 'Licença de Conquista (Aberta)',
    description: 'Um verdadeiro agente livre e desbravador fazendo valer seu direito. Nenhuma restrição e nenhum apoio direto.',
    boosts: [],
    freeBoosts: 1,
  },
  {
    id: 'grant',
    name: 'Licença de Concessão',
    description: 'Grande financiamento sem restrições de desenvolvimento, mas exige empregar cidadãos e aliados do patrono.',
    boosts: ['economy'],
    flaw: 'loyalty',
    freeBoosts: 1,
  },
  {
    id: 'patron_conquest',
    name: 'Licença de Conquista (Patrono)',
    description: 'Coloca você no comando de território conquistado. Povo dedicado (por medo ou respeito), mas guerra constante prejudica as artes.',
    boosts: ['loyalty'],
    flaw: 'culture',
    freeBoosts: 1,
  },
  {
    id: 'expansion',
    name: 'Licença de Expansão',
    description: 'Domínio adjacente a terras já povoadas. Forte apoio fortalece a sociedade, mas dependência gera instabilidade.',
    boosts: ['culture'],
    flaw: 'stability',
    freeBoosts: 1,
  },
  {
    id: 'exploration',
    name: 'Licença de Exploração',
    description: 'Explorar e povoar área selvagem na fronteira. Garante estruturas iniciais em troca de dívidas financeiras.',
    boosts: ['stability'],
    flaw: 'economy',
    freeBoosts: 1,
  }
];

export const HEARTLAND_TYPES: HeartlandType[] = [
  {
    id: 'hill_plain',
    name: 'Colina ou Planície',
    description: 'Área fácil de atravessar. Os cidadãos valorizam a vida facilitada e são mais leais.',
    boost: 'loyalty'
  },
  {
    id: 'forest_swamp',
    name: 'Floresta ou Pântano',
    description: 'Zonas arborizadas ou pantanosas com abundância de recursos e belezas naturais.',
    boost: 'culture'
  },
  {
    id: 'lake_river',
    name: 'Lago ou Rio',
    description: 'Mecanismo garantido para comercializar. Mercadores e viajantes chegam com facilidade.',
    boost: 'economy'
  },
  {
    id: 'mountain_ruins',
    name: 'Montanha ou Ruínas',
    description: 'Características naturais ou artificiais reforçam a defesa. Cidadãos fortes e obstinados.',
    boost: 'stability'
  }
];

const DEFAULT_SKILLS: KingdomSkill[] = [
  { name: "AGRICULTURA", linkedAttribute: 'stability', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "ARTES", linkedAttribute: 'culture', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "NÁUTICA", linkedAttribute: 'economy', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "DEFESA", linkedAttribute: 'stability', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "ENGENHARIA", linkedAttribute: 'stability', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "EXPLORAÇÃO", linkedAttribute: 'economy', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "FOLCLORE", linkedAttribute: 'culture', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "INDÚSTRIA", linkedAttribute: 'economy', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "INTRIGA", linkedAttribute: 'loyalty', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "MAGIA", linkedAttribute: 'culture', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "POLÍTICA", linkedAttribute: 'loyalty', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "ERUDIÇÃO", linkedAttribute: 'culture', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "GOVERNANÇA", linkedAttribute: 'loyalty', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "COMÉRCIO", linkedAttribute: 'economy', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "ARTES BÉLICAS", linkedAttribute: 'loyalty', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
  { name: "ECOSSISTEMA", linkedAttribute: 'stability', rank: 0, statusBonus: 0, circumstanceBonus: 0, itemBonus: 0, otherBonus: 0 },
];

export const INITIAL_KINGDOM_DATA: KingdomData = {
  id: "",
  stats: {
    name: "Novo Reino",
    level: 1,
    unrest: 0,
    fame: 0,
    infamy: 0,
    xp: 0,
    charterFreeBoosts: [],
    governmentFreeBoosts: [],
    feats: [],
    builtStructures: [],
    attributes: {
      culture: { value: 10, mod: 0 },
      economy: { value: 10, mod: 0 },
      loyalty: { value: 10, mod: 0 },
      stability: { value: 10, mod: 0 },
    },
    skills: DEFAULT_SKILLS,
    ruins: {
      corruption: { value: 0, pen: 0, threshold: 10 },
      crime: { value: 0, pen: 0, threshold: 10 },
      decay: { value: 0, pen: 0, threshold: 10 },
      strife: { value: 0, pen: 0, threshold: 10 },
    },
    controlDC: {
      base: 10,
      size: 0,
    },
    resources: {
      rp: 0,
      materials: { food: 0, wood: 0, luxury: 0, ore: 0, stone: 0 },
      workplaces: { lands: 0, wood: 0, mines: 0, quarries: 0 },
      tradeAgreements: 0,
      eventDC: 16,
      bonusDice: 0,
      penaltyDice: 0,
    },
    currentTurn: 1,
  },
  settlements: [],
  events: [],
  leaders: {
    governante: "",
    conselheiro: "",
    general: "",
    emissario: "",
    magista: "",
    tesoureiro: "",
    viceRei: "",
    protetor: "",
  },
};
