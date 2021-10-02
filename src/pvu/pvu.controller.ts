import { Body, Controller, Get, Post } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { tokens } from './constants/tokens';
import { FarmData } from './interfaces/farm_response.interfaces';
import { PvuService } from './pvu.service';
import { DateTime, Interval } from 'luxon';
import { farmMocked } from './mocks/farm';
import { PVUFarmDTO } from './pvu.dto';

const farmMapper = (farm: FarmData) => {
  const harvestDateTime = DateTime.fromISO(farm.harvestTime.toString());
  const startDateTime = DateTime.fromISO(farm.startTime.toString());
  const time = harvestDateTime.toMillis();
  const difference = Interval.fromDateTimes(startDateTime, harvestDateTime);
  return {
    needWater: farm.needWater,
    hasSeed: farm.hasSeed,
    hasCrow: farm.hasCrow,
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

  @Post('/farm')
  getFarm(@Body() pvuFarmDto: PVUFarmDTO) {
    if (!pvuFarmDto.farmData.length) return [];
    // return farmMocked;
    return forkJoin(
      pvuFarmDto.farmData.map((tokenFarm) =>
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
    // return { price: 3.50923314080297 };
    return this.pvuService.getPvuPrice().pipe(
      map((coinMarketResponse) => ({
        price: coinMarketResponse.data.quote.USD.price,
      })),
    );
  }
}
