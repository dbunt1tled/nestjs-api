import { FilterCondition } from './filter.condition';
import { FilterOptions } from 'src/core/repository/filter/filter.options';
import { Prisma } from 'src/generated/client';

export class Filter {
  constructor(public readonly options?: FilterOptions) {}

  build(limit?: number, where?: object): FilterCondition {
    let take = limit;
    let skip = undefined;
    if (this.options?.pagination?.page) {
      take = this.options.pagination.limit;
      skip = (this.options.pagination.page - 1) * this.options.pagination.limit;
    }
    return {
      where: where,
      orderBy: this.options?.sort?.field,
      skip: skip,
      take: take,
    };
  }

  andWhere(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    if (Array.isArray(value)) {
      return { [field]: { in: value } };
    }
    return { [field]: value };
  }

  andWhereNot(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    if (Array.isArray(value)) {
      return { [field]: { notIn: value } };
    }
    return { [field]: { isNot: value } };
  }

  andWhereLike(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    return { [field]: { contains: value } };
  }

  andWhereMultiFieldLike(fields: string[], value: any): object {
    if (value === undefined || fields.length === 0) {
      return {};
    }
    return {
      OR: fields.map((f) => this.andWhereLike(f, value)),
    };
  }

  andWhereNull(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    return { [field]: null };
  }

  andWhereNotNull(field: string, value: any): object {
    if (value === undefined) {
      return {};
    }
    return { [field]: { not: null } };
  }
}
