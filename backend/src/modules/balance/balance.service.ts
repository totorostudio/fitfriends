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

    const balancesData = await Promise.all(balanceEntities.entities.map(async (entity) => {
      const training = await this.trainingService.getTrainingEntity(entity.trainingId);
      return fillDto(BalanceRdo, {
        ...entity.toPOJO(),
        training: training
      });
    }));

    const data = {
      ...balanceEntities,
      balances: balancesData,
    };

    return fillDto(BalancesRdo, data);
  }

  public async spendBalance(userId: string, trainingId: string) {
    const balance = await this.findBalance(userId, trainingId);

    if (balance.count < 1) {
      throw new ConflictException(
        `Недостаточный баланс тренировки ${trainingId} для списания`,
      );
    }
    balance.count = balance.count - 1;
    const newBalance = await this.balanceRepository.update(balance.id, balance);
    const training = await this.trainingService.getTrainingEntity(trainingId);

    return fillDto(BalanceRdo, {
      ...newBalance.toPOJO(),
      training: training
    });
  }

  public async topUpBalance(userId: string, trainingId: string, newCount: number) {
    const balance = await this.findBalance(userId, trainingId);

    balance.count = balance.count + newCount;
    await this.balanceRepository.update(balance.id, balance);
  }
}
