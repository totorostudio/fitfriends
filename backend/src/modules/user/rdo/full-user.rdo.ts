import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { UserRdo } from ".";
import { TrainingTime } from "src/libs/types";

export class FullUserRdo extends UserRdo {
  @ApiPropertyOptional({
    description: 'Дата регистрации пользователя',
    example: '1981-03-12',
  })
  @Expose()
  public createdAt: Date;

  @ApiPropertyOptional({
    description: 'День рождения пользователя',
    example: '1981-03-12',
  })
  @Expose()
  public birthday?: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@fitfriends.local',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'Описание пользователя',
    example: 'Описание пользователя текстом',
  })
  @Expose()
  public description: string;

  @ApiProperty({
    description: 'Фоновая картинка профиля пользователя',
    example: 'background-image.png',
  })
  @Expose()
  public background: string;

  @ApiPropertyOptional({
    description: 'Предпочитаемая длительность тренировки',
    example: '10-30 мин',
  })
  @Expose()
  public trainingTime?: TrainingTime;

  @ApiPropertyOptional({
    description: 'Калорий к сбросу всего',
    example: '3200',
  })
  @Expose()
  public calories?: number;

  @ApiPropertyOptional({
    description: 'Калорий к сбросу в день',
    example: '1000',
  })
  @Expose()
  public caloriesPerDay?: number;

  @ApiPropertyOptional({
    description: 'Сертификат тренера',
    example: 'certificate.pdf',
  })
  @Expose()
  public certificate?: string;

  @ApiPropertyOptional({
    description: 'Достижения тренера',
    example: 'Список больших и малых достижений',
  })
  @Expose()
  public awards?: string;
}
