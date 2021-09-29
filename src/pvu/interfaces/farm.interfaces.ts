export interface Production {
  le: number;
  hours: number;
}

export interface Plant {
  production: Production;
  element: string;
  type: string;
  rarity: number;
  isSunflower: boolean;
  icon: string;
}

export interface Data {
  needWater: boolean;
  hasSeed: boolean;
  hasCrow: boolean;
  harvestTime: string;
  timeStoped: number;
  plant: Plant;
}

export interface Farm {
  name: string;
  data: Data[];
}
