import { HttpException } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    public readonly code: number,
    public readonly statusCode: number,
    public readonly message: string,
  ) {
    super(message, statusCode);
  }
}