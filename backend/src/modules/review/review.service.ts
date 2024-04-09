import { Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewRepository } from './review.repository';
import { ReviewEntity } from './review.entity';
import { ReviewRdo, ReviewsRdo } from './rdo';
import { fillDto } from 'src/libs/helpers';
import { BaseQuery } from 'src/libs/query';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);

  constructor(
    private readonly reviewRepository: ReviewRepository
  ) {}

  public async create(userId: string, createReviewDto: CreateReviewDto): Promise<ReviewRdo> {
    const {
      trainingId,
      grade,
      text
    } = createReviewDto;

    const newReview = {
      userId,
      trainingId,
      grade,
      text
    };

    const reviewEntity = new ReviewEntity(newReview);

    const review = await this.reviewRepository.save(reviewEntity);
    return fillDto(ReviewRdo, review.toPOJO());
  }

  public async find(trainingId: string, query?: BaseQuery): Promise<ReviewsRdo> {
    const reviewEntities = await this.reviewRepository.find(trainingId, query);
    return fillDto(ReviewsRdo, {
      ...reviewEntities,
      users: reviewEntities.entities.map((entity) =>
        fillDto(ReviewRdo, entity.toPOJO()),
      ),
    });
  }
}
