import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig
  // AxiosError
  // AxiosResponse
} from 'axios'
import { Injectable } from '@/http-typedi'

/**
 * @author kaichao.Feng
 */
@Injectable()
export default class RequestService {
  private _instance!: AxiosInstance
  /**
   * @method constructor
   */
  constructor() {
    this.forRoot()
  }

  /**
   * @method request
   * @param { AxiosRequestConfig } AxiosRequestConfig
   * @return { ServerRes<U> } ServerRes<U>
   */
  public async request<T, U>(config: AxiosRequestConfig<T>): ServerRes<U> {
    return await this.instance.request<{}, ServerRes<U>, T>(config)
  }

  /**
   * @method forRoot
   * @param { AxiosRequestConfig } AxiosRequestConfig
   * @description Set Configure
   */
  public forRoot(config: AxiosRequestConfig = {}): void {
    this.instance = axios.create(config)
  }

  /**
   * @method getters
   * @return { AxiosInstance } AxiosInstance
   * @description instance Getter
   */
  private get instance(): AxiosInstance {
    return this._instance
  }

  /**
   * @method setters
   * @description instance Setter
   */
  private set instance(axiosInstance: AxiosInstance) {
    this._instance = axiosInstance
  }
}
