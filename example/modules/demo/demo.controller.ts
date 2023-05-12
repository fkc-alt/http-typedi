import type { AxiosRequestConfig } from 'axios'
import { Controller, Post } from '@/http-typedi'
import RequestService from '../../common/providers/request.service'
import ArticleService from '../article/article.service'
import { ArticleRouteChildren, Route } from '..'
@Controller(Route.ARTICLE)
export default class DemoController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly requestService: RequestService
  ) {}

  @Post(ArticleRouteChildren.GETARTICLELIST)
  public async GetArticleList<
    T = Service.ArticleListReq,
    U = Service.ArticleListRes
  >(configure: T): ServerRes<U> {
    this.articleService.Log(
      1,
      { age: 20 },
      { customElements: '<div>我是自定义Pipe</div>' }
    )
    return await this.requestService.request<T, U>(
      <AxiosRequestConfig>configure
    )
  }

  @Post(ArticleRouteChildren.TABLEDATA)
  public async GetTableDataList<
    T = Service.TableDataReq,
    U = Service.TableDataRes
  >(configure: T): ServerRes<U> {
    return await this.requestService.request<T, U>(
      <AxiosRequestConfig>configure
    )
  }
}
