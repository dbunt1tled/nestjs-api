import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PathInfo } from 'src/core/config-api/dto/path-info.dto';
import path from 'path';
import 'dotenv/config';

@Injectable()
export class FileConfig {
  static readonly UPLOAD_SIZE =
    parseInt(process.env.FILE_UPLOAD_SIZE || '5') * 1024 * 1024;
  static readonly UPLOAD_FILE_PATTERN =
    process.env.UPLOAD_FILE_PATTERN || 'jpg|jpeg|png';

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
