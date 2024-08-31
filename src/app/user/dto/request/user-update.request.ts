import { UserStatus } from 'src/app/user/enum/user.status';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUniqueDB } from 'src/core/decorator/is-unique-db.decorator';
import { Roles } from 'src/app/role/enum/roles';
import { Transform } from 'class-transformer';

export class UserUpdateRequest {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(159)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(150)
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  @IsUniqueDB({ tableName: 'users', column: 'email', exclude: 'id' })
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(50)
  @IsUniqueDB({ tableName: 'users', column: 'phone', exclude: 'id' })
  phone?: string;

  @IsString()
  @IsOptional()
  @Length(6, 70)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsArray()
  @IsEnum(Roles, { each: true })
  @Transform(({ value }) => {
    return Array.isArray(value)
      ? value.map((role: string) => role.trim())
      : value.split(',').map((role: string) => role.trim());
  })
  roles?: Roles[];
}
