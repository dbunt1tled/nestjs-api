import { Injectable } from '@nestjs/common';
import { UserService } from 'src/app/user/user.service';
import { Paginator } from 'src/core/repository/paginator';
import { arrayDifferenceLeft, arrayWrap, isPaginator } from 'src/core/utils';
import { ResponseBase } from 'src/core/service/response/response.base';
import { RoleService } from 'src/app/role/role.service';
import { TWithId } from 'src/core/types/general/TWithId';
import { FileService } from 'src/app/file/file.service';
import { FileFilter } from 'src/app/file/dto/file.filter';

@Injectable()
export class UserResponse extends ResponseBase {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly rolesService: RoleService,
  ) {
    super();
  }

  async json<T extends object>(data: {
    model: TWithId<T> | TWithId<T>[] | Paginator<TWithId<T>>;
    include?: string[];
  }): Promise<any> {
    let model = arrayWrap(this.getData(data.model));
    let relationships = {};
    const includes: string[] = [];
    if (data.include?.includes('roles')) {
      model = await Promise.all(
        model.map(async (m) => ({
          ...m,
          roles: await this.rolesService.findByUser(m.id),
        })),
      );
      relationships = {
        ...relationships,
        roles: {
          ref: function (user, role) {
            return `${role.userId}-${role.name}`;
          },
          attributes: this.rolesService.modelAttributes(),
        },
      };
      includes.push('roles');
    }

    if (data.include?.includes('files')) {
      model = await Promise.all(
        model.map(async (m) => ({
          ...m,
          files: await this.fileService.list(
            new FileFilter({ filter: { userId: m.id } }),
          ),
        })),
      );
      relationships = {
        ...relationships,
        files: {
          ref: function (user, file) {
            return file.id;
          },
          attributes: this.fileService.modelAttributes(),
        },
      };
      includes.push('files');
    }

    return await this.serialize({
      models:
        Array.isArray(data.model) || isPaginator(data.model)
          ? model
          : model[0],
      type: 'user',
      attributes: [
        ...arrayDifferenceLeft(this.userService.modelAttributes(), ['hash']),
        ...includes,
      ],
      relationships: relationships,
      meta: this.getMeta(data.model),
    });
  }
}
