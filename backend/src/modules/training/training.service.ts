import { Logger, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingDto } from './dto/create-training.dto';
import { UpdateTrainingDto } from './dto/update-training.dto';
import { TrainingRepository } from './training.repository';
import { TrainingQuery } from './training.query';
import { fillDto } from 'src/libs/helpers';
import { TrainingRdo, TrainingsRdo } from './rdo';
import { TrainingEntity } from './training.entity';

@Injectable()
export class TrainingService {
  private readonly logger = new Logger(TrainingService.name);

  constructor(
    private readonly trainingRepository: TrainingRepository
  ) {}

  public async getTrainingEntity(id: string): Promise<TrainingEntity> {
    const existsTraining = await this.trainingRepository.findById(id);

    if (!existsTraining) {
      throw new NotFoundException(`Trainng with id ${id} not found`);
    }

    return existsTraining;
  }

  public async findAll(query?: TrainingQuery): Promise<TrainingsRdo> {
    const userEntities = await this.trainingRepository.find(query);
    return fillDto(TrainingsRdo, {
      ...userEntities,
      users: userEntities.entities.map((entity) =>
        fillDto(TrainingRdo, entity.toPOJO()),
      ),
    });
  }

  public async create(coachId: string, createTrainingDto: CreateTrainingDto): Promise<TrainingRdo> {
    const {
      title,
      background,
      level,
      trainingType,
      trainingTime,
      price,
      calories,
      description,
      gender,
      video,
      isFeatured
    } = createTrainingDto;

    const newTraining = {
      title,
      background,
      level,
      trainingType,
      trainingTime,
      price,
      calories,
      description,
      gender,
      rating: 0,
      video,
      coachId,
      isFeatured
    };

    const trainingEntity = new TrainingEntity(newTraining);

    const training = await this.trainingRepository.save(trainingEntity);
    return fillDto(TrainingRdo, training.toPOJO());
  }

  public async findOne(id: string) {
    const existTraining = await this.trainingRepository.findById(id);

    if (! existTraining) {
      throw new NotFoundException(`Training with id ${id} not found`);
    }

    return existTraining;
  }

  public async update(id: string, dto: UpdateTrainingDto) {
    const existsTraining = await this.getTrainingEntity(id);
    let hasChanges = false;

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && existsTraining[key] !== value) {
        existsTraining[key] = value;
        hasChanges = true;
      }
    }

    if (!hasChanges) {
      return fillDto(TrainingRdo, existsTraining.toPOJO());
    }

    const updatedTraining = await this.trainingRepository.update(id, existsTraining);
    return fillDto(TrainingRdo, updatedTraining.toPOJO());
  }
}
