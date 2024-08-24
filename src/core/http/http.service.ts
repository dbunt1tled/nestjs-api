import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Log } from 'src/core/logger/log';

@Injectable()
export class HttpService {
  private readonly instance: AxiosInstance;

  private logger = new Log('general');

  constructor() {
    const instance = axios.create({
      timeout: 20000,
    });

    instance.interceptors.request.use(
      // Do something before request is sent
      (config) => {
        return config;
      },
      // Do something with request error
      (error) => {
        console.log(error);
        //this.logger.error(error.toJSON());
      },
    );

    instance.interceptors.response.use(
      // Any status code that lie within the range of 2xx cause this function to trigger
      (response) => {
        return response;
      },
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      async (error) => {
        if (error.response) {
          await this.logger.errorException({
            message: `${error.code}: ${error.response.statusText}`,
            statusCode: error.response.status,
            trace: error.stack,
            path: error.response.config.url,
            method: error.response.config.method,
            request: {
              hostname: error.request.host,
              headers: error.response.headers,
              body: error.response.data,
              query: Object.fromEntries(
                new URLSearchParams(error.response.config.url.split('?')[1]),
              ),
            },
          });
        } else {
          await this.logger.errorException({
            message: `${error.code}: ${error.message}`,
            statusCode: 500,
            path: error.config.url,
            method: error.config.method,
            trace: error.stack,
            request: {
              headers: error.config.headers,
              body: error.config.data,
              query: Object.fromEntries(
                new URLSearchParams(error.config.url.split('?')[1]),
              ),
            },
          });
        }
        throw error;
      },
    );

    this.instance = instance;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.instance.delete(url, config))?.data;
  }

  async get<T = any, C = any>(
    url: string,
    config?: AxiosRequestConfig<C>,
  ): Promise<T> {
    return (await this.instance.get(url, config))?.data;
  }

  getInstance() {
    return this.instance;
  }

  async head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.instance.head(url, config))?.data;
  }

  async options<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return (await this.instance.options(url, config))?.data;
  }

  async patch<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return (await this.instance.patch(url, data, config))?.data;
  }

  async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return (await this.instance.post(url, data, config))?.data;
  }

  async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return (await this.instance.put(url, data, config))?.data;
  }
}
