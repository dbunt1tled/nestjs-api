import { Global, Module } from '@nestjs/common';
import { RoleService } from './role.service';

@Global()
@Module({
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
