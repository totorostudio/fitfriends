import { Entity } from 'src/libs/models';
import { Notice, Subscriber } from 'src/libs/types';

export class SubscribeEntity implements Subscriber, Entity<string> {
  public id?: string;
  public createdAt?: Date;
  public userId: string;
  public coaches: string[];
  public notices: Notice[];

  constructor(subscriber: Subscriber) {
    this.populate(subscriber);
  }

  public toPOJO() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      userId: this.userId,
      coaches: this.coaches,
      notices: this.notices,
    };
  }

  public populate(data: Subscriber): void {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.userId = data.userId;
    this.coaches = data.coaches;
    this.notices = data.notices;
  }

  static fromObject(data: Subscriber): SubscribeEntity {
    return new SubscribeEntity(data);
  }
}
