import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @Length(3, 150)
  login: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @Length(3, 150)
  password: string;
}
