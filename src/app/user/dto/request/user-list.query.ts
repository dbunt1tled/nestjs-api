import { UserStatus } from 'src/app/user/enum/user.status';
import { UserFilter } from 'src/app/user/dto/user.filter';
import { ListBaseQuery } from 'src/core/dto/request/list-base.query';
import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Roles } from 'src/app/role/enum/roles';
import { intOrArrayToArray, stringOrArrayToArray } from 'src/core/utils';

class Filter {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  email?: string;

  @IsOptional()
  @Transform(intOrArrayToArray)
  statuses?: UserStatus[];

  @IsOptional()
  @Transform(stringOrArrayToArray)
  roles?: Roles[];
}

export class UserListQuery extends ListBaseQuery {
  @ValidateNested()
  @Type(() => Filter)
  @IsOptional()
  filter?: Filter;

  toFilter() {
    return new UserFilter({
      filter: {
        nameFilter: this.filter.name,
        emailFilter: this.filter.email,
        status: this.filter.statuses,
        roles: this.filter.roles,
      },
      sort: this.sortBy,
      pagination: {
        limit: this.limit,
        page: this.page,
      },
    });
  }
}
