import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Log } from 'src/core/logger/log';
import { FastifyRequest } from 'fastify';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseException } from 'src/core/exception/base-exception';

@Catch()
export class ExceptionHandler implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const req = <FastifyRequest>ctx.getRequest();
    const logger: Log = new Log('general');
    const { httpAdapter } = this.httpAdapterHost;
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const code = exception instanceof BaseException ? exception.code : 0;
    const response =
      exception instanceof HttpException
        ? { errors: exception.getResponse() }
        : exception instanceof Error
          ? { errors: exception.message }
          : { errors: 'Internal Server Error' };

    const debug =
      exception instanceof Error && process.env.NODE_ENV !== 'production'
        ? {
          file: exception.stack.split('\n')[1]?.trim(),
          trace: exception.stack,
        }
        : {};
    const responseBody = {
      ...(response as NonNullable<unknown>),
      ...{
        code: code,
        statusCode: httpStatus,
        path: req.url,
      },
      ...debug,
    };
    await logger.errorException({
      statusCode: httpStatus,
      method: req.method,
      path: req.url,
      message: response.errors,
      trace: debug.trace,
      request: {
        id: req.id,
        hostname: req.hostname,
        headers: <object | string>req.headers,
        params: <object | string>req.params,
        body: <object | string>req.body,
        query: <object | string>req.query,
      },
    });

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
