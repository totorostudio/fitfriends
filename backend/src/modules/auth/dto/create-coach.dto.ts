import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString, Length } from "class-validator";
import { DtoValidationMessage } from "src/libs/messages";
import { BaseUserDto } from "./base-user.dto";
import { UserAwardsLength } from "src/app.const";

export class CreateCoachDto extends BaseUserDto {
  @ApiProperty({
    description: 'Сертификаты тренера',
    example: 'certificate.jpg',
  })
  @IsString()
  @Expose()
  public certificate: string;

  @ApiProperty({
    description: 'Список достижений тренера',
    example: 'Список достижений тренера',
  })
  @IsString()
  @Length(UserAwardsLength.Min, UserAwardsLength.Max, {
    message: DtoValidationMessage.awards.length,
  })
  @Expose()
  public awards: string;
}
