import { LogRequestData } from 'src/core/logger/dto/log.request.data';
import { colorize } from 'src/core/logger/colorize';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { DateTime } from 'luxon';

export class LokiData {
  logLevel: string;
  datetime: string;
  message: string | object;
  request?: object;
  context?: string;

  constructor(logLevel: string, data: LogRequestData) {
    this.logLevel = logLevel;
    this.datetime =
      data.timestamp || DateTime.now().setZone('Europe/Kyiv').toISO();
    this.message = data.message;
    this.request = {
      statusCode: data.statusCode,
      path: data.path,
      ...data.request,
    };
    this.context = data.trace;
  }

  toString(): string {
    return JSON.stringify({
      logLevel: colorize(this.logLevel.toUpperCase(), [
        this.logLevel.toLowerCase(),
      ]),
      datetime: colorize(this.datetime, ['green']),
      message: isObject(this.message)
        ? JSON.stringify(this.message)
        : this.message,
      request: this.request,
      context: this.context,
    });
  }
}
