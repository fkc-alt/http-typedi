import { RequestConfig, RequestService } from '@/index'

export default class HelplerService extends RequestService {
  public helper<T, R>(configure: RequestConfig<T>) {
    return this.request<T, R>(configure)
  }
}
