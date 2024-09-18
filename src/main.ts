import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { runInCluster } from 'src/runInCluster';
import { contentParser } from 'fastify-multer';
import { ValidationPipe } from '@nestjs/common';
import { fastifyInstance, gracefulShutdown } from 'src/http.server';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const port = process.env.APP_PORT ?? 3000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance()),
  );
  app.enableShutdownHooks();
  app.enableCors({
    methods: process.env.CORS_ALLOWED_METHODS.toString().split(','),
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS.toString().split(','),
    exposedHeaders: process.env.CORS_EXPOSE_HEADERS.toString().split(','),
    origin: process.env.CORS_ORIGIN.toString().split(','),
    optionsSuccessStatus: 200,
    credentials: true,
    maxAge: 86400,
  });

  app.use(
    compression({
      filter: () => {
        return true;
      },
      threshold: 0,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.register(contentParser);
  await app.startAllMicroservices();
  await gracefulShutdown(app);
  await app.listen(port);
}
runInCluster(bootstrap);
