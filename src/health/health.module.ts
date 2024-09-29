import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { ServiceHealthController } from './service.health.controller';
import { DatabaseHealthController } from './database.health.controller';
import { DrizzleHealthIndicator } from '../drizzle/drizzle.health';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  imports: [TerminusModule, DrizzleModule],
  controllers: [ServiceHealthController, DatabaseHealthController],
  providers: [DrizzleHealthIndicator],
})
export class HealthModule {}
