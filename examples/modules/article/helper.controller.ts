import { Controller, PostMapping, Sleep, RequestConfig } from '@/index'
import HelplerService from './providers/helper.service'
import TableDataDto from './dto/tableData.dto'

@Controller('helper')
export default class HelperController {
  constructor(private readonly helperService: HelplerService) {}

  @Sleep(1000)
  @PostMapping('apidoc')
  public getApidoc<T = any, R = any>(config: TableDataDto) {
    return this.helperService.helper<T, R>(<RequestConfig<T>>config)
  }
}
