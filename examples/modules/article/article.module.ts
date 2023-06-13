import { Global, Module, RequestService } from '@/index'
import OrderModule from '../order/order.module'
import OrderController from '../order/order.controller'
import ArticleController from './article.controller'
import ArticleService from './article.service'
import HelperController from './helper.controller'
import HelplerService from './providers/helper.service'

@Global()
@Module({
  imports: [OrderModule],
  controllers: [ArticleController, OrderController, HelperController],
  providers: [ArticleService, HelplerService, RequestService]
})
export default class ArticleModule {}
