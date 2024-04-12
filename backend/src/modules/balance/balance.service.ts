import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { BalanceRdo, BalancesRdo } from './rdo';
import { fillDto } from 'src/libs/helpers';
import { BalanceRepository } from './balance.repository';
import { BalanceEntity } from './balance.entity';
import { TrainingService } from '../training/training.service';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    private readonly balanceRepository: BalanceRepository,
    private readonly trainingService: TrainingService,
  ) {}

  private async createBalance(userId: string, trainingId: string): Promise<BalanceEntity> {
    await this.trainingService.getTrainingEntity(trainingId);

    const balanceEntity = BalanceEntity.fromObject({
      userId,
      trainingId,
      count: 0,
    });

    return this.balanceRepository.save(balanceEntity);
  }

  private async findBalance(userId: string, trainingId: string ): Promise<BalanceEntity> {
    const balance = await this.balanceRepository.findBalance(userId, trainingId);

    if (balance) {
      return balance;
    }

    return this.createBalance(userId, trainingId);
  }

  public async find(currentUserId: string): Promise<BalancesRdo> {
    const balanceEntities = await this.balanceRepository.find(currentUserId);

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

  public async topUpBalance(userId: string, trainingId: string, newCount: number) {
    const balance = await this.findBalance(userId, trainingId);

    balance.count = balance.count + newCount;
    await this.balanceRepository.update(balance.id, balance);
  }
}
