import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { BalanceRdo, BalancesRdo } from './rdo';
import { fillDto } from 'src/libs/helpers';
import { BalanceRepository } from './balance.repository';
import { BalanceEntity } from './balance.entity';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    private readonly balanceRepository: BalanceRepository
  ) {}

  private async findBalance(userId: string, workoutId: string ): Promise<BalanceEntity> {
    const balance = await this.balanceRepository.findBalance(userId, workoutId);

    return balance;
  }

  public async find(currentUserId: string): Promise<BalancesRdo> {
    const balanceEntities = await this.balanceRepository.findMany(currentUserId);

    return fillDto(BalancesRdo, {
      ...balanceEntities,
      users: balanceEntities.entities.map((entity) =>
        fillDto(BalanceRdo, entity.toPOJO()),
      ),
    });
  }

  public async spendBalance(userId: string, trainingId: string) {
    const balance = await this.findBalance(userId, trainingId);

    if (balance.count < 1) {
      throw new ConflictException(
        `Недостаточный баланс тренировки ${trainingId} для списания`,
      );
    }
    balance.count = balance.count - 1;
    await this.balanceRepository.update(balance.id, balance);
  }
}
