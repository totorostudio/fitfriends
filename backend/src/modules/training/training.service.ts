import { Logger, Injectable } from '@nestjs/common';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingRepository } from './training.repository';
import { TrainingQuery } from './training.query';
import { fillDto } from 'src/libs/helpers';
import { TrainingRdo, TrainingsRdo } from './rdo';

@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);

  constructor(
    private readonly trainingRepository: TrainingRepository
  ) {}

  public async findAll(query?: TrainingQuery): Promise<TrainingsRdo> {
    const userEntities = await this.trainingRepository.find(query);
    return fillDto(TrainingsRdo, {
      ...userEntities,
      users: userEntities.entities.map((entity) =>
        fillDto(TrainingRdo, entity.toPOJO()),
      ),
    });
  }

  create(createTrainingDto: CreateTrainingDto) {
    return 'This action adds a new training';
  }

  findOne(id: number) {
    return `This action returns a #${id} training`;
  }

  update(id: number, updateTrainingDto: UpdateTrainingDto) {
    return `This action updates a #${id} training`;
  }

  remove(id: number) {
    return `This action removes a #${id} training`;
  }
}
