import { Injectable } from '@nestjs/common';
import { User } from 'src/generated/client';
import { Paginator } from 'src/core/repository/paginator';
import { FilesDTO } from 'src/app/file/dto/files.dto';
import { Unprocessable } from 'src/core/exception/unprocessable';
import { Repository } from 'src/core/repository/repository';
import { UserFilter } from 'src/app/user/dto/user.filter';

@Injectable()
export class UserService {
  private readonly userRepository = new Repository<User>('user');

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

  async create(data: FilesDTO): Promise<User> {
    if (!data.path) {
      throw new Unprocessable(500001, 'Wrong file arguments');
    }
    return this.userRepository.create(data);
  }

  async update(data: FilesDTO): Promise<User> {
    if (!data.id) {
      throw new Unprocessable(500002, 'Wrong file arguments');
    }
    return this.userRepository.update(data);
  }
}
