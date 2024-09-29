import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthCheckError } from '@nestjs/terminus';
import { DRIZZLE } from './drizzle.module';
import { Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';

@Injectable()
export class DrizzleHealthIndicator extends HealthIndicator {
  constructor(@Inject(DRIZZLE) private readonly drizzle) {
    super();
  }

  async isHealthy(key: string): Promise<any> {
    try {
      await this.drizzle.execute(sql`SELECT 1`);
      return this.getStatus(key, true);
    } catch (error) {
      console.error('Database health check error:', error);
      throw new HealthCheckError('Database health check failed', error);
    }
  }
}
