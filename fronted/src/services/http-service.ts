import axios, {
  Axios,
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse
} from 'axios';

export type HttpServiceError = Pick<AxiosError, 'message' | 'code'>;
type ErrorHandlerFunction = (error: HttpServiceError) => void;

export class HttpService {
  private axiosIntance: Axios;
  private baseUrl: string;
  private errorHandlers: ErrorHandlerFunction[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosIntance = axios.create({
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
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
    const headers: AxiosRequestHeaders = {};

    if (localStorage.getItem('token')) {
      headers['token'] = `Bearer ${localStorage.getItem('token')}`;
    }

    return headers;
  }

  private methodFactory(method: 'delete' | 'put' | 'get' | 'post') {
    return (url: string, body?: unknown) => {
      const fullUrl = this.resolveUrl(url);

      const config: AxiosRequestConfig = {
        headers: this.Headers
      };

      if (['post', 'put'].includes(method)) {
        return this.axiosIntance[method as 'put' | 'post'](fullUrl, body, config)
          .then(this.handlerResponse.bind(this))
          .catch(this.handlerError.bind(this));
      }

      return this.axiosIntance[method](url, config)
        .then(this.handlerResponse.bind(this))
        .catch(this.handlerError.bind(this));
    };
  }

  private resolveUrl(url: string) {
    return `${this.baseUrl}${url}`;
  }

  private handlerError(error: AxiosError): HttpServiceError {
    const data: HttpServiceError = {
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
