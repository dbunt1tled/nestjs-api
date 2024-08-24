import { Injectable } from '@nestjs/common';
import fs from 'node:fs';
import { NotFound } from 'src/core/exception/not-found';

@Injectable()
export class FileService {
  constructor() {}

  async fileInfo(path: string, allowDirectory = false) {
    try {
      const info = await fs.promises.stat(path);
      if (!allowDirectory && info.isDirectory()) {
        throw new NotFound(600004, 'File not found');
      }
      return info;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      throw new NotFound(600005, 'File not found');
    }
  }
}
