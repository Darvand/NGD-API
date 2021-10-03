import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { FutureFarm } from './interfaces/farm.interfaces';
import { PvuController } from './pvu.controller';
import { PvuService } from './pvu.service';
import { farmHarvestableStub, farmStatsStub, farmStub } from './stubs/api.stub';

describe('PvuService', () => {
  let service: PvuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PvuService],
      controllers: [PvuController],
      imports: [HttpModule],
    }).compile();

    service = module.get<PvuService>(PvuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateFarmStats', () => {
    it('should return 0', () => {
      const expectedStat: FutureFarm = {
        stimatedDays: 9,
        stimatedHours: 217,
        currentLE: 0,
        currentSunflower: 0,
      };
      const stat = service.calculateFarmStats(
        farmHarvestableStub,
        farmStatsStub,
      );
      expect(stat).toEqual(expectedStat);
    });
  });
});
