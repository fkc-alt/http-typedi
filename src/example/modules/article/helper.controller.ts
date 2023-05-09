import { Controller, Post, Core } from '../../../http-typedi'
import HelplerService from './providers/helper.service'
import TableDataDto from './dto/tableData.dto'

@Controller('helper')
export default class HelperController {
  constructor(private readonly helperService: HelplerService) {}

  @Post('apidoc')
  public getApidoc(config: TableDataDto) {
    return this.helperService.helper(<Core.RequestConfig>config)
  }
}
