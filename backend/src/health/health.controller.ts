import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { DataSource } from 'typeorm';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database health status' })
  @ApiResponse({ status: 200, description: 'API is healthy and database is connected' })
  @ApiResponse({ status: 500, description: 'Database connection failed or API is unhealthy' })
  async checkHealth(@Res() res: Response) {
    try {
      await this.dataSource.query('SELECT 1');
      return res.status(HttpStatus.OK).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: 'CONNECTED',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        database: 'DISCONNECTED',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
