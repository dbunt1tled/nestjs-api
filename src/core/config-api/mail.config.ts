import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfig {
  constructor(private configService: ConfigService) {}

  get transport(): string {
    return this.configService.getOrThrow('EMAIL_TRANSPORT');
  }

  get fromName(): string {
    return this.configService.getOrThrow('EMAIL_FROM_NAME');
  }

  get fromEmail(): string {
    return this.configService.getOrThrow('EMAIL_FROM_EMAIL');
  }

  get fromFrontendUrl(): string {
    return this.configService.getOrThrow('APP_FRONTEND_URL');
  }
}
