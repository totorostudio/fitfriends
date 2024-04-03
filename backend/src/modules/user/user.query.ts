import { ArrayMaxSize, IsEnum, IsIn, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import * as lodash from 'lodash';
import { Metro, Level, UserRole, TrainingType } from 'src/libs//types';
import { BaseQuery } from 'src/libs/query';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UsersQuery extends BaseQuery {
  @ApiPropertyOptional({ description: 'Типы тренировок', enum: TrainingType, isArray: true })
  @Transform(({ value }) => {
    const locations = typeof value === 'string' ? [value] : value;
    return locations.map((item: string) => lodash.lowerCase(item));
  })
  @IsIn(Object.values(TrainingType), { each: true })
  @IsOptional()
  public trainingType?: TrainingType[];

  @ApiPropertyOptional({ description: 'Станция метро', enum: Metro, enumName: 'Metro' })
  @Transform(({ value }) => {
    const locations = typeof value === 'string' ? [value] : value;
    return locations.map((item: string) => lodash.capitalize(item));
  })
  @IsIn(Object.values(Metro), { each: true })
  @IsOptional()
  public metro?: Metro;

  @ApiPropertyOptional({ description: 'Уровень подготовки', enum: Level, enumName: 'Level' })
  @Transform(({ value }) => lodash.lowerCase(value))
  @IsEnum(Level)
  @IsOptional()
  public level?: Level;

  @ApiPropertyOptional({ description: 'Роль пользователя', enum: UserRole, enumName: 'UserRole' })
  @Transform(({ value }) => lodash.lowerCase(value))
  @IsEnum(UserRole)
  @IsOptional()
  public role?: UserRole;
}
