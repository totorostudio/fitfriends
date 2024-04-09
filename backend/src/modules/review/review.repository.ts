import { Injectable } from '@nestjs/common';
import { PrismaClientService } from 'src/libs/models/prisma/prisma-client.service';
import { BasePostgresRepository } from 'src/libs/models/repository/base-postgres.repository';
import { Review } from 'src/libs/types';
import { DefaultPojoType } from 'src/libs/models/repository/entity.interface';
import { ReviewEntity } from './review.entity';

@Injectable()
export class ReviewRepository extends BasePostgresRepository<ReviewEntity> {
  constructor(prismaService: PrismaClientService) {
    super(prismaService, (document: DefaultPojoType) => {
      const review = document as unknown as Review;
      return ReviewEntity.fromObject(review);
    });
  }

  public async save(reviewInput: ReviewEntity): Promise<ReviewEntity> {
    try {
      const createdDocument = await this.client.review.create({
        data: reviewInput,
      });

      return this.createEntityFromDocument(createdDocument);
    } catch (error) {
      throw error;
    }
  }
}


