import { IsIn, IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import lodash from 'lodash';
import { TrainingTime } from 'src/libs//types';
import { BaseQuery } from 'src/libs/query';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TrainingQuery extends BaseQuery {
  @ApiPropertyOptional({ description: 'Цена от', type: Number  })
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Целое положительное число' })
  public priceFrom?: number;

  @ApiPropertyOptional({ description: 'Цена до', type: Number  })
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Целое положительное число' })
  public priceTo?: number;

  @ApiPropertyOptional({ description: 'Калорий от', type: Number  })
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Целое положительное число' })
  public caloriesFrom?: number;

  @ApiPropertyOptional({ description: 'Калорий до', type: Number  })
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Целое положительное число' })
  public caloriesTo?: number;

  @ApiPropertyOptional({ description: 'Рейтинг (целое число от 0 до 5)', type: Number  })
  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Целое число от 0 до 5' })
  @Max(5, { message: 'Целое число от 0 до 5' })
  public rating?: number;

  @ApiPropertyOptional({ description: 'Длительность тренировок', enum: TrainingTime, isArray: true })
  @Transform(({ value }) => {
    const durations = typeof value === 'string' ? [value] : value;
    return durations.map((item: string) => lodash.lowerCase(item));
  })
  @IsIn(Object.values(TrainingTime), { each: true })
  @IsOptional()
  public trainingTime?: TrainingTime[];

  @ApiPropertyOptional({ description: 'Id тренера', type: String  })
  @IsUUID()
  @IsOptional()
  public coachId?: string;
}
