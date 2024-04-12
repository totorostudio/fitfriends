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
import { TrainingRdo } from './rdo';

@Injectable()
export class TrainingRepository extends BasePostgresRepository<TrainingEntity> {
  constructor(prismaService: PrismaClientService) {
    super(prismaService, (document: DefaultPojoType) => {
      const training = document as unknown as Training;
      return TrainingEntity.fromObject(training);
    });
  }

  protected getTableName(): string {
    return 'training';
  }

  public async find(query?: TrainingQuery): Promise<Pagination<TrainingEntity>> {
    const sortDirection = query?.sort ?? DEFAULT_SORT_DIRECTION;
    const limit = Number(query?.limit) || LIST_LIMIT;
    const page = query?.page ? (query.page - 1) * limit : 0;

    const whereClause: Prisma.TrainingWhereInput = {};

    const priceConditions: Prisma.TrainingWhereInput[] = [];

    if (query?.priceFrom !== undefined) {
      priceConditions.push({ price: { gte: +query.priceFrom } });
    }

    if (query?.priceTo !== undefined) {
      priceConditions.push({ price: { lte: +query.priceTo } });
    }

    const caloriesConditions: Prisma.TrainingWhereInput[] = [];

    if (query?.caloriesFrom !== undefined) {
      caloriesConditions.push({ calories: { gte: +query.caloriesFrom } });
    }

    if (query?.caloriesTo !== undefined) {
      caloriesConditions.push({ calories: { lte: +query.caloriesTo } });
    }

    if (priceConditions.length > 0 || caloriesConditions.length > 0) {
      whereClause.AND = [...priceConditions, ...caloriesConditions];
    }

    if (query?.rating !== undefined) {
      whereClause.rating = +query.rating;
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

  public async findById(id: string): Promise<TrainingEntity | null> {
    const document = await this.client.training.findUnique({
      where: { id },
    });
    return this.createEntityFromDocument(document);
  }

  public async update(id: string, trainingUpdateInput: Prisma.TrainingUpdateInput): Promise<TrainingEntity | null> {
    try {
      const updatedDocument = await this.client.training.update({
        where: {id},
        data: trainingUpdateInput,
      });

      return this.createEntityFromDocument(updatedDocument);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with id ${id} not found`);
        }
      }

      throw error;
    }
  }

  public async save(trainingInput: TrainingEntity): Promise<TrainingEntity> {
    try {
      const createdDocument = await this.client.training.create({
        data: trainingInput,
      });

      return this.createEntityFromDocument(createdDocument);
    } catch (error) {
      throw error;
    }
  }
}


