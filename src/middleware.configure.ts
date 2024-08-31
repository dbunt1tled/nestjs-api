import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { General } from 'src/core/middleware/general';

export const configMiddleware = (consumer: MiddlewareConsumer) => {
  consumer.apply(General).forRoutes({ path: '/*', method: RequestMethod.GET });
};
