export interface FarmStatsData {
  totalHarvestable: number;
  pvuToFarm: number;
  seedsToFarm: number;
  pvuMyFarmed: number;
  seedsMyFarmed: number;
  leWallet: number;
  usagesSunflower: number;
}

export interface FarmStatsResponse {
  status: number;
  data: FarmStatsData;
}
