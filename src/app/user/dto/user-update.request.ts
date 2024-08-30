import { UserStatus } from 'src/app/user/enum/user.status';

export class UserUpdateRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  status?: UserStatus;
}
