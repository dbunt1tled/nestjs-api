import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Algorithm } from 'jsonwebtoken';

@Injectable()
export class HashConfig {
  constructor(private configService: ConfigService) {}

  get publicKey(): string {
    return Buffer.from(
      this.configService.getOrThrow('JWT_PUBLIC_KEY').toString(),
      'base64',
    ).toString();
  }

  get privateKey(): string {
    return Buffer.from(
      this.configService.getOrThrow('JWT_PRIVATE_KEY').toString(),
      'base64',
    ).toString();
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
