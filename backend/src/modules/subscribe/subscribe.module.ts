import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { PrismaClientModule } from 'src/libs/models';
import { HttpClientParam } from 'src/app.const';
import { EmailService } from './email.service';
import { SubscribeRepository } from './subscribe.repository';

@Module({
  imports: [
    PrismaClientModule,
    HttpModule.register({
      timeout: HttpClientParam.Timeout,
      maxRedirects: HttpClientParam.MaxRedirect,
    }),
  ],
  controllers: [SubscribeController],
  providers: [SubscribeService, EmailService, SubscribeRepository],
  exports: [SubscribeService, EmailService],
})
export class SubscribeModule {}
