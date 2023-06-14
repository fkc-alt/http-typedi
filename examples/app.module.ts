import { Injection, Module, RequestService } from '@/index'
import CommonModule from './common/common.module'
import ArticleController from './modules/article/article.controller'
import ArticleModule from './modules/article/article.module'
import DemoModule from './modules/demo/demo.module'
import ExampleModule from './modules/example/example.module'
import DemoController from './modules/demo/demo.controller'
import UserController from './modules/user/user.controller'
import UserModule from './modules/user/user.module'

@Module({
  imports: [CommonModule, ArticleModule, ExampleModule, DemoModule, UserModule],
  providers: []
})
export default class AppModule {
  @Injection()
  readonly customHttp!: RequestService
  constructor(
    readonly requestService: RequestService,
    readonly articleController: ArticleController,
    readonly demoController: DemoController,
    readonly userController: UserController
  ) {}
}
