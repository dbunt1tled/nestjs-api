import { Paginator } from 'src/core/repository/paginator';
import { responseAPI } from 'src/core/http/response.api';
import { FilesMapper } from 'src/app/file/response/files.mapper';
import { File } from 'src/generated/client';

export const filesResponse = (data: File | File[] | Paginator<File>) => {
  return responseAPI(data, new FilesMapper());
};
