import { Controller, PostMapping, Core, Sleep } from '@/index'
import HelplerService from './providers/helper.service'
import TableDataDto from './dto/tableData.dto'

@Controller('helper')
export default class HelperController {
  constructor(private readonly helperService: HelplerService) {}

  @Sleep(1000)
  @PostMapping('apidoc')
  public getApidoc(config: TableDataDto) {
    return this.helperService.helper(<Core.RequestConfig>config)
  }
}
