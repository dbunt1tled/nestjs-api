import { Global, Module } from '@nestjs/common';
import { FileConfig } from 'src/core/config-api/file.config';
import { HashConfig } from 'src/core/config-api/hash.config';
import { SocketConfig } from 'src/core/config-api/socket.config';

@Global()
@Module({
  providers: [FileConfig, HashConfig, SocketConfig],
  exports: [FileConfig, HashConfig, SocketConfig],
})
export class ConfigApiModule {}
