import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';
import { DrizzleHealthIndicator } from '../drizzle/drizzle.health';

@Controller('health')
export class DatabaseHealthController {
  constructor(
    private health: HealthCheckService,
    private drizzleHealthIndicator: DrizzleHealthIndicator,
  ) {}

  @Get('database')
  @HealthCheck()
  checkDatabase() {
    return this.health.check([
      () => this.drizzleHealthIndicator.isHealthy('database'),
    ]);
  }
}
