import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class TestUserDto {
  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'Алексей',
  })
  @IsString()
  @Expose()
  public userName: string;

  @ApiPropertyOptional({
    description: 'Имя тренера',
    example: 'Борис',
  })
  @IsString()
  @Expose()
  public coachName: string;

  @IsString()
  @Expose()
  public title: string;

  @IsString()
  @Expose()
  public type: string;

  @IsString()
  @Expose()
  public description: string;

  @IsString()
  @Expose()
  public calories: string;
}
