import { Global, Module } from '@nestjs/common';
import { HttpModule } from 'src/core/http/http.module';
import { ConfigApiModule } from './config-api/config-api.module';
import { HashModule } from 'src/core/hash/hash.module';
import { MailModule } from './mail/mail.module';

@Global()
@Module({
  imports: [HttpModule, ConfigApiModule, HashModule, MailModule],
  providers: [],
})
export default class CoreModule {}
