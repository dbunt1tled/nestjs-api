import { Injectable } from '@nestjs/common';
import { Paginator } from 'src/core/repository/paginator';
import { ResponseBase } from 'src/core/service/response/response.base';
import { FileService } from 'src/app/file/file.service';

@Injectable()
export class FileResponse extends ResponseBase {
  constructor(private readonly fileService: FileService) {
    super();
  }

  async json<T extends object>(data: {
    model: T | T[] | Paginator<T>;
    include?: string[];
  }): Promise<any> {
    const model = this.getData(data.model);

    return await this.serialize({
      models: model,
      type: 'user',
      attributes: this.fileService.modelAttributes(),
      meta: this.getMeta(data.model),
    });
  }
}
