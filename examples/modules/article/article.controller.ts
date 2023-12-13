import ArticleListDto from './dto/articleList.dto'
import TableDataDto from './dto/tableData.dto'
import ArticleService from './article.service'
import ExamplesService from '../example/examples.service'
import HelperController from './helper.controller'
import DemoController from '../demo/demo.controller'
import {
  ArticleControllerApplydecorators,
  DeleteArticleApplyDecorators,
  GetArticleListApplyDecorators,
  GetTableDataApplyDecorators
} from './decorators'
import {
  PipeTransform,
  DefaultValuePipe,
  Request,
  RequestConfig,
  Logger,
  Res
} from '@/index'

class CustomValidationPipe implements PipeTransform {
  transform(value: string): string {
    console.log(`CustomValidationPipe=====${value}`)
    return value
  }
}

@ArticleControllerApplydecorators()
export default class ArticleController {
  state = 10
  constructor(
    private readonly articleService: ArticleService,
    private readonly examplesService: ExamplesService,
    private readonly helperController: HelperController,
    private readonly demoController: DemoController,
    private readonly logger: Logger
  ) {
    // 解构使用方法的话需要在构造中绑定this
    // this.GetArticleList = this.GetArticleList.bind(this)
    // this.GetTableDataList = this.GetTableDataList.bind(this)
    // this.DeleteArticle = this.DeleteArticle.bind(this)
  }

  @GetArticleListApplyDecorators()
  public async GetArticleList<
    T = Service.ArticleListReq,
    U = Service.ArticleListRes
  >(@Res() configure: ArticleListDto): ServerRes<U> {
    console.log(configure, 'configure', this)
    const { data } = await this.helperController.getApidoc({
      pageSize: 0,
      currentPage: 0
    })
    // this.logger.log('{/user/register, POST}')
    // this.logger.error('{/user/register, POST}')
    // this.logger.warn('{/user/register, POST}')
    // this.logger.debug?.('{/user/register, POST}')
    // this.logger.verbose?.('{/user/register, POST}')
    return await this.articleService.GetArticleList<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }

  @GetTableDataApplyDecorators()
  public async GetTableDataList<
    T = Service.TableDataReq,
    U = Service.TableDataRes
  >(
    // @Request('id', new DefaultValuePipe('aaaa'), new CustomValidationPipe())
    @Request()
    configure: TableDataDto
  ): ServerRes<U> {
    console.log(configure, 'GetTableDataApplyDecorators')
    return await this.articleService.GetTableDataList<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }

  @DeleteArticleApplyDecorators()
  public async DeleteArticle<
    T = Service.TableDataReq,
    U = Service.TableDataRes
  >(configure: TableDataDto): ServerRes<U> {
    return await this.articleService.DeleteArticle<T, ServerRes<U>>(
      <RequestConfig<T>>configure
    )
  }
}
