import { Injection, Module } from '../http-typedi'
import CommonModule from './common/common.module'
import RequestService from './common/providers/request.service'
import ArticleController from './modules/article/article.controller'
import ArticleModule from './modules/article/article.module'
import DemoModule from './modules/demo/demo.module'
import ExampleModule from './modules/example/example.module'

@Module({
  imports: [CommonModule, ArticleModule, ExampleModule, DemoModule],
  providers: []
})
export default class AppModule {
  @Injection()
  readonly customHttp!: RequestService
  constructor(
    readonly requestService: RequestService,
    readonly articleController: ArticleController
  ) {}
}
