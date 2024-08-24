import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import prismaMain from 'src/core/services/prisma-client/main-client';
import prismaUser from 'src/core/services/prisma-client/user-client';
import prismaInfo from 'src/core/services/prisma-client/info-client';
import { SocketConfig } from 'src/core/config-api/socket.config';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: PrismaHealthIndicator,
    private readonly socketConfig: SocketConfig,
  ) {}

  @Get('/indicator')
  @HealthCheck()
  async check() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.http.pingCheck('dns', 'https://1.1.1.1'),
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck('db-main', prismaMain),
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck('db-user', prismaUser),
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck('db-info', prismaInfo),
      async () =>
        this.http.responseCheck(
          'centrifugo',
          `${this.socketConfig.centrifugoUrl}/health`,
          (res) => res.status === 200,
        ),
    ]);
  }
}
