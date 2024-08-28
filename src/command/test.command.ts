import { Command, CommandRunner } from 'nest-commander';
import * as console from 'node:console';
import { HashService } from 'src/core/hash/hash.service';
import { UserService } from 'src/app/user/user.service';
import { UserFilter } from 'src/app/user/dto/user.filter';
import { FileService } from 'src/app/file/file.service';
import { FileFilter } from 'src/app/file/dto/file.filter';
import { FileStatus } from 'src/app/file/enum/file-status';

@Command({
  name: 't:t',
  description: 'test function',
})
export class TestCommand extends CommandRunner {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly fileService: FileService,
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
  }
}
