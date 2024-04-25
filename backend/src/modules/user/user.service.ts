import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { fillDto } from 'src/libs/helpers';
import { UserEntity } from './user.entity';
import { FullUserRdo, UsersRdo } from './rdo';
import { UpdateUserDtoType } from './dto';
import { UsersQuery } from './user.query';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  public async getUserEntity(userId: string): Promise<UserEntity> {
    const existsUser = await this.userRepository.findById(userId);

    if (!existsUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return existsUser;
  }

  public async getAllUsers(query?: UsersQuery): Promise<UsersRdo> {
    const userEntities = await this.userRepository.find(query);
    return fillDto(UsersRdo, {
      ...userEntities,
      users: userEntities.entities.map((entity) =>
        fillDto(FullUserRdo, entity.toPOJO()),
      ),
    });
  }

  public async getUserById(id: string) {
    const existUser = await this.userRepository.findById(id);

    if (! existUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return existUser;
  }

  public async getUserByEmail(email: string): Promise<FullUserRdo> {
    const existUser = await this.userRepository.findByEmail(email);
    console.log(existUser);

    if (! existUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return fillDto(FullUserRdo, existUser.toPOJO());
  }

  public async updateUser(userId: string, dto: UpdateUserDtoType): Promise<FullUserRdo> {
    const existsUser = await this.getUserEntity(userId);
    let hasChanges = false;

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && existsUser[key] !== value) {
        existsUser[key] = value;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return fillDto(FullUserRdo, existsUser.toPOJO());
    }

    const updatedUser = await this.userRepository.update(userId, existsUser);
    return fillDto(FullUserRdo, updatedUser.toPOJO());
  }

  public async updateSubscribers(userId: string, newSubscribers: string[]): Promise<void> {
    const existsUser = await this.getUserEntity(userId);
    existsUser.subscribers = newSubscribers;

    await this.userRepository.update(userId, existsUser);
  }
}
