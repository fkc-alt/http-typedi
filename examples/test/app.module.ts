import {
  Controller,
  HttpFactory,
  HttpTypeDIModule,
  MiddlewareConsumer,
  Module,
  PostMapping,
  RequestMethod,
  RequestService
} from '@/index'
import { Test2Middleware } from '~@/middleware/__test2__.middleware'

@Controller('article')
class ArticleController {
  constructor(private readonly requestService: RequestService) {}

  @PostMapping('GetTableDataList')
  GetArticleList(cf: any) {
    return this.requestService.request(cf)
  }
}

@Module({
  controllers: [ArticleController],
  providers: [RequestService],
  exports: [RequestService, ArticleController]
})
class ArticleModule {}

@Module({
  imports: [ArticleModule]
})
export class AppModule implements HttpTypeDIModule {
  constructor(readonly articleController: ArticleController) {}
  configure(consumer: MiddlewareConsumer) {
    // console.log(consumer, 'consumer')
    consumer
      .apply(Test2Middleware)
      .exclude('Test2Middleware')
      .exclude({
        path: 'login',
        method: RequestMethod.GET
      })
      .forRoutes('Test2Middleware')
  }
}

export const HTTPClient2 = HttpFactory.create(AppModule)
HTTPClient2.setGlobalPrefix(import.meta.env.VITE_APP_BASE_API + 'test')
HTTPClient2.useInterceptorsReq(configure => {
  const Authorization = 'this is authorization'
  if (Authorization && configure.headers)
    configure.headers.Authorization2 = `Bearer ${Authorization}`
  return configure
})
