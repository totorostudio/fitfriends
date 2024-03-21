import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaClientModule } from '../../libs/models';

@Module({
  imports: [PrismaClientModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
