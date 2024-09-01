import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Unauthorized } from 'src/core/exception/unauthorized';
import { HashService } from 'src/core/hash/hash.service';
import { UserService } from 'src/app/user/user.service';
import { AuthToken } from 'src/core/hash/dto/auth.token';
import { UserFilter } from 'src/app/user/dto/user.filter';
import { UserStatus } from 'src/app/user/enum/user.status';
import { TokenType } from 'src/core/hash/enums/token.type';
import { Reflector } from '@nestjs/core';
import { PublicTypes } from 'src/app/auth/enum/public-types.enum';

export const Public = (value: PublicTypes) =>
  SetMetadata(PublicTypes.AUTH, value);

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly hashService: HashService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    let isPublic = this.reflector.get<string>(
      PublicTypes.AUTH,
      context.getClass(),
    );
    if (!isPublic) {
      isPublic = this.reflector.get<string>(
        PublicTypes.AUTH,
        context.getHandler(),
      );
    }
    if (isPublic === PublicTypes.AUTH) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    let jwtToken = null;
    if (req.headers.authorization) {
      jwtToken = req.headers.authorization.replace('Bearer ', '');
    }
    if (!jwtToken && req.query.token) {
      jwtToken = req.query.token;
    }
    if (!jwtToken && req.params.token) {
      jwtToken = req.params.token;
    }
    if (!jwtToken) {
      throw new Unauthorized(400000, 'Unauthorized');
    }
    let token = null;
    try {
      token = <AuthToken>await this.hashService.decodeAsync(jwtToken);
    } catch (e) {
      throw new Unauthorized(400001, 'Unauthorized');
    }

    if (token.type !== TokenType.ACCESS) {
      throw new Unauthorized(400002, 'Unauthorized');
    }

    const user = await this.userService.one(
      new UserFilter({ filter: { id: token.sub, status: UserStatus.ACTIVE } }),
    );

    if (!user) {
      throw new Unauthorized(400003, 'Unauthorized');
    }

    req.authUser = user;

    return true;
  }
}
