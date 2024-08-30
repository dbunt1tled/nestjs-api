import { Injectable } from '@nestjs/common';
import { Role } from 'src/generated/client';
import { Repository } from 'src/core/repository/repository';
import { RoleFilter } from 'src/app/role/dto/role.filter';
import { arrayIntersection, arrayWrap } from 'src/core/utils';
import { Roles } from 'src/app/role/enum/roles';

@Injectable()
export class RoleService {
  private readonly roleRepository = new Repository<Role>('role', 'userId');

  findByUserId(userId: string): Promise<Role[]> {
    return <Promise<Role[]>>(
      this.roleRepository.list(new RoleFilter({ filter: { userId: userId } }))
    );
  }

  assignUserId(userId: string, roles: Roles | Roles[]): Promise<Role[]> {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    return <Promise<Role[]>>(
      this.roleRepository.createManyAndReturn(
        roles.map((role) => ({ name: role, userId: userId })),
      )
    );
  }

  async unassignUserId(userId: string, roles: Roles | Roles[]) {
    roles = arrayWrap(roles);
    await this.roleRepository.deleteCondition(
      roles.map((r) => ({ userId: userId, name: r })),
    );
  }

  async userRevokeRoles(userId: string) {
    await this.roleRepository.deleteCondition({ userId: userId });
  }

  async userHasRole(userId: string, roles: Roles | Roles[]): Promise<boolean> {
    roles = arrayWrap(roles);
    const userRoles = await this.findByUserId(userId);
    return (
      arrayIntersection(
        userRoles.map((r) => r.name),
        roles,
      ).length > 0
    );
  }
}
