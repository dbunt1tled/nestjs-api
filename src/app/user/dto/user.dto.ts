import { UserStatus } from 'src/app/user/enum/user.status';

export class UserDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  hash?: string;
  status: UserStatus;
  session?: string;
  confirmedAt?: Date;
}
