import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from 'src/libs/models/prisma/prisma-client.service';
import { BasePostgresRepository } from 'src/libs/models/repository/base-postgres.repository';
import { FullUser } from 'src/libs/types';
import { UserEntity } from './user.entity';
import { DefaultPojoType } from 'src/libs/models/repository/entity.interface';
import { BaseQuery } from 'src/libs/query/base-query';
import { DEFAULT_PAGE, DEFAULT_SORT_DIRECTION, LIST_LIMIT } from 'src/app.const';
import { Pagination } from 'src/libs/types';
import { calculatePages } from 'src/libs/helpers';
import { UsersQuery } from './user.query';

@Injectable()
export class UserRepository extends BasePostgresRepository<UserEntity> {
  constructor(prismaService: PrismaClientService) {
    super(prismaService, (document: DefaultPojoType) => {
      const user = document as unknown as FullUser;
      return UserEntity.fromObject(user);
    });
  }

  public async find(query?: UsersQuery): Promise<Pagination<UserEntity>> {
    const sortDirection = query?.sort ?? DEFAULT_SORT_DIRECTION;
    const limit = Number(query?.limit) || LIST_LIMIT;
    const page = query?.page ? (query.page - 1) * limit : 0;
    const recordsCount = await this.client.user.count();

    const prismaQuery: Prisma.UserFindManyArgs = {
      orderBy: { id: sortDirection },
      take: limit,
      skip: page,
    };

    const documents = await this.client.user.findMany(prismaQuery);
    const entities: UserEntity[] = documents.map(document => this.createEntityFromDocument(document));
    return {
      entities,
      currentPage: query?.page ?? DEFAULT_PAGE,
      totalPages: calculatePages(recordsCount, limit),
      itemsPerPage: limit,
      totalItems: recordsCount,
    };
  }

  public async findByEmail(email: string): Promise<FullUser | null> {
    return this.findOne('users', { email });
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const document = await this.client.user.findUnique({
      where: { id },
    });
    return this.createEntityFromDocument(document);
  }

  public async update(id: string, userUpdateInput: Prisma.UserUpdateInput): Promise<UserEntity | null> {
    try {
      const updatedDocument = await this.client.user.update({
        where: {id},
        data: userUpdateInput,
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
}


