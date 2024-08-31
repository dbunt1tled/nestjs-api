import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/user.service';
import { Paginator } from 'src/core/repository/paginator';
import { arrayDifferenceLeft } from 'src/core/utils';
import { ResponseBase } from 'src/core/service/response/response.base';

@Injectable()
export class UserResponse extends ResponseBase {
  constructor(private readonly userService: UserService) {
    super();
  }

  async json<T extends object>(data: {
    model: T | T[] | Paginator<T>,
    include?: string[],
  }): Promise<any> {
    const model = this.getData(data.model);

    return await this.serialize({
      models: model,
      type: 'user',
      attributes: arrayDifferenceLeft(this.userService.modelAttributes(), [
        'hash',
      ]),
      meta: this.getMeta(data.model),
    });
  }
}
