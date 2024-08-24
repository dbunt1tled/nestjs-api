import { IsNotEmpty, IsString } from 'class-validator';

export class PathParam {
  @IsString()
  @IsNotEmpty()
  '*': string;
}
