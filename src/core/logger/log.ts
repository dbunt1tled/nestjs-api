import { Global, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { LogRequestData } from 'src/core/logger/dto/log.request.data';
import { LokiData } from 'src/core/logger/dto/loki.data';

@Global()
@Injectable()
export class Log extends Logger {
  async errorException(data: LogRequestData) {
    const error = new LokiData('error', data);
    this.error(data.message, data.trace, error);
    await this.pushToLoki(error.toString());
  }

  async pushToLoki(body: string) {
    const lokiUrl = process.env.LOKI_PUSH_URL;
    if (!lokiUrl) {
      return new Promise<void>((resolve) => resolve());
    }
    const app = process.env.APP_NAME.replace(/[^a-zA-Z0-9]/, '').trim();
    return axios.post(
      lokiUrl,
      {
        streams: [
          {
            stream: {
              [app]: this.context ?? 'socket',
            },
            values: [[(Date.now() * 1e6).toString(), body]],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
