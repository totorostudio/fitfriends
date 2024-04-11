import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, ValidationPipe } from '@nestjs/common';
import { TrainingService } from './training.service';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrainingRdo, TrainingsRdoExample, TrainingsRdo } from './rdo';
import { TrainingQuery } from './training.query';
import { UUIDValidationPipe } from 'src/libs/pipes';
import { CURRENT_USER_ID } from 'src/app.const';

@ApiTags('Тренировки')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @ApiResponse({
    schema: {
      example: TrainingsRdoExample
    },
    status: HttpStatus.OK,
    description: 'Каталог тренировок',
  })
  @Get()
  public async index(@Query() query: TrainingQuery): Promise<TrainingsRdo> {
    return this.trainingService.findAll(query);
  }

  @ApiResponse({
    type: TrainingRdo,
    status: HttpStatus.CREATED,
    description: 'Новая тренировка успешно создана.',
  })
  @Post('add')
  public async create(
    @Body(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })) dto: CreateTrainingDto
  ) {
    return this.trainingService.create(CURRENT_USER_ID, dto);
  }

  @ApiResponse({
    type: TrainingRdo,
    status: HttpStatus.OK,
    description: 'Пользователь найден',
  })
  @Get('/:id')
  public async show(@Param('id', UUIDValidationPipe) id: string) {
    return this.trainingService.findOne(id);
  }

  @ApiBody({ type: UpdateTrainingDto })
  @ApiResponse({
    type: TrainingRdo,
    status: HttpStatus.OK,
    description: 'Данные тренировки успешно изменены',
  })
  @Patch('/:id')
  public async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })) dto: UpdateTrainingDto
  ) {
    return this.trainingService.update(id, dto);
  }
}
