import { Body, Controller, Get, HttpStatus, Post, Query, Req } from "@nestjs/common";
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "src/libs/decorators";
import { UserRole } from "src/libs/types";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto";
import { OrderRdo } from "./rdo";
import { OrderQuery } from "./query";
import { RequestWithTokenPayload } from "src/libs/requests";

@ApiTags('Заказы')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({
    type: OrderRdo,
    status: HttpStatus.CREATED,
    description: 'Новый заказ успешно создан',
  })
  @ApiBody({ type: CreateOrderDto })
  @Role(UserRole.Customer)
  @Post()
  public async create(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Body() dto: CreateOrderDto
  ) {
    return this.orderService.create(tokenPayload.sub, dto);
  }

  @ApiResponse({
    type: OrderRdo,
    status: HttpStatus.OK,
    description: 'Список заказов тренера',
  })
  @ApiQuery({ type: OrderQuery })
  @Role(UserRole.Coach)
  @Get()
  public async indexByCoach(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Query() query: OrderQuery
  ) {
    return this.orderService.find(tokenPayload.sub, query);
  }
}
