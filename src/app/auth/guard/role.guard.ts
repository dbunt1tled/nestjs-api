import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Forbidden } from 'src/core/exception/forbidden';
import { Roles } from 'src/app/role/enum/roles';
import { RoleService } from 'src/app/role/role.service';
import { RoleTypes } from 'src/app/auth/enum/role-types.enum';

export const RBAC = (roles?: Roles[]) => SetMetadata(RoleTypes.ROLE, roles);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const roles = this.checkRole(RoleTypes.ROLE, context);

    if (!roles) {
      return true;
    }

    if (!(await this.roleService.hasRole(req.authUser.id, roles))) {
      throw new Forbidden(500001, 'Insufficient privileges');
    }
    return true;
  }

  checkRole(roleType: RoleTypes, context: ExecutionContext) {
    let roles = this.reflector.get<Roles[]>(roleType, context.getClass());
    const r = this.reflector.get<Roles[]>(roleType, context.getHandler());
    if (!roles || r.length > 0) {
      roles = r;
    }
    if (roles) {
      return roles;
    }
    return false;
  }
}
