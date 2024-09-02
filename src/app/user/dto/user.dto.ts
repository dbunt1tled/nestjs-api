import { UserStatus } from 'src/app/user/enum/user.status';
import { Roles } from 'src/app/role/enum/roles';

export class UserDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  hash?: string;
  status?: UserStatus;
  session?: string;
  confirmAt?: Date;
  roles?: Roles[];
}
