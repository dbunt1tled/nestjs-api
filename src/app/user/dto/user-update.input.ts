import { UserStatus } from 'src/app/user/enum/user.status';

export class UserUpdateInput {
  id: string;
  name?: string;
  email?: string;
  session?: string;
  status?: UserStatus;
}
