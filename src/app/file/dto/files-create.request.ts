import { IsInt, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { FileType } from 'src/app/file/enum/file-type';

export class FilesRequest {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  type?: FileType;
}