import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '../../libs/models/prisma/prisma-client.service';
import { BasePostgresRepository } from '../../libs/models/repository/base-postgres.repository';
import { FullUser } from '../../libs/types';
import { UserEntity } from './user.entity';
import { DefaultPojoType } from '../../libs/models/repository/entity.interface';
import { BaseQuery } from '../../libs/query/base-query';
import { DEFAULT_SORT_DIRECTION, LIST_LIMIT } from '../../app.const';

@Injectable()
export class UserRepository extends BasePostgresRepository<UserEntity> {
  constructor(prismaService: PrismaClientService) {
    super(prismaService, (document: DefaultPojoType) => {
      const user = document as unknown as FullUser;
      return UserEntity.fromObject(user);
    });
  }

  public async find(query?: BaseQuery): Promise<UserEntity[]> {
    const sortDirection = query?.sort ?? DEFAULT_SORT_DIRECTION;
    const limit = Number(query?.limit) || LIST_LIMIT;
    const page = query?.page ? (query.page - 1) * limit : 0;

    const prismaQuery: Prisma.UserFindManyArgs = {
      orderBy: { id: sortDirection },
      take: limit,
      skip: page,
    };

    const documents = await this.client.user.findMany(prismaQuery);
    const users: UserEntity[] = documents.map(document => this.createEntityFromDocument(document));
    return users;
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
}


