import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsEnum, IsString, Length } from "class-validator";
import { DtoValidationMessage } from "src/libs/messages";
import { BaseAuthDto } from "./base-auth.dto";
import { UserAwardsLength } from "src/app.const";
import { UserRole } from "src/libs/types";

export class CreateCoachDto extends BaseAuthDto {
  @ApiProperty({
    description: 'Роль пользователя',
    example: 'тренер',
  })
  @IsEnum(UserRole, { message: DtoValidationMessage.role.invalidFormat })
  @Expose()
  public role: UserRole;

  @ApiProperty({
    description: 'Сертификаты тренера',
    example: 'certificate.pdf',
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
