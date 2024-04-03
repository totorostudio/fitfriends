import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { UserRdo } from ".";

export class FullUserRdo extends UserRdo {
  @ApiPropertyOptional({
    description: 'День рождения пользователя',
    example: '01-01-1990',
  })
  @Expose()
  public birthday?: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@user.ru',
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
    description: 'Сертификаты тренера',
    example: 'certificate.jpg',
  })
  @Expose()
  public certificate?: string;
}
