import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';
import { BaseQuery } from 'src/libs/query/base-query';
import { fillDto } from 'src/libs/helpers';
import { UserEntity } from 'src/modules/user/user.entity';
import { UserRdo, UsersRdo } from 'src/modules/user/rdo';
import { UpdateUserDto, UpdateUserDtoType } from 'src/modules/user/dto';
import { UsersQuery } from 'src/modules/user/user.query';
import { UpdateFriendsDto } from './dto/update-friends.dto';

@Injectable()
export class FriendsService {
  private readonly logger = new Logger(FriendsService.name);

  constructor(
    private readonly friendsRepository: FriendsRepository
  ) {}

  public async getUserEntity(userId: string): Promise<UserEntity> {
    const existsUser = await this.friendsRepository.findById(userId);

    if (!existsUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return existsUser;
  }

  public async getFriends(currentUserId: string, query?: UsersQuery): Promise<UsersRdo> {
    const userEntities = await this.friendsRepository.find(currentUserId, query);
    return fillDto(UsersRdo, {
      ...userEntities,
      users: userEntities.entities.map((entity) =>
        fillDto(UserRdo, entity.toPOJO()),
      ),
    });
  }

  public async addFriend(currentUserId: string, { friendId }: UpdateFriendsDto) {
    const response = await this.friendsRepository.add(currentUserId, friendId);
    return response;
  }

  public async removeFriend(currentUserId: string, { friendId }: UpdateFriendsDto) {
    const response = await this.friendsRepository.remove(currentUserId, friendId);
    return response;
  }
}
