import { Global, Module } from '@nestjs/common';
import { FileConfig } from 'src/core/config-api/file.config';
import { HashConfig } from 'src/core/config-api/hash.config';

@Global()
@Module({
  providers: [FileConfig, HashConfig],
  exports: [FileConfig, HashConfig],
})
export class ConfigApiModule {}
