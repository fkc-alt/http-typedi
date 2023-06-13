import { Core, RequestService } from '@/index'

export default class HelplerService extends RequestService {
  public helper(configure: Core.RequestConfig) {
    return this.request(configure)
  }
}
