#example
```
# demo.controller.ts
import type { AxiosRequestConfig } from 'axios'
import { Controller, Post } from '@/support/core'
import RequestService from '@/service/common/providers/request.service'
import UtilService from '@/service/common/providers/util.service'
import DemoService from './demo.service'

@Controller('article')
export default class DemoController {
  constructor (private readonly utilService: UtilService, private readonly requestService: RequestService, readonly demoServie: DemoService) { }

  @Post('getArticleList')
  public async GetArticleList<T = Service.ArticleListReq, U = Service.ArticleListRes> (configure: T): ServerRes<U> {
    console.log(this.utilService)
    this.demoServie.Log(1, { age: 20 })
    return await this.requestService.request<T, U>(<AxiosRequestConfig>configure)
  }

  @Post('tableData')
  public async GetTableDataList<T = Service.TableDataReq, U = Service.TableDataRes> (configure: T): ServerRes<U> {
    return await this.requestService.request<T, U>(<AxiosRequestConfig>configure)
  }
}
```
```
# demo.service.ts
import { Inject, Injectable, Param, ParseIntPipe, DefaultValuePipe } from '@/support/core'

@Injectable()
export default class DemoService {
  @Inject()
  public Log (
    @Param(['id', 'price'], new DefaultValuePipe('1000.99'), new ParseIntPipe()) record: number | Record<string, any>, @Param('name', new DefaultValuePipe('落魄前端')) name: string | Record<string, any>): void {
    console.log('this is DemoService', record, name, '1')
  }
}
```
```
#demo.module.ts
import { Module } from '@/support/core'
import RequestService from '../common/providers/request.service'
import UtilService from '../common/providers/util.service'
import DemoController from './demo.controller'
import DemoService from './demo.service'

@Module({
  controllers: [DemoController],
  providers: [DemoService, UtilService, RequestService],
})
export default class DemoModule { }

export const application = SupportFactory.create(DemoModule)
```