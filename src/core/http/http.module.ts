import { Global, Module } from '@nestjs/common';
import { HttpService } from 'src/core/http/http.service';

@Global()
@Module({
  exports: [HttpService],
  providers: [HttpService],
})
export class HttpModule {}
