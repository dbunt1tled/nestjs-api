import { Min } from 'class-validator';
import { SortOrder } from 'src/core/repository/sort.order';
import { UserStatus } from 'src/app/user/enum/user.status';
import { UserFilter } from 'src/app/user/dto/user.filter';

export class UserListRequest {
  name?: string;
  email?: string;
  statuses?: UserStatus[];
  @Min(0)
  page: number = 0;
  @Min(1)
  limit: number = 25;
  orderBy?: SortOrder;

  toFilter() {
    return new UserFilter({
      filter: {
        nameFilter: this.name,
        emailFilter: this.email,
        status: this.statuses,
      },
      sort: this.orderBy,
      pagination: {
        limit: this.limit,
        page: this.page,
      },
    });
  }
}
