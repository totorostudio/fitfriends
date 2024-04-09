import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaClientModule } from 'src/libs/models';
import { HttpClientParam } from 'src/app.const';
import { TrainingRepository } from './training.repository';

@Module({
  imports: [
    PrismaClientModule,
    HttpModule.register({
      timeout: HttpClientParam.Timeout,
      maxRedirects: HttpClientParam.MaxRedirect,
    }),
    UserModule,
    //NotifyModule,
  ],
  controllers: [TrainingController],
  providers: [TrainingService, TrainingRepository],
  exports: [TrainingService],
})
export class TrainingModule {}
