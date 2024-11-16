import axios from 'axios';

export class APIClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(baseUrl: string = '', headers: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  async makeRequest(config: {
    method?: string;
    endpoint?: string;
    data?: any;
    params?: Record<string, string>;
    additionalHeaders?: Record<string, string>;
  }): Promise<any> {
    const {
      method = 'GET',
      endpoint = '',
      data = null,
      params = {},
      additionalHeaders = {}
    } = config;

    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        data,
        params,
        headers: {
          ...this.headers,
          ...additionalHeaders
        }
      });

      return response.data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  setHeaders(headers: Record<string, string>): void {
    this.headers = headers;
  }

  addHeader(key: string, value: string): void {
    this.headers[key] = value;
  }
}
