import { Paginator } from 'src/core/repository/paginator';
import { IModelPropertiesMapper } from 'jsona/src/JsonaTypes';
import Jsona from 'jsona';

export const responseAPI = <T extends object>(
  data: T | T[] | Paginator<T>,
  mapper?: IModelPropertiesMapper,
) => {
  let d = data;
  let m = {};
  if ('meta' in data) {
    d = data.data;
    m = { meta: data.meta };
  }
  return {
    ...m,
    ...new Jsona({
      modelPropertiesMapper: mapper,
    }).serialize({ stuff: d }),
  };
};