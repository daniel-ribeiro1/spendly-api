import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('health-check')
  @ApiOperation({
    summary: 'Check if the API is healthy.',
  })
  @ApiOkResponse({
    description: 'The API is healthy.',
    example: true,
  })
  healthCheck(): boolean {
    return true;
  }
}
