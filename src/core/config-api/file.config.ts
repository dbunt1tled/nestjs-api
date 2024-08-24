import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PathInfo } from 'src/core/config-api/dto/path-info.dto';
import path from 'path';

@Injectable()
export class FileConfig {
  constructor(private configService: ConfigService) {}

  get filePath(): string {
    return this.configService.getOrThrow('FILE_STORAGE_PATH');
  }

  get uploadSize(): number {
    return parseInt(this.configService.getOrThrow('FILE_UPLOAD_SIZE'));
  }

  public storagePath(info: PathInfo): string {
    return info.path;
  }

  public tmpPath(): string {
    return path.join(
      this.filePath,
      this.configService.getOrThrow('FILE_TMP_STORAGE_PATH'),
    );
  }

  public chatPath(): string {
    return path.join(
      this.filePath,
      this.configService.getOrThrow('FILE_CHAT_STORAGE_PATH'),
    );
  }
}
