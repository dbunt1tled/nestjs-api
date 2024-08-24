export interface LogRequestData {
  statusCode?: number;
  path?: string;
  method?: string;
  message: string | object;
  timestamp?: string;
  trace?: string;
  request?: {
    id?: string;
    hostname?: string;
    headers?: object | string;
    body?: object | string;
    query?: object | string;
    params?: object | string;
  };
}
