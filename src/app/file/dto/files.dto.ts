import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { FileType } from 'src/app/file/enum/file-type';

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

  @IsString()
  @IsOptional()
  path?: string;
}
