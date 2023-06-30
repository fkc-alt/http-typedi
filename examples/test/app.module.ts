import {
  Controller,
  HttpFactory,
  Module,
  PostMapping,
  RequestService
} from '@/index'

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
export class AppModule {
  constructor(readonly articleController: ArticleController) {}
}

export const HTTPClient2 = HttpFactory.create(AppModule)
HTTPClient2.setGlobalPrefix(import.meta.env.VITE_APP_BASE_API + 'test')
HTTPClient2.useInterceptorsReq(configure => {
  const Authorization = 'this is authorization'
  if (Authorization && configure.headers)
    configure.headers.Authorization2 = `Bearer ${Authorization}`
  return configure
})
