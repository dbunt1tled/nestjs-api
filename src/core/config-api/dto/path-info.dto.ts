import { Storage } from 'src/core/config-api/enums/storage.enum';
import path from 'path';

export class PathInfo {
  constructor(private readonly data: { userId?: string }) {}

  get path() {
    if (this.data.userId) {
      return path.join(Storage.USER, this.data.userId);
    }
    return `${Storage.OTHER}`;
  }
}
