import { ModelPropertiesMapper } from 'jsona';
import { TJsonaModel } from 'jsona/lib/JsonaTypes';

export class FilesMapper extends ModelPropertiesMapper {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getType(model: TJsonaModel) {
    return 'file';
  }
}
