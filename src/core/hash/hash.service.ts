import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { random, uuid4, uuid7 } from 'src/core/utils';
import { HashConfig } from 'src/core/config-api/hash.config';
import { Tokens } from 'src/core/hash/dto/tokens';
import { TokenType } from 'src/core/hash/enums/token.type';
import { DateTime } from 'luxon';
import { User } from '@prisma/client';

@Injectable()
export class HashService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly hashConfig: HashConfig,
  ) {}

  async comparePassword(plainText: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, plainText);
  }

  async hashPassword(plainText: string): Promise<string> {
    return await argon2.hash(plainText);
  }

  random(size: number = 32): string {
    return random(size);
  }

  uuid7(): string {
    return uuid7();
  }

  uuid4(): string {
    return uuid4();
  }

  async decodeAsync(token: string, checkExpiry = true) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (!checkExpiry && e instanceof TokenExpiredError) {
        return await this.jwtService.decode(token);
      }
      throw e;
    }
  }

  decode(token: string, checkExpiry = true) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      if (!checkExpiry && e instanceof TokenExpiredError) {
        return this.jwtService.decode(token);
      }
      throw e;
    }
  }

  async tokens(
    user: User,
    options?: { accessExpiredSec?: number; refreshExpiredSec?: number },
  ): Promise<Tokens> {
    const accessExpiredSec =
      options?.accessExpiredSec || this.hashConfig.tokenAccessLifeTime;
    const refreshExpiredSec =
      options?.refreshExpiredSec || this.hashConfig.tokenRefreshLifeTime;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: TokenType.ACCESS,
          session: user.session,
        },
        {
          expiresIn: accessExpiredSec,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: TokenType.REFRESH,
          session: user.session,
        },
        {
          expiresIn: refreshExpiredSec,
        },
      ),
    ]);
    return {
      tokenAccess: accessToken,
      tokenAccessExpires: DateTime.now()
        .plus({ second: accessExpiredSec })
        .toJSDate(),
      tokenRefresh: refreshToken,
      tokenRefreshExpires: DateTime.now()
        .plus({ second: refreshExpiredSec })
        .toJSDate(),
    };
  }
}
