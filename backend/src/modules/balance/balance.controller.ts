import { Controller, Get, HttpStatus, Param, Patch, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "src/libs/decorators";
import { UserRole } from "src/libs/types";
import { BalanceService } from "./balance.service";
import { UUIDValidationPipe } from "src/libs/pipes";
import { BalancesRdo } from "./rdo/balances.rdo";
import { RequestWithTokenPayload } from "src/libs/requests";
import { RoleGuard } from "src/libs/guards";
import { BalanceRdo, BalancesRdoExample } from "./rdo";

@ApiTags('Баланс пользователя')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @ApiOperation({
    summary: 'Получить баланс пользователя по всем тренировкам'
  })
  @ApiResponse({
    schema: {
      example: BalancesRdoExample
    },
    status: HttpStatus.OK,
    description: 'Баланс пользователя',
  })
  @Role(UserRole.Customer)
  @UseGuards(RoleGuard)
  @ApiBearerAuth('access-token')
  @Get()
  public async index(@Req() { tokenPayload }: RequestWithTokenPayload) {
    return this.balanceService.find(tokenPayload.sub);
  }

  @ApiOperation({
    summary: 'Уменьшить баланс пользователя по тренировке на 1'
  })
  @ApiResponse({
    type: BalanceRdo,
    status: HttpStatus.OK,
    description: 'Баланс успешно изменен',
  })
  @Role(UserRole.Customer)
  @UseGuards(RoleGuard)
  @ApiBearerAuth('access-token')
  @Patch(':trainingId')
  public async update(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Param('trainingId', UUIDValidationPipe) trainingId: string ) {
    return this.balanceService.spendBalance(tokenPayload.sub, trainingId);
  }
}
