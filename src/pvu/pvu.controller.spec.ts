import { Test, TestingModule } from '@nestjs/testing';
import { PvuController } from './pvu.controller';

describe('PvuController', () => {
  let controller: PvuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PvuController],
    }).compile();

    controller = module.get<PvuController>(PvuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
