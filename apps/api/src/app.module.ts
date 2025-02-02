import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfessionalModule } from './professionals/professionals.module';

@Module({
  imports: [ProfessionalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
