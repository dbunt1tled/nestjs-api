import { Filter } from 'src/core/repository/filter/filter';
import { FilterCondition } from 'src/core/repository/filter/filter.condition';
import { Pagination } from 'src/core/repository/pagination';
import { SortOrder } from 'src/core/repository/sort.order';
import { FileType } from 'src/app/file/enum/file-type';
import { FileStatus } from 'src/app/file/enum/file-status';

export class FileFilter extends Filter {
  constructor(
    public readonly options?: {
      filter: {
        id?: string | string[];
        ownerId?: string | string[];
        userId?: string | string[];
        type?: FileType | FileType[];
        status?: FileStatus | FileStatus[];
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
      ...this.andWhere('ownerId', this.options.filter.ownerId),
      ...this.andWhere('userId', this.options.filter.userId),
      ...this.andWhere('type', this.options.filter.type),
      ...this.andWhere('status', this.options.filter.status),
    });
  }
}
