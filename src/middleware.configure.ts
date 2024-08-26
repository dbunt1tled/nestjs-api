import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthBearer } from 'src/core/middleware/auth/auth.bearer';
import { General } from 'src/core/middleware/general';
import { FileController } from 'src/app/file/file.controller';

export const configMiddleware = (consumer: MiddlewareConsumer) => {
  consumer
    .apply(AuthBearer)
    .forRoutes(
      FileController,
    );
  consumer.apply(General).forRoutes({ path: '/*', method: RequestMethod.GET });
};
