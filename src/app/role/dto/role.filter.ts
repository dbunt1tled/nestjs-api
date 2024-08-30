import { Filter } from 'src/core/repository/filter/filter';
import { FilterCondition } from 'src/core/repository/filter/filter.condition';
import { Pagination } from 'src/core/repository/pagination';
import { SortOrder } from 'src/core/repository/sort.order';
import { Roles } from 'src/app/role/enum/roles';

export class RoleFilter extends Filter {
  constructor(
    public readonly options?: {
      filter: {
        userId?: string | string[];
        name?: Roles | Roles[];
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
      ...this.andWhere('userId', this.options.filter.userId),
      ...this.andWhere('name', this.options.filter.name),
    });
  }
}
