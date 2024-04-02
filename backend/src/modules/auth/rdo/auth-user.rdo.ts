import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { FullUserRdo } from 'src/modules/user/rdo';
import { TrainingTime } from 'src/libs/types';

export class AuthUserRdo extends FullUserRdo {
  @ApiPropertyOptional({
    description: 'Calories to lose',
    example: '3200',
  })
  @Expose()
  public calories?: number;

  @ApiPropertyOptional({
    description: 'Calories to lose per day',
    example: '1000',
  })
  @Expose()
  public caloriesPerDay?: number;

  @ApiPropertyOptional({
    description: 'User`s preferable workout duration',
    example: '10-30 мин',
  })
  @Expose()
  public trainingTime?: TrainingTime;

  @ApiPropertyOptional({
    description: 'User`s achievements',
    example: 'Мой список достижений',
  })
  @Expose()
  public awards?: string;
}
