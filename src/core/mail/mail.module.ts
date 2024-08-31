import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailConfig } from 'src/core/config-api/mail.config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (mailConfig: MailConfig) => ({
        transport: mailConfig.transport,
        defaults: {
          from: `"${mailConfig.fromName}" <${mailConfig.fromEmail}>`,
        },
        template: {
          dir: path.join(__dirname, '/../../../templates/'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [MailConfig],
    }),
  ],
  providers: [MailService, MailConfig],
})
export class MailModule {}
