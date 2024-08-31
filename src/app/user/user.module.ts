import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from 'src/app/user/user.service';
import { UserResponse } from 'src/app/user/dto/response/user.response';

@Global()
@Module({
  controllers: [UserController],
  providers: [UserService, UserResponse],
  exports: [UserService],
})
export class UserModule {}
