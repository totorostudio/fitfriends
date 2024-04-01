import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length } from "class-validator";
import { Expose } from "class-transformer";
import { BaseUserDto } from ".";
import { UserAwardsLength } from "src/app.const";
import { DtoValidationMessage } from "src/libs/messages";

export class UpdateCoachDto extends BaseUserDto {
  @ApiPropertyOptional({
    description: 'Coach certificate',
    example: 'certificate.jpg',
  })
  @IsOptional()
  @IsString()
  @Expose()
  public sertificate?: string;

  @ApiPropertyOptional({
    description: 'User`s achievements',
    example: 'Мой список достижений',
  })
  @IsOptional()
  @IsString()
  @Length(UserAwardsLength.Min, UserAwardsLength.Max, {
    message: DtoValidationMessage.awards.length,
  })
  @Expose()
  public avards?: string;
}
