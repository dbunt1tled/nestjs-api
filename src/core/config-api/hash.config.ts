import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Algorithm } from 'jsonwebtoken';

@Injectable()
export class HashConfig {
  constructor(private configService: ConfigService) {}

  get publicKey(): string {
    return Buffer.from(
      this.configService.getOrThrow('JWT_PUBLIC').toString(),
      'base64',
    ).toString();
  }

  get privateKey(): string {
    return Buffer.from(
      this.configService.getOrThrow('JWT_PRIVATE').toString(),
      'base64',
    ).toString();
  }

  get jwtAlgorithm(): Algorithm {
    return this.configService.get<Algorithm>('JWT_TOKEN_ALGORITHM', 'RS256');
  }
}
