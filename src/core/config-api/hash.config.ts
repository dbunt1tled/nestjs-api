import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Algorithm } from 'jsonwebtoken';
import { base64decode } from 'src/core/utils';

@Injectable()
export class HashConfig {
  constructor(private configService: ConfigService) {}

  get publicKey(): string {
    return base64decode(
      this.configService.getOrThrow('JWT_PUBLIC_KEY').toString(),
    );
  }

  get privateKey(): string {
    return base64decode(
      this.configService.getOrThrow('JWT_PRIVATE_KEY').toString(),
    );
  }

  get jwtAlgorithm(): Algorithm {
    return this.configService.get<Algorithm>('JWT_TOKEN_ALGORITHM', 'RS256');
  }

  get tokenAccessLifeTime(): number {
    return parseInt(
      this.configService.getOrThrow('TOKEN_ACCESS_LIFE_TIME_SECONDS'),
    );
  }

  get tokenRefreshLifeTime(): number {
    return parseInt(
      this.configService.getOrThrow('TOKEN_REFRESH_LIFE_TIME_SECONDS'),
    );
  }

  get tokenConfirmEmailLifeTime(): number {
    return parseInt(
      this.configService.getOrThrow('TOKEN_CONFIRM_EMAIL_LIFE_TIME_SECONDS'),
    );
  }
}
