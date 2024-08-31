import { Global, Module } from '@nestjs/common';
import { FileConfig } from 'src/core/config-api/file.config';
import { HashConfig } from 'src/core/config-api/hash.config';
import { MailConfig } from 'src/core/config-api/mail.config';

@Global()
@Module({
  providers: [FileConfig, HashConfig, MailConfig],
  exports: [FileConfig, HashConfig, MailConfig],
})
export class ConfigApiModule {}
