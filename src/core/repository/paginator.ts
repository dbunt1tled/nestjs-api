export interface Paginator<T> {
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPage: number;
  };
  data: Array<T>;
}
