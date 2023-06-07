import type { AxiosRequestConfig } from 'axios'
import {
  Controller,
  ExecutionContext,
  PostMapping,
  createParamDecorator
} from '@/index'
import RequestService from '../../common/providers/request.service'
import ArticleService from '../article/article.service'
import { ArticleRouteChildren, Route } from '..'

const Demo = createParamDecorator((token: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  console.log(token, ctx, 'ExecutionContext')
  return token ? request[token] : request
})

@Controller(Route.ARTICLE)
export default class DemoController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly requestService: RequestService
  ) {}

  @PostMapping(ArticleRouteChildren.GETARTICLELIST)
  public async GetArticleList<
    T = Service.ArticleListReq,
    U = Service.ArticleListRes
  >(@Demo() configure: T): ServerRes<U> {
    console.log(configure, 'democontroller')
    this.articleService.Log(
      1,
      { age: 20 },
      { customElements: '<div>我是自定义Pipe</div>' }
    )
    return await this.requestService.request<T, U>(
      <AxiosRequestConfig>configure
    )
  }

  @PostMapping(ArticleRouteChildren.TABLEDATA)
  public async GetTableDataList<
    T = Service.TableDataReq,
    U = Service.TableDataRes
  >(configure: T): ServerRes<U> {
    return await this.requestService.request<T, U>(
      <AxiosRequestConfig>configure
    )
  }
}
