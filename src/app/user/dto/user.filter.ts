import { Filter } from 'src/core/repository/filter/filter';
import { FilterCondition } from 'src/core/repository/filter/filter.condition';
import { Pagination } from 'src/core/repository/pagination';
import { SortOrder } from 'src/core/repository/sort.order';
import { UserStatus } from 'src/app/user/enum/user.status';

export class UserFilter extends Filter {
  constructor(
    public readonly options?: {
      filter: {
        id?: string | string[];
        email?: string | string[];
        phone?: string | string[];
        session?: string | string[];
        status?: UserStatus | UserStatus[];
        nameFilter?: string;
        emailFilter?: string | string[];
        phoneFilter?: string | string[];
        userIdExclude?: string | string[];
      };
      sort?: SortOrder;
      pagination?: Pagination;
    },
  ) {
    super(options);
  }
  build(limit?: number): FilterCondition {
    if (!this.options) {
      return super.build(limit);
    }
    return super.build(limit, {
      ...this.andWhere('id', this.options.filter.id),
      ...this.andWhere('email', this.options.filter.email),
      ...this.andWhere('phone', this.options.filter.phone),
      ...this.andWhere('status', this.options.filter.status),
      ...this.andWhereLike('email', this.options.filter.emailFilter),
      ...this.andWhereLike('phone', this.options.filter.phoneFilter),
      ...this.andWhere('session', this.options.filter.session),
      ...this.andWhereMultiFieldLike(['firstName', 'lastName'], this.options.filter.nameFilter),
      ...this.andWhereNot('id', this.options.filter.userIdExclude),
    });
  }
}
