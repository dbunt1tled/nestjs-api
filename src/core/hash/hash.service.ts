import { Injectable } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { random, uuid7 } from 'src/core/utils';

@Injectable()
export class HashService {
  constructor(private readonly jwtService: JwtService) {}

  random(size: number = 32): string {
    return random(size);
  }

  uuid7(): string {
    return uuid7();
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
}
