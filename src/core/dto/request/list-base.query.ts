import { IsOptional, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder } from 'src/core/repository/sort.order';
import { include, sort } from 'src/core/utils';

export class ListBaseQuery {
  @Min(1)
  @Max(1000)
  @IsOptional()
  page?: number;

  @Min(1)
  @Max(1000)
  @IsOptional()
  limit?: number;

  @IsOptional()
  @Transform(include)
  include?: string[];

  @IsOptional()
  @Transform(sort)
  sortBy?: SortOrder;
}
