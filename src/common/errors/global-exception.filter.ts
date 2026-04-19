// /**
//  * What it does: It intercepts any exception (like a 404 Not Found, 500 Internal Server Error, or a database crash).
//  * Why use it: Instead of the default error, you can return a consistent "Error Object" that your frontend developer will love.
//  */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from './api-error';
import { ValidationError } from 'class-validator';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { constraintRecordFromUnknown } from '../../utils/validation.util';

@Catch() // * want to catch everything. No matter what the error is, send it to me first.
export class GlobalExceptionFilter implements ExceptionFilter {
  // * This is the core function. It receives two things: exception (The actual error object that occurred) and host (Access to the underlying request/response objects (via Express))
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // * Debug: log the actual exception
    console.log('GlobalExceptionFilter caught:', exception);
    console.log('Exception type:', typeof exception);
    // console.log('Exception constructor:', exception?.constructor?.name);

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error'; // * 500 -- Internal Server Error

    if (exception instanceof JsonWebTokenError) {
      // * Handle JWT errors -- 401 Unauthorized response.
      statusCode = HttpStatus.UNAUTHORIZED;
      message = 'Invalid token';
      error = (exception as Error).message;
    } else if (exception instanceof TokenExpiredError) {
      statusCode = HttpStatus.UNAUTHORIZED; // * 401 -- Unauthorized.
      message = 'Token expired';
      error = (exception as Error).message;
    } else if (exception instanceof UnauthorizedException) {
      statusCode = HttpStatus.UNAUTHORIZED;
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse['message'] as string) || 'Unauthorized'
          : exceptionResponse;
      error = 'Unauthorized';
    } else if (exception instanceof ForbiddenException) {
      // * NestJS Built-in Exceptions: It checks if NestJS already threw a Forbidden Exception (403) or Unauthorized Exception (401)
      statusCode = HttpStatus.FORBIDDEN;
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse['message'] as string) || 'Forbidden'
          : exceptionResponse;
      error = 'Forbidden';
    } else if (exception instanceof ApiError) {
      // * Handle custom API errors -- This is for your own custom errors
      statusCode = exception.statusCode;
      message = exception.message;
      error = exception.message;
    } else if (exception instanceof BadRequestException) {
      //* Handle validation errors -- This is where class-validator comes i
      const validationErrors = exception.getResponse() as {
        message?: string | ValidationError[];
      };
      if (
        Array.isArray(validationErrors['message']) &&
        validationErrors['message'][0] instanceof ValidationError
      ) {
        statusCode = HttpStatus.BAD_REQUEST;
        message = validationErrors['message']
          .map((item) =>
            Object.values(constraintRecordFromUnknown(item)).join(', '),
          )
          .join(', ');
        error = 'Validation Error';
      } else {
        statusCode = HttpStatus.BAD_REQUEST;
        message =
          (validationErrors['message'] as string) || 'Validation failed';
        error = 'Bad Request';
      }
    }

    if ((statusCode as number) >= 500) {
      //* Log the error for debugging (remove in production or use proper logging)
      console.error('Unhandled Exception:', exception);
    }

    response.status(statusCode).json({
      statusCode,
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    });
  }
}
