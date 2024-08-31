import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { IsUniqueDB } from 'src/core/decorator/is-unique-db.decorator';

export class SignUpRequest {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  @Length(3, 150)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(3, 100)
  @IsUniqueDB({ tableName: 'users', column: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(9, 50)
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
}
