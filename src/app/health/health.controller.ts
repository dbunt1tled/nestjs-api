import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import prismaMainClient from 'src/core/repository/prisma/service/client';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly db: PrismaHealthIndicator,
  ) {}

  @Get('/indicator')
  @HealthCheck()
  async check() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> =>
        this.http.pingCheck('dns', 'https://1.1.1.1'),
      async (): Promise<HealthIndicatorResult> =>
        this.db.pingCheck('db-main', prismaMainClient),
    ]);
  }
}
