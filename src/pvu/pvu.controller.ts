import { Controller, Get } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { tokens } from './constants/tokens';
import { FarmData } from './interfaces/pvu.interfaces';
import { PvuService } from './pvu.service';
import { DateTime, Interval } from 'luxon';

const farmMapper = (farm: FarmData) => {
  const harvestDateTime = DateTime.fromISO(farm.harvestTime.toString());
  const startDateTime = DateTime.fromISO(farm.startTime.toString());
  const time = harvestDateTime.toLocaleString(DateTime.DATETIME_MED);
  const difference = Interval.fromDateTimes(startDateTime, harvestDateTime);
  return {
    needWater: farm.needWater,
    hasSeed: farm.hasSeed,
    hasCrow: !!farm.pausedTime,
    harvestTime: time,
    timeStoped: difference.length('hours') - farm.rate.hours,
    plant: {
      production: farm.plant.farmConfig,
      element: farm.plantElement,
      type: farm.plantType === 1 ? 'Plant' : 'Mother Tree',
      rarity: farm.plant.rarity,
      isSunflower: !!farm.plant.sunflowerId,
      icon: farm.plant.iconUrl,
    },
  };
};

@Controller('pvu')
export class PvuController {
  constructor(private readonly pvuService: PvuService) {}

  @Get('/farm')
  getFarm() {
    return forkJoin(
      tokens.map((tokenFarm) =>
        this.pvuService.getFarm(tokenFarm.token).pipe(
          map((farmResponse) => ({
            name: tokenFarm.name,
            data: farmResponse.data.map(farmMapper),
          })),
        ),
      ),
    );
  }

  @Get('/price')
  getPrice() {
    return this.pvuService
      .getPvuPrice()
      .pipe(
        map((coinMarketResponse) => coinMarketResponse.data.quote.USD.price),
      );
  }
}
