import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/libs/models/prisma/prisma-client.service';
import { BasePostgresRepository } from 'src/libs/models/repository/base-postgres.repository';
import { Subscriber } from 'src/libs/types';
import { DefaultPojoType } from 'src/libs/models/repository/entity.interface';
import { SubscribeEntity } from './subscribe.entity';
import { TrainingEntity } from '../training/training.entity';

@Injectable()
export class SubscribeRepository extends BasePostgresRepository<SubscribeEntity> {
  constructor(prismaService: PrismaClientService) {
    super(prismaService, (document: DefaultPojoType) => {
      const subscriber = document as unknown as Subscriber;
      return SubscribeEntity.fromObject(subscriber);
    });
  }

  protected getModelName(): string {
    return ('subscribe');
  }

  public async findAll(): Promise<SubscribeEntity[]> {
    const subscribers = await this.client.subscribe.findMany();
    return subscribers.map(subscriber => this.createEntityFromDocument(subscriber));
  }

  public async findByUserId(userId: string): Promise<SubscribeEntity | null> {
    const subscriber = await this.client.subscribe.findUnique({
      where: { userId }
    });

    return subscriber ? this.createEntityFromDocument(subscriber) : null;
  }

  public async addNewTraining(coachId: string, training: TrainingEntity, coachName: string): Promise<void> {
    const { title, description, calories, trainingType } = training;
    await this.client.subscribe.updateMany({
      where: {
        coaches: { some: { id: coachId } }
      },
      data: {
        notices: {
          create: {
            title,
            description,
            calories,
            trainingType,
            coachName,
          }
        }
      }
    });
  }

  public async addNewSubscription(userId: string, coachId: string): Promise<void> {
    const subscriber = await this.client.subscribe.findUnique({
      where: { userId },
      select: { coaches: true }
    });

    if (!subscriber) return;

    const updatedCoaches = Array.from(new Set([...subscriber.coaches, coachId]));

    await this.client.subscribe.update({
      where: { userId },
      data: {
        coaches: updatedCoaches
      }
    });
  }

  public async removeSubscription(userId: string, coachId: string): Promise<void> {
    const subscriber = await this.client.subscribe.findUnique({
      where: { userId },
      select: { coaches: true }
    });

    if (!subscriber) return;

    const updatedCoaches = subscriber.coaches.filter(id => id !== coachId);

    await this.client.subscribe.update({
      where: { userId },
      data: {
        coaches: updatedCoaches
      }
    });
  }
}


