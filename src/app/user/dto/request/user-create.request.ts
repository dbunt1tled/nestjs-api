import { UserStatus } from 'src/app/user/enum/user.status';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsUniqueDB } from 'src/core/decorator/is-unique-db.decorator';

export class UserCreateRequest {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(159)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @IsUniqueDB({ tableName: 'users', column: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(50)
  @IsUniqueDB({ tableName: 'users', column: 'phone' })
  phone: string;

  @IsString()
  @IsNotEmpty()
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
}
