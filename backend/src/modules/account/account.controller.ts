import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountService } from './account.service';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get("hello")
  getHello(): string {
    return this.accountService.getHello();
  }

  @Get("users")
  getUsers() {
    return this.accountService.getUsers();
  }
}
