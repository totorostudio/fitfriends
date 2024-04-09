import { compare, genSalt, hash } from 'bcrypt';
import { FullUser, UserRole, Gender, Metro, Level, TrainingType, TrainingTime } from '../../libs/types';
import { Entity } from 'src/libs/models';
import { SALT_ROUNDS } from 'src/app.const';

export class UserEntity implements FullUser, Entity<string> {
  public id?: string;
  public createdAt: Date;
  public email: string;
  public passwordHash: string;
  public name: string;
  public avatar?: string;
  public gender: Gender;
  public birthday?: Date;
  public userRole: UserRole;
  public description?: string;
  public metro: Metro;
  public background: string;
  public level: Level;
  public trainingType: TrainingType[];
  public trainingTime?: TrainingTime;
  public calories?: number;
  public caloriesPerDay?: number;
  public sertificate?: string;
  public awards?: string;
  public friends: string[];
  public isReady: boolean;

  constructor(user: FullUser) {
    this.populate(user)
  }

  public toPOJO() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      gender: this.gender,
      birthday: this.birthday,
      role: this.userRole,
      description: this.description,
      metro: this.metro,
      background: this.background,
      passwordHash: this.passwordHash,
      level: this.level,
      trainingType: this.trainingType,
      trainingTime: this.trainingTime,
      calories: this.calories,
      caloriesPerDay: this.caloriesPerDay,
      sertificate: this.sertificate,
      awards: this.awards,
      friends: this.friends,
      isReady: this.isReady,
    };
  }

  public populate(data: FullUser): void {
    this.createdAt = data.createdAt;
    this.email = data.email;
    this.name = data.name;
    this.avatar = data.avatar;
    this.gender = data.gender;
    this.birthday = data.birthday;
    this.userRole = data.userRole;
    this.description = data.description;
    this.metro = data.metro;
    this.background = data.background;
    this.passwordHash = data.passwordHash;
    this.level = data.level;
    this.trainingType = data.trainingType;
    this.trainingTime = data.trainingTime;
    this.calories = data.calories;
    this.caloriesPerDay = data.caloriesPerDay;
    this.sertificate = data.sertificate;
    this.awards = data.awards;
    this.friends = data.friends;
    this.isReady = data.isReady;
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  static fromObject(data: FullUser): UserEntity {
    return new UserEntity(data);
  }
}
