
export enum ResolutionState {
  PENDENTE = "Pendente",
  SUCESSO = "Sucesso",
  FALHA = "Falha",
  CRITICO = "Crítico"
}

export interface Settlement {
  id: string;
  name: string;
  population: number;
  loyalty: number;
  primaryResource: string;
  production: number;
  stability: number;
}

export interface KingdomEvent {
  id: string;
  name: string;
  level: number;
  skill: string;
  modifier: number;
  dc: number;
  notes: string;
  state: ResolutionState;
  turn: number;
}

export type KingdomAttributeKey = 'culture' | 'economy' | 'loyalty' | 'stability';

export interface KingdomSkill {
  name: string;
  linkedAttribute: KingdomAttributeKey;
  rank: 0 | 2 | 4 | 6 | 8; // 0=U, 2=T, 4=E, 6=M, 8=L
  statusBonus: number;
  circumstanceBonus: number;
  itemBonus: number;
  otherBonus: number;
  targetDC?: number; // CD persistente para rolagem
}

export interface GovernmentType {
  id: string;
  name: string;
  description: string;
  boosts: KingdomAttributeKey[];
  freeBoosts: number;
  skills: string[];
}

export interface CharterType {
  id: string;
  name: string;
  description: string;
  boosts: KingdomAttributeKey[];
  flaw?: KingdomAttributeKey;
  freeBoosts: number;
}

export interface HeartlandType {
  id: string;
  name: string;
  description: string;
  boost: KingdomAttributeKey;
}

export interface KingdomStats {
  name: string;
  level: number;
  unrest: number;
  fame: number;
  infamy: number;
  xp: number;
  governmentId?: string;
  charterId?: string;
  heartlandId?: string;
  charterFreeBoosts: (KingdomAttributeKey | null)[];
  governmentFreeBoosts: (KingdomAttributeKey | null)[]; // Novo: Melhorias livres de governo
  feats: string[];
  builtStructures: string[]; // Nomes ou IDs das estruturas construídas
  attributes: {
    culture: { value: number; mod: number };
    economy: { value: number; mod: number };
    loyalty: { value: number; mod: number };
    stability: { value: number; mod: number };
  };
  skills: KingdomSkill[];
  ruins: {
    corruption: { value: number; pen: number; threshold: number };
    crime: { value: number; pen: number; threshold: number };
    decay: { value: number; pen: number; threshold: number };
    strife: { value: number; pen: number; threshold: number };
  };
  controlDC: {
    base: number;
    size: number;
  };
  resources: {
    rp: number; // Resource Points (PR)
    materials: { food: number; wood: number; luxury: number; ore: number; stone: number };
    workplaces: { lands: number; wood: number; mines: number; quarries: number };
    tradeAgreements: number;
    eventDC: number;
    bonusDice: number;
    penaltyDice: number;
  };
  currentTurn: number;
}

export interface KingdomData {
  id: string;
  stats: KingdomStats;
  settlements: Settlement[];
  events: KingdomEvent[];
  leaders: Record<string, string>;
}
