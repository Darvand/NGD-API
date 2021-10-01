export interface FarmConfig {
  le: number;
  hours: number;
}

export interface Stats {
  type: string;
  hp: number;
  defPhysics: number;
  defMagic: number;
  damagePhysics: number;
  damageMagic: number;
  damagePure: number;
  damageHpLoss: number;
  damageHpRemove: number;
}

export interface Synergy {
  requirement: number;
  description: string;
}

export interface Plant {
  farmConfig: FarmConfig;
  stats: Stats;
  type: number;
  iconUrl: string;
  rarity: number;
  synergy: Synergy;
  sunflowerId?: number;
}

export interface Elements {
  fire: number;
  water: number;
  ice: number;
  wind: number;
  electro: number;
  parasite: number;
  light: number;
  dark: number;
  metal: number;
}

export interface Capacity {
  plant: number;
  motherTree: number;
}

export interface Land {
  elements: Elements;
  capacity: Capacity;
  landId: number;
  x: number;
  y: number;
  totalOfElements: number;
  rarity: number;
}

export interface ActiveTool {
  count: number;
  _id: string;
  id: number;
  type: string;
  duration: number;
  endTime: Date;
  startTime: Date;
}

export interface Rate {
  le: number;
  hours: number;
}

export interface FarmData {
  _id: string;
  plant: Plant;
  land: Land;
  isTempPlant: boolean;
  stage: string;
  ownerId: string;
  landId: number;
  plantId: number;
  plantUnitId: number;
  plantType: number;
  plantElement: string;
  activeTools: ActiveTool[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  harvestTime: Date;
  rate: Rate;
  startTime: Date;
  hasSynergy: boolean;
  needWater: boolean;
  hasSeed: boolean;
  hasCrow?: boolean;
  pausedTime?: any;
  inGreenhouse: boolean;
  count: number;
  totalHarvest: number;
  totalExtraHarvest: number;
}

export interface FarmResponse {
  status: number;
  data: FarmData[];
  total: number;
}
