import { Injectable, Logger } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrainingService } from 'src/modules/training/training.service';
import { BalanceService } from 'src/modules/balance/balance.service';
import { OrderEntity } from './order.entity';
import { OrderRdo, OrdersRdo } from './rdo';
import { fillDto } from 'src/libs/helpers';
import { OrderQuery } from './query';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly trainingService: TrainingService,
    private readonly balanceService: BalanceService,
  ) {}

  public async create(userId: string, dto: CreateOrderDto) {
    const training = await this.trainingService.getTrainingEntity(dto.trainingId);

    const newOrder = OrderEntity.fromObject(
      Object.assign(dto, {
        userId,
        price: training.price,
        cost: dto.quantity * training.price,
      }),
    );

    const orderEntity = new OrderEntity(newOrder);
    const order = await this.orderRepository.save(orderEntity);
    await this.balanceService.topUpBalance(userId, dto.trainingId, dto.quantity);

    return fillDto(OrderRdo, order.toPOJO());
  }

  public async find(coachId: string, query?: OrderQuery): Promise<OrdersRdo> {
    const orderEntities = await this.orderRepository.find(coachId, query);

    return fillDto(OrdersRdo, {
      ...orderEntities,
      orders: orderEntities.entities.map((entity) =>
        fillDto(OrdersRdo, entity.toPOJO()),
      ),
    });
  }
}