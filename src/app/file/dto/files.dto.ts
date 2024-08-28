import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { FileType } from 'src/app/file/enum/file-type';
import { FileStatus } from 'src/app/file/enum/file-status';

export class FilesDTO {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  type?: FileType;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  status?: FileStatus;

  @IsString()
  @IsOptional()
  path?: string;
}
