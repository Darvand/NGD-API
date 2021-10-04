import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FarmResponse } from './interfaces/farm_response.interfaces';
import { map } from 'rxjs/operators';
import { CoinMarketResponse } from './constants/coin_market';
import { FarmStatsResponse } from './interfaces/farm_stats_response.interface';
import { FutureFarm, PlantCalculation } from './interfaces/farm.interfaces';
import { DateTime, Interval } from 'luxon';
import {
  LE_TO_PVU,
  LE_TO_PVU_TAX,
  MOTHER_TREE_TYPE,
  POT_LE,
  PVU_TO_SEED,
  SEED_LE,
  SUNFLOWER_MAMA_LE,
  SUNFLOWER_SAPPLING_LE,
} from './constants/pvu.constant';
import { farmStatsStub, farmStub } from './stubs/api.stub';

const buildRequest = (token: string) => ({
  headers: {
    credentials: 'include',
    'user-agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36 OPR/78.0.4093.186',
    authorization: `Bearer Token: ${token}`,
    origin: 'https://marketplace.plantvsundead.com',
    referer: 'https://marketplace.plantvsundead.com/',
    authority: 'backend-farm.plantvsundead.com',
  },
});

const calculateLE = (isSunflower: boolean, type: number, le: number) => {
  if (isSunflower && type === MOTHER_TREE_TYPE) {
    return le - SUNFLOWER_MAMA_LE - POT_LE;
  } else if (isSunflower) {
    return le - SUNFLOWER_SAPPLING_LE - POT_LE;
  } else {
    return le;
  }
};

const fullDayInHours = (hours: number) => hours % 24 === 0;

const calculateHours =
  (plants: PlantCalculation[], actualLE: number) =>
  (leNeeded = SEED_LE) => {
    let totalLEHarvested = actualLE;
    let hoursPassed = 0;
    const plantsCalculation = plants.map((plant) => ({ ...plant }));
    while (totalLEHarvested <= leNeeded) {
      plantsCalculation.forEach((plant) => {
        const hours =
          plant.harvestTimes === 1 ? plant.actualHours : plant.hours;
        if (hoursPassed === hours * plant.harvestTimes) {
          totalLEHarvested += plant.le;
          plant.harvestTimes++;
        }
      });
      if (fullDayInHours(hoursPassed)) {
        totalLEHarvested += SUNFLOWER_SAPPLING_LE * 4;
      }
      hoursPassed++;
    }
    return hoursPassed;
  };

@Injectable()
export class PvuService {
  constructor(private httpService: HttpService) {}

  getFarm(token: string): Observable<FarmResponse> {
    if (process.env.NODE_ENV === 'dev') {
      return new Observable((suscriber) => {
        suscriber.next(farmStub);
        suscriber.complete();
      });
    }
    return this.httpService
      .get<FarmResponse>(
        'https://backend-farm.plantvsundead.com/farms',
        buildRequest(token),
      )
      .pipe(map((axiosResponse) => axiosResponse.data));
  }

  getFarmStats(token: string): Observable<FarmStatsResponse> {
    if (process.env.NODE_ENV === 'dev') {
      return new Observable((suscriber) => {
        suscriber.next(farmStatsStub);
        suscriber.complete();
      });
    }
    return this.httpService
      .get<FarmStatsResponse>(
        'https://backend-farm.plantvsundead.com/farming-stats ',
        buildRequest(token),
      )
      .pipe(map((axiosResponse) => axiosResponse.data));
  }

  getPvuPrice(): Observable<CoinMarketResponse> {
    return this.httpService
      .get<CoinMarketResponse>(
        'https://pro-api.coinmarketcap.com/v1/tools/price-conversion?id=11130&amount=1',
        {
          headers: {
            'X-CMC_PRO_API_KEY': '4b145551-bdc9-48cd-92fb-d786d063fea6',
          },
        },
      )
      .pipe(map((axiosResponse) => axiosResponse.data));
  }

  calculateFarmStats(
    farm: FarmResponse,
    { data: { leWallet, usagesSunflower } }: FarmStatsResponse,
  ): FutureFarm {
    const plants = farm.data.map((plant) => {
      const startTime = DateTime.fromISO(plant.startTime);
      const actualHours = Interval.fromDateTimes(startTime, DateTime.now());
      return {
        le: calculateLE(plant.isTempPlant, plant.plantType, plant.rate.le),
        hours: plant.rate.hours,
        harvestTimes: 1,
        actualHours: plant.totalHarvest
          ? 0
          : Math.ceil(actualHours.length('hours')),
      };
    });
    const actualLE = leWallet + usagesSunflower * SUNFLOWER_SAPPLING_LE;
    const functionToCalculateWith = calculateHours(plants, actualLE);
    const leToSeed = SEED_LE + LE_TO_PVU * PVU_TO_SEED * (1 + LE_TO_PVU_TAX);
    const hoursIncludingPVU = functionToCalculateWith(leToSeed);
    const hoursNotIncludingPVU = functionToCalculateWith();
    return {
      currentLE: leWallet,
      currentSunflower: usagesSunflower,
      stimatedHoursIncludingPVU: hoursIncludingPVU,
      stimatedHoursNotIncludingPVU: hoursNotIncludingPVU,
    };
  }
}
