import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { BaseQuery } from '../../libs/query/base-query';
import { fillDto } from 'src/libs/helpers';
import { UserEntity } from './user.entity';
import { UserRdo, UsersRdo } from './rdo';
import { UpdateUserDto, UpdateUserDtoType } from './dto';

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

  public async getAllUsers(query?: BaseQuery): Promise<UsersRdo> {
    const userEntities = await this.userRepository.find(query);
    return fillDto(UsersRdo, {
      ...userEntities,
      users: userEntities.map((entity) =>
        fillDto(UserRdo, entity.toPOJO()),
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

  public async getUserByEmail(email: string) {
    const existUser = await this.userRepository.findByEmail(email);

    if (! existUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return existUser;
  }

  public async updateUser(userId: string, dto: UpdateUserDtoType) {
    const existsUser = await this.getUserEntity(userId);
    let hasChanges = false;

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && existsUser[key] !== value) {
        existsUser[key] = value;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return fillDto(UserRdo, existsUser.toPOJO());
    }

    const updatedUser = await this.userRepository.update(userId, existsUser);
    return fillDto(UserRdo, updatedUser.toPOJO());
  }
}
