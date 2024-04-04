import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UpdateFriendsRdo {
  @ApiPropertyOptional({
    description: 'День рождения пользователя',
    example: '01-01-1990',
  })
  @Expose()
  public message?: string;
}
