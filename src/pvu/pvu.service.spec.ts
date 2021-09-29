import { Test, TestingModule } from '@nestjs/testing';
import { PvuService } from './pvu.service';

describe('PvuService', () => {
  let service: PvuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PvuService],
    }).compile();

    service = module.get<PvuService>(PvuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
