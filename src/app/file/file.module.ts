import { Global, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileResponse } from 'src/app/file/response/file.response';

@Global()
@Module({
  controllers: [FileController],
  providers: [FileService, FileResponse],
  exports: [FileService],
})
export class FileModule {}
