import { Injectable } from '@nestjs/common';
import { Repository } from 'src/core/repository/repository';
import { RoleFilter } from 'src/app/role/dto/role.filter';
import { arrayIntersection, arrayWrap } from 'src/core/utils';
import { Roles } from 'src/app/role/enum/roles';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  private readonly roleRepository = new Repository<Role>('role', 'userId');

  findByUser(userId: string): Promise<Role[]> {
    return <Promise<Role[]>>(
      this.roleRepository.list(new RoleFilter({ filter: { userId: userId } }))
    );
  }

  assign(userId: string, roles: Roles | Roles[]): Promise<Role[]> {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    return <Promise<Role[]>>(
      this.roleRepository.createManyAndReturn(
        roles.map((role) => ({ name: role, userId: userId })),
      )
    );
  }

  async unassign(userId: string, roles: Roles | Roles[]) {
    roles = arrayWrap(roles);
    await this.roleRepository.deleteCondition(
      roles.map((r) => ({ userId: userId, name: r })),
    );
  }

  async revoke(userId: string) {
    await this.roleRepository.deleteCondition({ userId: userId });
  }

  async hasRole(userId: string, roles: Roles | Roles[]): Promise<boolean> {
    roles = arrayWrap(roles);
    const userRoles = await this.findByUser(userId);
    return (
      arrayIntersection(
        userRoles.map((r) => r.name),
        roles,
      ).length > 0
    );
  }

  modelAttributes() {
    return this.roleRepository.attributes;
  }
}
