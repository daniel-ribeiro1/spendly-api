import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('health-check')
  @ApiOkResponse({
    description: 'The API is healthy.',
    example: true,
  })
  healthCheck(): boolean {
    return true;
  }
}
