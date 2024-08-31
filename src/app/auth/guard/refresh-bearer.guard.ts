import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Unauthorized } from 'src/core/exception/unauthorized';
import { HashService } from 'src/core/hash/hash.service';
import { UserService } from 'src/app/user/user.service';
import { AuthToken } from 'src/core/hash/dto/auth.token';
import { UserFilter } from 'src/app/user/dto/user.filter';
import { UserStatus } from 'src/app/user/enum/user.status';
import { TokenType } from 'src/core/hash/enums/token.type';

@Injectable()
export class RefreshBearerGuard implements CanActivate {
  constructor(
    private readonly hashService: HashService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    let jwtToken = null;
    if (req.headers.authorization) {
      jwtToken = req.headers.authorization.replace('Bearer ', '');
    }
    if (!jwtToken) {
      throw new Unauthorized(400008, 'Unauthorized');
    }
    let token = null;
    try {
      token = <AuthToken>await this.hashService.decodeAsync(jwtToken);
    } catch (e) {
      throw new Unauthorized(400009, 'Unauthorized');
    }

    if (token.type !== TokenType.REFRESH) {
      throw new Unauthorized(400010, 'Unauthorized');
    }

    const user = await this.userService.one(
      new UserFilter({ filter: { id: token.sub, status: UserStatus.ACTIVE } }),
    );

    if (!user) {
      throw new Unauthorized(400011, 'Unauthorized');
    }

    req.authUser = user;

    return true;
  }
}
