import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthBearer } from 'src/core/middlewares/auth/auth.bearer';
import { General } from 'src/core/middlewares/general';
import { FileController } from 'src/app/file/file.controller';

export const configMiddleware = (consumer: MiddlewareConsumer) => {
  consumer
    .apply(AuthBearer)
    .forRoutes(
      FileController,
    );
  consumer.apply(General).forRoutes({ path: '/*', method: RequestMethod.GET });
};
