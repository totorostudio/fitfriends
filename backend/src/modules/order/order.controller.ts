import { Body, Controller, Get, HttpStatus, Post, Query, Req } from "@nestjs/common";
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "src/libs/decorators";
import { UserRole } from "src/libs/types";
import { OrderService } from "./order.service";
import { CURRENT_USER_ID } from "src/app.const";
import { CreateOrderDto } from "./dto";
import { OrderRdo } from "./rdo";
import { OrderQuery } from "./query";

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
  public async create(@Body() dto: CreateOrderDto ) {
    return this.orderService.create(CURRENT_USER_ID, dto);
  }

  @ApiResponse({
    type: OrderRdo,
    status: HttpStatus.OK,
    description: 'Список заказов тренера',
  })
  @ApiQuery({ type: OrderQuery })
  @Role(UserRole.Coach)
  @Get()
  public async indexByCoach(@Query() query: OrderQuery) {
    return this.orderService.find(CURRENT_USER_ID, query);
  }
}
