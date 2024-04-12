import { Controller, Get, HttpStatus, Param, Patch, Query, Req } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "src/libs/decorators";
import { UserRole } from "src/libs/types";
import { BalanceService } from "./balance.service";
import { CURRENT_USER_ID } from "src/app.const";
import { UUIDValidationPipe } from "src/libs/pipes";
import { BalancesRdo } from "./rdo/balances.rdo";

@ApiTags('Баланс пользователя')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @ApiResponse({
    type: BalancesRdo,
    status: HttpStatus.OK,
    description: 'Баланс пользователя',
  })
  @Role(UserRole.Customer)
  @Get()
  public async index() {
    return this.balanceService.find(CURRENT_USER_ID);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Баланс успешно изменен',
  })
  @Role(UserRole.Customer)
  @Patch(':trainingId')
  public async update(@Param('trainingId', UUIDValidationPipe) trainingId: string ) {
    return this.balanceService.spendBalance(CURRENT_USER_ID, trainingId);
  }
}
