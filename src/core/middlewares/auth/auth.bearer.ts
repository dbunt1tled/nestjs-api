import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthToken } from 'src/core/dto/auth/auth.token';
import { AuthService } from 'src/core/services/auth/auth.service';
import { AuthFilter } from 'src/core/services/auth/auth.filter';
import { UserFilter } from 'src/core/services/user/dto/user.filter';
import { UserService } from 'src/core/services/user/user.service';
import { Unauthorized } from 'src/core/exception/unauthorized';
import { HashService } from 'src/core/hash/hash.service';

@Injectable()
export class AuthBearer implements NestMiddleware {
  constructor(
    private readonly hashService: HashService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async use(req, res: FastifyReply['raw'], next: () => void) {
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
      throw new Unauthorized(400002, 'Unauthorized');
    }

    const auth = await this.authService.one(
      new AuthFilter({
        filter: {
          userId: token.iss,
          session: token.session,
        },
      }),
    );

    if (!auth) {
      throw new Unauthorized(400003, 'Unauthorized');
    }

    const user = await this.userService.one(
      new UserFilter({ filter: { id: token.iss, active: true } }),
    );

    if (!user) {
      throw new Unauthorized(400004, 'Unauthorized');
    }

    req.authUser = user;

    next();
  }
}
