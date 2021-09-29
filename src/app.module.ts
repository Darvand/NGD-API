import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PvuModule } from './pvu/pvu.module';

@Module({
  imports: [PvuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
