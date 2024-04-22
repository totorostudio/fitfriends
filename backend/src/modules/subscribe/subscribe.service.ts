import { ConflictException, Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';
import { SubscribeEntity } from './subscribe.entity';
import { TokenPayload, UserRole } from 'src/libs/types';
import { TrainingEntity } from '../training/training.entity';
import { SubscribeRepository } from './subscribe.repository';
import { RabbitService } from '../rabbit/rabbit.service';
import { TestUserDto } from './dto';

@Injectable()
export class SubscribeService {
  constructor(
    private readonly mailService: MailService,
    private readonly rabbitService: RabbitService,
    private readonly subscribeRepository: SubscribeRepository,
    private readonly userService: UserService,
  ) {}

  private async createSubscriber(userId: string): Promise<SubscribeEntity> {
    const user = await this.userService.getUserEntity(userId);

    if (user.userRole !== UserRole.Customer) {
      throw new ConflictException();
    }

    const newSubscriber = await this.subscribeRepository.save(
      new SubscribeEntity({
        userId,
        coaches: [],
        notices: [],
      }),
    );

    return newSubscriber;
  }

  public async getSubscriber(userId: string): Promise<SubscribeEntity> {
    const existsSubscriber =
      await this.subscribeRepository.findByUserId(userId);

    if (existsSubscriber) {
      return existsSubscriber;
    }

    return this.createSubscriber(userId);
  }

  public async sendNotices(): Promise<void> {
    const subscribers = await this.subscribeRepository.findAll();

    subscribers.forEach(async (subscriber) => {
      const { userId, notices } = subscriber;
      const { name, email } = await this.userService.getUserEntity(userId);
      notices.forEach(async (notice) => {
        await this.mailService.sendNewTraining(email, name, notice);
      });
      await this.clearNotices(userId);
    });
  }

  public async addNewTraining(coachId: string, training: TrainingEntity): Promise<void> {
    const coach = await this.userService.getUserEntity(coachId);
    this.subscribeRepository.addNewTraining(coachId, training, coach.name);
  }

  public async addNewSubscription({ sub, email, name }: TokenPayload, coachId: string): Promise<void> {
    const coach = await this.userService.getUserEntity(coachId);

    if (coach.userRole !== UserRole.Coach) {
      throw new ConflictException(`Подписка возможна только на пользователей с ролью: тренер`);
    }

    const existsSubscriber = await this.getSubscriber(sub);

    if (existsSubscriber.coaches.includes(coachId)) {
      throw new ConflictException(`Подписка уже есть`);
    }

    await this.subscribeRepository.addNewSubscription(sub, coachId, coach.name);
    await this.mailService.sendNewSubscription(email, name, coach.name);
  }

  public async removeSubscription(userId: string, coachId: string): Promise<void> {
    const existsSubscriber = await this.getSubscriber(userId);

    if (!existsSubscriber.coaches.includes(coachId)) {
      throw new ConflictException(`У пользователя нет подписки на данного тренера`);
    }

    this.subscribeRepository.removeSubscription(userId, coachId);
  }

  public async clearNotices(userId: string): Promise<void> {
    const subscriber = await this.getSubscriber(userId);

    subscriber.notices = [];
    this.subscribeRepository.update(subscriber.id, subscriber);
  }

  public async sendTest(emailData: TestUserDto): Promise<void> {
    await this.rabbitService.queueTestEmail(emailData);
  }
}
