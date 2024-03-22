import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaClientModule } from '../../libs/models';

@Module({
  imports: [PrismaClientModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
