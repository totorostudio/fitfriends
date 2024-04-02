import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsEmail, IsEnum, IsISO8601, IsOptional, IsString, Length } from "class-validator";
import { MAX_TRAINING_TYPES, UserDescriptionLength, UserNameLength, UserPasswordLength } from "src/app.const";
import { DtoValidationMessage } from "src/libs/messages";
import { Gender, Level, Metro, TrainingType, UserRole } from "src/libs/types";

export class BaseUserDto {
  @ApiProperty({
    description: 'User avatar url',
    example: 'image.jpg',
  })
  @Expose()
  public avatar: string;

  @ApiPropertyOptional({
    description: 'User birth date',
    example: '1981-03-12',
  })
  @IsISO8601()
  @IsOptional()
  @Expose()
  public dateOfBirth?: Date;

  @ApiProperty({
    description: 'User email',
    example: 'user@user.ru',
  })
  @IsEmail({}, { message: DtoValidationMessage.email.invalidFormat })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John',
  })
  @IsString()
  @Length(UserNameLength.Min, UserNameLength.Max, {
    message: DtoValidationMessage.name.length,
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @Length(UserPasswordLength.Min, UserPasswordLength.Max, {
    message: DtoValidationMessage.password.length,
  })
  @Expose()
  public password: string;

  @ApiProperty({
    description: 'User role',
    example: 'пользователь',
  })
  @IsEnum(UserRole, { message: DtoValidationMessage.role.invalidFormat })
  @Expose()
  public role: UserRole;

  @ApiProperty({
    description: 'Пол пользователя',
    example: 'мужской',
  })
  @IsEnum(Gender, { message: DtoValidationMessage.gender.invalidFormat })
  @Expose()
  public gender: Gender;

  @ApiProperty({
    description: 'User description',
    example: 'Описание пользователя текстом',
  })
  @IsString()
  @Length(UserDescriptionLength.Min, UserDescriptionLength.Max, {
    message: DtoValidationMessage.userDescription.length,
  })
  @Expose()
  public description: string;

  @ApiProperty({
    description: 'User location - metro station',
    example: 'Пионерская',
  })
  @IsEnum(Metro, {
    message: DtoValidationMessage.metro.invalidFormat,
  })
  @Expose()
  public metro: Metro;

  @ApiPropertyOptional({
    description: 'User image for background',
    example: 'background-image.png',
  })
  @IsString()
  @IsOptional()
  @Expose()
  public background?: string;

  @ApiProperty({
    description: 'User level',
    example: 'новичок',
  })
  @IsEnum(Level, { message: DtoValidationMessage.level.invalidFormat })
  @Expose()
  public level: Level;

  @ApiProperty({
    description: 'User`s workouts types',
    example: 'йога, бег',
  })
  @IsArray()
  @ArrayMaxSize(MAX_TRAINING_TYPES, {
    message: DtoValidationMessage.trainingType.length,
  })
  @IsEnum(TrainingType, {
    each: true,
    message: DtoValidationMessage.trainingType.invalidItems,
  })
  @Expose()
  public trainingTypes: TrainingType[];

  @ApiProperty({
    description: 'Is user ready for workout?',
    example: 'true',
  })
  @IsBoolean()
  @Expose()
  public isReady: boolean;
}
