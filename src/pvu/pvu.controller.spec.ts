import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { PvuController } from './pvu.controller';
import { PvuService } from './pvu.service';

describe('PvuController', () => {
  let controller: PvuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PvuService],
      controllers: [PvuController],
      imports: [HttpModule],
    }).compile();

    controller = module.get<PvuController>(PvuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
