import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UUIDValidationPipe } from 'src/libs/pipes';
import { CURRENT_USER } from 'src/app.const';
import { ReviewRdo } from './rdo';

@ApiTags('Отзывы')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiResponse({
    type: ReviewRdo,
    status: HttpStatus.CREATED,
    description: 'Новый отзыв успешно добавлен.',
  })
  @Post('/')
  public async createReview(
    @Body(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })) dto: CreateReviewDto
  ) {
    return this.reviewService.create(CURRENT_USER, dto);
  }
}
