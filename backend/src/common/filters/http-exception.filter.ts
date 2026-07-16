import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const resContent = exception.getResponse() as any;
      
      if (typeof resContent === 'object' && resContent !== null) {
        message = resContent.message || exception.message;
        error = resContent.error || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError;
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Database Error';
      
      if (driverError) {
        const code = driverError.code;
        if (code === '23505') {
          statusCode = HttpStatus.CONFLICT;
          message = `Duplicate key violation: ${driverError.detail || driverError.message}`;
          error = 'Conflict';
        } else if (code === '23503') {
          statusCode = HttpStatus.CONFLICT;
          message = `Foreign key constraint violation: ${driverError.detail || driverError.message}`;
          error = 'Conflict';
        } else if (driverError.message && (
          driverError.message.includes('capacidad máxima') ||
          driverError.message.includes('insuficiente') ||
          driverError.message.includes('excede el presupuesto')
        )) {
          statusCode = HttpStatus.CONFLICT;
          message = driverError.message.replace(/^error:\s*/i, '');
          error = 'Conflict';
        } else {
          message = driverError.detail || driverError.message || 'Database query error';
        }
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      if (
        exception.message.includes('insuficiente') || 
        exception.message.includes('capacidad máxima') || 
        exception.message.includes('excede el presupuesto')
      ) {
        statusCode = HttpStatus.CONFLICT;
        message = exception.message;
        error = 'Conflict';
      } else {
        message = exception.message;
      }
    }

    this.logger.error(
      `${request.method} ${request.url} - Status: ${statusCode} - Error: ${
        Array.isArray(message) ? message.join(', ') : message
      }`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
