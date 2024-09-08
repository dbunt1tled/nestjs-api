import { SortOrder } from 'src/core/repository/sort.order';
import { Sorting } from 'src/core/repository/sorting';

export const sort = ({ value }): SortOrder | undefined => {
  if (!value) {
    return undefined;
  }
  return <SortOrder>{
    field: value.split(',').map((v: string) => {
      const [field, order] = v.trim().split(':');
      return <Sorting>{ field: { [field.trim()]: order?.trim() || 'asc' } };
    }),
  };
};

export const include = ({ value }): string[] | undefined => {
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return <string[]>value.map((v: string) => v.trim());
  }
  return value.split(',').map((v: string) => v.trim());
};

export const stringOrArrayToArray = <T>({ value }): T[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return <T[]>value.map((v: string) => v.trim());
  }
  return <T[]>value.split(',').map((v: string) => v.trim());
};

export const intOrArrayToArray = <T>({ value }): T[] | undefined => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return <T[]>value.map((v: string) => parseInt(v.trim()));
  }
  return <T[]>value.split(',').map((v: string) => parseInt(v.trim()));
};
