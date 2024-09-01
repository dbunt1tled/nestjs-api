import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Forbidden } from 'src/core/exception/forbidden';
import { Roles } from 'src/app/role/enum/roles';
import { RoleService } from 'src/app/role/role.service';

export const RBAC = Reflector.createDecorator<Roles[] | undefined>();

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const roles = this.reflector.get(RBAC, context.getHandler());

    if (!roles) {
      return true;
    }

    if (!this.roleService.hasRole(req.authUser.id, roles)) {
      throw new Forbidden(500001, 'Insufficient privileges');
    }
    return true;
  }
}
