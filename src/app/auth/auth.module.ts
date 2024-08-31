import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailService } from 'src/core/mail/mail.service';
import { UserService } from 'src/app/user/user.service';

@Module({
  providers: [AuthService, MailService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
