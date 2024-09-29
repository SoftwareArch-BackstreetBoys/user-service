import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class ServiceHealthController {
  @Get('service')
  getServiceHealth() {
    const isServiceUp = true; // Good enough for now

    return {
      status: isServiceUp ? 'up' : 'down',
      timestamp: new Date(),
    };
  }
}
