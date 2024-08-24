import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Injectable()
export class General implements NestMiddleware {
  async use(req, res: FastifyReply['raw'], next: () => void) {
    res.setHeader('Connection', 'keep-alive');
    next();
  }
}
