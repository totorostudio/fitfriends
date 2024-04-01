import { IsEnum, IsNumber, IsOptional, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortDirection } from 'src/libs/types/sort.enum';
import { LIST_LIMIT } from 'src/app.const';

export class BaseQuery {
  @Transform(({ value }) => +value)
  @IsNumber()
  @Max(LIST_LIMIT)
  @IsOptional()
  public limit?: number;

  @Transform(({ value }) => +value)
  @IsEnum(SortDirection)
  @IsOptional()
  public sort?: SortDirection;

  @Transform(({ value }) => +value)
  @IsNumber()
  @IsOptional()
  public page?: number;
}
