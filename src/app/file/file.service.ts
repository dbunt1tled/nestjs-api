import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import { NotFound } from 'src/core/exception/not-found';
import { Repository } from 'src/core/repository/repository';
import { Filter } from 'src/core/repository/filter/filter';
import { Paginator } from 'src/core/repository/paginator';
import { FilesDTO } from 'src/app/file/dto/files.dto';
import { Unprocessable } from 'src/core/exception/unprocessable';
import { File } from '@prisma/client';
import { FileFilter } from 'src/app/file/dto/file.filter';

@Injectable()
export class FileService {
  private readonly fileRepository = new Repository<File>('file');
  constructor() {}

  async findById(id: string): Promise<File | null> {
    return this.fileRepository.findById(id);
  }

  async getById(id: string): Promise<File> {
    return this.fileRepository.getById(id);
  }

  async one(filter: FileFilter): Promise<File | null> {
    return this.fileRepository.one(filter);
  }

  async list(filter: FileFilter): Promise<File[] | Paginator<File>> {
    return this.fileRepository.list(filter);
  }

  async create(data: FilesDTO): Promise<File> {
    if (!data.path) {
      throw new Unprocessable(500001, 'Wrong file arguments');
    }
    return this.fileRepository.create(data);
  }

  async update(data: FilesDTO): Promise<File> {
    if (!data.id) {
      throw new Unprocessable(500002, 'Wrong file arguments');
    }
    return this.fileRepository.update(data);
  }

  async fileInfo(path: string, allowDirectory = false) {
    try {
      const info = await fs.promises.stat(path);
      if (!allowDirectory && info.isDirectory()) {
        throw new NotFound(600001, 'File not found');
      }
      return info;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      throw new NotFound(600002, 'File not found');
    }
  }

  modelAttributes() {
    return this.fileRepository.attributes;
  }
}
