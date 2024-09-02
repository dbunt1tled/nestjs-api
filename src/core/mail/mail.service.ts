import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as path from 'path';
import { MailerService } from '@nestjs-modules/mailer';
import { MailConfig } from 'src/core/config-api/mail.config';

@Injectable()
export class MailService {
  constructor(
    private readonly mailConfig: MailConfig,
    private readonly mailerService: MailerService,
  ) {}

  async confirmUser(user: User, token: string) {
    return this.sendWithTemplate(
      user.email,
      'Confirm your email account',
      path.join('auth', 'confirmUserEmail'),
      {
        baseUrl: this.mailConfig.fromFrontendUrl,
        name: `${user.firstName} ${user.lastName}`,
        urlConfirmAddress: `${this.mailConfig.fromFrontendUrl}/auth/confirm/${token}`,
      },
    );
  }

  private async sendWithTemplate(
    to: string,
    subject: string,
    template: string,
    context: object,
  ): Promise<any> {
    return await this.mailerService.sendMail({
      to: to,
      subject: subject,
      template: template,
      context: context,
    });
  }
}
