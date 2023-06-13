import { Injection, Module, RequestService } from '@/index'
import CommonModule from './common/common.module'
import ArticleController from './modules/article/article.controller'
import ArticleModule from './modules/article/article.module'
import DemoModule from './modules/demo/demo.module'
import ExampleModule from './modules/example/example.module'
import DemoController from './modules/demo/demo.controller'

@Module({
  imports: [CommonModule, ArticleModule, ExampleModule, DemoModule],
  providers: []
})
export default class AppModule {
  @Injection()
  readonly customHttp!: RequestService
  constructor(
    readonly requestService: RequestService,
    readonly articleController: ArticleController,
    readonly demoController: DemoController
  ) {}
}
