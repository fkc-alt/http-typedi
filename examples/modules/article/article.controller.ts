import type { AxiosRequestConfig } from 'axios'
import ArticleListDto from './dto/articleList.dto'
import TableDataDto from './dto/tableData.dto'
import ArticleService from './article.service'
import ExamplesService from '../example/examples.service'
import HelperController from './helper.controller'
import DemoController from '../demo/demo.controller'
import {
  ArticleControllerApplydecorators,
  GetArticleListApplyDecorators,
  GetTableDataApplyDecorators
} from './decorators'
import { Core, DefaultValuePipe, Request } from '@/index'

class CustomValidationPipe implements Core.PipeTransform {
  transform(value: string): string {
    console.log(`CustomValidationPipe=====${value}`)
    return value
  }
}

@ArticleControllerApplydecorators()
export default class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly examplesService: ExamplesService,
    private readonly helperController: HelperController,
    private readonly demoController: DemoController
  ) {
    // 解构使用方法的话需要在构造中绑定this
    this.GetArticleList = this.GetArticleList.bind(this)
    this.GetTableDataList = this.GetTableDataList.bind(this)
  }

  @GetArticleListApplyDecorators()
  public async GetArticleList<
    T = Service.ArticleListReq,
    U = Service.ArticleListRes
  >(@Request('yy') configure: ArticleListDto): ServerRes<U> {
    console.log(configure, 'yy')
    const { data } = await this.helperController.getApidoc({
      pageSize: 0,
      currentPage: 0
    })
    console.log(data, 'helperController')
    return await this.articleService.GetArticleList<T, U>(
      <AxiosRequestConfig>configure
    )
  }

  @GetTableDataApplyDecorators()
  public async GetTableDataList<
    T = Service.TableDataReq,
    U = Service.TableDataRes
  >(
    @Request('id', new DefaultValuePipe('aaaa'), new CustomValidationPipe())
    configure: TableDataDto
  ): ServerRes<U> {
    console.log(configure, 'GetTableDataApplyDecorators')
    return await this.articleService.GetTableDataList<T, U>(
      <AxiosRequestConfig>configure
    )
  }
}
