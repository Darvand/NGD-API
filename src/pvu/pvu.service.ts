import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FarmResponse } from './interfaces/farm_response.interfaces';
import { map } from 'rxjs/operators';
import { CoinMarketResponse } from './constants/coin_market';

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

@Injectable()
export class PvuService {
  constructor(private httpService: HttpService) {}

  getFarm(token: string): Observable<FarmResponse> {
    return this.httpService
      .get<FarmResponse>(
        'https://backend-farm.plantvsundead.com/farms',
        buildRequest(token),
      )
      .pipe(map((axiosResponse) => axiosResponse.data));
  }

  getFarmStats(token: string): Observable<FarmResponse> {
    return this.httpService
      .get<FarmResponse>(
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
}
