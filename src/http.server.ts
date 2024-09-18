import { Log } from 'src/core/logger/log';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as qs from 'qs';
import { durationToHuman, ip, uuid7 } from 'src/core/utils';
import { INestApplication } from '@nestjs/common';

export const fastifyInstance = () => {
  const logger = new Log('main');

  const server = new FastifyAdapter({
    logger: false,
    disableRequestLogging: true,
    ignoreTrailingSlash: true,
    ignoreDuplicateSlashes: true,
    bodyLimit: 26214400,
    maxParamLength: 1000,
    querystringParser: (str) => qs.parse(str),
    genReqId: () => uuid7(),
  }).getInstance();

  if (process.env.APP_DEBUG == 'true') {
    server.addHook('preHandler', (req, reply, done) => {
      const {
        method,
        routeOptions,
        body,
        query,
        headers,
        id,
        hostname,
        params,
      } = req;

      logger.log(
        JSON.stringify({
          type: 'Request Incoming',
          id,
          method,
          url: routeOptions.url,
          body,
          query,
          headers,
          ip: ip(req),
          hostname,
          params,
        }),
      );
      done();
    });

    server.addHook('onSend', (req, reply, payload, done) => {
      const headers = reply.getHeaders();
      if ((headers['content-type'] as string)?.includes('application/json')) {
        logger.log(
          JSON.stringify({
            type: 'Request answer',
            id: req.id,
            statusCode: reply.statusCode,
            responseTime: durationToHuman(reply.elapsedTime),
            payload: payload,
          }),
        );
      }

      done();
    });
  }

  return server;
};

export const gracefulShutdown = async (app: INestApplication) => {
  process.on('SIGINT', async () => {
    await killAppWithGrace(app, 'SIGINT');
  });

  process.on('SIGTERM', async () => {
    await killAppWithGrace(app, 'SIGTERM');
  });
};

async function killAppWithGrace(app: INestApplication, code: string) {
  const logger = new Log('Shutdown');
  setTimeout(() => process.exit(1), 5000);
  logger.verbose(`Signal received with code ${code} ⚡.`);
  logger.log('❗ Closing http server with grace.');

  try {
    await app.close();
    logger.log('✅  Http server closed.');
    process.exit(0);
  } catch (error: any) {
    logger.error(`❌  Http server closed with error: ${error}`);
    process.exit(1);
  }
}