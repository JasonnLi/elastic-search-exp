import axios, { AxiosInstance, AxiosResponse } from "axios";

export default class ApiClient {
  private client: AxiosInstance;
  // set token into header

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
    });
  }

  // add default header, auth param is used to control if the following action need to be authenticated by token
  async GET<TResponse>(
    url: string,
    authed: boolean = true
  ): Promise<AxiosResponse<TResponse>> {
    const headers: any = {};
    if (authed) {
      const token = localStorage.getItem("jwtToken");
      headers.Authorization = token ? `${token}` : "";
    }
    return this.client.get(url, { headers });
  }

  async POST<TResponse, TBody = {}>(
    url: string,
    body: TBody,
    authed: boolean = true
  ): Promise<AxiosResponse<TResponse>> {
    const headers: any = {};
    if (authed) {
      const token = localStorage.getItem("jwtToken");
      headers.Authorization = token ? `${token}` : "";
    }
    return this.client.post(url, body, { headers });
  }

  async PUT<TResponse, TBody = {}>(
    url: string,
    body: TBody,
    authed: boolean = true
  ): Promise<AxiosResponse<TResponse>> {
    const headers: any = {};
    if (authed) {
      const token = localStorage.getItem("jwtToken");
      headers.Authorization = token ? `${token}` : "";
    }
    return this.client.put(url, body, { headers });
  }

  async DEL<TResponse>(
    url: string,
    authed: boolean = true
  ): Promise<AxiosResponse<TResponse>> {
    const headers: any = {};
    if (authed) {
      const token = localStorage.getItem("jwtToken");
      headers.Authorization = token ? `${token}` : "";
    }
    return this.client.delete(url, { headers });
  }
}
