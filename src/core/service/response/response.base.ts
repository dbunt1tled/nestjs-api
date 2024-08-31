import { Paginator } from 'src/core/repository/paginator';
import * as JSONAPISerializer from 'jsonapi-serializer';

export abstract class ResponseBase {
  abstract json<T extends object>(data: {
    model: T | T[] | Paginator<T>;
    include?: string[];
  }): Promise<any>;

  protected getData<T extends object>(data: T | T[] | Paginator<T>): T | T[] {
    if ('meta' in data) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      return data;
    }
  }
  protected getMeta<T extends object>(
    data: T | T[] | Paginator<T>,
  ): object | undefined {
    if ('meta' in data) {
      return data.meta;
    } else {
      return undefined;
    }
  }

  protected serialize<T extends object>(data: {
    models: T | T[];
    type: string;
    attributes?: string[];
    meta?: object;
  }): any {
    return new JSONAPISerializer.Serializer(data.type, {
      keyForAttribute: 'camelCase',
      attributes: data.attributes,
      meta: data.meta,
    }).serialize(data.models);
  }
}
