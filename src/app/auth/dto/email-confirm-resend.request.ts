import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailConfirmResendRequest {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}