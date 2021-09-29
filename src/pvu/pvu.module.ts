import { Module } from '@nestjs/common';
import { PvuService } from './pvu.service';
import { PvuController } from './pvu.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [PvuService],
  controllers: [PvuController],
  imports: [HttpModule],
})
export class PvuModule {}
