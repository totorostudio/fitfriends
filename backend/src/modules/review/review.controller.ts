import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ValidationPipe, Query, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUIDValidationPipe } from 'src/libs/pipes';
import { ReviewRdo, ReviewsRdoExample } from './rdo';
import { BaseQuery } from 'src/libs/query';
import { RequestWithTokenPayload } from 'src/libs/requests';

@ApiTags('Отзывы')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiResponse({
    schema: {
      example: ReviewsRdoExample
    },
    status: HttpStatus.OK,
    description: 'Каталог тренировок',
  })
  @Get('/:trainingId')
  public async index(
    @Param('trainingId', UUIDValidationPipe) trainingId: string,
    @Query() query: BaseQuery
  ) {
    return this.reviewService.find(trainingId, query);
  }

  @ApiResponse({
    type: ReviewRdo,
    status: HttpStatus.CREATED,
    description: 'Новый отзыв успешно добавлен.',
  })
  @Post('/')
  public async createReview(
    @Req() { tokenPayload }: RequestWithTokenPayload,
    @Body(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })) dto: CreateReviewDto
  ) {
    return this.reviewService.create(tokenPayload.sub, dto);
  }
}
