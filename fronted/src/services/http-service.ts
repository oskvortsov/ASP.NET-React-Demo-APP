import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse
} from 'axios';
import { Pagination } from '../models/common';

export type HttpServiceError = Pick<AxiosError, 'message' | 'code' | 'status'>;
type ErrorHandlerFunction = (error: HttpServiceError) => void;

const TokenLS = 'token';

const HEADERS_PARAMS = {
  xPagination: 'x-pagination'
};

export class HttpService {
  private axiosInstance: Axios;
  private errorHandlers: ErrorHandlerFunction[] = [];

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl
    });
  }

  post = this.methodFactory('post');
  put = this.methodFactory('put');
  get = this.methodFactory('get');
  delete = this.methodFactory('delete');

  public addErrorhandler(callback: ErrorHandlerFunction) {
    this.errorHandlers.push(callback);
  }

  public removeErrorHandler(callback: ErrorHandlerFunction) {
    this.errorHandlers = this.errorHandlers.filter((cb) => cb === callback);
  }

  private get Headers() {
    const headers: AxiosRequestHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'X-Pagination'
    };

    if (localStorage.getItem(TokenLS)) {
      headers['Authorization'] = `Bearer ${localStorage.getItem(TokenLS)}`;
    }

    return headers;
  }

  private methodFactory(method: 'delete' | 'put' | 'get' | 'post') {
    return (url: string, body?: unknown) => {
      const config: AxiosRequestConfig = {
        headers: this.Headers
      };

      if (['post', 'put'].includes(method)) {
        return this.axiosInstance[method as 'put' | 'post'](url, body, config)
          .then(this.handlerResponse.bind(this))
          .catch(this.handlerError.bind(this));
      }

      return this.axiosInstance[method](url, config)
        .then(this.handlerResponse.bind(this))
        .catch(this.handlerError.bind(this));
    };
  }

  private handlerError(error: AxiosError): HttpServiceError {
    const data: HttpServiceError = {
      message: String(error.response?.data) || error.message,
      code: error.code,
      status: String(error.response?.status || '')
    };

    this.errorHandlers.forEach((callback) => callback(data));

    throw data;
  }

  private handlerResponse(response: AxiosResponse) {
    if (response.headers[HEADERS_PARAMS.xPagination]) {
      let pagination: Pagination | null = null;

      try {
        pagination = JSON.parse(response.headers[HEADERS_PARAMS.xPagination]);
      } catch (err) {
        pagination = null;
      }

      if (pagination) {
        return {
          pagination,
          items: response.data
        };
      }
    }

    return response.data;
  }
}

export const httpClient = new HttpService(process.env.REACT_APP_BACKEND_BASE_URL || '');
