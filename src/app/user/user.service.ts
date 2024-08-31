import { Injectable } from '@nestjs/common';
import { Paginator } from 'src/core/repository/paginator';
import { Unprocessable } from 'src/core/exception/unprocessable';
import { Repository } from 'src/core/repository/repository';
import { UserFilter } from 'src/app/user/dto/user.filter';
import { UserDto } from 'src/app/user/dto/user.dto';
import { RoleService } from 'src/app/role/role.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly userRepository = new Repository<User>('user');

  constructor(private readonly roleService: RoleService) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getById(id: string): Promise<User> {
    return this.userRepository.getById(id);
  }

  async one(filter: UserFilter): Promise<User | null> {
    return this.userRepository.one(filter);
  }

  async list(filter: UserFilter): Promise<User[] | Paginator<User>> {
    return this.userRepository.list(filter);
  }

  async create(data: UserDto): Promise<User> {
    const user = await this.userRepository.create(data);

    if (data.roles) {
      await this.roleService.assign(user.id, data.roles);
    }

    return user;
  }

  async update(data: UserDto): Promise<User> {
    if (!data.id) {
      throw new Unprocessable(500003, 'Wrong user arguments');
    }
    const user = await this.userRepository.update(data);

    if (data.roles) {
      await this.roleService.revoke(user.id);
      await this.roleService.assign(user.id, data.roles);
    }

    return user;
  }

  modelAttributes() {
    return this.userRepository.attributes;
  }
}
