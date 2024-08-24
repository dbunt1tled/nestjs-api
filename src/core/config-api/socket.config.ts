import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Algorithm } from 'jsonwebtoken';

@Injectable()
export class SocketConfig {
  constructor(private configService: ConfigService) {}

  get grpcServerUrl(): string {
    return this.configService.getOrThrow('GRPC_SEVER_URL').toString();
  }

  get centrifugoUrl(): string {
    return this.configService.getOrThrow('CENTRIFUGO_URL').toString();
  }
}
