import {
  Injection,
  Module,
  RequestService,
  HttpTypeDIModule,
  MiddlewareConsumer,
  RequestMethod,
  ScheduleModule,
  UploadService
} from '@/index'
import CommonModule from './common/common.module'
import ArticleController from './modules/article/article.controller'
import ArticleModule from './modules/article/article.module'
import DemoModule from './modules/demo/demo.module'
import ExampleModule from './modules/example/example.module'
import DemoController from './modules/demo/demo.controller'
import UserController from './modules/user/user.controller'
import UserModule from './modules/user/user.module'
import OrderModule from './modules/order/order.module'
import OrderController from './modules/order/order.controller'
import { LoggerMiddleware } from './middleware/logger.middleware'
import { TestMiddleware } from './middleware/test.middleware'

@Module({
  imports: [
    CommonModule,
    ArticleModule,
    ExampleModule,
    DemoModule,
    UserModule,
    OrderModule,
    ScheduleModule
  ],
  providers: []
})
export default class AppModule implements HttpTypeDIModule {
  @Injection()
  readonly customHttp!: RequestService
  constructor(
    readonly requestService: RequestService,
    readonly articleController: ArticleController,
    readonly demoController: DemoController,
    readonly userController: UserController,
    readonly orderController: OrderController,
    readonly uploadService: UploadService
  ) {}
  configure(consumer: MiddlewareConsumer) {
    // console.log(consumer, 'consumer')
    consumer
      .apply(LoggerMiddleware)
      .exclude('login')
      .exclude('api')
      .exclude('test')
      .forRoutes('system')
      .apply(TestMiddleware)
      .exclude('TestMiddleware')
      .exclude({
        path: 'login',
        method: RequestMethod.GET
      })
      .forRoutes(UserController)
  }
}
