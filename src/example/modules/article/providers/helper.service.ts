import RequestService from '../../../common/providers/request.service'
import { Core } from '../../../../http-typedi'

export default class HelplerService extends RequestService {
  public helper(configure: Core.RequestConfig) {
    return this.request(configure)
  }
}
