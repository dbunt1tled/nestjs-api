import { BaseException } from 'src/core/exception/base-exception';
import { HttpStatus } from '@nestjs/common';

export class Forbidden extends BaseException {
  constructor(
    public readonly code: number,
    public readonly message: string,
  ) {
    super(code, HttpStatus.FORBIDDEN, message);
  }
}