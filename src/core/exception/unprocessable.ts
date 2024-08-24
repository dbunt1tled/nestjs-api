import { BaseException } from 'src/core/exception/base-exception';
import { HttpStatus } from '@nestjs/common';

export class Unprocessable extends BaseException {
  constructor(
    public readonly code: number,
    public readonly message: string,
  ) {
    super(code, HttpStatus.UNPROCESSABLE_ENTITY, message);
  }
}