import { Expose } from 'class-transformer';
import { UserRdo } from './user.rdo';
import { BasePaginationRdo } from 'src/libs/rdo';

export class UsersRdo extends BasePaginationRdo {
  @Expose()
  public users: UserRdo[];
}
