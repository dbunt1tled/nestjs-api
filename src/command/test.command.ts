import { Command, CommandRunner } from 'nest-commander';
import * as console from 'node:console';
import { HashService } from 'src/core/hash/hash.service';
import { UserService } from 'src/app/user/user.service';
import { UserFilter } from 'src/app/user/dto/user.filter';
import { FileService } from 'src/app/file/file.service';
import { FileFilter } from 'src/app/file/dto/file.filter';
import { FileStatus } from 'src/app/file/enum/file-status';
import { RoleService } from 'src/app/role/role.service';
import { Roles } from 'src/app/role/enum/roles';

@Command({
  name: 't:t',
  description: 'test function',
})
export class TestCommand extends CommandRunner {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly fileService: FileService,
    private readonly roleService: RoleService,
  ) {
    super();
  }

  async run(inputs: string[], options: Record<string, any>): Promise<void> {
    const hash = await this.hashService.hashPassword('Test');
    console.log(hash);
    console.log(await this.hashService.comparePassword('Test', hash));
    console.log(
      await this.userService.one(
        new UserFilter({ filter: { nameFilter: 'DD' } }),
      ),
    );
    console.log(
      await this.fileService.one(
        new FileFilter({ filter: { status: FileStatus.ACTIVE } }),
      ),
    );
    await this.roleService.revoke(
      '943e5394-f896-4a0c-8aa6-5c387be8aa0d',
    );

    await this.roleService.unassign(
      'b70bce8d-1cbb-48f6-8fa7-2935c910ac22',
      Roles.USER,
    );

    console.log(
      await this.roleService.assign(
        '943e5394-f896-4a0c-8aa6-5c387be8aa0d',
        [Roles.ADMIN, Roles.USER],
      ),
    );

    console.log(
      await this.roleService.assign(
        'b70bce8d-1cbb-48f6-8fa7-2935c910ac22',
        Roles.USER,
      ),
    );

    console.log(
      await this.roleService.hasRole(
        'b70bce8d-1cbb-48f6-8fa7-2935c910ac22',
        Roles.USER,
      ),
    );
    console.log(
      await this.roleService.hasRole(
        'b70bce8d-1cbb-48f6-8fa7-2935c910ac22',
        Roles.ADMIN,
      ),
    );
  }
}
