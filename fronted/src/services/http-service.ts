import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

type HttpServiceErrorResponse = Pick<AxiosError, 'message' | 'code'>;
type ErrorHandlerFunction = (error?: HttpServiceErrorResponse) => void;

export class HttpService {
  private baseUrl: string;
  private errorHandlers: ErrorHandlerFunction[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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

  private methodFactory(method: 'delete' | 'put' | 'get' | 'post') {
    return (url: string, body?: unknown | AxiosRequestConfig) => {
      const fullUrl = this.resolveUrl(url);

      let requestMethod: Promise<AxiosResponse> = axios[method](url);

      if (['post', 'put'].includes(method)) {
        requestMethod = axios[method as 'put' | 'post'](fullUrl, body);
      }

      return requestMethod.then(this.handlerResponse).catch(this.handlerError);
    };
  }

  private resolveUrl(url: string) {
    return `${this.baseUrl}${url}`;
  }

  private handlerError(error: AxiosError): HttpServiceErrorResponse {
    const data: HttpServiceErrorResponse = {
      message: error.message,
      code: error.code
    };

    this.errorHandlers.forEach((callback) => callback(data));

    return data;
  }

  private handlerResponse(response: AxiosResponse) {
    return response.data;
  }
}

export const httpClient = new HttpService(process.env.REACT_APP_BACKEND_BASE_URL || '');
