import { Expose } from 'class-transformer';
import { UserRdo } from './user.rdo';

export class UsersRdo {
  @Expose()
  public users: UserRdo[];
}
