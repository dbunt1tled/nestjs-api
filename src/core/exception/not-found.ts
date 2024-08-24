import { BaseException } from 'src/core/exception/base-exception';
import { HttpStatus } from '@nestjs/common';

export class NotFound extends BaseException {
  constructor(
    public readonly code: number,
    public readonly message: string,
  ) {
    super(code, HttpStatus.NOT_FOUND, message);
  }
}