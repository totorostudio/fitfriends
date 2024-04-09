import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from 'src/libs/models/prisma/prisma-client.service';
import { BasePostgresRepository } from 'src/libs/models/repository/base-postgres.repository';
import { Training } from 'src/libs/types';
import { DefaultPojoType } from 'src/libs/models/repository/entity.interface';
import { DEFAULT_PAGE, DEFAULT_SORT_DIRECTION, LIST_LIMIT } from 'src/app.const';
import { Pagination } from 'src/libs/types';
import { calculatePages } from 'src/libs/helpers';
import { TrainingEntity } from './training.entity';
import { TrainingQuery } from './training.query';
import { UpdateFriendsRdo } from '../friends/rdo/update-friends.rdo';

@Injectable()
export class TrainingRepository extends BasePostgresRepository<TrainingEntity> {
  constructor(prismaService: PrismaClientService) {
    super(prismaService, (document: DefaultPojoType) => {
      const training = document as unknown as Training;
      return TrainingEntity.fromObject(training);
    });
  }

  public async find(query?: TrainingQuery): Promise<Pagination<TrainingEntity>> {
    const sortDirection = query?.sort ?? DEFAULT_SORT_DIRECTION;
    const limit = Number(query?.limit) || LIST_LIMIT;
    const page = query?.page ? (query.page - 1) * limit : 0;

    const whereClause: Prisma.TrainingWhereInput = {};

    const priceConditions: Prisma.TrainingWhereInput[] = [];
    if (query?.priceFrom !== undefined) {
      priceConditions.push({ price: { gte: query.priceFrom } });
    }
    if (query?.priceTo !== undefined) {
      priceConditions.push({ price: { lte: query.priceTo } });
    }

    const caloriesConditions: Prisma.TrainingWhereInput[] = [];
    if (query?.caloriesFrom !== undefined) {
      caloriesConditions.push({ calories: { gte: query.caloriesFrom } });
    }
    if (query?.caloriesTo !== undefined) {
      caloriesConditions.push({ calories: { lte: query.caloriesTo } });
    }

    if (priceConditions.length > 0 || caloriesConditions.length > 0) {
      whereClause.AND = [...priceConditions, ...caloriesConditions];
    }

    if (query?.rating !== undefined) {
      whereClause.rating = query.rating;
    }
    if (query?.trainingTime && query.trainingTime.length > 0) {
      whereClause.trainingTime = { in: query.trainingTime };
    }

    const prismaQuery: Prisma.TrainingFindManyArgs = {
      where: whereClause,
      orderBy: { price: sortDirection },
      take: limit,
      skip: page,
    };

    const recordsCount = await this.client.training.count({ where: whereClause });
    const documents = await this.client.training.findMany(prismaQuery);
    const entities: TrainingEntity[] = documents.map(document => this.createEntityFromDocument(document));
    return {
      entities,
      currentPage: query?.page ?? DEFAULT_PAGE,
      totalPages: calculatePages(recordsCount, limit),
      itemsPerPage: limit,
      totalItems: recordsCount,
    };
  }

  public async add(currentUserId: string, friendId: string): Promise<UpdateFriendsRdo> {

    const currentUser = await this.client.user.findUnique({
      where: { id: currentUserId },
      select: { friends: true },
    });

    const friendUser = await this.client.user.findUnique({
      where: { id: friendId },
      select: { friends: true },
    });

    if (!currentUser || !friendUser) {
      throw new Error('Один из пользователей не найден');
    }

    const updatedCurrentUserFriendsList = currentUser.friends.includes(friendId) ? currentUser.friends : [...currentUser.friends, friendId];
    const updatedFriendUserFriendsList = friendUser.friends.includes(currentUserId) ? friendUser.friends : [...friendUser.friends, currentUserId];

    await this.client.user.update({
      where: { id: currentUserId },
      data: { friends: updatedCurrentUserFriendsList },
    });

    await this.client.user.update({
      where: { id: friendId },
      data: { friends: updatedFriendUserFriendsList },
    });

    return {
      message: `Друг c id ${friendId} успешно добавлен`,
    };
  }

  public async remove(currentUserId: string, friendId: string): Promise<UpdateFriendsRdo> {
    const currentUser = await this.client.user.findUnique({
      where: { id: currentUserId },
      select: { friends: true },
    });

    if (!currentUser) throw new Error('Пользователь не найден');

    const updatedCurrentUserFriendsList = currentUser.friends.filter(f => f !== friendId);

    await this.client.user.update({
      where: { id: currentUserId },
      data: { friends: updatedCurrentUserFriendsList },
    });

    const friendUser = await this.client.user.findUnique({
      where: { id: friendId },
      select: { friends: true },
    });

    if (!friendUser) throw new Error('User не найден в друзьях, не смогли удалить из друзей');

    const updatedFriendUserFriendsList = friendUser.friends.filter(f => f !== currentUserId);

    await this.client.user.update({
      where: { id: friendId },
      data: { friends: updatedFriendUserFriendsList },
    });

    return {
      message: `Пользователь c id ${friendId} успешно удален из друзей`,
    }
  }
}


